<template>
  <el-container>
    <el-aside width="200px" style="margin-top:80px">
      <el-tree ref="tree" :data="data" node-key="id" show-checkbox empty-text="无数据" @check="handleNodeClick" @node-click="handleNodeClick" />
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <el-button size="small" type="primary" style="margin-top:20px;margin-left:20px" @click="qrCode()">生成二维码</el-button>
          <el-dialog title="使用微信扫码加入" :visible.sync="dialogVisible" width="300px">
            <el-image
              style="width: 200px; height: 200px"
              :src="url"
            />
          </el-dialog>
          <el-button size="small" type="primary" plain icon="el-icon-document-add" style="float:right;margin-top:20px;margin-right:20px" :loading="addLoading" @click="addMember">添加</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          :v-loading="listLoading"
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
      </el-main>
    </el-container>
    <el-dialog title="关联成员" :visible.sync="dialogFormVisible">
      <el-select v-model="userid" placeholder="请选择" style="width: 400px">
        <el-option
          v-for="item in members"
          :key="item.userId"
          :label="item.name"
          :value="item.userid"
        >
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userid }}</span>
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { getJoinQrCode, memberList } from '@/api/member'
import { getAll } from '@/api/tag'

export default {
  data() {
    return {
      dialogVisible: false,
      url: '',
      list: null,
      listLoading: true,
      data: [],
      addLoading: false,
      form: {
        tagName: ''
      },
      dialogFormVisible: false,
      members: [],
      userid: ''
    }
  },
  created() {
    this.tagList()
  },
  methods: {
    qrCode() {
      getJoinQrCode().then(res => {
        this.url = res.data
        this.dialogVisible = true
      })
    },
    tagList() {
      getAll().then(res => {
        const dataList = res.data
        this.data = []
        if (dataList != null && dataList.length > 0) {
          for (const data of dataList) {
            this.data.push({ id: data.id, label: data.tagName })
          }
          this.handleNodeClick(dataList[0])
        }
      })
    },
    memberList(id) {
      this.listLoading = true
      memberList({ id: id }).then(res => {
        const data = res.data
        this.list = data
        this.listLoading = false
      })
    },
    handleNodeClick(data) {
      const id = data.id
      this.setCheckedKeys([id])
      this.memberList(id)
    },
    setCheckedKeys(id) {
      this.$refs.tree.setCheckedKeys([id])
    },
    addMember() {
      memberList().then(res => {
        const data = res.data
        this.members = data
        console.log(data)
        this.dialogFormVisible = true
      })
    },
    addCancel() {
      this.form.tagName = ''
      this.dialogFormVisible = false
    },
    addConfirm() {
      this.addLoading = true
      // relMember(this.form).then(res => {
      //   this.$message({
      //     type: 'success',
      //     message: res.message
      //   })
      //   this.addLoading = true
      //   this.dialogFormVisible = false
      //   this.reset()
      // })
    }
  }
}
</script>
