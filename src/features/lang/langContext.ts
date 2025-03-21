import { createContext } from 'react';

import { localStg } from '@/utils/storage';

export type LangContextType = {
  locale: App.I18n.LangType;
  localeOptions: App.I18n.LangOption[];
  setLocale: (locale: App.I18n.LangType) => void;
};

export const LangContext = createContext<LangContextType>({
  locale: localStg.get('lang') || 'zh-CN',
  localeOptions: [
    {
      key: 'zh-CN',
      label: '中文'
    },
    {
      key: 'en-US',
      label: 'English'
    }
  ],
  setLocale: () => {}
});

export function useLang() {
  const context = useContext(LangContext);

  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }

  return context;
}
