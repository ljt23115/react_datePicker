import { createSlice } from '@reduxjs/toolkit'

const datePickerSlice = createSlice({
  name: 'datePicker',
  initialState: {
    weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    year: 2023,
    month: 'December',
    day: 23,
    hour: 0,
    minute: 0,
    second: 0,
    sum: 42,
    active: `2023-December-23`
  },
  reducers: {
    // 修改为上一个月
    changeLastMonth(state, action) {
      const currentMonth = action.payload
      if(currentMonth == 'January') {
        state.month = 'December'
        state.year --
        return
      } 
      let index = state.months.findIndex((item: string) => currentMonth == item)
      if(index === 0) index = 12
      state.month = state.months[index - 1]
    },
    // 修改为下一个月
    changeNextMonth(state, action) {
      const currentMonth = action.payload
      if(currentMonth == 'December') {
        state.month = 'January'
        state.year ++
        return
      } 
      let index = state.months.findIndex((item: string) => currentMonth == item)
      if(index === 11) index = -1
      state.month = state.months[index + 1]
    },
    // 修改年份
    changeYear(state, action) {
      state.year = action.payload
    },
    // 点击日期
    clickDate(state, action) {
      const detail = action.payload
      state.active = detail.id
      if(detail.type == 'before') {
        if(detail.month == 'January') {
          state.year --
          state.month = 'December'
        } else {
          const index = state.months.findIndex((item: string) => detail.month == item)
          state.month = state.months[index]
        }
      }
      switch(detail.type) {
        case 'before':
          if(detail.month === 'December' && state.month === 'January') {
            state.year --
            state.month = 'December'
          } else {
            const index = state.months.findIndex((item: string) => detail.month == item)
            state.month = state.months[index]
          }
          break;
        case 'next':
          if(detail.month === 'January' && state.month === 'December') {
            state.year ++
            state.month = 'January'
          } else {
            const index = state.months.findIndex((item: string) => detail.month == item)
            state.month = state.months[index]
          }
          break
      }
    }
  }
})

export default datePickerSlice.reducer

export const { changeLastMonth, changeNextMonth, changeYear, clickDate } = datePickerSlice.actions