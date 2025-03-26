import { request } from '../request';

export const Data = {
  getCardData: async () => {
    return request<Api.Data.CardData>({
      method: 'get',
      url: '/data/card'
    });
  },
  getLineData: async () => {
    return request<Api.Data.LineData>({
      method: 'get',
      url: '/data/line'
    });
  },
  getPieData: async () => {
    return request<Api.Data.PieData>({
      method: 'get',
      url: '/data/pie'
    });
  }
};
