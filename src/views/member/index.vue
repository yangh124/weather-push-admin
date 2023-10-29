<template>
  <el-container>
    <el-aside width="200px" style="margin-top: 80px">
      <el-tabs v-model="tabIndex" tab-position="left" @tab-click="handleTabClick()">
        <el-tab-pane v-for="item in tags" :key="item.id" style="margin-top: 10px" :label="item.tagName" border>
          {{ item.tagName }}
        </el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <el-button
            size="small"
            type="primary"
            style="margin-top: 20px; margin-left: 20px"
            @click="qrCode()"
          >生成二维码
          </el-button>
          <el-dialog
            title="使用微信扫码加入"
            :visible.sync="dialogVisible"
            width="300px"
          >
            <el-image style="width: 200px; height: 200px" :src="url" />
          </el-dialog>
          <el-button
            size="small"
            type="primary"
            plain
            icon="el-icon-document-add"
            style="float: right; margin-top: 20px; margin-right: 20px"
            :loading="addLoading"
            @click="addMember()"
          >添加
          </el-button>
          <el-dialog title="关联成员" :visible.sync="dialogFormVisible">
            <el-select v-model="userId" placeholder="请选择">
              <el-option
                v-for="item in userIdList"
                :key="item"
                :value="item"
              >
                <span>
                  <ww-open-data type="userName" :openid="item" />
                </span>
              </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addCancel">取 消</el-button>
              <el-button type="primary" @click="addConfirm">确 定</el-button>
            </div>
          </el-dialog>
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
            <template v-slot="scope">
              {{ scope.row.userid }}
            </template>
          </el-table-column>
          <el-table-column label="成员名称" width="400" align="center">
            <template v-slot="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.userid)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { agentConfig, getJoinQrCode, memberList, memberIdList } from '@/api/member'
import { addTagMembers, delTagMembers, getAll } from '@/api/tag'

export default {
  data() {
    return {
      dialogVisible: false,
      url: '',
      list: null,
      listLoading: true,
      tags: [],
      addLoading: false,
      form: {
        tagName: ''
      },
      dialogFormVisible: false,
      tagId: '',
      userIdList: [],
      userId: '',
      tabIndex: ''
    }
  },
  mounted() {
    this.agentConfig()
  },
  created() {
    this.tagList()
  },
  methods: {
    agentConfig() {
      agentConfig().then((res) => {
        if (res.code === 200) {
          window.wx.agentConfig({
            corpid: res.data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: parseInt(res.data.agentid), // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: ['selectExternalContact'], // 必填，传入需要使用的接口名称
            success: function(result) {
              // 回调
              console.log(result, '请求微信成功')
            },
            fail: function(res) {
              console.error(res)
            }
          })
        }
      })
    },
    handleTabClick() {
      const tabIndex = this.tabIndex
      const curTagId = this.tags[tabIndex].tagId
      this.memberList(curTagId)
      this.tagId = curTagId
    },
    qrCode() {
      getJoinQrCode().then((res) => {
        this.url = res.data
        this.dialogVisible = true
      })
    },
    tagList() {
      getAll().then((res) => {
        const dataList = res.data
        this.tags = []
        if (dataList != null && dataList.length > 0) {
          for (const data of dataList) {
            this.tags.push({ tagId: data.id, tagName: data.tagName })
          }
          const curTagId = this.tags[0].tagId
          this.memberList(curTagId)
          this.tagId = curTagId
        }
      })
    },
    memberList(tagId) {
      this.listLoading = true
      memberList({ id: tagId }).then((res) => {
        this.list = res.data
        this.listLoading = false
      })
    },
    addMember() {
      memberIdList().then((res) => {
        this.userIdList = res.data
        const nodeList = document.querySelectorAll('ww-open-data')
        window.WWOpenData.bindAll(nodeList)
      })
      this.dialogFormVisible = true
    },
    addCancel() {
      this.userId = ''
      this.dialogFormVisible = false
    },
    addConfirm() {
      this.addLoading = true
      const data = { tagid: this.tagId, userlist: [this.userId] }
      addTagMembers(data).then((res) => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.memberList(this.tagid)
        this.addLoading = false
        this.dialogFormVisible = false
      })
    },
    handleDelete(userId) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTagMembers({ tagid: this.tagid, userlist: [userId] }).then(
            (res) => {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.memberList(this.tagid)
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
