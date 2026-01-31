import type { AppStoreLinks, OSPlatform } from '../types/app';

export function getStoreLink(links: AppStoreLinks, os: OSPlatform): string {
  if (os === 'ios') return links.ios;
  if (os === 'android') return links.android;
  return links.android; // default to Play Store for desktop
}
