import moment from 'moment'
const loadDateSearchFilter = (
  loads,
  pickupSearchStartDate,
  pickupSearchEndDate
) => {
  //current user search filter values
  let momentConvert = date => {
    return parseInt(
      moment(date)
        .valueOf()
        .toString()
        .slice(0, 10)
    )
  }

  let newLoads
  if (pickupSearchStartDate && pickupSearchEndDate) {
    console.log('both hit')
    newLoads = _.filter(
      loads,
      value =>
        momentConvert(value['pickups'].slice(-1)[0].pickup_date) >=
          parseInt(
            moment(pickupSearchStartDate)
              .valueOf()
              .toString()
              .slice(0, 10)
          ) &&
        momentConvert(value['pickups'].slice(-1)[0].pickup_date) <=
          momentConvert(pickupSearchEndDate)
    )
  } else if (pickupSearchStartDate) {
    console.log('pickup start')
    newLoads = _.filter(
      loads,
      value =>
        momentConvert(value['pickups'].slice(-1)[0].pickup_date) >=
        momentConvert(pickupSearchStartDate)
    )
  } else if (pickupSearchEndDate) {
    console.log('pickup end')
    newLoads = _.filter(
      loads,
      value =>
        momentConvert(value['pickups'].slice(-1)[0].pickup_date) <=
        momentConvert(pickupSearchEndDate)
    )
  } else {
    newLoads = loads
  }

  newLoads = _.map(newLoads, value => value)

  return newLoads
}
export { loadDateSearchFilter }
