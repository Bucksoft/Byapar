export const cleanKeys = (data) => {
  return data.map((obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      // Remove spaces, dots, punctuation
      const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "");
      newObj[cleanKey] = obj[key];
    });
    return newObj;
  });
};
