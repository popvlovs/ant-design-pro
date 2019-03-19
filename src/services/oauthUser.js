import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch({ currentPage = 1, pageSize = 10, params }) {
  return request(`/system/user?page=${currentPage}&pageSize=${pageSize}&${stringify(params)}`);
}

export async function fetchAll() {
  return request(`/system/user?pagination=false`)
}

export async function add(params) {
  return request(`/system/user`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function batchDelete(params) {
  const ids = params.join(',');
  return request(`/system/user/${ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/system/user/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
