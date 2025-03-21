import type { WatermarkProps } from 'antd';
import type { PropsWithChildren } from 'react';

import { info } from '@/constants/app';
import { themeColors } from '@/features/theme';
import { getAntdTheme, setupThemeVarsToHtml } from '@/features/theme/shared';
import { useThemeSettings } from '@/features/theme/themeHook';
import { antdLocales } from '@/locales/antd';
import { localStg } from '@/utils/storage';

import { useLang } from '../lang';
import { useTheme } from '../theme';

const WATERMARK_CONFIG = {
  font: {
    fontSize: 16
  },
  height: 128,
  offset: [12, 60],
  rotate: -15,
  width: 240,
  zIndex: 9999
} satisfies WatermarkProps;

function useAntdTheme() {
  const themeSettings = useThemeSettings();

  const colors = useAppSelector(themeColors);

  const { darkMode } = useTheme();

  const antdTheme = getAntdTheme(colors, darkMode, themeSettings.tokens);

  useEffect(() => {
    setupThemeVarsToHtml(colors, themeSettings.tokens, themeSettings.recommendColor);
    localStg.set('themeColor', colors.primary);
  }, [colors, themeSettings]);

  console.info(`%c${info}`, `color: ${colors.primary}`);

  return { antdTheme, watermarkText: themeSettings.watermark.text, watermarkVisible: themeSettings.watermark.visible };
}

function AntdConfig({ children }: PropsWithChildren) {
  const { locale } = useLang();

  const { antdTheme, watermarkText, watermarkVisible } = useAntdTheme();

  return (
    <AConfigProvider
      button={{ classNames: { icon: 'align-1px  text-icon' } }}
      card={{ styles: { body: { flex: 1, overflow: 'hidden', padding: '12px 16px ' } } }}
      locale={antdLocales[locale]}
      theme={antdTheme}
    >
      <AWatermark
        className="h-full"
        content={watermarkVisible ? watermarkText || 'Soybean' : ''}
        {...WATERMARK_CONFIG}
      >
        {children}
      </AWatermark>
    </AConfigProvider>
  );
}

export default AntdConfig;
