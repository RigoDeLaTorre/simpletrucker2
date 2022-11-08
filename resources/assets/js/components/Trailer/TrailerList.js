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
import { fetchTrailers, selectTrailer } from '../../actions/trailer'

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

import TrailerEdit from './TrailerEdit'
import TrailerAddNewModal from './TrailerAddNewModal'

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

class TrailerList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trailers: this.props.trailers.trailers.sort((a, b) =>
        a.trailer_reference.localeCompare(b.trailer_reference)
      ),
      currentPage: 1,
      resultsPerPage: 25
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    this.props.fetchRequest('Trailers')
    this.props.fetchTrailers()
    this.setState({
      allLength: this.state.trailers.length
    })
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
    this.initMaterialize()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.trailers != this.state.trailers) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.trailers.length
      })
    }
    if (prevProps.trailers.trailers != this.props.trailers.trailers) {
      let list = this.props.trailers.trailers.sort((a, b) =>
        a.trailer_reference.localeCompare(b.trailer_reference)
      )
      this.setState({
        trailers: list
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

      //   let dateAquired = document.querySelectorAll('.dateAquired')
      //   let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      //     onSelect: this.handleDate,
      //     autoClose: true
      //   })
    }, 0)
  }

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleInputState = event => {
    const term = event
    if (event.value === 'all') {
      this.setState({
        trailers: this.props.trailers.trailers,
        totalPages: Math.ceil(
          this.props.trailers.trailers.length / this.state.resultsPerPage
        )
      })
    } else {
      let searchResult = this.props.trailers.trailers.filter(
        trailer => trailer.id === term.value
      )
      this.setState({
        trailers: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      })
    }
  }

  handleLoadFilters = (target, e) => {
    switch (target) {
      case 'invoice-desc':
        let loads = this.state.trailers.sort((a, b) => {
          return b.id - a.id
        })
        this.setState({
          trailers: loads
        })
        break
      case 'invoice-asc':
        let loadAsc = this.state.trailers.sort((a, b) => {
          return a.id - b.id
        })
        this.setState({
          trailers: loadAsc
        })
        break
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  trailerModal(trailer) {
    this.props.selectTrailer(trailer)
  }

  //Renders the table/list of loads
  renderList = () => {
    if (this.state.trailers.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Trailers Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.trailers.slice(0, currentPage * resultsPerPage)
        let totalPages = Math.ceil(loads.length / resultsPerPage)
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#trailerEdit"
              key={load.id}
              onClick={() => this.trailerModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_reference}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_year}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.trailer_manufacturer}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_model}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_vin}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_license}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.trailer_date_aquired}
                </h5>
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.trailers.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#trailerEdit"
              key={load.id}
              onClick={() => this.trailerModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_reference}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_year}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.trailer_manufacturer}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_model}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_vin}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.trailer_license}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.trailer_date_aquired}
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
      Math.ceil(this.state.trailers.length / this.state.resultsPerPage)
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
    const trailers = this.props.trailers.trailers
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(trailers.length / event.value),
      currentPage: 1
    })
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.trailers.map(load => {
      return {
        Reference: load.trailer_reference,
        Year: load.trailer_year,
        Manufacturer: load.trailer_manufacturer,
        Model: load.trailer_model,
        Vin: load.trailer_vin,
        License: load.trailer_license,
        DateAquired: load.trailer_date_aquired
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `Trailers.csv` //Name the file here
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
      ...this.props.trailers.trailers.map(item => ({
        value: item.id,
        label:
          item.trailer_reference +
          (item.trailer_vin ? ' Vin# ' + item.trailer_vin : '')
      }))
    ]

    return (
      <section id="trailer-add-new" className="app-container vendor-list">
        <LoadingComponent loadingText="Trailer List" />
        <div className="top-section">
          <a
            className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
            href="#trailerAddNewModal">
            <i className="material-icons label-group__materializeIcon">add</i>
            Add New
          </a>
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Trailer or Vin
              </h4>
              <Select
                label="Trailer"
                name="trailer_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleInputState}
                defaultValue={options[0]}
                placeholder="Search Trailer"
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
              totalResults={this.state.trailers.length}
              totalPages={this.state.totalPages}
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
            'Date Aquired'
          ]}
        />

        <TrailerEdit />
        <TrailerAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    trailers: state.trailers,
    loads: state.trailers.trailers,
    isFetching: state.isFetching,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  { fetchTrailers, selectTrailer, fetchRequest, fetchComplete }
)(TrailerList)
