<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" :rules="updPwdRules">
      <el-form-item label="原密码">
        <el-input ref="oldPassword" v-model="form.oldPassword" style="width:300px" show-password />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input ref="newPassword" v-model="form.newPassword" style="width:300px" show-password />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input ref="confirmPassword" v-model="form.confirmPassword" style="width:300px" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'
export default {
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    onSubmit() {
      updatePassword(this.form).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.form = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        this.logout()
      })
    },
    onCancel() {
      this.form = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$message({
        message: '取消修改!',
        type: 'info'
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

