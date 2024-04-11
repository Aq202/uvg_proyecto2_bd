const parseBoolean = (value) => {
    if (value === true || value === "true" || parseInt(value) === 1)
        return true;
    if (value === false || value === "false" || parseInt(value) === 0)
        return false;
    return !!value;
};
export default parseBoolean;
