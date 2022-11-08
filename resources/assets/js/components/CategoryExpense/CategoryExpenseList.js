import _ from 'lodash'
let converter = require('json-2-csv')
import Select from 'react-select'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchRequest, fetchComplete } from '../../actions/fetching'

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
import {
  fetchCategoryExpenses,
  selectCategoryExpense
} from '../../actions/expense'

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

import CategoryAddNewModal from './CategoryAddNewModal'

import CategoryEdit from './CategoryEdit'

import {
  SearchBar,
  FixedActionButton,
  Pagination,
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'

import DisplayLoadTable from '../common/DisplayLoadTable'

class CategoryExpenseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      truckExpenseList: this.props.trucks.categories.sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
      currentPage: 1,
      resultsPerPage: 25,
      currentSelectedOption: { value: 'latest', label: 'Latest' }
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    this.props.fetchRequest('Expense Categories')
    this.props.fetchCategoryExpenses()
    // this.setState({
    //   allLength: this.state.truckExpenseList.length
    // })
    this.initMaterialize()
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.truckExpenseList != this.state.truckExpenseList) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.truckExpenseList.length
      })
    }
    if (prevProps.trucks.categories != this.props.trucks.categories) {
      let list = this.props.trucks.categories.sort((a, b) =>
        a.label.localeCompare(b.label)
      )
      this.setState({
        truckExpenseList: list,
        currentSelectedOption: { value: 'latest', label: 'Latest' }
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

  handleLoadFilters = filtervalue => {
    switch (filtervalue.value) {
      case 'desc':
        let loadDesc = this.state.truckExpenseList.sort((a, b) =>
          b.expense_type.localeCompare(a.expense_type)
        )
        this.setState({
          truckExpenseList: loadDesc,
          currentSelectedOption: filtervalue,
          totalPages: Math.ceil(loadDesc.length / this.state.resultsPerPage)
        })
        break
      case 'asc':
        let loadAsc = this.state.truckExpenseList.sort((a, b) =>
          a.expense_type.localeCompare(b.expense_type)
        )
        this.setState({
          truckExpenseList: loadAsc,
          currentSelectedOption: filtervalue,
          totalPages: Math.ceil(loadAsc.length / this.state.resultsPerPage)
        })
        break
      case 'latest':
        let latest = this.props.trucks.categories.sort((a, b) => b.id - a.id)

        this.setState({
          truckExpenseList: latest,
          currentSelectedOption: filtervalue,
          totalPages: Math.ceil(latest.length / this.state.resultsPerPage)
        })
        break
      case 'oldest':
        let oldest = this.props.trucks.categories.sort((a, b) => a.id - b.id)

        this.setState({
          truckExpenseList: oldest,
          currentSelectedOption: filtervalue,
          totalPages: Math.ceil(oldest.length / this.state.resultsPerPage)
        })
        break
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  truckModal(truck) {
    this.props.selectCategoryExpense(truck)
  }

  //Renders the table/list of loads
  renderList = () => {
    let expenseList = this.props.trucks.categories || ''

    if (this.state.truckExpenseList.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Categories Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.truckExpenseList.slice(
          0,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#categoryEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.label}</h5>
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.truckExpenseList.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#categoryEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.label}</h5>
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
      Math.ceil(this.state.truckExpenseList.length / this.state.resultsPerPage)
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
    const trucks = this.props.trucks.categories
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(trucks.length / event.value),
      currentPage: 1
    })
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.truckExpenseList.map(load => {
      return {
        Category: load.label
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `Categories.csv` //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
  }

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleInputState = event => {
    const term = event
    if (event.value === 'all') {
      this.setState({
        truckExpenseList: this.props.trucks.categories,
        totalPages: Math.ceil(
          this.props.expense.categories.length / this.state.resultsPerPage
        )
      })
    } else {
      let searchResult = this.props.expense.categories.filter(
        truck => truck.id === term.value
      )
      this.setState({
        truckExpenseList: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      })
    }
  }

  render() {
    const categoryOptions = [
      {
        value: 'all',
        label: 'All'
      },
      ...this.props.expense.categories.map(item => ({
        value: item.id,
        label: item.label
      }))
    ]

    return (
      <section id="truck-add-new" className="app-container vendor-list">
        <div className="top-section">
          <a
            className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
            href="#categoryAddNewModal">
            <i className="material-icons label-group__materializeIcon">add</i>
            Add New
          </a>
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">Category</h4>

              <Select
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleInputState}
                defaultValue={categoryOptions[0]}
                placeholder="Search Truck"
                options={categoryOptions}
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
              totalResults={this.state.truckExpenseList.length}
              totalPages={this.state.totalPages}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderList()}
          rowHeaders={['Category']}
        />

        <CategoryEdit />

        <CategoryAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    trucks: state.expense,
    isFetching: state.isFetching,
    expense: state.expense,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  { fetchCategoryExpenses, selectCategoryExpense, fetchRequest, fetchComplete }
)(CategoryExpenseList)
