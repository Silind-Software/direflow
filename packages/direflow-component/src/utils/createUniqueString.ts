const createUniqueString = (length = 9) => {
  return Math.random()
    .toString(36)
    .substr(2, length);
};

export default createUniqueString;
