import { request } from '../request';

export type AddGoodParams = {
  class: string;
  createBy: string;
  desc: string;
  inventory: number;
  name: string;
  repo: string;
  status?: Api.Common.EnableStatus;
  updateBy: string;
  weight: number;
};

export type UpdateGoodParams = {
  class?: string;
  desc?: string;
  id: number;
  inventory?: number;
  name?: string;
  repo?: string;
  status?: Api.Common.EnableStatus;
  updateBy: string;
  weight?: number;
};

export const Good = {
  /**
   * 添加商品
   *
   * @param data 商品信息
   */
  addGood: (data: Api.GoodManage.AddGoodParams) => {
    return request({
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      url: '/goodManage/good'
    });
  },

  /**
   * 删除商品
   *
   * @param id 商品ID
   */
  deleteGood: (id: number) => {
    return request({
      method: 'delete',
      url: `/goodManage/good/${id}`
    });
  },

  getGoodList: async (params?: Api.GoodManage.GoodSearchParams) => {
    return request<Api.GoodManage.GoodList>({
      method: 'get',
      params,
      url: '/goodManage/getGoodList'
    });
  },

  /**
   * 更新商品
   *
   * @param data 商品信息
   */
  updateGood: (data: Api.GoodManage.UpdateGoodParams) => {
    return request({
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'put',
      url: '/goodManage/good'
    });
  }
};
