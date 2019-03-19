import * as oauthUserService from '../services/oauthUser';

export default {
  namespace: 'oauthUsers',
  state: {
    list: [],
    total: 0,
    listAll: []
  },
  reducers: {
    save(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    saveAll(state, { payload: { list } }) {
      return { ...state, listAll: list };
    }
  },
  effects: {
    *fetch({ payload: { currentPage, pageSize, params }, }, { call, put }) {
      const { data } = yield call(oauthUserService.fetch, {
        currentPage,
        pageSize,
        params,
      });
      const { list, total } = data;
      yield put({ type: 'save', payload: { list, total } });
    },
    *fetchAll({ payload }, { call, put }) {
      const { data: {list} } = yield call(oauthUserService.fetchAll, {});
      yield put({ type: 'saveAll', payload: { list } })
    },
    *add({ payload, callback }, { call }) {
      const { data } = yield call(oauthUserService.add, payload);
      if (callback) callback(data);
    },
    *delete({ payload, callback }, { call }) {
      const { data } = yield call(oauthUserService.batchDelete, payload);
      if (callback) callback(data);
    },
    *update({ payload, callback }, { call }) {
      const { data } = yield call(oauthUserService.update, payload);
      if (callback) callback(data);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // history.listen是react路由的监听器
        if (pathname === '/oauth/user') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
