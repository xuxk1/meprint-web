import request from '@/utils/request'

export function getJiraData() {
  return request({
    url: 'api/dashboard',
    method: 'get'
  })
}
