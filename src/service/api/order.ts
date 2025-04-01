import { request } from '../request';

export const Order = {
  /**
   * 添加订单
   *
   * @param data 订单信息
   */
  addOrder: (data: Api.OrderManage.AddOrderParams) => {
    return request({
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      url: '/orderManage/order'
    });
  },

  /**
   * 完成订单
   *
   * @param id 订单ID
   * @param updateBy 操作人
   */
  completeOrder: (id: number, updateBy: string) => {
    const deliveryTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return request({
      data: { deliveryTime, id, updateBy },
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      url: `/orderManage/order/complete`
    });
  },

  /**
   * 删除订单
   *
   * @param id 订单ID
   */
  deleteOrder: (id: number) => {
    return request({
      method: 'delete',
      url: `/orderManage/order/${id}`
    });
  },

  /** 获取订单列表 */
  getOrderList: async (params?: Api.OrderManage.OrderSearchParams) => {
    const res = await request<Api.OrderManage.OrderList>({
      method: 'get',
      params,
      url: '/orderManage/getOrderList'
    });

    // Ensure records is an array even if null
    if (res.data && res.data.records === null) {
      res.data.records = [];
    }

    return res;
  },

  /**
   * 发货
   *
   * @param id 订单ID
   * @param updateBy 操作人
   */
  shipOrder: (id: number, updateBy: string) => {
    const sentOutTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return request({
      data: { id, sentOutTime, updateBy },
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      url: `/orderManage/order/ship`
    });
  },

  /**
   * 更新订单
   *
   * @param data 订单信息
   */
  updateOrder: (data: Api.OrderManage.UpdateOrderParams) => {
    return request({
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'put',
      url: '/orderManage/order'
    });
  }
};
