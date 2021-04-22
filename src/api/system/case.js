import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/case/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/case/delete',
    method: 'post',
    data: {id: ids[0]}
  })
}

export function edit(data) {
  return request({
    url: 'api/case/edit',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'api/case/update',
    method: 'post',
    data
  })
}

export function queryList(data) {
  return request({
    url: 'api/case/list',
    method: 'get',
    data
  })
}

export function queryDetail(data) {
  return request({
    url: 'api/case/detail',
    method: 'get',
    data
  })
}

export function listCreators(data) {
  return request({
    url: 'api/case/listCreators',
    method: 'get',
    data
  })
}

export function getCaseInfo(data) {
  return request({
    url: 'api/case/getCaseInfo',
    method: 'get',
    data
  })
}

export function countByCondition(data) {
  return request({
    url: 'api/case/countByCondition',
    method: 'get',
    data
  })
}

export default { add, edit, update, del, queryList, queryDetail, listCreators, getCaseInfo, countByCondition}
