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
import { fetchTrucks, selectTruck } from '../../actions/truck'

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

import TruckEdit from './TruckEdit'
import TruckAddNewModal from './TruckAddNewModal'
import {
  SearchBar,
  FixedActionButton,
  Pagination,
  SearchBarNew,
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
import DisplayLoadTable from '../common/DisplayLoadTable'
class TruckList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trucks: this.props.trucks.trucks.sort((a, b) =>
        a.truck_reference.localeCompare(b.truck_reference)
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
    this.props.fetchRequest('Trucks')
    this.props.fetchTrucks()
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
    if (prevProps.trucks.trucks != this.props.trucks.trucks) {
      let list = this.props.trucks.trucks.sort((a, b) =>
        a.truck_reference.localeCompare(b.truck_reference)
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
      //
      // let dateAquired = document.querySelectorAll('.dateAquired')
      // let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      //   onSelect: this.handleDate,
      //   autoClose: true
      // })
    }, 0)
  }

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleInputState = event => {
    const term = event
    if (event.value === 'all') {
      this.setState({
        trucks: this.props.trucks.trucks
      })
    } else {
      let searchResult = this.props.trucks.trucks.filter(
        truck => truck.id === term.value
      )
      this.setState({
        trucks: searchResult
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
    this.props.selectTruck(truck)
  }

  //Renders the table/list of loads
  renderList = () => {
    if (this.state.trucks.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Trucks Found</td>
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
              href="#truckEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_reference}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_year}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_manufacturer}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_model}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_vin}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_license}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_date_aquired}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.truck_initial_odometer}
                </h5>
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
              href="#truckEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_reference}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_year}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_manufacturer}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_model}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_vin}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_license}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.truck_date_aquired}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.truck_initial_odometer}
                </h5>
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
    const trucks = this.props.trucks.trucks
    this.setState({
      resultsPerPage: event.value,
      totalPages: trucks.length / event.value,
      currentPage: 1
    })
  }
  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.trucks.map(load => {
      return {
        Reference: load.truck_reference,
        Year: load.truck_year,
        Manufacturer: load.truck_manufacturer,
        Model: load.truck_model,
        Vin: load.truck_vin,
        License: load.truck_license,
        DateAquired: load.truck_date_aquired,
        InitOdometer: load.truck_initial_odometer
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `Trucks.csv` //Name the file here
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
      ...this.props.trucks.trucks.map(item => ({
        value: item.id,
        label: `${item.truck_reference}  ${
          item.truck_vin ? `Vin# ${item.truck_vin}` : ''
        }`
      }))
    ]

    return (
      <section id="truck-add-new" className="app-container vendor-list">
        <LoadingComponent loadingText="Truck List" />
        <div className="top-section">
          <a
            className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
            href="#truckAddNewModal">
            <i className="material-icons label-group__materializeIcon">add</i>
            Add New
          </a>
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Truck or Vin
              </h4>
              <Select
                label="Truck"
                name="truck_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleInputState}
                defaultValue={options[0]}
                placeholder="Search Truck"
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
              resultsPerPage={this.state.resultsPerPage}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />

            {/*
          <Select
            label="Customer"
            name="customer_id"
            className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
            type="select"
            onChange={this.handleInputState.bind(this, 'customer')}
            defaultValue={options[0]}
            value={this.state.searchTerm}
            placeholder="Search Reference"
            options={options}
            styles={customStyles}
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
          <Select
            label="Vin #"
            name="vin"
            className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
            type="select"
            onChange={this.handleInputState.bind(this, 'vin')}
            defaultValue={vinOptions[0]}
            value={this.state.searchPhone}
            placeholder="Search Vin"
            options={vinOptions}
            styles={customStyles}
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
          */}
          </div>
        </div>

        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderList()}
          rowHeaders={[
            'Reference',
            'Year',
            'Manufacturer',
            'Model',
            'Vin',
            'License',
            'Date Aquired',
            'Initial Odometer'
          ]}
        />
        <TruckEdit />
        <TruckAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    trucks: state.trucks,
    loads: state.trucks.trucks,
    isFetching: state.isFetching,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  { fetchTrucks, selectTruck, fetchRequest, fetchComplete }
)(TruckList)
