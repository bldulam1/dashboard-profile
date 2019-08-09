export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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