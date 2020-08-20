const getSerialized = (data: string) => {
  if (data === '') {
    return true;
  }

  if (data === 'true' || data === 'false') {
    return data === 'true';
  }

  try {
    const parsed = JSON.parse(data.replace(/'/g, '"'));
    return parsed;
  } catch (error) {
    return data;
  }
};

export default getSerialized;
