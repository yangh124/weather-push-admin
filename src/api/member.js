import request from '@/utils/request'

export function getJoinQrCode() {
  return request({
    url: '/members/qr_code',
    method: 'get'
  })
}
