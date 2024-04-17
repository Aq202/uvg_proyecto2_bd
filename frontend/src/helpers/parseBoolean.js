const parseBoolean = (value) => {
  if (value === true || value === 'true' || parseInt(value, 10) === 1) return true;
  if (value === false || value === 'false' || parseInt(value, 10) === 0) return false;
  return !!value;
};

export default parseBoolean;
