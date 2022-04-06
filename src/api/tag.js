import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/tags/page',
    method: 'get',
    params
  })
}

export function addTag(data) {
  return request({
    url: '/tags',
    method: 'post',
    data
  })
}

export function delTag(id) {
  return request({
    url: '/tags/' + id,
    method: 'delete'
  })
}

export function getAll() {
  return request({
    url: '/tags',
    method: 'get'
  })
}
