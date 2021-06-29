import request from '@/utils/request'

function getJiraData() {
  return request({
    url: 'api/dashboard',
    method: 'get'
  })
}

function issueTable() {
  return request({
    url: 'api/issueTable',
    method: 'post'
  })
}

export {
  getJiraData,
  issueTable
}
