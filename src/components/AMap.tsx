/* eslint-disable no-plusplus */
import { type FC, useEffect, useRef, useState } from 'react';

interface AMapProps {
  endKeyword: {
    city: string;
    keyword: string;
  };
  showPanel?: boolean;
  startKeyword: {
    city: string;
    keyword: string;
  }; // 是否显示路线导航面板
}

// 加载高德地图安全配置
const loadAMapSecurityConfig = (securityJsCode: string): void => {
  if (!window._AMapSecurityConfig) {
    window._AMapSecurityConfig = {
      securityJsCode
    };
  }
};

// 加载高德地图脚本
const loadAMapScript = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接返回
    if (window.AMap) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.Driving&callback=initAMap`;
    script.onerror = reject;

    // 使用回调函数方式加载
    window.initAMap = () => {
      resolve();
    };

    document.head.appendChild(script);

    // 加载工具栏
    const toolbarScript = document.createElement('script');
    toolbarScript.type = 'text/javascript';
    toolbarScript.src = 'https://cache.amap.com/lbs/static/addToolbar.js';
    document.head.appendChild(toolbarScript);
  });
};

// 添加面板样式
const addPanelStyle = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    #panel {
      position: absolute;
      background-color: white;
      max-height: 90%;
      overflow-y: auto;
      top: 10px;
      right: 10px;
      width: 280px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      z-index: 10;
    }
    #panel .amap-call {
      background-color: #009cf9;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    #panel .amap-lib-driving {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      overflow: hidden;
    }
    .panel-toggle-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 100;
      padding: 6px 12px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      font-size: 14px;
    }
    .map-container-wrapper {
      position: relative;
      height: 60vh;
      width: 100%;
    }
  `;
  document.head.appendChild(style);
};

const RouteMap: FC<AMapProps> = ({ endKeyword, showPanel = true, startKeyword }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(showPanel);

  // 切换面板显示/隐藏
  const togglePanel = () => {
    setIsPanelVisible(prev => !prev);
  };

  useEffect(() => {
    // 添加面板样式
    addPanelStyle();

    const initMap = async () => {
      if (!mapContainerRef.current) return;

      try {
        // 先加载安全配置
        loadAMapSecurityConfig(import.meta.env.VITE_AMAP_SECRET);

        // 加载高德地图脚本
        await loadAMapScript(import.meta.env.VITE_AMAP_KEY);

        const AMap = window.AMap;

        // 创建地图实例
        const map = new AMap.Map(mapContainerRef.current, {
          // center: [116.397428, 39.90923],
          resizeEnable: true,
          zoom: 13
        });

        mapInstanceRef.current = map;

        // 设置驾车导航配置
        const drivingOptions = {
          map,
          panel: 'panel',
          policy: 0 // 使用速度优先策略
        };

        // 构造路线导航类
        const driving = new AMap.Driving(drivingOptions);

        // 根据起终点名称规划驾车导航路线
        driving.search(
          [
            { city: startKeyword.city, keyword: startKeyword.keyword },
            { city: endKeyword.city, keyword: endKeyword.keyword }
          ],
          (status: string, result: any) => {
            if (status === 'complete') {
              console.log('绘制驾车路线完成');
            } else {
              console.error('获取驾车数据失败：', result);
            }
          }
        );
      } catch (error) {
        console.error('地图加载失败:', error);
      }
    };

    initMap();

    // 组件卸载时销毁地图
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [startKeyword, endKeyword, showPanel]);

  return (
    <div className="map-container-wrapper">
      <button
        className="panel-toggle-btn"
        style={{ left: '10px', right: 'auto' }}
        onClick={togglePanel}
      >
        {isPanelVisible ? '隐藏面板' : '显示面板'}
      </button>

      <div
        className="h-full w-full"
        id="container"
        ref={mapContainerRef}
      />

      <div
        id="panel"
        ref={panelRef}
        style={{ display: isPanelVisible ? 'block' : 'none' }}
      />
    </div>
  );
};

// 为TypeScript声明全局AMap对象和回调函数
declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string;
    };
    AMap: any;
    initAMap: () => void;
  }
}

export default RouteMap;
