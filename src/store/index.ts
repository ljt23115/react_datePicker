import { configureStore } from "@reduxjs/toolkit";
import datePickerReducer from './modules/datePicker'

const store = configureStore({
  reducer: {
    datePicker: datePickerReducer
  }
})

export default store