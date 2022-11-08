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

import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState,
  renderSelectFieldReactSelect
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
  customStylesThemeLight,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from '../common'

import {
  fetchExpenseTypes,
  fetchCategoryExpenses,
  fetchExpenseRecords,
  createExpenseRecord,
  createExpenseRecordAws
} from '../../actions/expense'
import { uploadAwsFile } from '../../actions/aws'
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

import TruckAddNewModal from '../Trucks/TruckAddNewModal'
import TrailerAddNewModal from '../Trailer/TrailerAddNewModal'
import CategoryAddNewModal from '../CategoryExpense/CategoryAddNewModal'
import ExpenseTypeAddNewModal from '../CategoryExpenseTypes/ExpenseTypeAddNewModal'
import VendorAddNewModal from '../Vendors/VendorAddNewModal'

class ExpenseAddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: '',
      tab: 'expense',
      date: '',
      vehicle: 'truck',
      vehicleOptions: this.props.trucks.trucks.map(item => ({
        value: item.id,
        label: item.truck_reference
      })),
      field_name: 'truck_id',
      vehicleChosen: '',
      general: false,
      category_id: 0,
      subCategories: [],
      open: false
    }
  }

  componentDidMount() {
    // document.addEventListener('mousedown', this.handleClickOutside)
    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)

    this.props.fetchTrucks()
    this.props.fetchTrailers()
    this.props.fetchExpenseRecords()
    this.props.fetchCategoryExpenses()
    this.props.fetchExpenseTypes()
    this.props.fetchVendors()

    this.updateMaterialize()
  }
  // componentWillUnmount() {
  //   document.removeEventListener('mousedown', this.handleClickOutside)
  // }
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

    if (prevProps.expense.expenseTypes != this.props.expense.expenseTypes) {
      this.setStateSubCategories()
    }
  }

  // handleClickOutside = event => {
  //   if (
  //     this.containerexpensetype &&
  //     !this.containerexpensetype.contains(event.target)
  //   ) {
  //     this.setState({
  //       open: false
  //     })
  //   }
  // }

  updateMaterialize = () => {
    let elemTabs = document.querySelectorAll('.tabs')
    var elemTabsInstance = M.Tabs.init(elemTabs)

    let modal = document.querySelectorAll('.modal')
    let modalInstance = M.Modal.init(modal)

    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
    let expenseAddNewDate = document.querySelectorAll('.expenseAddNewDate')
    let expenseAddNewInstance = M.Datepicker.init(expenseAddNewDate, {
      onSelect: this.handleDate,
      autoClose: true
    })
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change('date', date)
  }

  onSubmit = values => {
    let newValues = submitValidationExpense(values, this.state.field_name)
    if (this.state.expenseFile) {
      this.props.createExpenseRecordAws(newValues, fieldName => {
        this.props.uploadAwsFile(
          this.state.expenseFile,
          'expense',
          fieldName,
          () => {
            this.props.history.push('/expense/expenseList')
            M.toast({
              html: 'Expense Record added !',
              classes: 'materialize__toastSuccess'
            })
          }
        )
      })
    } else {
      this.props.createExpenseRecord(newValues, () => {
        this.props.history.push('/expense/expenseList')
      })
      M.toast({
        html: 'Expense Record added !',
        classes: 'materialize__toastSuccess'
      })
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

  handleRemoveRateLink = () => {
    let uploadLink = document.getElementById('file-id')
    uploadLink.value = ''
    uploadLink.classList.remove('valid')

    this.setState({
      expenseFile: null,
      expenseFileName: null
    })
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
    const expenseOptions = this.props.expense.expenseTypes
      .filter(item => item.category_expense_id == this.state.category_id)
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

    return (
      <div id="expenseAddNew" className="app-container">
        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack active"
              href="#test1"
              onClick={() => this.setState({ tab: 'expense' })}>
              Expense
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack"
              href="#test2"
              onClick={() => this.setState({ tab: 'vendor' })}>
              Vendor
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack"
              href="#test3"
              onClick={() => this.setState({ tab: 'alert' })}>
              Alert
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack"
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
              <h1 className="form__title">Expense Information</h1>
              <h4 className="form__subTitleRequired">
                <span className="form__subTitleRequired--asterick">*</span>{' '}
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
                  label="Date"
                  requiredStar="*"
                  name="date"
                  component={renderDateField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  dateField="expenseAddNewDate"
                  validate={required}
                />

                <Field
                  label="Amount"
                  requiredStar="*"
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
                Upload Attachment
              </h1>
              <div className="col s12 form__field form__field--column form__field--flex2">
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
                      id="file-id"
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
            </section>
          </div>
          <div className="fixed-action-btn">
            <button
              className="btn-floating btn-large green"
              type="submit"
              disabled={submitting}
              onClick={handleSubmit(this.onSubmit.bind(this))}>
              <i className="large material-icons">save</i>
            </button>
            <ul>
              <li>
                <Link to="/expense/expenseList" className="btn-floating red">
                  <i className="material-icons">cancel</i>
                </Link>
              </li>
            </ul>
            <h4 className="fixed-action-btn__title save">Add Expense</h4>
          </div>
        </form>
        {/*
        <div className="modal-footer">
          <section className="details-button">
            <button
              className="waves-effect waves-green btn green left modal__saveButton--width100"
              type="submit"
              disabled={submitting}
              onClick={handleSubmit(this.onSubmit.bind(this))}
            >
              <i className="large material-icons">save</i>Add New Expense
            </button>
          </section>
        </div>
*/}
        <CategoryAddNewModal />
        <ExpenseTypeAddNewModal />
        <TruckAddNewModal />
        <TrailerAddNewModal />
        <VendorAddNewModal />
      </div>
    )
  }
}
const selector = formValueSelector('ExpenseAddNew')

ExpenseAddNew = reduxForm({
  form: 'ExpenseAddNew',
  touchOnChange: true,
  touchOnBlur: true,
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: false,
  destroyOnUnmount: false
})(ExpenseAddNew)

// You have to connect() to any reducers that you wish to connect to yourself
ExpenseAddNew = connect(
  state => ({
    synchronousError: getFormSyncErrors('ExpenseAddNew')(state),
    company: state.company,
    trucks: state.trucks,
    trailers: state.trailers,
    expense: state.expense,
    vendors: state.vendors,
    settings: state.settings,
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
    touchOnChange: true,
    touchOnBlur: true,
    initialized: true,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: false,
    destroyOnUnmount: false
  }),
  {
    fetchExpenseTypes,
    createExpenseRecord,
    createExpenseRecordAws,
    uploadAwsFile,
    fetchExpenseRecords,
    fetchCategoryExpenses,
    fetchTrucks,
    fetchTrailers,
    fetchVendors
  } // bind account loading action creator
)(ExpenseAddNew)

export default ExpenseAddNew
