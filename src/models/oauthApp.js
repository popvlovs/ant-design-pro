import * as oauthAppService from '../services/oauthApp';

export default {
  namespace: 'oauthApps',
  state: {
    data: []
  },
  reducers: {
    save(
      state,
      {
        payload: { data },
      }
    ) {
      return { ...state, data };
    },
  },
  effects: {
    *fetch({ payload: { params } }, { call, put }) {
      const { data } = yield call(oauthAppService.fetch, { params });
      yield put({ type: 'save', payload: { data } });
    },
    *add({ payload, callback }, { call }) {
      const { data } = yield call(oauthAppService.add, payload);
      if (callback) callback(data);
    },
    *delete({ payload, callback }, { call }) {
      const { data } = yield call(oauthAppService.batchDelete, payload);
      if (callback) callback(data);
    },
    *update({ payload, callback }, { call }) {
      const { data } = yield call(oauthAppService.update, payload);
      if (callback) callback(data);
    },
    *updateBindUsers({ payload, callback }, { call }) {
      const { data } = yield call(oauthAppService.setApplicationUser, payload)
      if (callback) callback(data)
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // history.listen是react路由的监听器
        if (pathname === '/oauth/app') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
