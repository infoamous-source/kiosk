/**
 * 번역 자동 동기화 스크립트
 *
 * ko/common.json을 마스터로, 나머지 언어에 빠진 키를 자동 추가하고
 * 사용하지 않는 키를 제거합니다.
 *
 * 사용법: node scripts/sync-i18n.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '..', 'public', 'locales');

// 마스터 언어 (기준)
const MASTER_LANG = 'ko';
// 수동 번역 언어 (동기화 대상에서 제외)
const MANUAL_LANGS = ['en'];
// 동기화할 네임스페이스 파일들
// 지원 언어: ko (마스터) + en (수동 번역)만 유지
// 동기화할 대상이 없으므로 (en은 수동) 스크립트는 검증 용도로만 동작
const NAMESPACES = ['common.json'];

// ─── 헬퍼 함수 ───

/** 중첩 객체의 모든 키 경로를 플랫하게 추출 */
function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...flattenKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/** 점 표기법으로 중첩 객체에서 값 가져오기 */
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

/** 점 표기법으로 중첩 객체에 값 설정하기 */
function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/** 마스터 키 순서에 맞게 객체 재정렬 */
function reorderByMaster(masterObj, targetObj) {
  const result = {};
  for (const key of Object.keys(masterObj)) {
    if (!(key in targetObj)) continue;
    if (typeof masterObj[key] === 'object' && masterObj[key] !== null && !Array.isArray(masterObj[key])) {
      if (typeof targetObj[key] === 'object' && targetObj[key] !== null) {
        result[key] = reorderByMaster(masterObj[key], targetObj[key]);
      } else {
        result[key] = targetObj[key];
      }
    } else {
      result[key] = targetObj[key];
    }
  }
  return result;
}

// ─── 메인 로직 ───

function syncLocales() {
  console.log('🌐 번역 동기화 시작...\n');

  // 모든 언어 폴더 목록
  const allLangs = readdirSync(LOCALES_DIR).filter(dir => {
    const fullPath = join(LOCALES_DIR, dir);
    try {
      return readdirSync(fullPath).length > 0;
    } catch {
      return false;
    }
  });

  // 동기화 대상 언어 (마스터 + 수동 번역 제외)
  const targetLangs = allLangs.filter(lang => lang !== MASTER_LANG && !MANUAL_LANGS.includes(lang));

  let totalAdded = 0;
  let totalRemoved = 0;
  let totalUpdated = 0;

  for (const ns of NAMESPACES) {
    const masterPath = join(LOCALES_DIR, MASTER_LANG, ns);
    if (!existsSync(masterPath)) {
      console.log(`⚠️  마스터 파일 없음: ${MASTER_LANG}/${ns}`);
      continue;
    }

    const masterData = JSON.parse(readFileSync(masterPath, 'utf-8'));
    const masterKeys = flattenKeys(masterData);

    for (const lang of targetLangs) {
      const targetPath = join(LOCALES_DIR, lang, ns);
      let targetData = {};
      let fileExists = false;

      if (existsSync(targetPath)) {
        targetData = JSON.parse(readFileSync(targetPath, 'utf-8'));
        fileExists = true;
      }

      const targetKeys = flattenKeys(targetData);
      const targetKeySet = new Set(targetKeys);
      const masterKeySet = new Set(masterKeys);

      let added = 0;
      let removed = 0;

      // 1. 마스터에 있는데 타겟에 없는 키 → 한국어 원문으로 추가
      for (const key of masterKeys) {
        if (!targetKeySet.has(key)) {
          const masterValue = getNestedValue(masterData, key);
          setNestedValue(targetData, key, masterValue);
          added++;
        }
      }

      // 2. 타겟에 있는데 마스터에 없는 키 → 제거
      for (const key of targetKeys) {
        if (!masterKeySet.has(key)) {
          // 키 제거: 부모 객체에서 해당 키 삭제
          const parts = key.split('.');
          let current = targetData;
          for (let i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] === undefined) break;
            current = current[parts[i]];
          }
          if (current && parts[parts.length - 1] in current) {
            delete current[parts[parts.length - 1]];
            removed++;
          }
        }
      }

      // 3. 빈 객체 정리
      cleanEmptyObjects(targetData);

      // 4. 마스터 키 순서에 맞게 재정렬
      targetData = reorderByMaster(masterData, targetData);

      // 5. 변경이 있으면 저장
      if (added > 0 || removed > 0) {
        const output = JSON.stringify(targetData, null, 2) + '\n';
        writeFileSync(targetPath, output, 'utf-8');
        totalAdded += added;
        totalRemoved += removed;
        totalUpdated++;

        const parts = [];
        if (added > 0) parts.push(`+${added} keys`);
        if (removed > 0) parts.push(`-${removed} keys`);
        console.log(`  📝 ${lang}/${ns}: ${parts.join(', ')}`);
      }
    }
  }

  console.log('');
  if (totalUpdated === 0) {
    console.log('✅ 모든 언어가 이미 동기화되어 있습니다.');
  } else {
    console.log(`✅ ${totalUpdated}개 언어 업데이트 완료 (추가: ${totalAdded}, 제거: ${totalRemoved})`);
  }
  console.log('');
}

/** 빈 객체를 재귀적으로 정리 */
function cleanEmptyObjects(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      cleanEmptyObjects(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
}

// 실행
syncLocales();
