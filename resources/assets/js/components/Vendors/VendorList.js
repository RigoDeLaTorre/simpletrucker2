import _ from 'lodash'
let converter = require('json-2-csv')
import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import LoadingComponent from '../LoadingComponent'
import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from '../forms'
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from '../forms/validation/normalizeForm'
import { Field, FieldArray, formValueSelector, reduxForm } from 'redux-form'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
import { fetchVendors, selectVendor } from '../../actions/vendor'

import {
  required,
  maxLength,
  maxLength4,
  maxLength10,
  maxLength20,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength4,
  minLength5,
  minLength12,
  onlyInteger
} from '../forms/validation/fieldValidations'

import VendorEdit from './VendorEdit'
import VendorAddNewModal from './VendorAddNewModal'

import {
  SearchBar,
  FixedActionButton,
  Pagination,
  SearchBarNew,
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'

import DisplayLoadTable from '../common/DisplayLoadTable'

class VendorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trucks: this.props.trucks.vendors.sort((a, b) =>
        a.vendor_name.localeCompare(b.vendor_name)
      ),
      currentPage: 1,
      resultsPerPage: 25,
      totalPages: 1
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    this.props.fetchRequest('Vendors')
    this.props.fetchVendors()
    this.setState({
      allLength: this.state.trucks.length
    })
    this.initMaterialize()

    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.trucks != this.state.trucks) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.trucks.length
      })
    }
    if (prevProps.trucks.vendors != this.props.trucks.vendors) {
      let list = this.props.trucks.vendors.sort((a, b) =>
        a.vendor_name.localeCompare(b.vendor_name)
      )
      this.setState({
        trucks: list
      })
    }
  }

  initMaterialize() {
    setTimeout(() => {
      let newLabel = document.querySelectorAll('label')
      for (let label of newLabel) {
        label.classList.add('active')
      }
      let modal = document.querySelectorAll('.modal')
      let modalInstance = M.Modal.init(modal)

      let selectInstance3 = document.querySelectorAll('select')
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3)

      let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
      let actionButton = M.FloatingActionButton.init(actionButtonElement)

      let dateAquired = document.querySelectorAll('.dateAquired')
      let dateAquiredInstance = M.Datepicker.init(dateAquired, {
        onSelect: this.handleDate,
        autoClose: true
      })
    }, 0)
  }

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleInputState = event => {
    const term = event
    if (event.value === 'all') {
      this.setState({
        trucks: this.props.trucks.vendors,
        totalPages: Math.ceil(
          this.props.trucks.vendors.length / this.state.resultsPerPage
        )
      })
    } else {
      let searchResult = this.props.trucks.vendors.filter(
        truck => truck.id === term.value
      )
      this.setState({
        trucks: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      })
    }
  }

  handleLoadFilters = (target, e) => {
    switch (target) {
      case 'invoice-desc':
        let loads = this.state.trucks.sort((a, b) => {
          return b.id - a.id
        })
        this.setState({
          trucks: loads
        })
        break
      case 'invoice-asc':
        let loadAsc = this.state.trucks.sort((a, b) => {
          return a.id - b.id
        })
        this.setState({
          trucks: loadAsc
        })
        break
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  truckModal(truck) {
    this.props.selectVendor(truck)
  }

  //Renders the table/list of loads
  renderList = () => {
    if (this.state.trucks.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Vendors Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.trucks.slice(0, currentPage * resultsPerPage)
        let totalPages = Math.ceil(loads.length / resultsPerPage)
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#vendorEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_name}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_address}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_city}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_state}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_zipcode}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {normalizePhone(load.vendor_phone)}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {normalizePhone(load.vendor_fax)}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_email}</h5>
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.trucks.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#vendorEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_name}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_address}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_city}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_state}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_zipcode}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {normalizePhone(load.vendor_phone)}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {normalizePhone(load.vendor_fax)}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.vendor_email}</h5>
              </td>
            </tr>
          )
        })
      }
    }
  }

  renderNextPage = () => {
    if (
      this.state.currentPage <
      Math.ceil(this.state.trucks.length / this.state.resultsPerPage)
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
    const trucks = this.props.trucks.vendors
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(trucks.length / event.value),
      currentPage: 1
    })
  }
  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.trucks.map(load => {
      return {
        Name: load.vendor_name,
        Address: load.vendor_address,
        City: load.vendor_city,
        State: load.vendor_state,
        Zipcode: load.vendor_zipcode,
        Phone: normalizePhone(load.vendor_phone),
        Fax: normalizePhone(load.vendor_fax),
        Email: load.vendor_email
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `Vendors.csv` //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
  }

  render() {
    const options = [
      {
        value: 'all',
        label: 'All'
      },
      ...this.props.trucks.vendors.map(item => ({
        value: item.id,
        label:
          item.vendor_name +
          (item.vendor_phone
            ? `" Ph# : ${normalizePhone(item.vendor_phone)}`
            : '')
      }))
    ]

    return (
      <section id="truck-add-new" className="app-container vendor-list">
        <LoadingComponent loadingText="Vendor List" />
        <div className="top-section">
          <a
            className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
            href="#vendorAddNewModal">
            <i className="material-icons label-group__materializeIcon">add</i>
            Add New
          </a>
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Name or Phone
              </h4>
              <Select
                label="Truck"
                name="truck_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleInputState}
                defaultValue={options[0]}
                placeholder="Search Vendor"
                options={options}
                styles={
                  this.props.settings &&
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
              totalResults={this.state.trucks.length}
              totalPages={this.state.totalPages}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderList()}
          rowHeaders={[
            'Name',
            'Address',
            'City',
            'State',
            'Zipcode',
            'Phone',
            'Fax',
            'Email'
          ]}
        />

        <VendorEdit />
        <VendorAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    trucks: state.vendors,
    loads: state.vendors.vendors,
    isFetching: state.isFetching,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  { fetchVendors, selectVendor, fetchRequest, fetchComplete }
)(VendorList)
