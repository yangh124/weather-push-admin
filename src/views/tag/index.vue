<template>
  <el-container>
    <el-header />
    <el-main>
      <el-row>
        地区名称：
        <el-input
          v-model="tagName"
          size="small"
          style="width: 200px"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" plain icon="el-icon-search" size="small" style="margin-left: 10px;margin-bottom:10px" :loading="searchLoading" @click="search">搜索</el-button>
        <el-button type="info" plain icon="el-icon-refresh" size="small" style="margin-left: 10px;margin-bottom:10px" :loading="resetLoading" @click="reset">重置</el-button>
        <el-button size="small" type="primary" plain icon="el-icon-document-add" style="float:right;margin-right: 10px;margin-bottom:10px" :loading="addLoading" @click="dialogFormVisible = true">添加</el-button>
      </el-row>
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="地区ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="地区名称" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.tagName }}
          </template>
        </el-table-column>
        <el-table-column label="地区编码" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.ctime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        background
        layout="prev,pager,next,sizes"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-count="pageCount"
        :page-sizes="[5,10,20]"
        @current-change="currentChange"
        @size-change="sizeChange"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </el-footer>

    <el-dialog title="添加地区" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="地区名称" label-width="5">
          <el-input v-model="form.tagName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { getPage, delTag, addTag } from '@/api/tag'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageCount: 1,
      tagName: '',
      searchLoading: true,
      resetLoading: true,
      addLoading: false,
      form: {
        tagName: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.searchLoading = true
      this.listLoading = true
      this.resetLoading = true
      getPage({ tagName: this.tagName, currentPage: this.currentPage, pageSize: this.pageSize }).then(response => {
        const data = response.data
        this.list = data.records
        this.currentPage = data.current
        this.pageCount = data.pages
        this.pageSize = data.size
        this.total = data.total
        this.listLoading = false
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    currentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    sizeChange(val) {
      this.pageSize = val
    },
    prevClick() {},
    nextClick() {},
    handleDelete(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTag(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit(id) {
      console.log(id)
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.tagName = ''
      this.fetchData()
    },
    addCancel() {
      this.form.tagName = ''
      this.dialogFormVisible = false
    },
    addConfirm() {
      this.addLoading = true
      addTag(this.form).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.addLoading = true
        this.dialogFormVisible = false
        this.reset()
      })
    }
  }
}
</script>
