const sumValues = (obj = {}) => {
  return Object.values(obj).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
}

export { sumValues }
