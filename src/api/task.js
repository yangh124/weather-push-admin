import request from '@/utils/request'

export function getPage(params) {
  return request({
    url: '/tasks/page',
    method: 'get',
    params
  })
}

export function addTask(data) {
  return request({
    url: '/tasks',
    method: 'post',
    data
  })
}

export function delTask(id) {
  return request({
    url: '/tasks/' + id,
    method: 'delete'
  })
}

export function updateTask(id, data) {
  return request({
    url: '/tasks/' + id,
    method: 'patch',
    data
  })
}
