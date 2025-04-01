import { Button, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

interface GatewayPageProps {
  onClose?: () => void;
}

const GatewayPage: React.FC<GatewayPageProps> = ({ onClose }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  useEffect(() => {
    const themeMode = localStorage.getItem('SOY-REACT_themeMode') || 'system';

    if (themeMode === 'dark') {
      setTheme('dark');
    } else if (themeMode === 'light') {
      setTheme('light');
    } else {
      // System preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('SOY-REACT_themeMode', `"${newTheme}"`);
    document.body.dataset.theme = newTheme;
  };

  useEffect(() => {
    document.body.dataset.theme = theme;

    // Listen for system preference changes if in system mode
    if (localStorage.getItem('SOY-REACT_themeMode') === '"system"') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      // Return cleanup function
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Return empty cleanup function if not in system mode
    return () => {};
  }, [theme]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a1a1a] text-[#f0f0f0]' : 'bg-white text-[#333]'}`}
    >
      <nav
        className={`px-8 py-4 flex justify-between items-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#121212]' : 'bg-[#2c3e50]'} text-white`}
      >
        <div className="flex items-center gap-2">
          <img
            alt="logo"
            className="h-10 w-10"
            src="favicon.svg"
          />
          <span>智能物流系统</span>
        </div>
        <div className="flex items-center">
          <div className="flex">
            <a
              className="mx-1 rounded px-3 py-2 text-white no-underline transition-colors duration-200 hover:bg-white/10"
              href="#features"
            >
              功能特性
            </a>
            <a
              className="mx-1 rounded px-3 py-2 text-white no-underline transition-colors duration-200 hover:bg-white/10"
              href="#about"
            >
              关于我们
            </a>
          </div>

          <Switch
            checked={theme === 'dark'}
            checkedChildren="夜"
            className="mx-5"
            unCheckedChildren="日"
            onChange={toggleTheme}
          />

          <Button
            className="px-4 py-2 text-white no-underline hover:bg-white/10"
            type="primary"
            onClick={onClose}
          >
            登录/注册
          </Button>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-960px px-4 py-16 text-center">
          <h1 className="my-8 text-5xl font-semibold">
            智慧物流
            <br />
            全程可视化管理
          </h1>
          <p className="mb-12 text-xl text-gray-500 dark:text-gray-400">
            基于智能路径优化算法与高德的现代物流管理解决方案，助力企业实现运输全流程数字化
          </p>
          <Button
            className="h-auto border-0 px-8 py-4 text-lg"
            size="large"
            type="primary"
            onClick={onClose}
          >
            立即体验 →
          </Button>
        </section>

        <section
          className="grid grid-cols-3 mx-auto max-w-1200px gap-8 px-8 py-12"
          id="features"
        >
          <div className="rounded-lg p-8 shadow-md transition-transform duration-200 hover:translate-y-[-5px]">
            <h3 className="text-xl font-medium">实时追踪</h3>
            <p>全流程GPS定位追踪，货物状态实时更新</p>
          </div>
          <div className="rounded-lg p-8 shadow-md transition-transform duration-200 hover:translate-y-[-5px]">
            <h3 className="text-xl font-medium">智能调度</h3>
            <p>智能算法自动优化运输路线与车辆调度</p>
          </div>
          <div className="rounded-lg p-8 shadow-md transition-transform duration-200 hover:translate-y-[-5px]">
            <h3 className="text-xl font-medium">数据分析</h3>
            <p>多维度数据报表助力运营决策</p>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-500">
        <p>© 2025 智能物流管理系统. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GatewayPage;
