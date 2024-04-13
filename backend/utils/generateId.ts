const generateId = () => {
  const timestamp = new Date().getTime();
  const randNum = Math.floor(Math.random() * 10000); 
  const id_string = timestamp.toString() + randNum.toString();
  return btoa(id_string); 
}

export default generateId