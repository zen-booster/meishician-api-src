const handleErrorAsync = function handleErrorAsync(func) {
  // func 先將 async func 帶入參數儲存
  // middleware 先接住 router 資料
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

module.exports = handleErrorAsync;
