import _ from 'lodash'
let converter = require('json-2-csv')
import React, { Component } from 'react'
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
import {
  fetchExpenseTypes,
  fetchCategoryExpenses,
  selectExpenseRecord,
  fetchExpenseRecords
} from '../../actions/expense'
import { dateDiffInDays, getTodaysDate } from '../filterFunctions.js'

import { fetchTrucks } from '../../actions/truck'
import { fetchTrailers } from '../../actions/trailer'
import { fetchVendors } from '../../actions/vendor'
import { updateUserSettings } from '../../actions/user/updateUserSettings'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
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

import ExpenseAddNewModal from './ExpenseAddNewModal'
import TruckAddNewModal from '../Trucks/TruckAddNewModal'
import TrailerAddNewModal from '../Trailer/TrailerAddNewModal'
import CategoryAddNewModal from '../CategoryExpense/CategoryAddNewModal'
import ExpenseTypeAddNewModal from '../CategoryExpenseTypes/ExpenseTypeAddNewModal'
import ExpenseViewModal from './ExpenseViewModal'
import VendorAddNewModal from '../Vendors/VendorAddNewModal'

{
  /*
import TruckExpenseEdit from "./TruckExpenseEdit"
import TruckExpenseAddNewModal from "./TruckExpenseAddNewModal"
import TruckExpenseListAddNewModal from '../ExpenseTypes/TruckExpenseListAddNewModal'
import TruckAddNewModal from '../TruckList/TruckAddNewModal'
*/
}
import {
  SearchBar,
  FixedActionButton,
  Pagination,
  SearchBarNew,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'

import DisplayLoadTable from '../common/DisplayLoadTable'

class ExpenseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expenseRecords: this.props.expense.expenseRecords,
      searchId: { value: 'all', label: 'All' },
      searchTerm: { value: 'all', label: 'All' },
      currentInputName: 'vehicle',
      currentPage: 1,
      resultsPerPage: 25,
      allLength: '',
      totalPages: 1,
      focused: '',
      date: '',
      isDesktop: true
    }
  }

  componentDidMount() {
    this.props.fetchRequest('Expenses')
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

    this.props.fetchTrucks()
    this.props.fetchTrailers()
    this.props.fetchExpenseRecords()
    this.props.fetchCategoryExpenses()
    this.props.fetchExpenseTypes()
    this.props.fetchVendors()

    this.setState({
      isDesktop,
      allLength: this.state.expenseRecords.length
    })
    this.initMaterialize()
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)
  }
  // shouldComponentUpdate(nextProps,nextState) {
  //
  //   const diffState = this.state.expenseRecords != nextState.expenseRecords
  //   const diffExpenseProps = this.props.expense.expenseRecords !== nextProps.expense.expenseRecords
  //   const diffExpenseSubCategories = this.props.expense.expenseTypes !== nextProps.expense.expenseTypes
  //
  //   return diffState || diffExpenseProps || diffExpenseSubCategories
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expenseRecords != this.state.expenseRecords) {
      this.setState({
        allLength: this.state.expenseRecords.length
      })
    }
    if (prevProps.expense.expenseRecords != this.props.expense.expenseRecords) {
      this.setState({
        expenseRecords: this.props.expense.expenseRecords,
        searchId: { value: 'all', label: 'All' },
        searchTerm: { value: 'all', label: 'All' }
      })
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   Object.entries(this.props).forEach(([key, val]) =>
  //     prevProps[key] !== val && console.log(`Prop '${key}' changed`)
  //   );
  //   Object.entries(this.state).forEach(([key, val]) =>
  //     prevState[key] !== val && console.log(`State '${key}' changed`)
  //   );
  // }
  initMaterialize = () => {
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

      // let dateAquired = document.querySelectorAll(".dateAquired");
      // let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      //   onSelect: this.handleDate,
      //   autoClose: true
      // });
    }, 0)
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY

    date = date.toLocaleString().split(',')
    date = date[0]

    // changes value in redux form state
    this.props.change(this.state.focused, date)
  }

  handleLoadFilters = (target, e) => {
    switch (target) {
      case 'invoice-desc':
        let loads = this.state.expenseRecords.sort((a, b) => {
          return b.id - a.id
        })
        this.setState({
          expense: loads
        })
        break
      case 'invoice-asc':
        let loadAsc = this.state.expenseRecords.sort((a, b) => {
          return a.id - b.id
        })
        this.setState({
          expense: loadAsc
        })
        break
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  truckModal(truck) {
    this.props.selectExpenseRecord(truck)
    if (this.state.isDesktop == false) {
      this.props.history.push('/expense/view')
    }
  }

  //Renders the table/list of loads
  renderList = () => {
    let expenseList = this.props.expense.expenseTypes || ''

    let trucks = this.props.trucks.trucks || ''

    if (this.state.expenseRecords.length === 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: '26px' }}>No Expenses Found</td>
        </tr>
      )
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.expenseRecords.slice(
          0,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              href="#expenseRecordEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.truck ? 'Truck' : load.trailer ? 'Trailer' : 'General'}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.truck
                    ? load.truck.truck_reference
                    : load.trailer
                      ? load.trailer.trailer_reference
                      : 'General'}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.expenseCategory.label || ''}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.expenseType ? load.expenseType.label : ''}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.amount}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.description}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.date}</h5>
              </td>
            </tr>
          )
        })
      } else {
        let resultsPerPage = this.state.resultsPerPage
        let currentPage = this.state.currentPage
        const loads = this.state.expenseRecords.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        )
        let totalPages = Math.ceil(loads.length / resultsPerPage)

        return loads.map(load => {
          // let truck = trucks.find((item)=>item.id ===load.truck_id).truck_reference || ""
          //   let expense = expenseList.find((item)=>item.id ===load.truckexpenselists_id).label | ""
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
              href="#expenseRecordEdit"
              key={load.id}
              onClick={() => this.truckModal(load)}>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.truck
                    ? load.truck.truck_reference
                    : load.trailer
                      ? load.trailer.trailer_reference
                      : 'General'}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.expenseCategory.label || ''}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.expenseType ? load.expenseType.label : ''}
                </h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.amount}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.description}</h5>
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.date}</h5>
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
      Math.ceil(this.state.expenseRecords.length / this.state.resultsPerPage)
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
    const trucks = this.props.expense.expenseRecords
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(trucks.length / event.value),
      currentPage: 1
    })
  }
  handleInputState = (target, event) => {
    let currentInputName = target //customer or invoice
    let searchTerm = event.value // {value:load.id , label:"whatever"}

    if (currentInputName == 'vehicle') {
      this.setState(
        {
          currentInputName: currentInputName,
          searchTerm: event
        },
        () => this.handleSearch(currentInputName, searchTerm)
      )
    } else {
      this.setState(
        {
          currentInputName: currentInputName,
          searchId: event
        },
        () => this.handleSearch(currentInputName, searchTerm)
      )
    }
  }

  handleSearch = (
    currentInputName = this.state.currentInputName,
    searchTerm = 'all'
  ) => {
    const expenseRecords = this.props.expense.expenseRecords
    //DELETE THIS
    // let status = this.state.loadStatus

    //target is either id or name coming from the binded search inputs
    switch (currentInputName) {
      case 'vehicle':
        if (searchTerm == 'all') {
          if (this.state.searchId.value === 'all') {
            this.setState({
              expenseRecords: expenseRecords,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else {
            let searchResult = expenseRecords.filter(
              type => type.expenseCategory.id == this.state.searchId.value
            )
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        }
        // If Vehicle chosen is not All
        else if (searchTerm === 'truck') {
          if (this.state.searchId.value === 'all') {
            let searchResult = expenseRecords.filter(type => type.truck_id)
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else {
            let searchResult = expenseRecords.filter(
              type =>
                type.truck_id &&
                type.expenseCategory.id == this.state.searchId.value
            )
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        } else if (searchTerm === 'trailer') {
          if (this.state.searchId.value === 'all') {
            let searchResult = expenseRecords.filter(type => type.trailer_id)
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else {
            let searchResult = expenseRecords.filter(
              type =>
                type.trailer_id &&
                type.expenseCategory.id == this.state.searchId.value
            )
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        } else if (searchTerm === 'general') {
          if (this.state.searchId.value === 'all') {
            let searchResult = expenseRecords.filter(
              type => type.trailer_id === null && type.truck_id === null
            )
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else {
            let searchResult = expenseRecords.filter(
              type =>
                type.trailer_id === null &&
                type.truck_id === null &&
                type.expenseCategory.id == this.state.searchId.value
            )
            this.setState({
              expenseRecords: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        }

        break
      case 'expense':
        // Expense Type ==All
        if (searchTerm == 'all') {
          //Selectd Vehicle
          if (this.state.searchTerm.value === 'all') {
            this.setState({
              expenseRecords: expenseRecords,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'truck') {
            this.setState({
              expenseRecords: expenseRecords.filter(record => record.truck_id),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'trailer') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record => record.trailer_id
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'general') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record =>
                  (record.trailer_id === null) & (record.truck_id === null)
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        } else {
          // Expense type == a specific category
          //Selectd Vehicle
          if (this.state.searchTerm.value === 'truck') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record =>
                  record.truck_id && record.expenseCategory.id === searchTerm
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'trailer') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record =>
                  record.trailer_id && record.expenseCategory.id === searchTerm
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'general') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record =>
                  (record.trailer_id === null) & (record.truck_id === null) &&
                  record.expenseCategory.id === searchTerm
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          } else if (this.state.searchTerm.value === 'all') {
            this.setState({
              expenseRecords: expenseRecords.filter(
                record => record.expenseCategory.id === searchTerm
              ),
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                this.state.expenseRecords.length / this.state.resultsPerPage
              ),
              currentPage: 1
            })
          }
        }
        break
      default:
        this.setState({
          expenseRecords: expenseRecords,
          // currentInputName:currentInputName,
          totalPages: Math.ceil(
            expenseRecords.length / this.state.resultsPerPage
          ),
          currentPage: 1
        })
    }
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true }
    const array = this.state.expenseRecords.map(load => {
      return {
        Type: load.truck ? 'Truck' : load.trailer ? 'Trailer' : 'General',
        Category: load.expenseCategory.label,
        SubCategory: load.expenseType ? load.expenseType.label : '',
        Amount: load.amount,
        Description: load.description,
        Date: load.date
      }
    })
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement('a')
        var blob = new Blob(['\ufeff', csv])
        var url = URL.createObjectURL(blob)
        downloadLink.href = url
        downloadLink.download = `Expenses.csv` //Name the file here
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      },
      options
    )
  }

  renderDriverAlert = () => {
    // alert Days from the expense date
    let currentDate = new Date(getTodaysDate())
    let records = this.props.expense.expenseRecords.filter(
      item =>
        item.expense_alert === 1 &&
        dateDiffInDays(new Date(item.date), currentDate) <=
          item.expense_alert_days
    )

    //10/30

    if (records.length) {
      let recordAlerts = records.map(record => {
        return (
          <h4
            className="modal-trigger licenseExpire__driverName"
            href="#expenseRecordEdit"
            key={record.id}
            onClick={() => this.truckModal(record)}>
            {record.truck
              ? record.truck.truck_reference
              : record.trailer
                ? record.trailer.trailer_reference
                : 'General'}{' '}
            {record.expenseCategory.label}
          </h4>
        )
      })
      return (
        <div className="licenseExpire">
          Alert Notifications : {recordAlerts}
        </div>
      )
    } else {
      return ''
    }
  }

  render() {
    const truckOptions = [
      {
        value: 'all',
        label: 'All'
      },
      ...[
        { value: 'truck', label: 'Truck' },
        { value: 'trailer', label: 'Trailer' },
        { value: 'general', label: 'General' }
      ]
    ]
    const expenseOptions = [
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
      <section id="truck-add-new" className="app-container expense-list">
        <div className="top-section">
          {this.state.isDesktop ? (
            <a
              className="waves-effect waves-light btn modal-trigger deep-purple lighten-2 label-group__addItemIcon"
              href="#expenseAddNewModal">
              <i className="material-icons label-group__materializeIcon">add</i>
              Add New
            </a>
          ) : (
            <div>
              <Link
                to="/expense/expenseAddNew"
                className="deep-purple btn lighten-2 label-group__addItemIcon">
                <i className="material-icons label-group__materializeIcon">
                  add
                </i>{' '}
                Add New Expense
              </Link>
            </div>
          )}

          <div className="top-section__filterMobileGroup">
            <SearchBarNew
              handleSearchPhone={this.handleInputState}
              searchTerm={this.state.searchTerm}
              searchNumber={this.state.searchId}
              searchTermPlaceholder="Truck"
              searchNumberPlaceholder="Category"
              onChangeText={this.handleInputState.bind(this, 'vehicle')}
              onChangeNumber={this.handleInputState.bind(this, 'expense')}
              optionsText={truckOptions}
              optionsNumber={expenseOptions}
              defaultValueText={truckOptions[0]}
              defaultValueNumber={expenseOptions[0]}
              labelText="Truck"
              labelNumber="Category"
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
              loadStatus={'all'}
              currentPage={this.state.currentPage}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalPages={this.state.totalPages}
              totalResults={this.state.expenseRecords.length}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>
        {this.renderDriverAlert()}
        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, 'invoice-asc')}
          handleDesc={this.handleLoadFilters.bind(this, 'invoice-desc')}
          renderList={this.renderList()}
          rowHeaders={[
            'Type',
            'Name',
            'Category',
            'Sub-Category',
            'Amount',
            'Description',
            'Date'
          ]}
        />
        <ExpenseAddNewModal />
        <CategoryAddNewModal />
        <ExpenseTypeAddNewModal />
        <TruckAddNewModal />
        <TrailerAddNewModal />
        <ExpenseViewModal />
        <VendorAddNewModal />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    expense: state.expense,
    trucks: state.trucks,
    isFetching: state.isFetching,
    alert: state.alert,
    settings: state.settings
  }
}
export default connect(
  mapStateToProps,
  {
    fetchExpenseTypes,
    fetchExpenseRecords,
    fetchCategoryExpenses,
    selectExpenseRecord,
    fetchVendors,
    fetchTrucks,
    fetchTrailers,
    updateUserSettings,
    fetchRequest,
    fetchComplete
  }
)(ExpenseList)
