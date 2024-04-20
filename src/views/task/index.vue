<template>
  <el-container>
    <el-header />
    <el-main>
      <el-row>
        任务名称：
        <el-input
          v-model="taskName"
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
        <el-table-column align="center" label="任务ID" width="180">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="任务名称" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.taskName }}
          </template>
        </el-table-column>
        <el-table-column label="cron表达式" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cronExp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务描述" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taskDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地区" width="200" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="location in scope.row.locationList"
              :key="location.id"
              size="mini"
              effect="dark"
            >
              {{ location.locationName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.ctime }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.utime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.status === 0"
              active-color="#13ce66"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
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

    <el-dialog title="添加任务" :visible.sync="dialogFormVisible" @open="dialogOpen">
      <el-form :model="form">
        <el-form-item label="任务名称">
          <el-select v-model="form.taskName" placeholder="请选择任务">
            <el-option label="今日天气" value="weatherTodayJob" />
            <el-option label="明日天气" value="weatherTomorrowJob" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区名称">
          <el-select v-model="form.locationIds" multiple placeholder="请选择">
            <el-option
              v-for="item in locations"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="cron表达式">
          <el-input v-model="form.cronExp" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="form.taskDesc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑任务" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item label="状态">
          <el-select v-model="editForm.status">
            <el-option label="启动" :value="0" />
            <el-option label="停止" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区名称">
          <el-select v-model="editForm.locationIds" multiple placeholder="请选择">
            <el-option
              v-for="item in locations"
              :key="item.id"
              :label="item.locationName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="cron表达式">
          <el-input v-model="editForm.cronExp" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="editForm.taskDesc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancel">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getPage, delTask, addTask, updateTask } from '@/api/task'
import { getAll } from '@/api/location'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageCount: 1,
      taskName: '',
      searchLoading: true,
      resetLoading: true,
      addLoading: false,
      form: {
        taskName: '',
        cronExp: '',
        taskDesc: '',
        locationIds: []
      },
      dialogFormVisible: false,
      locations: [],
      dialogEditVisible: false,
      editForm: {
        id: '',
        status: '',
        cronExp: '',
        taskDesc: '',
        locationIds: []
      }
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
      getPage({ locationName: this.locationName, currentPage: this.currentPage, pageSize: this.pageSize }).then(response => {
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
        delTask(id).then(res => {
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
    search() {
      this.fetchData()
    },
    reset() {
      this.locationName = ''
      this.fetchData()
    },
    addCancel() {
      this.form = {
        taskName: '',
        cronExp: '',
        taskDesc: '',
        locationIds: []
      }
      this.addLoading = false
      this.dialogFormVisible = false
    },
    addConfirm() {
      this.addLoading = true
      addTask(this.form).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.addLoading = false
        this.dialogFormVisible = false
        this.form = {
          taskName: '',
          cronExp: '',
          taskDesc: ''
        }
        this.reset()
      })
    },
    dialogOpen() {
      getAll().then(res => {
        this.locations = res.data
      })
    },
    editCancel() {
      this.editForm = {
        id: '',
        status: '',
        cronExp: '',
        taskDesc: '',
        locationIds: []
      }
      this.dialogEditVisible = false
    },
    handleEdit(data) {
      getAll().then(res => {
        this.locations = res.data
      })
      const locationIds = []
      for (const location of data.locationList) {
        locationIds.push(location.id)
      }
      this.editForm = {
        id: data.id,
        status: data.status,
        cronExp: data.cronExp,
        taskDesc: data.taskDesc,
        locationIds: locationIds
      }
      this.dialogEditVisible = true
    },
    editConfirm() {
      const data = this.editForm
      updateTask(data.id, data).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.editLoading = false
        this.dialogEditVisible = false
        this.editForm = {
          id: '',
          status: '',
          cronExp: '',
          taskDesc: '',
          locationIds: []
        }
        this.reset()
      })
    }
  }
}
</script>
