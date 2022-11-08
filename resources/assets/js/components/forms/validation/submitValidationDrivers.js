const submitValidationDrivers = values => {
  let newValues = _.mapValues(values, function(val) {
    if (typeof val === 'string') {
      return val.toLowerCase().trim()
    }
    if (_.isInteger(val)) {
      return val
    }
  })
  newValues.driver_state =
    typeof values.driver_state === 'object'
      ? values.driver_state.value.toUpperCase()
      : newValues.driver_state.toUpperCase()
  newValues.driver_phone = newValues.driver_phone.split('-').join('')
  return newValues
}
export { submitValidationDrivers }
