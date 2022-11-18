const objectID = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}"需為mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (!value.match(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z]).*$/)) {
    return helpers.message('密碼至少為8碼, 至少1個大寫字母、1個小寫字母');
  }
  return value;
};

module.exports = {
  objectID,
  password,
};
