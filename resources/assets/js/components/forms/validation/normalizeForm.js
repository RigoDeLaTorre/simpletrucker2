const normalizeZip = value => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 5) {
    return onlyNums;
  }
  if (onlyNums.length <= 6) {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`;
  }
  return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 9)}`;
};

const normalizePhone = value => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  }
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`;
};

const normalizeDriverPay = value => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length >= 3) {
    return onlyNums.slice(0, 2);
  }
};

const normalizeQuickpay = value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length < 2) {
    return onlyNums;
  }
  if (onlyNums.length <= 3) {
    return `${onlyNums.slice(0, 1)}.${onlyNums.slice(1)}`;
  }
  // if (onlyNums.length >= 3) {
  //   return `${onlyNums.slice(0, 2)}-${onlyNums.slice(3, 5)}`;
  // }
};

const normalizeRateAmount = value => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 2) {
    return onlyNums;
    // return `${onlyNums}.00`;
  }
  // if (onlyNums.length==3 ||onlyNums.length==4) {
  //   // return onlyNums;
  //   return `${onlyNums}.00`;
  // }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, onlyNums.length - 2)}.${onlyNums.slice(
      onlyNums.length - 2
    )}`;
  }
};

export {
  normalizePhone,
  normalizeZip,
  normalizeDriverPay,
  normalizeQuickpay,
  normalizeRateAmount
};
