import request from '@/utils/request';

export function getJoinQrCode() {
  return request({
    url: '/members/qr_code',
    method: 'get',
  });
}

export function agentConfig() {
  return request({
    url: '/members/agentConfig',
    method: 'get',
  });
}
