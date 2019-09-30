function createTimeStamp(date) {
  const _date = new Date(date);
  const year = _date.getFullYear();
  let month = _date.getMonth() + 1;
  let day = _date.getDate();
  let hour = _date.getHours();
  let min = _date.getMinutes();
  let sec = _date.getSeconds();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;

  return "" + year + month + day + "_" + hour + min + sec;
}

module.exports = createTimeStamp;
