import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export function add(data) {
  console.log('data======' + data.file)
  const file = data.file
  const url = 'api/file/import'
  const formData = new FormData();
  formData.append("file", file)
  formData.append('creator', data.creator)
  formData.append('title', data.title)
  formData.append('projectId', data.projectId)
  formData.append('productLineId', data.productLineId)
  formData.append('caseType', data.caseType)
  formData.append('requirementId', data.requirementId)
  formData.append('description',data.description)
  formData.append('channel',data.channel)
  formData.append('bizId',data.bizId)
  const config = {
    'Authorization': getToken(),
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryyyi77zdj6shfaI9l'
  }
  if (file){
    return request({
      url: url,
      method: 'post',
      data: formData,
      headers: config
    })
  }
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
    data: { id: ids[0] }
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

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: { 'Authorization': getToken(),
               'Content-Type': 'multipart/form-data'}
  }
  return axios.post(api, data, config)
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

export function getCaseInfo(id) {
  return request({
    url: 'api/case/getCaseInfo',
    method: 'get',
    params: { id : id }
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
