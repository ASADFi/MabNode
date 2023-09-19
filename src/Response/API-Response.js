exports.success = (message, data) => {
  return {
    status: "success",
    message,
    data,
  };
};
exports.error = (message, data) => {
  return {
    status: "failed",
    message,
    data,
  };
};
