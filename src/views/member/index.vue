<template>
  <div class="app-container">
    <div>
      <el-button type="primary" style="margin-left: 20px" @click="qrCode()">生成二维码</el-button>
      <el-dialog title="使用微信扫码加入" :visible.sync="dialogVisible" width="300px">
        <el-image
          style="width: 200px; height: 200px"
          :src="url"
        />
      </el-dialog>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="成员id" width="400">
        <template slot-scope="scope">
          {{ scope.row.userid }}
        </template>
      </el-table-column>
      <el-table-column label="成员名称" width="400" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="open_userid" width="400" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.open_userid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getJoinQrCode } from '@/api/member'
import { memberList } from '@/api/member'

export default {
  data() {
    return {
      dialogVisible: false,
      url: '',
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    qrCode() {
      getJoinQrCode().then(res => {
        this.url = res.data
        this.dialogVisible = true
      })
    },
    fetchData() {
      this.listLoading = true
      memberList().then(res => {
        const data = res.data
        this.list = data
        this.listLoading = false
      })
    }
  }
}
</script>
