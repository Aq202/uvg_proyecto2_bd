const parseDate = (date:Date) => {

  const year: number = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

export default parseDate;