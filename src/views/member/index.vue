<template>
  <div>
    <el-button type="primary" style="margin-left: 20px" @click="qrCode()">生成二维码</el-button>
    <el-dialog title="使用微信扫码加入" :visible.sync="dialogVisible" width="15%" center="true">
      <el-image
        style="width: 200px; height: 200px"
        :src="url"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getJoinQrCode } from '@/api/member'

export default {
  data() {
    return {
      dialogVisible: false,
      url: ''
    }
  },
  methods: {
    qrCode() {
      getJoinQrCode().then(res => {
        this.url = res.data
        this.dialogVisible = true
      })
    }
  }
}
</script>
