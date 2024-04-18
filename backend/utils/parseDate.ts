const parseDate = (date:Date) => {

  const d = new Date(date);
  const year: number = d.getFullYear();
  let month: string | number = d.getMonth() + 1;
  let day: string | number = d.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

export default parseDate;