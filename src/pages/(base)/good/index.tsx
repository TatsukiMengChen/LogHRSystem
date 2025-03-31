/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import useApp from 'antd/es/app/useApp';
import { Suspense, lazy } from 'react';

import { selectUserInfo } from '@/features/auth/authStore';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { Api } from '@/service/api';

import GoodSearch from './modules/GoodSearch';

const GoodOperateDrawer = lazy(() => import('./modules/GoodOperateDrawer'));

const GoodManage = () => {
  const { t } = useTranslation();

  const { message } = useApp();

  const userInfo = useAppSelector(selectUserInfo);

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  // const nav = useNavigate();

  const isMobile = useMobile();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable(
    {
      apiFn: Api.Good.getGoodList,
      // @ts-ignore
      apiParams: {
        class: null,
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
          width: 64
        },
        {
          align: 'center',
          dataIndex: 'name',
          key: 'name',
          minWidth: 100,
          title: t('名称')
        },
        {
          align: 'center',
          dataIndex: 'repo',
          key: 'repo',
          minWidth: 100,
          title: t('仓库')
        },
        {
          align: 'center',
          dataIndex: 'class',
          key: 'class',
          title: t('分类'),
          width: 120
        },
        {
          align: 'center',
          dataIndex: 'inventory',
          key: 'inventory',
          title: t('库存'),
          width: 120
        },
        {
          align: 'center',
          dataIndex: 'weight',
          key: 'weight',
          title: t('重量'),
          width: 120
        },
        {
          align: 'center',
          dataIndex: 'desc',
          key: 'desc',
          minWidth: 200,
          render: desc => {
            const description = desc || '';
            const displayDesc = description.length > 20 ? `${description.slice(0, 20)}...` : description;
            return (
              <ATooltip title={description}>
                <span>{displayDesc}</span>
              </ATooltip>
            );
          },
          title: t('备注')
        },
        {
          align: 'center',
          key: 'operate',
          render: (_, record) => (
            <div className="flex-center gap-8px">
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
        await Api.Good.addGood({
          ...res,
          createBy: userInfo.userName,
          updateBy: userInfo.userName
        });
        // message.success(t('添加商品成功'));
        console.log(res);
      } else {
        await Api.Good.updateGood({
          ...res,
          updateBy: userInfo.userName
        });
        // message.success(t('更新商品成功'));
        console.log(res);
      }
    });

  async function handleBatchDelete() {
    try {
      // 对批量删除的商品进行处理
      await Promise.all(checkedRowKeys.map(id => Api.Good.deleteGood(Number(id))));
      message.success(t('批量删除成功'));
      onBatchDeleted();
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error(t('批量删除失败'));
    }
  }

  async function handleDelete(id: number) {
    try {
      await Api.Good.deleteGood(id);
      // message.success(t('删除商品成功'));
      onDeleted();
    } catch (error) {
      console.error('删除商品失败:', error);
      // message.error(t('删除商品失败'));
    }
  }

  function edit(id: number) {
    handleEdit(id);
  }

  return (
    <div className="h-full min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
      <ACollapse
        bordered={false}
        className="card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <GoodSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('商品管理')}
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
          <GoodOperateDrawer {...generalPopupOperation} />
        </Suspense>
      </ACard>
    </div>
  );
};

export default GoodManage;
