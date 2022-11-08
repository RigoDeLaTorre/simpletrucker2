import _ from 'lodash'
import Select from 'react-select'
let converter = require('json-2-csv')
import React, { Component } from 'react'

import LoadingComponent from '../LoadingComponent'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { normalizePhone } from '../forms/validation/normalizeForm'
import { selectedCustomer } from '../../actions/customer/selectedCustomer.js'
import { fetchCustomers } from '../../actions/customer/fetchCustomers.js'
import { selectedLoad } from '../../actions/loads'

import {
  SearchBar,
  Pagination,
  SearchBarNew,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'

import DisplayLoadTable from '../common/DisplayLoadTable'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
// import CustomerModal from './CustomerModal.js'
import CustomerModalTabular from './CustomerModalTabular.js'
class CustomerSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      currentDisplayedCustomers: this.props.customer,
      loadStatus: 'all',
      searchPhone: '',
      searchTerm: '',
      currentPage: 1,
      resultsPerPage: 25,
      allLength: '',
      totalPages: 1,
      isDesktop: true
    }
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.currentDisplayedCustomers.map(load => {
      return {
        Customer: load.customer_name,
        PreferredProcess: load.process_type,
        Phone: normalizePhone(load.customer_phone),
        Fax: normalizePhone(load.customer_fax),
        Email: load.customer_email,
        Address: load.customer_address,
        City: load.customer_city,
        State: load.customer_state,
        Zipcode: load.customer_zip,
        AccountingBillTo: load.customer_bill_name,
        AccountingPhone: normalizePhone(load.customer_bill_phone),
        AccountingFax: normalizePhone(load.customer_bill_fax),
        AccountingEmail: load.customer_bill_email,
        AccountingAddress: load.customer_bill_address,
        AccountingCity: load.customer_bill_city,
        AccountingState: load.customer_bill_state,
        AccountingZipcode: load.customer_bill_zip,
        QuickPayEmail: load.quickpay_email,
        QuickpayPhone: load.quickpay_phone,
        QuickpayFax: load.quickpay_fax,
        QuickpayCharge: load.quickpay_charge,
        QuickpayNotes: load.quickpay_notes
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = 'CustomerList.csv' //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
  }

  initMaterialize() {
    setTimeout(() => {
      let modal = document.querySelectorAll('.modal')
      let modalInstance = M.Modal.init(modal)

      let selectInstance3 = document.querySelectorAll('select')
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3)
    }, 0)
  }
  componentDidMount() {
    this.props.fetchRequest('Customers')
    let isDesktop = true //initiate as false
    // device detection
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isDesktop = false
    }

    this.props.fetchCustomers()
    window.scrollTo(0, 0)
    this.initMaterialize()
    this.setState({
      isDesktop,
      allLength: this.state.currentDisplayedCustomers.length
    })
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedCustomers !=
      this.state.currentDisplayedCustomers
    ) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.currentDisplayedCustomers.length
      })
    }
    if (prevProps.customer != this.props.customer) {
      this.setState({
        currentDisplayedCustomers: this.props.customer
      })
    }
  }

  // Dispatches action which stores selected customer to customers/ selectedCustomer in Redux
  customerModal(customer) {
    this.props.selectedCustomer(customer)
    if (this.state.isDesktop == false) {
      this.props.history.push('/customers/viewCustomer')
    }
  }

  // Renders list of Customers based on react state
  renderCustomers = () => {
    if (this.state.currentDisplayedCustomers.length === 0) {
      return (
        <tr>
          <td style={{ paddingLeft: '26px' }}>No Customers Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage

        const customers = this.state.currentDisplayedCustomers.slice(
          0,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(customers.length / resultsPerPage)

        return customers.map(customer => {
          return (
            <tr
              className={
                this.state.isDesktop &&
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? 'modal-trigger themeLight'
                  : this.state.isDesktop &&
                    this.props.settings &&
                    this.props.settings.settings
                    ? 'modal-trigger'
                    : this.state.isDesktop == false &&
                      this.props.settings &&
                      this.props.settings.settings &&
                      this.props.settings.settings.theme_option_id == 12
                      ? 'themeLight'
                      : ''
              }
              href="#modal1"
              key={customer.id}
              onClick={() => this.customerModal(customer)}>
              <td className="modal-trigger__td">{customer.customer_name}</td>
              <td className="modal-trigger__td">
                {normalizePhone(customer.customer_phone)}
              </td>
              <td className="modal-trigger__td">
                {normalizePhone(customer.customer_fax)}
              </td>
              <td className="modal-trigger__td">{customer.customer_email}</td>
              <td className="modal-trigger__td">
                {customer.customer_bill_email}
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage

        const customers = this.state.currentDisplayedCustomers.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(customers.length / resultsPerPage)
        return customers.map(customer => {
          return (
            <tr
              className="modal-trigger"
              href="#modal1"
              key={customer.id}
              onClick={() => this.customerModal(customer)}>
              <td className="modal-trigger__td">{customer.customer_name}</td>
              <td className="modal-trigger__td">
                {normalizePhone(customer.customer_phone)}
              </td>
              <td className="modal-trigger__td">
                {normalizePhone(customer.customer_fax)}
              </td>
              <td className="modal-trigger__td">{customer.customer_email}</td>
              <td className="modal-trigger__td">
                {customer.customer_bill_email}
              </td>
            </tr>
          )
        })
      }
    }
  }

  // Finds Customer by general phone number or accounting phone number
  handleSearchPhone = event => {
    const term = event
    //target name will be  "customer"||"phone"

    if (term.value === 'all') {
      this.setState({
        currentDisplayedCustomers: this.props.customer,
        totalPages: Math.ceil(
          this.props.customer.length / this.state.resultsPerPage
        )
      })
    } else {
      let searchResult = this.props.customer.filter(
        customer => customer.id == term.value
      )

      this.setState({
        currentDisplayedCustomers: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      })
    }
  }

  handleLoadFilters = (target, e) => {
    switch (target) {
      case 'customer-asc':
        let companyNameAsc = this.state.currentDisplayedCustomers.sort(
          (a, b) => {
            return a.customer_name.localeCompare(b.customer_name)
          }
        )
        this.setState({
          currentDisplayedCustomers: companyNameAsc
        })
        break
      case 'customer-desc':
        let companyNameDesc = this.state.currentDisplayedCustomers.sort(
          (a, b) => {
            return b.customer_name.localeCompare(a.customer_name)
          }
        )
        this.setState({
          currentDisplayedCustomers: companyNameDesc
        })
        break

      default:
    }
  }

  handleSearch = (currentInputName = 'name', searchTerm = ' ') => {
    const loads = this.props.loads.loads
    let status = this.state.loadStatus

    //target is either id or name coming from the binded search inputs
    switch (currentInputName) {
      case 'name':
        if (status == 'all') {
          if (searchTerm.length == 0) {
            this.setState({
              currentDisplayedLoads: loads
            })
          } else {
            let searchResult = loads.filter(function(load) {
              return (
                load.customer.customer_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                load.load_reference
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
            })
            this.setState({
              currentDisplayedLoads: searchResult
            })
          }
        } else {
          if (searchTerm.length == 0) {
            this.setState({
              currentDisplayedLoads: loads.filter(
                load => load.load_status == status
              )
            })
          } else {
            let searchResult = loads.filter(function(load) {
              return (
                (load.load_status == status &&
                  load.customer.customer_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
                (load.load_status == status &&
                  load.load_reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
              )
            })
            this.setState({
              currentDisplayedLoads: searchResult
            })
          }
        }
        break
      case 'id':
        // IF "ALL" FILTER IS CHECKED
        if (status == 'all') {
          if (searchTerm.length == 0) {
            this.setState({
              currentDisplayedLoads: loads
            })
          } else {
            let res = loads.filter(
              load => load.invoice_id == parseInt(searchTerm)
            )
            this.setState({
              currentDisplayedLoads: res
            })
          }
        } else {
          // IF !ALL filter is checked

          if (searchTerm.length == 0) {
            this.setState({
              currentDisplayedLoads: loads.filter(
                load => load.load_status == status
              )
            })
          } else {
            this.setState({
              currentDisplayedLoads: loads.filter(
                load =>
                  load.load_status == status &&
                  load.invoice_id == parseInt(searchTerm)
              )
            })
          }
        }
        break
      default:
        this.setState({
          currentDisplayedLoads: loads
        })
    }
  }

  renderNextPage = () => {
    if (
      this.state.currentPage <
      Math.ceil(
        this.state.currentDisplayedCustomers.length / this.state.resultsPerPage
      )
    ) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1
      }))
    }
  }
  renderPrevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage - 1
      }))
    }
  }
  handleResultsPerPage = event => {
    const loads = this.props.customer
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(loads.length / event.value),
      currentPage: 1
    })
  }

  render() {
    const customerOptions = [
      {
        value: 'all',
        label: 'All'
      },
      ...this.props.customer.map(item => ({
        value: item.id,
        label:
          item.customer_name + ' PH:' + normalizePhone(item.customer_phone),
        other: normalizePhone(item.customer_phone)
      }))
    ]

    return (
      <section id="customer-search" className="app-container customer-search">
        <div className="top-section top-section--displayNone">
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Customer or Phone
              </h4>
              <Select
                label="Customer"
                name="customer_id"
                className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
                type="select"
                onChange={this.handleSearchPhone}
                defaultValue={customerOptions[0]}
                placeholder="Choose Customer"
                options={customerOptions}
                styles={
                  this.props.settings &&
                  this.props.settings.settings &&
                  this.props.settings.settings.theme_option_id == 22
                    ? reactSelectStylesPagination
                    : this.props.settings &&
                      this.props.settings.settings &&
                      this.props.settings.settings.theme_option_id == 12
                      ? reactSelectStylesPaginationThemeLight
                      : reactSelectStylesPagination
                }
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    //background
                    // neutral0:"white",

                    //border and divider of arrow - initial
                    neutral20: '#2f3c63',

                    //arrow down - after its not pristine
                    neutral60: '#7f64e3',

                    // no options text when user searching
                    neutral40: 'orange',
                    //chosen field on dropdown from previous
                    primary: '#7f64e3',

                    //highlight at hover
                    primary25: '#e0d8fe',
                    //Placeholder
                    neutral50: '#8c8bcc',

                    //selectd value text color
                    neutral80: 'rgba(0,0,0,0.87)',
                    //hover over container
                    neutral30: '#7f64e3'

                    // neutral5:"#dd4c4c",
                    // neutral10:"#dd4c4c",
                    //
                    // primay50:"#dd4c4c",
                    // neutral70:"#dd4c4c",
                    // neutral90:"#dd4c4c"
                  }
                })}
              />
            </div>
            <Pagination
              loadStatus={'all'}
              currentPage={this.state.currentPage}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalResults={this.state.currentDisplayedCustomers.length}
              totalPages={this.state.totalPages}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

        <DisplayLoadTable
          handleCustomerAsc={this.handleLoadFilters.bind(this, 'customer-asc')}
          handleCustomerDesc={this.handleLoadFilters.bind(
            this,
            'customer-desc'
          )}
          renderList={this.renderCustomers()}
          rowHeaders={[
            'Customer',
            'Phone',
            'Fax',
            'General Email',
            'Accounting Email'
          ]}
        />

        <CustomerModalTabular
          customerName={this.props.currentSelected.customer_name}
          customerAddress={this.props.currentSelected.customer_address}
          customerCity={this.props.currentSelected.customer_city}
          customerState={this.props.currentSelected.customer_state}
          customerZipCode={this.props.currentSelected.customer_zip}
          customerPhone={this.props.currentSelected.customer_phone}
          customerFax={this.props.currentSelected.customer_fax}
          customerEmail={this.props.currentSelected.customer_email}
          customerBillName={this.props.currentSelected.customer_bill_name}
          customerBillAddress={this.props.currentSelected.customer_bill_address}
          customerBillCity={this.props.currentSelected.customer_bill_city}
          customerBillState={this.props.currentSelected.customer_bill_state}
          customerBillZipCode={this.props.currentSelected.customer_bill_zip}
          customerBillPhone={this.props.currentSelected.customer_bill_phone}
          customerBillFax={this.props.currentSelected.customer_bill_fax}
          customerBillEmail={this.props.currentSelected.customer_bill_email}
        />

        <div className="fixed-action-btn">
          <Link to="/customers/addnew">
            <button
              className="btn-floating btn-large blue lighten-2"
              type="submit">
              <i className="large material-icons">add_circle</i>
            </button>
            <h4 className="fixed-action-btn__title add">Add Customer</h4>
          </Link>
        </div>
      </section>
    )
  }
}

function mapStatetoProps(state) {
  let customers = state.customers.customers.sort((a, b) =>
    a.customer_name.localeCompare(b.customer_name)
  )
  return {
    loads: state.loads,
    company: state.company,
    customer: state.customers.customers,
    currentSelected: state.customers.selectedCustomer,
    settings: state.settings
  }
}

export default connect(
  mapStatetoProps,
  {
    fetchCustomers,
    selectedCustomer,
    selectedLoad,
    fetchRequest,
    fetchComplete
  }
)(CustomerSearch)
