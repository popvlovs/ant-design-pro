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

export async function setApplicationUser(params) {
  return request(`/system/application/users`, {
    method: 'POST',
    body: {
      ...params
    }
  })
}

export async function batchDelete(params) {
  const ids = params.join(',');
  return request(`/system/application/${ids}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`/system/application/${params.clientId}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
