import { request } from '../request';

export const Good = {
  getGoodList: async () => {
    return request<{
      /** 当前页面 */
      current: number;
      /** 用户记录 */
      records: Api.GoodManage.Good[];
      /** 大小 */
      size: number;
      /** 用户总数 */
      total: number;
    }>({
      method: 'get',
      url: '/goodManage/getGoodList'
    });
  }
};
