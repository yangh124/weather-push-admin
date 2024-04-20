import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/location/page',
    method: 'get',
    params
  })
}

export function addLocation(data) {
  return request({
    url: '/location',
    method: 'post',
    data
  })
}

export function delLocation(id) {
  return request({
    url: '/location/' + id,
    method: 'delete'
  })
}

export function getAll() {
  return request({
    url: '/location',
    method: 'get'
  })
}

export function addLocationMembers(data) {
  return request({
    url: '/location/members',
    method: 'post',
    data
  })
}

export function delLocationMembers(data) {
  return request({
    url: '/location/members',
    method: 'delete',
    data
  })
}
