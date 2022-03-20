import request from '@/utils/request'

export function getJoinQrCode() {
  return request({
    url: '/members/qr_code',
    method: 'get'
  })
}

export function memberList(params) {
  return request({
    url: '/members',
    method: 'get',
    params
  })
}
