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

export function addTagMembers(data) {
  return request({
    url: '/tags/members',
    method: 'post',
    data
  })
}

export function delTagMembers(data) {
  return request({
    url: '/tags/members',
    method: 'delete',
    data
  })
}
