import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { localStg } from '@/utils/storage';

import locales from './locale';

export const reactI18nextInstance = i18n.use(initReactI18next);

/** Setup plugin i18n */
export async function setupI18n() {
  await reactI18nextInstance.init({
    interpolation: {
      escapeValue: false
    },
    lng: localStg.get('lang') || 'zh-CN',
    resources: locales
  });
}

export const $t = reactI18nextInstance.t;

export function setLng(locale: App.I18n.LangType) {
  reactI18nextInstance.changeLanguage(locale);
}
