/* eslint-disable no-eq-null */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import useApp from 'antd/es/app/useApp';
import { Suspense, lazy, useState } from 'react';

import RouteMap from '@/components/AMap';
import { selectUserInfo } from '@/features/auth/authStore';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { Api, addUserAPI, deleteUserAPI, updateUserAPI } from '@/service/api';

import OrderSearch from './modules/OrderSearch';

const OrderOperateDrawer = lazy(() => import('./modules/OrderOperateDrawer'));

const OrderManage = () => {
  const { t } = useTranslation();

  const { message } = useApp();

  const userInfo = useAppSelector(selectUserInfo);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  // const nav = useNavigate();

  const isMobile = useMobile();

  // 添加地图模态框状态
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 显示地图
  const showAddressMap = (address: string) => {
    setSelectedAddress(address);
    setMapVisible(true);
  };

  // 关闭地图
  const closeAddressMap = () => {
    setMapVisible(false);
  };

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable(
    {
      apiFn: Api.Order.getOrderList,
      // @ts-ignore
      apiParams: {
        current: 1,
        name: null,
        size: 10
      },
      columns: () => [
        {
          align: 'center',
          dataIndex: 'index',
          key: 'index',
          title: t('common.index'),
          width: 48
        },
        {
          align: 'center',
          dataIndex: 'name',
          key: 'name',
          minWidth: 100,
          title: t('订单名称')
        },
        {
          align: 'center',
          dataIndex: 'customerInfo',
          // @ts-ignore
          key: 'customerInfo.name',
          minWidth: 100,
          render: customerInfo => customerInfo?.name,
          title: t('客户名称')
        },
        {
          align: 'center',
          dataIndex: 'customerInfo',
          // @ts-ignore
          key: 'customerInfo.phone',
          render: customerInfo => customerInfo?.phone,
          title: t('联系电话'),
          width: 120
        },
        {
          align: 'center',
          dataIndex: 'customerInfo',
          // @ts-ignore
          key: 'customerInfo.address',
          minWidth: 150,
          render: customerInfo => {
            const address = customerInfo?.address || '';
            const displayAddress = address.length > 15 ? `${address.slice(0, 15)}...` : address;
            return (
              <ATooltip title={address}>
                <span
                  className="block max-w-full cursor-pointer truncate text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedId(customerInfo?.id);
                    showAddressMap(address);
                    setSelectedCity(customerInfo?.city || '');
                  }}
                >
                  {displayAddress}
                </span>
              </ATooltip>
            );
          },
          title: t('客户地址')
        },
        {
          align: 'center',
          dataIndex: 'price',
          key: 'price' as any,
          title: t('订单价格'),
          width: 100
        },
        {
          align: 'center',
          dataIndex: 'deliveryTime',
          // Using string literal as CustomColumnKey
          key: 'deliveryTime' as any,
          render: deliveryTime => (
            <ATooltip title={deliveryTime || t('未设置交付时间')}>
              <ATag color={deliveryTime ? 'success' : 'default'}>{deliveryTime ? t('已交付') : t('未交付')}</ATag>
            </ATooltip>
          ),
          title: t('订单状态'),
          width: 100
        },
        {
          align: 'center',
          dataIndex: 'sentOutTime',
          key: 'sentOutTime' as any,
          render: sentOutTime => (
            <ATooltip title={sentOutTime || t('未设置发货时间')}>
              <ATag color={sentOutTime ? 'processing' : 'default'}>{sentOutTime ? t('已发货') : t('未发货')}</ATag>
            </ATooltip>
          ),
          title: t('发货状态'),
          width: 100
        },
        {
          align: 'center',
          key: 'operate',
          render: (_, record) => (
            <div className="flex-center gap-8px">
              <AButton
                disabled={record.sentOutTime !== null}
                size="small"
                type="link"
                onClick={() => handleShip(record.id)}
              >
                {t('发货')}
              </AButton>
              <AButton
                disabled={record.deliveryTime !== null}
                size="small"
                type="dashed"
                onClick={() => handleComplete(record.id)}
              >
                {t('完成')}
              </AButton>
              <AButton
                ghost
                size="small"
                type="primary"
                onClick={() => edit(record.id)}
              >
                {t('common.edit')}
              </AButton>
              <APopconfirm
                title={t('common.confirmDelete')}
                onConfirm={() => handleDelete(record.id)}
              >
                <AButton
                  danger
                  size="small"
                >
                  {t('common.delete')}
                </AButton>
              </APopconfirm>
            </div>
          ),
          title: t('common.operate'),
          width: 195
        }
      ]
    },
    { showQuickJumper: true }
  );

  const { checkedRowKeys, generalPopupOperation, handleAdd, handleEdit, onBatchDeleted, onDeleted, rowSelection } =
    // @ts-ignore
    useTableOperate(data, run, async (res, type) => {
      // @ts-ignore
      if (res.price) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res.price = Number(res.price);
      }
      // Convert date strings to timestamps if they exist
      // @ts-ignore
      if (res.deliveryTime && typeof res.deliveryTime === 'string') {
        // @ts-ignore
        const date = new Date(res.deliveryTime);
        // @ts-ignore
        res.deliveryTime = !Number.isNaN(date.getTime()) ? Math.floor(date.getTime() / 1000) : 0;
      }
      // @ts-ignore
      else if (res.deliveryTime == null) {
        // @ts-ignore
        res.deliveryTime = 0;
      }
      // @ts-ignore
      if (res.sentOutTime && typeof res.sentOutTime === 'string') {
        // @ts-ignore
        const date = new Date(res.sentOutTime);
        // @ts-ignore
        res.sentOutTime = !Number.isNaN(date.getTime()) ? Math.floor(date.getTime() / 1000) : 0;
      }
      // @ts-ignore
      else if (res.sentOutTime == null) {
        // @ts-ignore
        res.sentOutTime = 0;
      }
      if (type === 'add') {
        Api.Order.addOrder({
          ...res,
          createBy: userInfo.userName,
          updateBy: userInfo.userName
        });
        console.log(res);
      } else {
        Api.Order.updateOrder({
          ...res,
          id: selectedId!,
          updateBy: userInfo.userName
        });
        console.log(res);
      }
    });

  async function handleBatchDelete() {
    // request
    console.log(checkedRowKeys);
    onBatchDeleted();
  }

  function handleDelete(id: number) {
    // request
    Api.Order.deleteOrder(id);
    console.log(id);

    onDeleted();
  }

  function edit(id: number) {
    setSelectedId(id);
    handleEdit(id);
  }

  // 处理发货
  async function handleShip(id: number) {
    try {
      const sentOutTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await Api.Order.updateOrder({
        id,
        sentOutTime,
        updateBy: userInfo.userName
      });
      message.success(t('发货成功'));
      run();
    } catch (error) {
      console.error('发货失败:', error);
      message.error(t('发货失败'));
    }
  }

  // 处理完成订单
  async function handleComplete(id: number) {
    try {
      const deliveryTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await Api.Order.updateOrder({
        deliveryTime,
        id,
        updateBy: userInfo.userName
      });
      message.success(t('订单已完成'));
      run();
    } catch (error) {
      console.error('完成订单失败:', error);
      message.error(t('完成订单失败'));
    }
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <OrderSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />
      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('订单管理')}
        variant="borderless"
        extra={
          <TableHeaderOperation
            add={handleAdd}
            columns={columnChecks}
            disabledDelete={checkedRowKeys.length === 0}
            loading={tableProps.loading}
            refresh={run}
            setColumnChecks={setColumnChecks}
            onDelete={handleBatchDelete}
          />
        }
      >
        <ATable
          // @ts-ignore
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />
        <Suspense>
          <OrderOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>

      {/* 地址地图模态框 */}
      <AModal
        footer={null}
        open={mapVisible}
        title={t('物流地图')}
        width="80%"
        onCancel={closeAddressMap}
      >
        <RouteMap
          id={selectedId ?? undefined}
          // endKeyword={{
          //   city: selectedCity,
          //   keyword: selectedAddress
          // }}
          // startKeyword={{
          //   city: import.meta.env.VITE_AMAP_CITY,
          //   keyword: import.meta.env.VITE_AMAP_LOCATION
          // }}
        />
      </AModal>
    </div>
  );
};

export default OrderManage;
