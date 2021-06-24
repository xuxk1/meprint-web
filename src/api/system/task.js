import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function add(data) {
  return request({
    url: 'api/record/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/record/delete',
    method: 'post',
    data: { id: ids[0] }
  })
}

export function edit(data) {
  return request({
    url: 'api/record/edit',
    method: 'post',
    data
  })
}

export function clear(data) {
  return request({
    url: 'api/record/clear',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: 'api/record/list',
    method: 'get',
    params: data
  })
}

export function execution(id) {
  return request({
    url: 'api/record/getRecordInfo',
    method: 'get',
    params: { id : id }
  })
}


export default { add, edit, del, clear, queryList, execution}
