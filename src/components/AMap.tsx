/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { type FC, useEffect, useRef, useState } from 'react';

import { Api } from '@/service/api';

interface AMapProps {
  id?: number; // 路线ID，用于获取路线点数据，改为number类型
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
    .map-container-wrapper {
      position: relative;
      height: 60vh;
      width: 100%;
    }
  `;
  document.head.appendChild(style);
};

// 模拟API请求获取路线点
const fetchRoutePoints = async (id: number): Promise<number[][]> => {
  // 模拟网络延迟
  console.log('Fetching route points...', id);
  // return new Promise(resolve => {
  //   setTimeout(() => {
  //     // 模拟不同ID返回不同的路线点
  //     const routes: Record<number, number[][]> = {
  //       // 默认路线
  //       0: [
  //         [116.379028, 39.865042], // 起点
  //         [116.379028, 39.885042], // 途经点
  //         [116.427281, 39.903719] // 终点
  //       ],
  //       1: [
  //         [116.379028, 39.865042], // 起点
  //         [116.379028, 39.885042], // 途经点1
  //         [116.427281, 39.903719] // 终点
  //       ],
  //       2: [
  //         [116.379028, 39.865042], // 起点
  //         [116.397428, 39.890923], // 途经点1
  //         [116.410728, 39.895532], // 途经点2
  //         [116.427281, 39.903719] // 终点
  //       ],
  //       3: [
  //         [116.379028, 39.865042], // 起点
  //         [116.379028, 39.885042], // 途经点1
  //         [116.397428, 39.890923], // 途经点2
  //         [116.410728, 39.895532], // 途经点3
  //         [116.417963, 39.899603], // 途经点4
  //         [116.427281, 39.903719] // 终点
  //       ]
  //     };

  //     resolve(routes[id] || routes[0]);
  //   }, 1000); // 模拟1秒网络延迟
  // });
  const res = await Api.Order.getRoute(id);
  console.log('获取路线点数据:', res);
  // 处理返回的坐标点，将[0,0]替换为默认坐标
  const defaultPoint = [116.397428, 39.890923]; // 默认坐标
  const validPoints =
    res.data?.points?.map((point: number[]) => {
      // 如果坐标是[0,0]或者无效，则使用默认坐标
      if (!point || point.length < 2 || (point[0] === 0 && point[1] === 0)) {
        return defaultPoint;
      }
      return point;
    }) || [];

  return validPoints;
};

const RouteMap: FC<AMapProps> = ({ id = 0 }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);

  // 获取路线点数据
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchRoutePoints(id)
      .then(routePoints => {
        setPoints(routePoints);
        setLoading(false);
      })
      .catch(err => {
        console.error('获取路线数据失败:', err);
        setError('获取路线数据失败，请稍后重试');
        setLoading(false);
      });
  }, [id]);

  // 加载地图并规划路线
  useEffect(() => {
    // 如果还在加载数据或者没有点数据，则不初始化地图
    if (loading || points.length < 2) return;

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
          center: points[0], // 以起点为中心
          resizeEnable: true,
          zoom: 13
        });

        mapInstanceRef.current = map;

        // 获取起点和终点
        const startPoint = points[0];
        const endPoint = points[points.length - 1];

        // 获取途经点（如果有）
        const waypoints = points.length > 2 ? points.slice(1, points.length - 1) : [];

        // 设置驾车导航配置
        const drivingOptions = {
          map,
          policy: 0 // 使用速度优先策略
        };

        // 构造路线导航类
        const driving = new AMap.Driving(drivingOptions);

        // 转换途经点格式
        const waypointsLngLat = waypoints.map(point => new AMap.LngLat(point[0], point[1]));

        // 根据起终点经纬度规划驾车导航路线
        driving.search(
          new AMap.LngLat(startPoint[0], startPoint[1]),
          new AMap.LngLat(endPoint[0], endPoint[1]),
          {
            waypoints: waypointsLngLat
          },
          (status: string, result: any) => {
            if (status === 'complete') {
              console.log('绘制驾车路线完成');
            } else {
              console.error('获取驾车数据失败：', result);
            }
          }
        );
      } catch (err) {
        console.error('地图加载失败:', err);
        setError('地图加载失败，请检查网络连接或刷新页面');
      }
    };

    initMap();

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [points, loading]);

  return (
    <div className="map-container-wrapper">
      {loading && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            left: '50%',
            padding: '10px 20px',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100
          }}
        >
          加载路线数据中...
        </div>
      )}

      {error && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            color: 'red',
            left: '50%',
            padding: '10px 20px',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100
          }}
        >
          {error}
        </div>
      )}

      <div
        className="h-full w-full"
        id="container"
        ref={mapContainerRef}
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
