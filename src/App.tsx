import React, { memo, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import './App.css';
import dayjs from "dayjs";
import { getMonthDay } from './utils/time'

import { changeNextMonth, changeLastMonth, changeYear, clickDate } from './store/modules/datePicker';


const App =  memo((props: any) => {
  const [ allMonthsDetail, setAllMonthsDetail ] = useState([] as any)
  const [ lastYearDecmMonthDetail, setLastYearDecmMonthDetail ] = useState({} as any)
  const [ nextYearJanuMonthDetail, setNextYearJanuMonthDetail ] = useState({} as any)
  const [ disMonth, setDisMonth ] = useState([] as any)
  // 得到每月的详细数据
  useEffect(() => {
    const months = 12
    props.months.forEach((item: string, index: number) => {
      allMonthsDetail[index] = {
        year: props.year,
        month: item,
        days: getMonthDay(props.year, index),
        firstWeekDay: props.weeks[new Date(`${props.year}/${index+1}/${1}`).getDay()]
      }
    })
    setLastYearDecmMonthDetail({
      year: props.year - 1,
      month: 'December',
      days: getMonthDay(props.year - 1, 11),
      firstWeekDay: props.weeks[new Date(`${props.year - 1}/${12}/${1}`).getDay()]
    })
    setNextYearJanuMonthDetail({
      year: props.year + 1,
      month: 'January',
      days: getMonthDay(props.year + 1, 0),
      firstWeekDay: props.weeks[new Date(`${props.year + 1}/${1}/${1}`).getDay()]
    })


  }, [props.year]);
  // 对每月的展示日期进行收集
  useEffect(() => {

    // 找到当月的信息
    let currentMonthDetailIndex = allMonthsDetail.findIndex((item: any) => {
      return item.month == props.month
      
    })

    const currentMonthDetail = allMonthsDetail[currentMonthDetailIndex]
    // 上个月和下个月的信息
    // 判断边界年份
    let lastMonthDetail
    let nextMonthDetail
    if(currentMonthDetailIndex == 0) {
      lastMonthDetail = lastYearDecmMonthDetail
      nextMonthDetail = allMonthsDetail[currentMonthDetailIndex + 1]
    } else if(currentMonthDetailIndex == 11) {
      nextMonthDetail = nextYearJanuMonthDetail
      lastMonthDetail = allMonthsDetail[currentMonthDetailIndex - 1]
    } else {
      lastMonthDetail = allMonthsDetail[currentMonthDetailIndex - 1]
      nextMonthDetail = allMonthsDetail[currentMonthDetailIndex + 1]
    }

    const rest = props.sum - currentMonthDetail?.days


    // 整理展示数据
    const before = props.weeks.findIndex((item: string) => {
      return item == currentMonthDetail.firstWeekDay
    })
    const next = rest - before
    
    const disMonth = [] as any

    for(let i = 0; i < before; i++) {
      disMonth.push({
        year: lastMonthDetail.year,
        month: lastMonthDetail.month,
        day: lastMonthDetail.days - ( before - i - 1 ),
        id: `${lastMonthDetail.year}-${lastMonthDetail.month}-${lastMonthDetail.days - ( before - i - 1 )}`,
        type: 'before'
      })
    }
    for(let i = 0; i < currentMonthDetail.days; i++) {
      disMonth.push({
        year: currentMonthDetail.year,
        month: currentMonthDetail.month,
        day: i + 1,
        id: `${currentMonthDetail.year}-${currentMonthDetail.month}-${i + 1}`,
        type: 'current'
      })
    }

    for(let i = 0; i < next; i++) {
      disMonth.push({
        year: nextMonthDetail.year,
        month: nextMonthDetail.month,
        day: i + 1,
        id: `${nextMonthDetail.year}-${nextMonthDetail.month}-${i + 1}`,
        type: 'next'
      })
    }
    setDisMonth(disMonth)

  }, [props.month, props.year]);
  const weeks = props.weeks

  return (
    <div className="App">
      <div className="time-picker">
        {/* <div className="header">
          <input type="text" />
          <input type="text" />
        </div> */}
        <div className="main">
          <div className='ym-change'>
            <span onClick={e => props.changeYear(props.year - 1)}>《</span>
            <span onClick={e => props.changeLastMonth(props.month)}>&lt;</span>
            <span className='year-month'>{props.year} {props.month}</span>
            <span onClick={e => props.changeNextMonth(props.month)}>&gt;</span>
            <span onClick={e => props.changeYear(props.year + 1)}>》</span>
          </div>
          <div className="weeks">
            { 
              weeks.map((item: String) => (<span key={item as any}>{item}</span>)) 
            }
          </div>
          <div className="days">
            { disMonth.map((item: any) => (
                <span onClick={e => props.clickDate(item)} 
                      key={item.id}  
                      style={
                        { 
                          color: item.type === 'current' ? 'black' : 'gray',
                          backgroundColor: item.id == props.active ? 'rgba(150, 150, 150, 0.5)' : 'white'
                        }
                      }
                      >{item.day}
                </span>
              ))}
          </div>
        </div>
        {/* <div className="footer">
          <button>Now</button>
          <button>OK</button>
        </div> */}
      </div>
      <div className='time-input'>
        <i className='icon'>
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path><path fill="currentColor" d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z"></path><path fill="currentColor" d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32z"></path></svg>
        </i>
        <input type="text" value={props.active}/>
      </div>
    </div>
  );
})

const mapStateToProps = (state: any) => ({
  ...state.datePicker
})
const mapDispathToProps = (dispatch: any) => ({
  changeLastMonth(month: string) {
    dispatch(changeLastMonth(month))
  },
  changeNextMonth(month: string) {
    dispatch(changeNextMonth(month))
  },
  changeYear(year: number) {
    dispatch(changeYear(year))
  },
  clickDate(detail: Object) {
    dispatch(clickDate(detail))
  }
})

export default connect(mapStateToProps, mapDispathToProps)(App)