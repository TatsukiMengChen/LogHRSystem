import type { FC, PropsWithChildren } from 'react';

import { setLng } from '@/locales';
import { localStg } from '@/utils/storage';

import { LangContext } from './langContext';

const localeOptions = [
  {
    key: 'zh-CN',
    label: '中文'
  },
  {
    key: 'en-US',
    label: 'English'
  }
] satisfies App.I18n.LangOption[];

const LangProvider: FC<PropsWithChildren> = ({ children }) => {
  const [locale, setLocale] = useState<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  function changeLocale(lang: App.I18n.LangType) {
    setLng(lang);

    setLocale(lang);

    localStg.set('lang', lang);
  }

  return <LangContext value={{ locale, localeOptions, setLocale: changeLocale }}>{children}</LangContext>;
};

export default LangProvider;
