<template>
  <el-calendar v-model="value" :first-day-of-week="7">
    <template
      slot="dateCell"
      slot-scope="{date, data}"
    >
      <p :class="getClass(data.day)">
        {{ data.day.split('-')[2]+'日' }} <br> {{ holidays.indexOf(data.day) > -1 ? holidayMap[data.day].name : '' }}
      </p>
    </template>
  </el-calendar>
</template>
<script>

import { getAllHolidays } from '@/api/holiday'

export default {
  data() {
    return {
      value: new Date(),
      holidays: [],
      holidayMap: {}
    }
  },
  created() {
    this.getAllHolidays()
  },
  methods: {
    getAllHolidays() {
      getAllHolidays().then(res => {
        const list = res.data
        if (list != null && list.length > 0) {
          for (const holiday of list) {
            const date = holiday.holidayDate
            let name = holiday.holidayName
            const isOffDay = holiday.isOffDay
            name = name + '假期'
            if (!isOffDay) {
              name = '上班(补' + name + ')'
            }
            this.holidays.push(date)
            this.holidayMap[date] = { name: name, isOffDay: isOffDay }
          }
        }
      })
    },
    getClass(day) {
      const flag = this.holidays.indexOf(day) !== -1
      if (flag) {
        const isOffDay = this.holidayMap[day].isOffDay
        if (isOffDay) {
          return 'is-holiday'
        } else {
          return 'is-work'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .is-holiday {
    color: white;
    background: green;
  }
  .is-work {
    color: black;
    background: #fad133;
  }
</style>
