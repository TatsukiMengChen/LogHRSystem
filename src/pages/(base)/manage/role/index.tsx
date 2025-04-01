import { Suspense } from 'react';

import { enableStatusRecord } from '@/constants/business';
import { ATG_MAP } from '@/constants/common';
import { selectUserInfo } from '@/features/auth/authStore';
import { TableHeaderOperation, useTable, useTableOperate, useTableScroll } from '@/features/table';
import { addRoleAPI, deleteRoleAPI, fetchGetRoleList, updateRoleAPI } from '@/service/api';

import RoleSearch from './modules/role-search';

const RoleOperateDrawer = lazy(() => import('./modules/role-operate-drawer'));

const Role = () => {
  const { t } = useTranslation();

  const userInfo = useAppSelector(selectUserInfo);

  const isMobile = useMobile();

  // const nav = useNavigate()

  const [menuAuthData, setMenuAuthData] = useState<{
    home: string;
    menus: string[];
    roleId: number;
  }>();

  const { scrollConfig, tableWrapperRef } = useTableScroll();

  const { columnChecks, data, run, searchProps, setColumnChecks, tableProps } = useTable({
    apiFn: fetchGetRoleList,
    apiParams: {
      current: 1,
      roleCode: undefined,
      roleName: undefined,
      size: 10,
      status: undefined
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
        dataIndex: 'roleName',
        key: 'roleName',
        minWidth: 120,
        title: t('page.manage.role.roleName')
      },
      {
        align: 'center',
        dataIndex: 'roleCode',
        key: 'roleCode',
        minWidth: 120,
        title: t('page.manage.role.roleCode')
      },
      {
        dataIndex: 'roleDesc',
        key: 'roleDesc',
        minWidth: 120,
        title: t('page.manage.role.roleDesc')
      },
      {
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          if (record.status === null) {
            return null;
          }
          const label = t(enableStatusRecord[record.status]);
          return <ATag color={ATG_MAP[record.status]}>{label}</ATag>;
        },
        title: t('page.manage.role.roleStatus'),
        width: 200
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
            {/* <AButton
              size="small"
              onClick={() => nav(`/manage/role/${record.id}/${record.roleName}/${record.status}`)}
            >
              详情
            </AButton> */}
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
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    checkedRowKeys,
    editingData,
    generalPopupOperation,
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    rowSelection
  } = useTableOperate(data, run, async (res, type) => {
    if (res.status) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status = Number(res.status);
    }
    if (type === 'add') {
      addRoleAPI({
        ...res,
        createBy: userInfo.userName,
        updateBy: userInfo.userName
      });
    } else {
      updateRoleAPI({
        // ...data,
        ...res,
        home: menuAuthData?.home || '/home',
        id: selectedId!,
        routes: menuAuthData?.menus || [],
        updateBy: userInfo.userName
      });
    }
  });

  async function handleBatchDelete() {
    // request
    console.log(checkedRowKeys);
    onBatchDeleted();
  }

  function handleDelete(id: number) {
    // request
    deleteRoleAPI(id);
    onDeleted();
  }

  const [currentRoutes, setCurrentRoutes] = useState<string[]>([]);

  function edit(id: number) {
    // console.log(data);
    setSelectedId(id);
    setCurrentRoutes(data.find(item => item.id === id)?.routes || []);
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
            children: <RoleSearch {...searchProps} />,
            key: '1',
            label: t('common.search')
          }
        ]}
      />

      <ACard
        className="flex-col-stretch sm:flex-1-hidden card-wrapper"
        ref={tableWrapperRef}
        title={t('page.manage.role.title')}
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
          rowSelection={rowSelection}
          scroll={scrollConfig}
          size="small"
          {...tableProps}
        />

        <Suspense>
          <RoleOperateDrawer
            {...generalPopupOperation}
            routes={currentRoutes}
            rowId={editingData?.id || -1}
            setMenuAuthData={setMenuAuthData}
          />
        </Suspense>
      </ACard>
    </div>
  );
};

export default Role;
