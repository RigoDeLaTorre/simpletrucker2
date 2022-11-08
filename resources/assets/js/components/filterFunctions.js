// Get Difference of Days between 2 dates
const _MS_PER_DAY = 1000 * 60 * 60 * 24

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / _MS_PER_DAY)
}

function getTodaysDate() {
  let newDate = new Date()
  let dd = newDate.getDate()
  let mm = newDate.getMonth() + 1
  let yyyy = newDate.getFullYear()

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return mm + '/' + dd + '/' + yyyy
}

//************** NEED BOL BUTTON -  Delivered, have not received the BOL **************
const deliveredFilter = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == false &&
      load.customer_paid_date == null &&
      load.bill_of_lading == false
  )
//type is object value you want ot compare it to, ex: type can be "customer_id"
const deliveredFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == false &&
      load.customer_paid_date == null &&
      load.bill_of_lading == false &&
      load[type] === id
  )
const deliveredFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.customer_paid_date == null &&
        load.bill_of_lading == false &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.customer_paid_date == null &&
        load.bill_of_lading == false &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const deliveredFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == false &&
      load.customer_paid_date === null &&
      load.bill_of_lading == false &&
      load.invoice_id == searchTerm
  )

//************** READY TO PROCESS BUTTON -  Delivered, we received the BOL **************
const readyFilter = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == false &&
      load.bill_of_lading == true
  )
const readyFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == false &&
      load.bill_of_lading == true &&
      load[type] === id
  )

const readyFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.bill_of_lading == true &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.bill_of_lading == true &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const readyFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.bill_of_lading == true &&
        load.invoice_id == searchTerm) ||
      (load.load_status == 'delivered' &&
        load.load_processed == false &&
        load.bill_of_lading == true &&
        load.invoice_id == searchTerm)
  )

//************** PROCESSED TODAY BUTTON -  Processed Today  **************
const processedToday = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == true &&
      load.load_processed_date == getTodaysDate() &&
      load.customer_paid_date === null &&
      load.bill_of_lading == true
  )
const processedTodayByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == true &&
      load.load_processed_date == getTodaysDate() &&
      load.customer_paid_date === null &&
      load.bill_of_lading == true &&
      load[type] === id
  )
const processedTodayFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed == true &&
        load.load_processed_date == getTodaysDate() &&
        load.customer_paid_date === null &&
        load.bill_of_lading == true &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed == true &&
        load.load_processed_date == getTodaysDate() &&
        load.customer_paid_date === null &&
        load.bill_of_lading == true &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const processedTodayFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == true &&
      load.load_processed_date == getTodaysDate() &&
      load.customer_paid_date === null &&
      load.bill_of_lading == true &&
      load.invoice_id == searchTerm
  )

//**************  Processed && Paid  **************
const processedPaidFilter = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.customer_paid_amount !== null &&
      load.load_processed == true
  )
const processedPaidFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.customer_paid_amount !== null &&
      load.load_processed == true &&
      load[type] === id
  )
const processedPaidFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed == true &&
        load.customer_paid_amount !== null &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.customer_paid_amount !== null &&
        load.load_processed == true &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const processedPaidFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed == true &&
      load.customer_paid_amount !== null &&
      load.invoice_id == searchTerm
  )

// **************  FACTORED AND UNPAID  **************
const factorUnpaidFilter = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.factor_paid_date == null &&
      load.load_processed_date !== null
  )
const factorUnpaidFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.factor_paid_date == null &&
      load.load_processed_date !== null &&
      load[type] === id
  )
const factorUnpaidFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.factor_paid_date == null &&
        load.load_processed_date !== null &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.factor_paid_date == null &&
        load.load_processed_date !== null &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const factorUnpaidFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.factor_paid_date == null &&
      load.load_processed_date !== null &&
      load.invoice_id == searchTerm
  )

// **************  FACTORED AND RESERVES UNPAID  **************
const factorUnpaidReservesFilter = loads =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.load_processed_date !== null &&
      load.factor_paid_date !== null &&
      load.factor_reserve_percentage != 0 &&
      load.factor_reserve_amount_paid_date === null
  )
const factorUnpaidReservesFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.load_processed_date !== null &&
      load.factor_paid_date !== null &&
      load.factor_reserve_amount_paid_date === null &&
      load[type] === id
  )
const factorUnpaidReservesFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load.factor_reserve_amount_paid_date == null &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load.factor_reserve_amount_paid_date == null &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const factorUnpaidReservesFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.load_status == 'delivered' &&
      load.load_processed_type == 'factor' &&
      load.load_processed_date !== null &&
      load.factor_paid_date !== null &&
      load.factor_reserve_amount_paid_date == null &&
      load.invoice_id == searchTerm
  )

//**************  CUSTOMER UNPAID  **************
const customerUnpaidFilter = loads =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type != 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null)
  )
const customerUnpaidFilterByCustomer = (loads, id, type) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type != 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load[type] === id) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load[type] === id)
  )
const customerUnpaidFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type != 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load.customer.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type != 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load.load_reference.toLowerCase().includes(searchTerm.toLowerCase()))
  )

const customerUnpaidFilterSearchById = (loads, searchTerm) =>
  loads.filter(
    load =>
      (load.load_status == 'delivered' &&
        load.load_processed_type != 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.invoice_id == searchTerm) ||
      (load.load_status == 'delivered' &&
        load.load_processed_type == 'factor' &&
        load.customer_paid_date == null &&
        load.load_processed_date !== null &&
        load.factor_paid_date !== null &&
        load.invoice_id == searchTerm)
  )

// All filter search

const allFilterSearchName = (loads, searchTerm) =>
  loads.filter(
    load =>
      load.customer.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      load.load_reference.toLowerCase().includes(searchTerm.toLowerCase())
  )

export {
  deliveredFilter,
  deliveredFilterSearchName,
  deliveredFilterSearchById,
  readyFilter,
  readyFilterSearchName,
  readyFilterSearchById,
  processedToday,
  processedTodayFilterSearchName,
  processedTodayFilterSearchById,
  processedPaidFilter,
  processedPaidFilterSearchName,
  processedPaidFilterSearchById,
  factorUnpaidFilter,
  factorUnpaidFilterSearchName,
  factorUnpaidFilterSearchById,
  factorUnpaidReservesFilter,
  factorUnpaidReservesFilterSearchName,
  factorUnpaidReservesFilterSearchById,
  customerUnpaidFilter,
  customerUnpaidFilterSearchName,
  customerUnpaidFilterSearchById,
  allFilterSearchName,
  dateDiffInDays,
  getTodaysDate,
  deliveredFilterByCustomer,
  readyFilterByCustomer,
  processedTodayByCustomer,
  factorUnpaidFilterByCustomer,
  factorUnpaidReservesFilterByCustomer,
  customerUnpaidFilterByCustomer,
  processedPaidFilterByCustomer
}
