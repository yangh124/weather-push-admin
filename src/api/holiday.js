import request from '@/utils/request'

export function getAllHolidays(params) {
  return request({
    url: '/holidays',
    method: 'get',
    params
  })
}
