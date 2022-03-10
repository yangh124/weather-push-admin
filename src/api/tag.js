import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/tags',
    method: 'get',
    params
  })
}

export function delTag(id) {
  return request({
    url: '/tags/' + id,
    method: 'delete'
  })
}
