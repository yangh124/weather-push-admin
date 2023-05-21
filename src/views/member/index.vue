<template>
  <el-container>
    <el-aside width="200px" style="margin-top: 80px">
      <el-tree
        ref="tree"
        :data="data"
        node-key="tagId"
        show-checkbox
        empty-text="无数据"
        @check="handleNodeClick"
        @node-click="handleNodeClick"
      />
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <el-button
            size="small"
            type="primary"
            style="margin-top: 20px; margin-left: 20px"
            @click="qrCode()"
            >生成二维码</el-button
          >
          <el-dialog
            title="使用微信扫码加入"
            v-model:visible="dialogVisible"
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
            @click="addMember"
            >添加</el-button
          >
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
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog title="关联成员" v-model:visible="dialogFormVisible">
      <WWOpenData type="userName" :openid="userId"></WWOpenData>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { getJoinQrCode, memberList, agentConfig } from "@/api/member";
import { getAll, addTagMembers, delTagMembers } from "@/api/tag";
import WWOpenData from "@/components/WxOpendata";

export default {
  data() {
    return {
      dialogVisible: false,
      url: "",
      list: null,
      listLoading: true,
      data: [],
      addLoading: false,
      form: {
        tagName: "",
      },
      dialogFormVisible: false,
      members: [],
      userid: "",
      tagid: "",
      userId: "",
    };
  },
  mounted() {
    this.agentConfig();
  },
  created() {
    this.tagList();
  },
  methods: {
    agentConfig() {
      agentConfig().then((res) => {
        if (res.code == 200) {
          console.log(res);
          wx.agentConfig({
            corpid: res.data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: parseInt(res.data.agentid), // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: ["selectExternalContact"], //必填，传入需要使用的接口名称
            success: function (result) {
              console.log(result, "请求微信成功");
              // 回调
            },
            fail: function (res) {
              console.table(res);
            },
          });
        }
      });
    },
    qrCode() {
      getJoinQrCode().then((res) => {
        this.url = res.data;
        this.dialogVisible = true;
      });
    },
    tagList() {
      getAll().then((res) => {
        const dataList = res.data;
        this.data = [];
        if (dataList != null && dataList.length > 0) {
          for (const data of dataList) {
            this.data.push({ tagId: data.tagId, label: data.tagName });
          }
          this.handleNodeClick(dataList[0]);
        }
      });
    },
    memberList() {
      this.listLoading = true;
      memberList({ id: this.tagid }).then((res) => {
        const data = res.data;
        this.list = data;
        this.listLoading = false;
      });
    },
    handleNodeClick(data) {
      const tagId = data.tagId;
      this.setCheckedKeys([tagId]);
      this.memberList();
    },
    setCheckedKeys(tagId) {
      this.$refs.tree.setCheckedKeys(tagId);
      this.tagid = tagId[0];
    },
    addMember() {
      this.dialogFormVisible = true;
    },
    addCancel() {
      this.userid = "";
      this.dialogFormVisible = false;
    },
    addConfirm() {
      this.addLoading = true;
      const data = { tagid: this.tagid, userlist: [this.userid] };
      addTagMembers(data).then((res) => {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.memberList();
        this.addLoading = false;
        this.dialogFormVisible = false;
      });
    },
    handleDelete(userid) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delTagMembers({ tagid: this.tagid, userlist: [userid] }).then(
            (res) => {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.memberList();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
