module.exports = (emailString) => {
  if (emailString === undefined) {
    return [];
  } else {
    return emailString
      .split(/[\s;,]+/)
      .map((elem) => elem.trim())
      .filter((elem) => elem !== "");
  }
};
