//paymentStatus value is either [ 0, 1, allPaymentStatus]
// 0 is unpaid
//1 is paid

export const factoredPaidReport = (loads, processType, paymentStatus) => {
  if (processType == 'factor' && paymentStatus == 'allPaymentStatus') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type == 'factor'
    )
  } else if (processType == 'factor' && paymentStatus == 'Unpaid') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type == 'factor' &&
        !load.factor_total_advanced &&
        !load.customer_paid_amount
    )
  } else if (processType == 'factor' && paymentStatus == 'paid') {
    return loads.filter(
      load =>
        (load.load_status == 'delivered' &&
          load.load_processed &&
          load.load_processed_type == 'factor' &&
          load.factor_total_advanced) ||
        (load.load_status == 'delivered' &&
          load.load_processed &&
          load.load_processed_type == 'factor' &&
          load.customer_paid_amount)
    )
  } else if (
    processType == 'notFactored' &&
    paymentStatus == 'allPaymentStatus'
  ) {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type == 'notfactored'
    )
  } else if (processType == 'notFactored' && paymentStatus == 'Unpaid') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type == 'notfactored' &&
        !load.customer_paid_amount
    )
  } else if (processType == 'notFactored' && paymentStatus == 'paid') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type == 'notfactored' &&
        load.customer_paid_amount
    )
    // ALL - FACTORED AND NOT FACTORED
  } else if (
    processType == 'allProcessedType' &&
    paymentStatus == 'allPaymentStatus'
  ) {
    return loads.filter(
      load => load.load_status == 'delivered' && load.load_processed
    )
  } else if (processType == 'allProcessedType' && paymentStatus == 'Unpaid') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type &&
        !load.customer_paid_amount
    )
  } else if (processType == 'allProcessedType' && paymentStatus == 'paid') {
    return loads.filter(
      load =>
        load.load_status == 'delivered' &&
        load.load_processed &&
        load.load_processed_type &&
        load.customer_paid_amount
    )
  }
}
