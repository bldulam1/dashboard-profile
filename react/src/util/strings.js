export function numberWithCommas(x) {
  return Boolean(x) ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
}

export function normalizeSize(byteSize) {
  const units = " KMGTPEZYXSD";
  let newSize = byteSize ? byteSize : 0;
  let index = 0;
  while (newSize > 1000) {
    newSize /= 1000;
    index++;
  }
  return `${newSize.toFixed(2)} ${units[index]}B`;
}

export function normalizeTime(milliSec) {
  const ms = milliSec ? milliSec : 0;
  const sec = ms / 1000;
  const min = sec / 60;
  const hr = min / 60;
  const day = hr / 24;
  const week = day / 7;
  const year = day / 365.25;

  if (year >= 1) {
    return `${year.toFixed(2)} ${year > 1 ? "years" : "year"}`;
  } else if (week >= 1) {
    return `${week.toFixed(2)} ${week > 1 ? "weeks" : "week"}`;
  } else if (day >= 1) {
    return `${day.toFixed(2)} ${day > 1 ? "days" : "day"}`;
  } else if (hr >= 1) {
    return `${hr.toFixed(2)} ${hr > 1 ? "hours" : "hour"}`;
  } else if (min >= 1) {
    return `${min.toFixed(2)} ${min > 1 ? "minutes" : "minute"}`;
  } else if (sec >= 1) {
    return `${sec.toFixed(2)} ${sec > 1 ? "seconds" : "second"}`;
  } else {
    return `${ms} ${ms > 1 ? "milliseconds" : "millisecond"}`;
  }
}

export function getInitials(name) {
  return name
    .split(/[\s,-]+/)
    .map(p => p[0])
    .join("");
}
