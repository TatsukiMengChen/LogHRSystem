/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { Suspense, lazy } from 'react';

import { selectUserInfo } from '@/features/auth/authStore';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { Api, addUserAPI, deleteUserAPI, updateUserAPI } from '@/service/api';

import OrderSearch from './modules/OrderSearch';

const OrderOperateDrawer = lazy(() => import('./modules/OrderOperateDrawer'));

const OrderManage = () => {
  const { t } = useTranslation();

  const userInfo = useAppSelector(selectUserInfo);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  // const nav = useNavigate();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable(
    {
      apiFn: Api.Order.getGoodList,
      // @ts-ignore
      apiParams: {
        current: 1,
        name: null,
        size: 10,
        status: null
      },
      columns: () => [
        {
          align: 'center',
          dataIndex: 'index',
          key: 'index',
          title: t('common.index'),
          width: 64
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
          render: customerInfo => customerInfo?.address,
          title: t('客户地址')
        },
        {
          align: 'center',
          dataIndex: 'price',
          key: 'price',
          title: t('订单价格'),
          width: 100
        },
        {
          align: 'center',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          title: t('交付时间'),
          width: 150
        },
        {
          align: 'center',
          dataIndex: 'sentOutTime',
          key: 'sentOutTime',
          title: t('发货时间'),
          width: 150
        },
        {
          align: 'center',
          key: 'operate',
          render: (_, record) => (
            <div className="flex-center gap-8px">
              <AButton
                size="small"
                type="link"
                onClick={() => edit(record.id)}
              >
                {t('发货')}
              </AButton>
              <AButton
                size="small"
                type="dashed"
                onClick={() => edit(record.id)}
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
      if (type === 'add') {
        addUserAPI({
          ...res,
          createBy: userInfo.userName,
          updateBy: userInfo.userName
        });
        console.log(res);
      } else {
        updateUserAPI({
          ...res,
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
    deleteUserAPI(id);
    console.log(id);

    onDeleted();
  }

  function edit(id: number) {
    // handleEdit(id);
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
            add={() => {}}
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
    </div>
  );
};

export default OrderManage;
