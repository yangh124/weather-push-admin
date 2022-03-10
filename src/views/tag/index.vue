<template>
  <div class="app-container">
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
          {{ scope.row.tagId }}
        </template>
      </el-table-column>
      <el-table-column label="地区名称" width="120" align="center">
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
  </div>
</template>

<script>
import { getList, delTag } from '@/api/tag'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageCount: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ currentPage: this.currentPage, pageSize: this.pageSize }).then(response => {
        const data = response.data
        this.list = data.records
        this.currentPage = data.current
        this.pageCount = data.pages
        this.pageSize = data.size
        this.total = data.total
        this.listLoading = false
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
    }
  }
}
</script>
