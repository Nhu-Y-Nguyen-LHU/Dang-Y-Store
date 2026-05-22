'use client';

import { App, ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';

const ecommerceTheme: ThemeConfig = {
  token: {
    colorPrimary: '#722F37',
    colorTextBase: '#111111',
    borderRadius: 6,
    fontFamily: 'var(--font-inter), sans-serif',
    fontFamilyCode: 'var(--font-geist-mono), monospace',
  },
  components: {
    Typography: {
      fontFamily: 'var(--font-playfair), serif',
    },
    Button: {
      fontWeight: 500,
    },
    Menu: {
      itemSelectedColor: '#722F37',
      horizontalItemSelectedColor: '#722F37',
    },
  },
};

export default function AntdThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider theme={ecommerceTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
