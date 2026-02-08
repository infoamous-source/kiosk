export type BadgeType = 'government' | 'local-essential' | 'foreigner-friendly';

export type OSPlatform = 'ios' | 'android' | 'unknown';

export interface AppStoreLinks {
  ios: string;
  android: string;
  web?: string;
}

export interface DeepLinks {
  ios?: string;
  android?: string;
  androidPackage?: string;
}

export interface AppItem {
  id: string;
  categoryId: string;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  taglineKey: string;
  storeLinks: Partial<AppStoreLinks>; // 개발 예정 앱을 위해 Partial로 변경
  badges: BadgeType[];
  koreanName: string;
  deepLinks?: DeepLinks;
  comingSoon?: boolean; // 개발 예정 여부
}

export interface Category {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  order: number;
}
