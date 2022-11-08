import _ from 'lodash'
let converter = require('json-2-csv')
import Select from 'react-select'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import LoadingComponent from '../LoadingComponent'
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
  fetchExpenseTypes,
  selectExpenseType,
  fetchCategoryExpenses
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

import CategoryAddNewModal from '../CategoryExpense/CategoryAddNewModal'
import ExpenseTypeAddNewModal from './ExpenseTypeAddNewModal'
import ExpenseTypeEdit from './ExpenseTypeEdit'

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

class ExpenseTypeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expenseTypes: this.props.expense.expenseTypes.sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
      currentPage: 1,
      resultsPerPage: 25,
      currentSelectedOption: { value: 'latest', label: 'Latest' },
      totalPages: 1,
      currentInputName: '',
      searchId: 'all',
      searchTerm: 'all'
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    this.props.fetchRequest('Expense Sub-Categories')
    this.props.fetchCategoryExpenses()
    this.props.fetchExpenseTypes()
    // this is comingback with lengh of 0 of course

    this.setState({
      allLength: this.state.expenseTypes.length
    })
    this.initMaterialize()
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expenseTypes != this.state.expenseTypes) {
      this.initMaterialize()
      this.setState({
        allLength: this.state.expenseTypes.length
      })
    }
    if (prevProps.expense.expenseTypes != this.props.expense.expenseTypes) {
      let list = this.props.expense.expenseTypes.sort((a, b) =>
        a.label.localeCompare(b.label)
      )
      this.setState({
        expenseTypes: list
        // currentSelectedOption:{value:"latest", label:"Latest"}
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
        let loadDesc = this.state.expenseTypes.sort((a, b) =>
          b.label.localeCompare(a.label)
        )
        this.setState({
          expenseTypes: loadDesc,
          currentSelectedOption: filtervalue
        })
        break
      case 'asc':
        let loadAsc = this.state.expenseTypes.sort((a, b) =>
          a.label.localeCompare(b.label)
        )
        this.setState({
          expenseTypes: loadAsc,
          currentSelectedOption: filtervalue
        })
        break
      case 'latest':
        let latest = this.props.expense.expenseTypes.sort((a, b) => b.id - a.id)

        this.setState({
          expenseTypes: latest,
          currentSelectedOption: filtervalue
        })
        break
      case 'oldest':
        let oldest = this.props.expense.expenseTypes.sort((a, b) => a.id - b.id)

        this.setState({
          expenseTypes: oldest,
          currentSelectedOption: filtervalue
        })
        break
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  truckModal(truck) {
    this.props.selectExpenseType(truck)
  }

  //Renders the table/list of loads
  renderList = () => {
    const categories = this.props.expense.categories
    let expenseList = this.props.expense.expenseTypes || ''

    if (this.state.expenseTypes.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Loads Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.expenseTypes.slice(
          0,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#expenseTypeEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.category.label}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.label}</h5>
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.expenseTypes.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#expenseTypeEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.category.label}</h5>
              </td>
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
      Math.ceil(this.state.expenseTypes.length / this.state.resultsPerPage)
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
    const trucks = this.props.expense.expenseTypes
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(trucks.length / event.value),
      currentPage: 1
    })
  }

  handleInputState = (target, event) => {
    let currentInputName = target //customer or invoice
    let searchTerm = event.value // {value:load.id , label:"whatever"}

    if (currentInputName == 'category') {
      this.setState(
        {
          currentInputName: currentInputName,
          searchTerm: event,
          searchId: {
            value: 'all',
            label: 'All'
          }
        },
        () => this.handleSearch(currentInputName, searchTerm)
      )
    } else {
      this.setState(
        {
          currentInputName: currentInputName,
          searchId: event,
          searchTerm: {
            value: 'all',
            label: 'All'
          }
        },
        () => this.handleSearch(currentInputName, searchTerm)
      )
    }
  }

  handleSearch = (
    currentInputName = this.state.currentInputName,
    searchTerm = this.state.searchTerm
  ) => {
    const expenseTypes = this.props.expense.expenseTypes
    //DELETE THIS
    // let status = this.state.loadStatus

    //target is either id or name coming from the binded search inputs
    switch (currentInputName) {
      case 'category':
        if (searchTerm == 'all') {
          this.setState({
            expenseTypes: expenseTypes,
            currentInputName: currentInputName,
            totalPages: Math.ceil(
              expenseTypes.length / this.state.resultsPerPage
            ),
            currentPage: 1
          })
        } else {
          let searchResult = expenseTypes.filter(
            type => type.category_expense_id === searchTerm
          )
          this.setState({
            expenseTypes: searchResult,
            currentInputName: currentInputName,
            totalPages: Math.ceil(
              searchResult.length / this.state.resultsPerPage
            ),
            currentPage: 1
          })
        }

        break
      case 'expense':
        if (searchTerm == 'all') {
          this.setState({
            expenseTypes: expenseTypes,
            currentInputName: currentInputName,
            totalPages: Math.ceil(
              expenseTypes.length / this.state.resultsPerPage
            ),
            currentPage: 1
          })
        } else {
          let searchResult = expenseTypes.filter(type => type.id === searchTerm)
          this.setState({
            expenseTypes: searchResult,
            currentInputName: currentInputName,
            totalPages: Math.ceil(
              searchResult.length / this.state.resultsPerPage
            ),
            currentPage: 1
          })
        }
        break
      default:
        this.setState({
          expenseTypes: expenseTypes,
          // currentInputName:currentInputName,
          totalPages: Math.ceil(
            expenseTypes.length / this.state.resultsPerPage
          ),
          currentPage: 1
        })
    }
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.expenseTypes.map(load => {
      return {
        Category: load.category.label,
        SubCategory: load.label
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `SubCategories.csv` //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
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
    const expenseOptions = [
      {
        value: 'all',
        label: 'All'
      },
      ...this.props.expense.expenseTypes.map(item => ({
        value: item.id,
        label: `${item.category ? item.category.label.toUpperCase() : ''} : ${
          item.label
        }`
      }))
    ]
    return (
      <section
        id="truck-add-new"
        className="app-container expense-list expense-list--subcategory">
        <div className="top-section">
          <a
            className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
            href="#expenseTypeAddNew">
            <i className="material-icons label-group__materializeIcon">add</i>
            Add New
          </a>

          <div className="top-section__filterMobileGroup">
            <SearchBarNew
              handleSearchPhone={this.handleInputState}
              searchTerm={this.state.searchTerm}
              searchNumber={this.state.searchId}
              searchTermPlaceholder="Category"
              searchNumberPlaceholder="Expense"
              onChangeText={this.handleInputState.bind(this, 'category')}
              onChangeNumber={this.handleInputState.bind(this, 'expense')}
              optionsText={categoryOptions}
              optionsNumber={expenseOptions}
              defaultValueText={categoryOptions[0]}
              defaultValueNumber={expenseOptions[0]}
              labelText="Category"
              labelNumber="Sub-Category"
              positionAbsolute="search-container-navTop--positionAbsolute"
              themeStyle={
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? reactSelectStylesPaginationThemeLight
                  : reactSelectStylesPagination
              }
            />
            <Pagination
              currentPage={this.state.currentPage}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              totalPages={this.state.totalPages}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalResults={this.state.expenseTypes.length}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderList()}
          rowHeaders={['Category', 'Sub-Category']}
        />

        <ExpenseTypeEdit />
        <ExpenseTypeAddNewModal />
        <CategoryAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    expense: state.expense,
    isFetching: state.isFetching,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  {
    fetchExpenseTypes,
    selectExpenseType,
    fetchCategoryExpenses,
    fetchRequest,
    fetchComplete
  }
)(ExpenseTypeList)
