import { request } from '../request';

export const Data = {
  getCardData: async () => {
    request<{
      customers: number;
      orders: number;
      transactionQuantity: number;
      transactionVolume: number;
    }>({
      method: 'get',
      url: '/data/card'
    });
  },
  getLineData: async () => {
    request<{
      success: number[];
      total: number[];
    }>({
      method: 'get',
      url: '/data/line'
    });
  }
};
