import _ from 'lodash'
import React, { Component } from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import {
  Field,
  FieldArray,
  reduxForm,
  formValues,
  formValueSelector,
  getFormSyncErrors
} from 'redux-form'
import { Link } from 'react-router-dom'

import TruckAddNewModal from '../Trucks/TruckAddNewModal'
import TrailerAddNewModal from '../Trailer/TrailerAddNewModal'
import CategoryAddNewModal from '../CategoryExpense/CategoryAddNewModal'
import ExpenseTypeAddNewModal from '../CategoryExpenseTypes/ExpenseTypeAddNewModal'
import VendorAddNewModal from '../Vendors/VendorAddNewModal'

import Checkbox from './Checkbox'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from '../forms'
import RenderSelectFieldReactSelectClass from '../forms/RenderSelectFieldReactSelectClass'
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip,
  submitValidationExpense
} from '../forms/validation'

import {
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'
import {
  fetchCategoryExpenses,
  fetchExpenseTypes,
  updateExpenseRecord
} from '../../actions/expense'
import { uploadAwsFile, deleteAwsFile } from '../../actions/aws'

import { fetchTrucks } from '../../actions/truck'
import { fetchTrailers } from '../../actions/trailer'
import { fetchVendors } from '../../actions/vendor'

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
  onlyInteger,
  number
} from '../forms/validation/fieldValidations'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

class ExpenseEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'expense',
      focused: '',
      date: '',
      vehicle: 'truck',
      vehicleOptions: [],
      field_name: 'truck_id',
      vehicleChosen: '',
      general: false,
      wut: '',
      deleteUploads: [],
      deleteId: [],
      checkedItems: new Map(),
      category_id: 0,
      subCategories: [],
      open: false
    }

    this.setStateSubCategories = this.setStateSubCategories.bind(this)
  }

  componentDidMount() {
    this.props.fetchRequest('Edit Expense..')
    this.props.fetchTrucks()
    this.props.fetchTrailers()
    this.props.fetchCategoryExpenses()
    this.props.fetchExpenseTypes()
    this.props.fetchVendors()

    this.updateMaterialize()
    setTimeout(() => {
      this.props.fetchComplete()
    }, 300)

    // this.controlOptions()

    this.setState(
      {
        category_id: this.props.expense.selectedExpenseRecord.category_id,
        truck_id:
          this.props.expense.selectedExpenseRecord &&
          this.props.expense.selectedExpenseRecord.truck
            ? {
                value: this.props.expense.selectedExpenseRecord.truck.id,
                label: this.props.expense.selectedExpenseRecord.truck
                  .truck_reference
              }
            : this.props.expense.selectedExpenseRecord.trailer
              ? {
                  value: this.props.expense.selectedExpenseRecord.trailer.id,
                  label: this.props.expense.selectedExpenseRecord.trailer
                    .trailer_reference
                }
              : null,
        wut: this.props.expense.selectedExpenseRecord.truck_id
          ? { value: 'truck', label: 'Truck' }
          : this.props.expense.selectedExpenseRecord.trailer_id
            ? { value: 'trailer', label: 'Trailer' }
            : { value: 'general', label: 'General' },
        general:
          this.props.expense.selectedExpenseRecord.truck_id === null &&
          this.props.expense.selectedExpenseRecord.trailer_id === null
            ? true
            : false,
        vehicleOptions: this.props.expense.selectedExpenseRecord.truck_id
          ? this.props.trucks.trucks.map(item => ({
              value: item.id,
              label: item.truck_reference
            }))
          : this.props.expense.selectedExpenseRecord.trailer_id
            ? this.props.trailers.trailers.map(item => ({
                value: item.id,
                label: item.trailer_reference
              }))
            : [],
        field_name: this.props.expense.selectedExpenseRecord.truck_id
          ? 'truck_id'
          : this.props.expense.selectedExpenseRecord.trailer_id
            ? 'trailer_id'
            : 'general_expense_id',
        vehicle: this.props.expense.selectedExpenseRecord.truck_id
          ? 'Truck'
          : 'Trailer',
        vendor_id:
          this.props.expense.selectedExpenseRecord &&
          this.props.expense.selectedExpenseRecord.vendor
            ? {
                value: this.props.expense.selectedExpenseRecord.vendor.id,
                label: this.props.expense.selectedExpenseRecord.vendor
                  .vendor_name
              }
            : null
      },
      () => this.setStateSubCategories()
    )
  }

  componentDidUpdate(prevProps) {
    if (this.state.tab === 'expense') {
      this.updateMaterialize()
    }
    if (
      prevProps.trucks.trucks != this.props.trucks.trucks ||
      prevProps.trailers.trailers != this.props.trailers.trailers
    ) {
      this.controlOptions()
    }

    // if (
    //   prevProps.expense.selectedExpenseRecord !==
    //   this.props.expense.selectedExpenseRecord
    // ) {
    //   console.log('what in the actual youu')
    //   //Instance for MaterializeCSS
    //   this.setState(
    //     {
    //       deleteUploads: [],
    //       deleteId: [],
    //       category_id: this.props.expense.selectedExpenseRecord.category_id,
    //       wut: this.props.expense.selectedExpenseRecord.truck_id
    //         ? { value: 'truck', label: 'Truck' }
    //         : this.props.expense.selectedExpenseRecord.trailer_id
    //           ? { value: 'trailer', label: 'Trailer' }
    //           : { value: 'general', label: 'General' },
    //       general:
    //         this.props.expense.selectedExpenseRecord.truck_id === null &&
    //         this.props.expense.selectedExpenseRecord.trailer_id === null
    //           ? true
    //           : false,
    //       vehicleOptions: this.props.expense.selectedExpenseRecord.truck_id
    //         ? this.props.trucks.trucks.map(item => ({
    //             value: item.id,
    //             label: item.truck_reference
    //           }))
    //         : this.props.expense.selectedExpenseRecord.trailer_id
    //           ? this.props.trailers.trailers.map(item => ({
    //               value: item.id,
    //               label: item.trailer_reference
    //             }))
    //           : [],
    //       field_name: this.props.expense.selectedExpenseRecord.truck_id
    //         ? 'truck_id'
    //         : this.props.expense.selectedExpenseRecord.trailer_id
    //           ? 'trailer_id'
    //           : 'general_expense_id',
    //       vehicle: this.props.expense.selectedExpenseRecord.truck_id
    //         ? 'Truck'
    //         : 'Trailer',
    //       vendor_id:
    //         this.props.expense.selectedExpenseRecord &&
    //         this.props.expense.selectedExpenseRecord.vendor
    //           ? {
    //               value: this.props.expense.selectedExpenseRecord.vendor.id,
    //               label: this.props.expense.selectedExpenseRecord.vendor
    //                 .vendor_name
    //             }
    //           : null
    //     },
    //     () => this.setStateSubCategories()
    //   )
    //
    //   this.updateMaterialize()
    // }
  }
  handleDateChange = () => {}

  updateMaterialize = () => {
    let elemTabs = document.querySelectorAll('.tabs')
    var elemTabsInstance = M.Tabs.init(elemTabs)

    let modal = document.querySelectorAll('.modal')
    let modalInstance = M.Modal.init(modal)

    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)

    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    let truckExpenseDate = document.querySelectorAll('.truckExpenseDate')
    let truckExpenseDateInstance = M.Datepicker.init(truckExpenseDate, {
      onSelect: this.handleDate,
      container: 'body',
      autoClose: true
    })
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY

    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change(this.state.focused, date)
  }

  handleLicenseExp = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change('driver_license_expiration', date)
  }

  handleDisabled = event => {
    event.preventDefault()
    this.props.handleModalOpen()
  }

  onSubmit = values => {
    let formErrors = this.renderErrors()
    if (
      _.isEmpty(this.props.synchronousError) &&
      formErrors.expenseerror === false &&
      formErrors.alerterror === false
    ) {
      let delValues = {
        id: this.state.deleteId,
        link: this.state.deleteUploads
      }
      if (this.state.deleteId.length) {
        this.props.deleteAwsFile(delValues)
      }

      let newValues = submitValidationExpense(values, this.state.field_name)

      let fieldName = {
        fieldName: 'expense_id',
        id: this.props.expense.selectedExpenseRecord.id
      }

      if (this.state.expenseFile) {
        this.props.uploadAwsFile(
          this.state.expenseFile,
          'expense',
          fieldName,
          linkUrl => {
            this.props.updateExpenseRecord(newValues, () => {
              // this.props.reset()
              this.props.history.push('/expense/expenseList')
              // this.handleRemoveRateLink()
            })
            M.toast({
              html: 'Expense Record updated !',
              classes: 'materialize__toastSuccess'
            })
          }
        )
      } else {
        this.props.updateExpenseRecord(newValues, () => {
          // this.props.reset()
          this.props.history.push('/expense/expenseList')
          // this.handleRemoveRateLink()
        })
        M.toast({
          html: 'Expense Record updated !',
          classes: 'materialize__toastSuccess'
        })
      }
    } else {
      alert(formErrors.messageError)
    }
  }

  controlOptions = (val = this.state.vehicle) => {
    if (val === 'truck') {
      let list = this.props.trucks.trucks.map(item => ({
        value: item.id,
        label: item.truck_reference
      }))

      this.setState({
        field_name: 'truck_id',
        vehicle: 'truck',
        vehicleOptions: list,
        general: false,
        open: false
      })
      this.props.change('truck_id', '')
    } else if (val === 'trailer') {
      let list = this.props.trailers.trailers.map(item => ({
        value: item.id,
        label: item.trailer_reference
      }))

      this.setState({
        field_name: 'trailer_id',
        vehicle: 'trailer',
        vehicleOptions: list,
        general: false,
        open: false
      })
      this.props.change('truck_id', '')
    } else if (val === 'general') {
      this.props.change('truck_id', '')
      this.setState({
        general: true,
        field_name: 'general_expense_id',
        open: false
      })
    }
  }
  controlOptionsSubCategory = event => {
    this.setState(
      {
        category_id: event.value,
        subCategories: [{ value: '', label: 'Choose Sub-Category' }]
      },
      () => this.setStateSubCategories()
    )

    this.props.change('category_expense_type_id', {
      value: '',
      label: 'Choose Subcategory'
    })
  }

  setStateSubCategories = () => {
    let categoryId =
      this.state.category_id ||
      this.props.expense.selectedExpenseRecord.category_expense_id

    const expenseOptions = this.props.expense.expenseTypes
      .filter(item => item.category_expense_id == categoryId)
      .map(obj => {
        return {
          value: obj.id,
          label: `${obj.category ? obj.category.label.toUpperCase() : ''} : ${
            obj.label
          }`
        }
      })

    this.setState({
      subCategories: expenseOptions
    })
  }

  handleFileChange = e => {
    const file = e.target.files[0]

    // name of the file uploaded
    let uploadName = file.name

    // rateconfirmation || bol
    let folder = e.target.name
    const fileName = 'expense_attachment'
    // folder = rateconfirmation ||bol
    this.setState({
      [`${folder}File`]: file,
      [`${folder}FileName`]: uploadName
    })

    e.target.value = ''
  }

  handleRemoveRateLink = event => {
    let uploadLink = document.getElementById('fileIdEditExpense')
    uploadLink.value = ''
    uploadLink.classList.remove('valid')

    this.setState({
      expenseFile: null,
      expenseFileName: null
    })
  }

  deleteBol = item => {
    const deleteItem = { ...item }

    if (
      this.state.deleteId.find(deleteId => deleteId == deleteItem.id) ===
      undefined
    ) {
      this.setState({
        deleteId: [...this.state.deleteId, deleteItem.id],
        deleteUploads: [
          ...this.state.deleteUploads,
          { Key: deleteItem.attachment }
        ]
      })
    } else {
      let deleteId = this.state.deleteId.filter(x => x != deleteItem.id)
      let deleteUploads = this.state.deleteUploads.filter(
        x => x.Key != deleteItem.attachment
      )
      this.setState({
        deleteId,
        deleteUploads
      })
    }

    // if (confirm('Are you sure you want to delete proof of delivery??')) {
    //   let delValues = {
    //     id:this.state.deleteId,
    //     link:this.state.deleteUploads
    //   }
    //   this.props.deleteAwsFile(delValues)
    //
    //   this.props.updateLoad(newValues, () => {
    //     // this.props.history.push('/loads/loadboard')
    //   })
    // } else {
    //   return false
    // }
  }

  renderAttachments = () => {
    if (
      this.props.expense.selectedExpenseRecord.attachments &&
      this.props.expense.selectedExpenseRecord.attachments.length !== 0
    ) {
      return this.props.expense.selectedExpenseRecord.attachments.map(item => (
        <div key={item.id} className="form__attachment">
          <a
            key={item.id}
            className="linkWithMaterializeIcon"
            href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${
              item.attachment
            }`}
            target="_blank">
            <i className="material-icons">attachment</i>
            {item.attachment.split('/').pop()}
          </a>
          <Checkbox name={item.id} onChange={() => this.deleteBol(item)} />
        </div>
      ))
    } else {
      return
    }
  }

  renderErrors = () => {
    const errors = this.props.synchronousError
    let expenseerror = false
    let alerterror = false
    let messageError

    if (this.state.tab === 'expense') {
      if (errors.expense_alert_days !== undefined) {
        alerterror = true
      }
      if (
        !this.state.general &&
        !this.props.expenseValues.hasOwnProperty('truck_id')
      ) {
        expenseerror = true
      }
    } else if (this.state.tab === 'vendor') {
      if (
        !this.state.general &&
        !this.props.expenseValues.hasOwnProperty('truck_id')
      ) {
        expenseerror = true
      }
      const errorReduxExpense = Object.keys(errors).some(
        x =>
          x === 'truck_id' ||
          x === 'category_expense_id' ||
          x === 'date' ||
          x === 'amount' ||
          x === 'expense_alert_days'
      )
      if (errors.expense_alert_days !== undefined) {
        alerterror = true
      }

      if (errorReduxExpense) {
        expenseerror = true
      }
    } else if (this.state.tab === 'alert') {
      if (
        !this.state.general &&
        !this.props.expenseValues.hasOwnProperty('truck_id')
      ) {
        expenseerror = true
      }
      const errorReduxExpense = Object.keys(errors).some(
        x =>
          x === 'truck_id' ||
          x === 'category_expense_id' ||
          x === 'date' ||
          x === 'amount'
      )
      if (errorReduxExpense) {
        expenseerror = true
      }
    } else if (this.state.tab === 'attachments') {
      if (
        !this.state.general &&
        !this.props.expenseValues.hasOwnProperty('truck_id')
      ) {
        expenseerror = true
      }
      const errorReduxExpense = Object.keys(errors).some(
        x =>
          x === 'truck_id' ||
          x === 'category_expense_id' ||
          x === 'date' ||
          x === 'amount'
      )
      if (errors.expense_alert_days !== undefined) {
        alerterror = true
      }

      if (errorReduxExpense) {
        expenseerror = true
      }
    }

    return {
      expenseerror,
      alerterror,
      messageError:
        expenseerror && alerterror
          ? 'Please fill required fields in Expense and Alert tabs'
          : expenseerror
            ? 'Please fill required fields in Expense Tab'
            : 'Please fill required fields in Alert Tab'
    }
  }

  controlOptions = (val = this.state.vehicle) => {
    if (val === 'truck') {
      let list = this.props.trucks.trucks.map(item => ({
        value: item.id,
        label: item.truck_reference
      }))

      this.setState({
        field_name: 'truck_id',
        vehicle: 'truck',
        vehicleOptions: list,
        general: false,
        open: false
      })
      this.props.change('truck_id', '')
    } else if (val === 'trailer') {
      let list = this.props.trailers.trailers.map(item => ({
        value: item.id,
        label: item.trailer_reference
      }))

      this.setState({
        field_name: 'trailer_id',
        vehicle: 'trailer',
        vehicleOptions: list,
        general: false,
        open: false
      })
      this.props.change('truck_id', '')
    } else if (val === 'general') {
      this.props.change('truck_id', '')
      this.setState({
        general: true,
        field_name: 'general_expense_id',
        open: false
      })
    }
  }

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  // shouldComponentUpdate(nextProps) {
  //   const differentTitle =
  //     this.props.trailers.trailers.length !== nextProps.trailers.trailers.length
  //   const differentDone =
  //     this.props.trucks.trucks.length !== nextProps.trucks.trucks.length
  //   return differentTitle || differentDone
  // }
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props
    const alertOptions = [
      { value: 0, label: 'Inactive' },
      { value: 1, label: 'Active' }
    ]
    // const expenseList = this.props.trucks.expenseList.find((item)=>item.id===this.props.initialValues.category_expense_type_id) || ""
    const trucks = this.props.trucks.trucks
    const options = [
      { value: 'truck', label: 'Truck' },
      { value: 'trailer', label: 'Trailer' },
      { value: 'general', label: 'General' }
    ]
    const categoryOptions = this.props.expense.categories.map(item => ({
      value: item.id,
      label: item.label
    }))

    const vendorOptions = [
      { value: '', label: 'Choose Vendor' },
      ...this.props.vendors.vendors.map(item => ({
        value: item.id,
        label: item.vendor_name
      }))
    ]

    if (_.isEmpty(this.props.expense.selectedExpenseRecord)) {
      return (
        <div>
          <h4>
            No expense was selected, go back to{' '}
            <Link
              to="/expense/expenseList"
              className="nav-section__link nav-section__link--flex">
              Expenses
            </Link>{' '}
            and try again !
          </h4>
        </div>
      )
    }
    return (
      <div id="expenseRecordEdit" className="app-container">
        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a
              className="active"
              href="#test1"
              onClick={() => this.setState({ tab: 'expense' })}>
              Expense
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test2" onClick={() => this.setState({ tab: 'vendor' })}>
              Vendor
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test3" onClick={() => this.setState({ tab: 'alert' })}>
              Alert
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              href="#test4"
              onClick={() => this.setState({ tab: 'attachments' })}>
              Attachments
            </a>
          </li>
        </ul>
        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div id="test1" className="col s12">
            <section className="form__section">
              <h1 className="form__title">Expense Details</h1>
              <h4 className="form__subTitleRequired">
                <span className="form__subTitleRequired--asterick">* </span>{' '}
                Required Fields
              </h4>
              <div className="row form__row form__row--column form__row--column form__row--column--marginBottom5rem">
                <div
                  className="container1"
                  ref={input => {
                    this.containerexpensetype = input
                  }}>
                  <a className="button1" onClick={this.handleButtonClick}>
                    Type:<span>
                      {this.state.general
                        ? 'General'
                        : this.state.vehicle == 'trailer'
                          ? 'Trailer'
                          : 'Truck'}
                    </span>
                    <i className="material-icons">arrow_drop_down</i>
                  </a>

                  {this.state.open && (
                    <div className="dropdown1">
                      <ul>
                        <li
                          className="dropdown1__single"
                          onClick={() => this.controlOptions('truck')}>
                          <div>
                            <h4>Truck</h4>
                          </div>
                        </li>
                        <li
                          className="dropdown1__single"
                          onClick={() => this.controlOptions('trailer')}>
                          <div>
                            <h4>Trailer</h4>
                          </div>
                        </li>
                        <li
                          className="dropdown1__single"
                          onClick={() => this.controlOptions('general')}>
                          <div>
                            <h4>General</h4>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <Field
                  label={this.state.vehicle}
                  requiredStar="*"
                  name="truck_id"
                  iconDisplayNone={'label-group__addItemIcon--displayIcon'}
                  iconLink={
                    this.state.field_name === 'truck_id'
                      ? '#truckAddNewModal'
                      : '#trailerAddNewModal'
                  }
                  className={
                    this.state.general
                      ? 'expenseShowItem--hide'
                      : 'input-fields col s12 form__field form__field--column form__field--flex1 '
                  }
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  // value={this.state.vehicleChosen}
                  placeholder={`Choose ${this.state.vehicle}`}
                  options={this.state.vehicleOptions}
                />

                <Field
                  label="Category"
                  requiredStar="*"
                  name="category_expense_id"
                  iconDisplayNone={'label-group__addItemIcon--displayIcon'}
                  iconLink={'#categoryAddNewModal'}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Category"
                  options={categoryOptions}
                  onChange={this.controlOptionsSubCategory}
                />
                <Field
                  label="Sub-Category"
                  name="category_expense_type_id"
                  iconDisplayNone={'label-group__addItemIcon--displayIcon'}
                  iconLink={'#expenseTypeAddNew'}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  placeholder="Sub-Category"
                  options={this.state.subCategories}
                />
              </div>
              <div className="row form__row form__row--column">
                <Field
                  label="Date of Transaction"
                  name="date"
                  component={renderDateField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  validate={required}
                  dateField="truckExpenseDate"
                  onFocus={event =>
                    this.setState({ focused: event.target.name })
                  }
                />
                <Field
                  label="Amount"
                  name="amount"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  validate={[required, number, maxLength10]}
                />
                <Field
                  label="Description"
                  name="description"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="text"
                  validate={maxLength200}
                />
              </div>
            </section>
          </div>
          <div id="test2" className="col s12">
            <section className="form__section">
              <h1 className="form__title form__title--marginBottom">
                Vendor Information
              </h1>

              <Field
                label="Vendor"
                name="vendor_id"
                iconDisplayNone={'label-group__addItemIcon--displayIcon'}
                iconLink={'#vendorAddNewModal'}
                className="col s12 form__field form__field--column form__field--flex1"
                type="select"
                onBlur={() => input.onBlur(input.value)}
                component={RenderSelectFieldReactSelectClass}
                placeholder="Vendor"
                options={vendorOptions}
              />
            </section>
          </div>
          <div id="test3" className="col s12">
            <section className="form__section">
              <h1 className="form__title form__title--marginBottom">Alert</h1>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Alert (Days) from Transaction Date"
                  name="expense_alert_days"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  validate={[number, maxLength4]}
                />
                <Field
                  label="Alert on/off"
                  name="expense_alert"
                  iconDisplayNone={'label-group__addItemIcon--displayNone'}
                  iconLink={'#expenseTypeAddNew'}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="select"
                  defaultValue={alertOptions[0]}
                  placeholder="Inactive"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  options={alertOptions}
                />
              </div>
            </section>
          </div>
          <div id="test4" className="col s12">
            <section className="form__section">
              <h1 className="form__title form__title--marginBottom">
                Upload Attachments
              </h1>

              <div className="row form__row form__row--column">
                <div className="col s12 form__field form__field--column form__field--flex1">
                  <div className="file-field input-field">
                    <div className="btn form__modal-fileAttachment__uploadBox">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={this.handleFileChange}
                        name="expense"
                      />
                    </div>
                    <div className="file-path-wrapper">
                      <input
                        id="fileIdEditExpense"
                        className="file-path validate"
                        type="text"
                      />
                    </div>
                  </div>
                  {this.state.expenseFileName ? (
                    <div className="form__modal-fileAttachment">
                      <a
                        className="blob-url form__modal-fileAttachment--url"
                        href={URL.createObjectURL(this.state.expenseFile)}
                        target="_blank">
                        Preview Document
                      </a>
                      <h4
                        className="form__modal-fileAttachment--remove-link"
                        onClick={this.handleRemoveRateLink}>
                        Cancel Upload
                      </h4>
                    </div>
                  ) : null}
                </div>
                <div className="col s12 form__field form__field--column form__field--flex1">
                  {this.renderAttachments()}
                </div>
              </div>
            </section>
          </div>
        </form>

        <div className="modal-footer">
          <section className="details-button">
            <button
              className="waves-effect waves-green btn green left modal__saveButton--width100"
              type="submit"
              disabled={submitting}
              onClick={handleSubmit(this.onSubmit.bind(this))}>
              <i className="large material-icons">save</i>Save
            </button>
          </section>
        </div>

        <CategoryAddNewModal />
        <ExpenseTypeAddNewModal />
        <TruckAddNewModal />
        <TrailerAddNewModal />
        <VendorAddNewModal />
      </div>
    )
  }
}

const selector = formValueSelector('ExpenseEdit')
ExpenseEdit = reduxForm({
  form: 'ExpenseEdit',
  touchOnChange: true,
  touchOnBlur: true,
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: false,
  destroyOnUnmount: false
})(ExpenseEdit)

ExpenseEdit = connect(
  state => ({
    synchronousError: getFormSyncErrors('ExpenseEdit')(state),
    alertDays: selector(state, 'expense_alert_days'),
    expenseValues: selector(
      state,
      'truck_id',
      'category_expense_id',
      'category_expense_type_id',
      'date',
      'amount',
      'description'
    ),
    company: state.company,
    trucks: state.trucks,
    trailers: state.trailers,
    expense: state.expense,
    vendors: state.vendors,
    settings: state.settings,
    initialValues: {
      ...state.expense.selectedExpenseRecord,
      truck_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.truck
          ? {
              value: state.expense.selectedExpenseRecord.truck.id,
              label: state.expense.selectedExpenseRecord.truck.truck_reference
            }
          : state.expense.selectedExpenseRecord.trailer
            ? {
                value: state.expense.selectedExpenseRecord.trailer.id,
                label:
                  state.expense.selectedExpenseRecord.trailer.trailer_reference
              }
            : null,
      category_expense_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expenseCategory
          ? {
              value: state.expense.selectedExpenseRecord.expenseCategory.id,
              label: state.expense.selectedExpenseRecord.expenseCategory.label
            }
          : null,
      category_expense_type_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expenseType
          ? {
              value: state.expense.selectedExpenseRecord.expenseType.id,
              label: `${state.expense.selectedExpenseRecord.expenseType.label}`
            }
          : null,
      vendor_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.vendor
          ? {
              value: state.expense.selectedExpenseRecord.vendor.id,
              label: state.expense.selectedExpenseRecord.vendor.vendor_name
            }
          : null,
      expense_alert:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expense_alert === 0
          ? { value: 0, label: 'Inactive' }
          : { value: 1, label: 'Active' }
    },
    touchOnChange: true,
    touchOnBlur: true,
    initialized: true,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: false,
    destroyOnUnmount: false
  }),
  {
    fetchVendors,
    fetchTrucks,
    fetchTrailers,
    fetchExpenseTypes,
    fetchCategoryExpenses,
    updateExpenseRecord,
    uploadAwsFile,
    deleteAwsFile,
    fetchRequest,
    fetchComplete
  }
)(ExpenseEdit)

export default ExpenseEdit
