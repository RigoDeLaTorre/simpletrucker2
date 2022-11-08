import React, { Component } from 'react'
import Select from 'react-select'
let converter = require('json-2-csv')
import moment from 'moment'
import { Link } from 'react-router-dom'
import LoadingComponent from '../LoadingComponent'
import { connect } from 'react-redux'
import { normalizePhone } from '../forms/validation/normalizeForm'

import { fetchPurchases } from '../../actions/purchases'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
import { dateDiffInDays, getTodaysDate } from '../filterFunctions.js'
import FilterButtons from '../Loads/filterButtonsLoads/FilterButtons.js'
import {
  SearchBar,
  Pagination,
  SearchBarNew,
  customStyles,
  reactSelectStylesPaginationThemeLight,
  reactSelectStylesPagination
} from '../common'

import DisplayLoadTable from '../common/DisplayLoadTable'
class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      currentDisplayedDrivers: this.props.purchases,
      searchPhone: '',
      searchTerm: '',
      currentPage: 1,
      resultsPerPage: 25,
      allLength: '',
      totalPages: 1,
      invoiceAsc: null
    }
  }

  // INITIALIZES MATERIALIZE FOR MODAL AND SELECT DROPDOWN
  initMaterialize() {
    setTimeout(() => {
      let modal = document.querySelectorAll('.modal')
      let modalInstance = M.Modal.init(modal)
      let selectInstance3 = document.querySelectorAll('select')
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3)
    }, 0)
  }

  componentDidMount() {
    this.props.fetchRequest('Purchases')
    window.scrollTo(0, 0)
    this.props.fetchPurchases()
    this.initMaterialize()
    this.setState(
      {
        allLength: this.state.currentDisplayedDrivers.length
      },
      () => this.props.fetchComplete()
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedDrivers != this.state.currentDisplayedDrivers
    ) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.currentDisplayedDrivers.length
      })
    }
    if (prevProps.purchases !== this.props.purchases) {
      this.props.fetchRequest('Purchases')
      this.setState(
        {
          currentDisplayedDrivers: this.props.purchases.sort(
            (a, b) =>
              a.card_charge_date > b.card_charge_date
                ? -1
                : a.card_charge_date > b.card_charge_date
                  ? 1
                  : 0
          )
        },
        () => this.props.fetchComplete()
      )
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  driverModal(driver) {
    this.props.selectedDriver(driver)
  }

  // DISPLAYS LIST OF DRIVERS ONTO LOAD TABLE
  renderDrivers = () => {
    if (this.state.currentDisplayedDrivers.length === 0) {
      return (
        <tr className="modal-trigger">
          <td className="modal-trigger__td">No Purchases Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const drivers = this.state.currentDisplayedDrivers.slice(
          0,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(drivers.length / resultsPerPage)
        return drivers.map(driver => {
          return (
            <tr
              className={
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? 'modal-trigger themeLight modal-trigger--noHover'
                  : 'modal-trigger modal-trigger--noHover'
              }
              href="#modal1"
              key={driver.id}
              onClick={() => this.driverModal(driver)}>
              <td className="modal-trigger__td">{driver.id}</td>
              <td className="modal-trigger__td">
                {driver.user.first_name} {driver.user.last_name}
              </td>
              <td className="modal-trigger__td">${driver.amount / 100}.00</td>
              <td className="modal-trigger__td">{driver.description}</td>
              <td className="modal-trigger__td modal-trigger__td--lowerCase">
                x{driver.card_number}
              </td>
              <td className="modal-trigger__td">
                {moment(driver.card_charge_date * 1000).format(
                  'dddd, MMMM Do YYYY, h:mm A'
                )}
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const drivers = this.state.currentDisplayedDrivers.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(drivers.length / resultsPerPage)

        return drivers.map(driver => {
          return (
            <tr
              className="modal-trigger"
              href="#modal1"
              key={driver.id}
              onClick={() => this.driverModal(driver)}>
              <td className="modal-trigger__td">{driver.id}</td>
              <td className="modal-trigger__td">
                {driver.user.first_name} {driver.user.last_name}
              </td>
              <td className="modal-trigger__td">${driver.amount / 100}.00</td>
              <td className="modal-trigger__td">{driver.description}</td>
              <td className="modal-trigger__td modal-trigger__td--lowerCase">
                x{driver.card_number}
              </td>
              <td className="modal-trigger__td">
                {moment(driver.card_charge_date * 1000).format(
                  'dddd, MMMM Do YYYY, h:mm A'
                )}
              </td>
            </tr>
          )
        })
      }
    }
  }

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleSearchPhone = event => {
    const term = event
    //target name will be  "customer"||"phone"

    if (term.value === 'all') {
      this.setState({
        currentDisplayedDrivers: this.props.purchases,
        totalPages: Math.ceil(
          this.props.purchases.length / this.state.resultsPerPage
        )
      })
    } else {
      let searchResult = this.props.purchases.filter(
        driver => driver.id == term.value
      )

      this.setState({
        currentDisplayedDrivers: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      })
    }
  }
  //SORTS TABLE DATA BY FIRST NAME, LAST NAME
  handleLoadFilters = (target, e) => {
    switch (target) {
      case 'invoice-desc':
        let loads = this.state.currentDisplayedDrivers.sort((a, b) => {
          return b.id - a.id
        })
        this.setState({
          currentDisplayedDrivers: loads,
          invoiceAsc: false
        })
        break
      case 'invoice-asc':
        let loadAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return a.id - b.id
        })
        this.setState({
          currentDisplayedDrivers: loadAsc,
          invoiceAsc: true
        })
        break

      default:
    }
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.currentDisplayedDrivers.map(load => {
      return {
        Invoice: load.id,
        Name: load.user.first_name + ' ' + load.user.last_name,
        Amount: load.amount,
        Description: load.description,
        Card: load.card_number,
        PurcahseDate: moment(load.card_charge_date * 1000).format(
          'dddd, MMMM Do YYYY, h:mm A'
        )
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = 'Purchases.csv' //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
  }

  renderNextPage = () => {
    if (
      this.state.currentPage <
      Math.ceil(
        this.state.currentDisplayedDrivers.length / this.state.resultsPerPage
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
    const loads = this.props.purchases
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(loads.length / event.value),
      currentPage: 1
    })
  }

  render() {
    return (
      <section id="driver-search" className="app-container">
        <LoadingComponent loadingText="Purchases" />

        <div className="top-section">
          <div className="top-section__filterMobileGroup">
            <Pagination
              loadStatus={'all'}
              currentPage={this.state.currentPage}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalPages={this.state.totalPages}
              totalResults={this.state.currentDisplayedDrivers.length}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

        <DisplayLoadTable
          handleInvoiceAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleInvoiceDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderDrivers()}
          invoiceAsc={this.state.invoiceAsc}
          rowHeaders={[
            'Invoice',
            'User',
            'Amount',
            'Description',
            'Card',
            'Date'
          ]}
        />

        <div className="fixed-action-btn">
          <Link to="/drivers/addnew">
            <button
              className="btn-floating btn-large blue lighten-2"
              type="submit">
              <i className="large material-icons">add_circle</i>
            </button>
            <h4 className="fixed-action-btn__title add">Add Driver</h4>
          </Link>
        </div>
      </section>
    )
  }
}

function mapStatetoProps(state) {
  return {
    purchases: state.checkout.purchases,
    settings: state.settings
  }
}

export default connect(
  mapStatetoProps,
  { fetchPurchases, fetchRequest, fetchComplete }
)(Checkout)
