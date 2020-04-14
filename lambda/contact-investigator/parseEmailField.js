module.exports = (emailString) => {
  try {
    // TODO: check if email consent has been given:
    const emails = emailString
      .split(/[\s;,]+/)
      .map((elem) => elem.trim())
      .filter((elem) => elem !== "");
    return {
      isEmailAvailable: true,
      emails,
    };
  } catch (error) {
    return {
      isEmailAvailable: false,
    };
  }
};
