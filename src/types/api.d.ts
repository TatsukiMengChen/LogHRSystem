/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record id */
      id: number;
      /** record status */
      status: EnableStatus | null;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      refreshToken: string;
      token: string;
    }

    interface UserInfo {
      buttons: string[];
      roles: string[];
      userId: string;
      userName: string;
    }

    type Info = {
      token: LoginToken['token'];
      userInfo: UserInfo;
    };
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@soybean-react/vite-plugin-react-router').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      home: import('@soybean-react/vite-plugin-react-router').LastLevelRouteKey;
      routes: string[];
    }
  }

  namespace Data {
    type CardData = {
      customers: number;
      orders: number;
      transactionQuantity: number;
      transactionVolume: number;
    };

    type LineData = {
      success: number[];
      total: number[];
    };

    type PieData = {
      data: {
        name: string;
        value: number;
      }[];
    };
  }

  /**
   * namespace OrderManage
   *
   * backend api module: "orderManage"
   */
  namespace OrderManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** customer info */
    type CustomerInfo = {
      /** address */
      address: string;
      /** customer name */
      name: string;
      /** phone number */
      phone: string;
    };

    /** order item */
    type Item = {
      /** item id */
      id: number;
      /** item name */
      name: string;
      /** quantity */
      quantity: string;
      /** weight */
      weight: string;
    };

    /** order */
    type Order = Omit<
      Common.CommonRecord<{
        /** customer information */
        customerInfo: CustomerInfo;
        /** delivery time */
        deliveryTime: string;
        /** order items */
        items: Item[];
        /** order name */
        name: string;
        /** order price */
        price: string;
        /** sent out time */
        sentOutTime: string;
      }>,
      'status'
    >;

    /** order search params */
    type OrderSearchParams = CommonType.RecordNullable<Pick<OrderManage.Order, 'name'> & CommonSearchParams>;

    /** order list */
    type OrderList = Common.PaginatingQueryRecord<Order>;

    /** 添加订单参数 */
    type AddOrderParams = {
      createBy: string;
      customerInfo?: {
        address: string;
        name: string;
        phone: string;
      };
      deliveryTime?: string;
      items?: Array<{
        id: number;
        name: string;
        quantity: string;
        weight: string;
      }>;
      name?: string;
      price?: string;
      sentOutTime?: string;
      updateBy: string;
      [key: string]: any; // 允许额外的属性
    };

    /** 更新订单参数 */
    type UpdateOrderParams = {
      customerInfo?: {
        address?: string;
        name?: string;
        phone?: string;
      };
      deliveryTime?: string;
      id: number;
      items?: Array<{
        id: number;
        name: string;
        quantity: string;
        weight: string;
      }>;
      name?: string;
      price?: string;
      sentOutTime?: string;
      updateBy: string;
    };
  }

  namespace GoodManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    type Good = Omit<
      Common.CommonRecord<{
        /** 分类，分类 */
        class: string;
        /** 备注，备注 */
        desc: string;
        /** ID，ID 编号 */
        id: number;
        /** 库存，库存 */
        inventory: number;
        /** 商品名称，名称 */
        name: string;
        /** 仓库名称，仓库 */
        repo: string;
        /** 重量，单位kg */
        weight: number;
      }>,
      'status'
    >;

    /** 添加商品参数 */
    type AddGoodParams = {
      class: string;
      createBy: string;
      desc: string;
      inventory: number;
      name: string;
      repo: string;
      updateBy: string;
      weight: number;
    };

    /** 更新商品参数 */
    type UpdateGoodParams = {
      class?: string;
      desc?: string;
      id: number;
      inventory?: number;
      name?: string;
      repo?: string;
      updateBy: string;
      weight?: number;
    };

    /** 商品查询参数 */
    type GoodSearchParams = CommonType.RecordNullable<Pick<Api.GoodManage.Good, 'class' | 'name'> & CommonSearchParams>;

    /** 商品列表 */
    type GoodList = Common.PaginatingQueryRecord<Good>;
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      home: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
      /** role name */
      roleName: string;
      routes: string[];
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleCode' | 'roleName' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleCode' | 'roleName'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user nick name */
      nickName: string;
      /** user email */
      userEmail: string;
      /** user gender */
      userGender: UserGender | null;
      /** user name */
      userName: string;
      /** user phone */
      userPhone: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'nickName' | 'status' | 'userEmail' | 'userGender' | 'userName' | 'userPhone'> &
        CommonSearchParams
    >;

    /** user info */
    type AddUserParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.User,
        'nickName' | 'status' | 'userEmail' | 'userGender' | 'userName' | 'userPhone' | 'userRoles'
      > &
        Pick<Api.Common.CommonRecord, 'createBy' | 'id' | 'updateBy'>
    >;

    type UpdateUserParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.User,
        'nickName' | 'status' | 'userEmail' | 'userGender' | 'userName' | 'userPhone' | 'userRoles'
      > &
        Pick<Api.Common.CommonRecord, 'id' | 'updateBy'>
    >;

    type AddRoleParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleCode' | 'roleDesc' | 'roleName' | 'status'> &
        Pick<Api.Common.CommonRecord, 'createBy' | 'id' | 'updateBy'>
    >;

    type UpdateRoleParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'home' | 'roleCode' | 'roleDesc' | 'roleName' | 'routes' | 'status'> &
        Pick<Api.Common.CommonRecord, 'id' | 'updateBy'>
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('@soybean-react/vite-plugin-react-router').RouteMeta,
      | 'activeMenu'
      | 'constant'
      | 'fixedIndexInTab'
      | 'hideInMenu'
      | 'href'
      | 'i18nKey'
      | 'keepAlive'
      | 'multiTab'
      | 'order'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** menu name */
      menuName: string;
      /** menu type */
      menuType: MenuType;
      /** parent menu id */
      parentId: number;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      children?: MenuTree[];
      id: number;
      label: string;
      pId: number;
    };
  }
}
