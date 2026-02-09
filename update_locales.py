import json
import os

translations = {
    "zh": {
        "instructorCode": "讲师代码",
        "orgCode": "机构代码",
        "instructorCodePlaceholder": "请输入讲师代码",
        "instructorCodeHint": "讲师代码（可选）",
        "orgCodePlaceholder": "请输入机构代码",
        "orgCodeHint": "机构代码（可选）"
    },
    "ja": {
        "instructorCode": "講師コード",
        "orgCode": "機関コード",
        "instructorCodePlaceholder": "講師コードを入力してください",
        "instructorCodeHint": "講師コード（オプション）",
        "orgCodePlaceholder": "機関コードを入力してください",
        "orgCodeHint": "機関コード（オプション）"
    },
    "vi": {
        "instructorCode": "Mã giảng viên",
        "orgCode": "Mã tổ chức",
        "instructorCodePlaceholder": "Nhập mã giảng viên",
        "instructorCodeHint": "Mã giảng viên (tùy chọn)",
        "orgCodePlaceholder": "Nhập mã tổ chức",
        "orgCodeHint": "Mã tổ chức (tùy chọn)"
    },
    "th": {
        "instructorCode": "รหัสอาจารย์",
        "orgCode": "รหัสองค์กร",
        "instructorCodePlaceholder": "ป้อนรหัสอาจารย์",
        "instructorCodeHint": "รหัสอาจารย์ (ไม่บังคับ)",
        "orgCodePlaceholder": "ป้อนรหัสองค์กร",
        "orgCodeHint": "รหัสองค์กร (ไม่บังคับ)"
    },
    "id": {
        "instructorCode": "Kode Instruktur",
        "orgCode": "Kode Organisasi",
        "instructorCodePlaceholder": "Masukkan kode instruktur",
        "instructorCodeHint": "Kode instruktur (opsional)",
        "orgCodePlaceholder": "Masukkan kode organisasi",
        "orgCodeHint": "Kode organisasi (opsional)"
    },
    "tl": {
        "instructorCode": "Instructor Code",
        "orgCode": "Organization Code",
        "instructorCodePlaceholder": "Ilagay ang instructor code",
        "instructorCodeHint": "Instructor code (opsyonal)",
        "orgCodePlaceholder": "Ilagay ang organization code",
        "orgCodeHint": "Organization code (opsyonal)"
    },
    "ne": {
        "instructorCode": "प्रशिक्षक कोड",
        "orgCode": "संस्था कोड",
        "instructorCodePlaceholder": "प्रशिक्षक कोड प्रविष्ट गर्नुहोस्",
        "instructorCodeHint": "प्रशिक्षक कोड (वैकल्पिक)",
        "orgCodePlaceholder": "संस्था कोड प्रविष्ट गर्नुहोस्",
        "orgCodeHint": "संस्था कोड (वैकल्पिक)"
    },
    "my": {
        "instructorCode": "ဆရာကုဒ်",
        "orgCode": "အဖွဲ့အစည်းကုဒ်",
        "instructorCodePlaceholder": "ဆရာကုဒ်ထည့်ပါ",
        "instructorCodeHint": "ဆရာကုဒ် (ရွေးချယ်ရန်)",
        "orgCodePlaceholder": "အဖွဲ့အစည်းကုဒ်ထည့်ပါ",
        "orgCodeHint": "အဖွဲ့အစည်းကုဒ် (ရွေးချယ်ရန်)"
    },
    "uz": {
        "instructorCode": "O'qituvchi kodi",
        "orgCode": "Tashkilot kodi",
        "instructorCodePlaceholder": "O'qituvchi kodini kiriting",
        "instructorCodeHint": "O'qituvchi kodi (ixtiyoriy)",
        "orgCodePlaceholder": "Tashkilot kodini kiriting",
        "orgCodeHint": "Tashkilot kodi (ixtiyoriy)"
    },
    "mn": {
        "instructorCode": "Багшийн код",
        "orgCode": "Байгууллагын код",
        "instructorCodePlaceholder": "Багшийн код оруулах",
        "instructorCodeHint": "Багшийн код (заавал биш)",
        "orgCodePlaceholder": "Байгууллагын код оруулах",
        "orgCodeHint": "Байгууллагын код (заавал биш)"
    },
    "km": {
        "instructorCode": "Instructor Code",
        "orgCode": "Organization Code",
        "instructorCodePlaceholder": "Enter instructor code",
        "instructorCodeHint": "Instructor code (optional)",
        "orgCodePlaceholder": "Enter organization code",
        "orgCodeHint": "Organization code (optional)"
    },
    "ru": {
        "instructorCode": "Код инструктора",
        "orgCode": "Код организации",
        "instructorCodePlaceholder": "Введите код инструктора",
        "instructorCodeHint": "Код инструктора (необязательно)",
        "orgCodePlaceholder": "Введите код организации",
        "orgCodeHint": "Код организации (необязательно)"
    }
}

def update_locale_file(locale_code):
    base_path = r"C:\Users\wodnj\Desktop\클로드\이주민\kiosk\public\locales"
    file_path = os.path.join(base_path, locale_code, "translation.json")
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    trans = translations.get(locale_code, {})
    
    if "auth" in data:
        auth = data["auth"]
        old_ref_code = auth.get("refCode", trans.get("orgCode", "Organization Code"))
        
        if "refCode" in auth:
            del auth["refCode"]
        if "refCodePlaceholder" in auth:
            del auth["refCodePlaceholder"]
        
        new_auth = {}
        inserted = False
        for key, value in auth.items():
            new_auth[key] = value
            if key == "password" and not inserted:
                new_auth["instructorCode"] = trans.get("instructorCode", "Instructor Code")
                new_auth["instructorCodePlaceholder"] = trans.get("instructorCodePlaceholder", "Enter instructor code")
                new_auth["instructorCodeHint"] = trans.get("instructorCodeHint", "Instructor code (optional)")
                new_auth["orgCode"] = trans.get("orgCode", old_ref_code)
                new_auth["orgCodePlaceholder"] = trans.get("orgCodePlaceholder", "Enter organization code")
                new_auth["orgCodeHint"] = trans.get("orgCodeHint", "Organization code (optional)")
                inserted = True
        
        data["auth"] = new_auth
    
    if "admin" in data:
        admin = data["admin"]
        
        if "sortBy" in admin and isinstance(admin["sortBy"], dict):
            if "refCode" in admin["sortBy"]:
                old_value = admin["sortBy"]["refCode"]
                del admin["sortBy"]["refCode"]
                admin["sortBy"]["instructorCode"] = trans.get("instructorCode", "Instructor Code")
                admin["sortBy"]["orgCode"] = trans.get("orgCode", old_value)
        
        if "searchHint" in admin and isinstance(admin["searchHint"], dict):
            if "refCode" in admin["searchHint"]:
                old_value = admin["searchHint"]["refCode"]
                del admin["searchHint"]["refCode"]
                admin["searchHint"]["instructorCode"] = trans.get("instructorCodePlaceholder", "Search by instructor code")
                admin["searchHint"]["orgCode"] = trans.get("orgCodePlaceholder", old_value)
        
        if "table" in admin and isinstance(admin["table"], dict):
            if "refCode" in admin["table"]:
                old_value = admin["table"]["refCode"]
                del admin["table"]["refCode"]
                admin["table"]["instructorCode"] = trans.get("instructorCode", "Instructor Code")
                admin["table"]["orgCode"] = trans.get("orgCode", old_value)
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated: {locale_code}")

locales = ["zh", "ne", "vi", "my", "uz", "mn", "id", "tl", "km", "th", "ja", "ru"]

for locale in locales:
    update_locale_file(locale)

print("\nAll locale files updated successfully!")
