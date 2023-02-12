export function getMonthDay(year:number, month:number) {
  let days = new Date(year, month + 1, 0).getDate()
  return days
}

