export type BadgeType = 'government' | 'local-essential' | 'foreigner-friendly';

export type OSPlatform = 'ios' | 'android' | 'unknown';

export interface AppStoreLinks {
  ios: string;
  android: string;
  web?: string;
}

export interface AppItem {
  id: string;
  categoryId: string;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  taglineKey: string;
  storeLinks: AppStoreLinks;
  badges: BadgeType[];
  koreanName: string;
}

export interface Category {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  order: number;
}
