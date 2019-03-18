import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch({ params }) {
  return request(`/system/application?${stringify(params)}`);
}

export async function add(params) {
  return request(`/system/application`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function batchDelete(params) {
  const ids = params.join(',');
  return request(`/system/application/${ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/system/application/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
