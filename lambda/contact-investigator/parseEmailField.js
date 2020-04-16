module.exports = (emailString, hasOptedOut) => {
  if (hasOptedOut === true) {
    return {
      hasOptedOut: true,
    }
  }
  try {
    const emails = emailString
      .split(/[\s;,]+/)
      .map((elem) => elem.trim())
      .filter((elem) => elem !== "");
    return {
      hasOptedOut: false,
      isEmailAvailable: true,
      emails,
    };
  } catch (error) {
    return {
      isEmailAvailable: false,
      hasOptedOut: false,
    };
  }
};
