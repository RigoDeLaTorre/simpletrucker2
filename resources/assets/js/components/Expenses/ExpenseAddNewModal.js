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
  createExpenseRecord,
  createExpenseRecordAws,
  fetchExpenseRecords
} from '../../actions/expense'
import { uploadAwsFile } from '../../actions/aws'

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

class ExpenseAddNewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    this.updateMaterialize()
  }

  componentDidUpdate(prevProps, prevState) {
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

  updateMaterialize() {
    let elemTabs = document.querySelectorAll('.tabs')
    var elemTabsInstance = M.Tabs.init(elemTabs)

    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    let expenseAddNewDate = document.querySelectorAll('.expenseAddNewDate')
    let expenseAddNewInstance = M.Datepicker.init(expenseAddNewDate, {
      container: 'body',
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

  onSubmit = values => {
    let formErrors = this.renderErrors()
    if (
      _.isEmpty(this.props.synchronousError) &&
      formErrors.expenseerror === false &&
      formErrors.alerterror === false
    ) {
      let newValues = submitValidationExpense(values, this.state.field_name)
      if (this.state.expenseFile) {
        this.props.createExpenseRecordAws(newValues, fieldName => {
          this.props.uploadAwsFile(
            this.state.expenseFile,
            'expense',
            fieldName,
            () => {
              document.getElementById('close-modal-addNewExpense').click()
              this.props.fetchExpenseRecords()
              this.props.reset()
              // this.handleRemoveRateLink()
              M.toast({
                html: 'Expense Record updated !',
                classes: 'materialize__toastSuccess'
              })
            }
          )
        })
      } else {
        this.props.createExpenseRecord(newValues, () => {
          document.getElementById('close-modal-addNewExpense').click()
          this.props.reset()
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
    console.log('aaaaaaaaaaaa', val)
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
      this.setState({
        general: true,
        field_name: 'general_expense_id',
        open: false
      })

      this.props.change('truck_id', null)
    }
  }

  controlOptionsSubCategory = event => {
    console.log('controloptions event ', event)
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
  // shouldComponentUpdate(nextProps) {
  //   const differentTitle =
  //     this.props.trailers.trailers.length !== nextProps.trailers.trailers.length
  //   const differentDone =
  //     this.props.trucks.trucks.length !== nextProps.trucks.trucks.length
  //   return differentTitle || differentDone
  // }
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

  checkValidateVehicleType = () => {
    if (this.state.general === true) {
      return required
    } else {
      return undefined
    }
  }

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      }
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
      <div
        id="expenseAddNewModal"
        className="modal modal-fixed-footer load-modal">
        <div
          className={
            this.props.settings &&
            this.props.settings.settings &&
            this.props.settings.settings.theme_option_id == 12
              ? 'modal-content modal-content--themeLight'
              : 'modal-content'
          }>
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
                            : 'Truck'}{' '}
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
                    validate={required}
                    dateField="expenseAddNewDate"
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
          </form>
        </div>
        <div className="modal-footer">
          <section className="details-button">
            <a
              href="#!"
              id="close-modal-addNewExpense"
              className="modal-close waves-effect waves-red btn red darken-4 left">
              cancel<i className="material-icons right">cancel</i>
            </a>
            <button
              className="btn waves-effect waves-green green right btnWithIconFlex"
              type="submit"
              disabled={submitting}
              onClick={handleSubmit(this.onSubmit.bind(this))}>
              {' '}
              <i className="large material-icons material-icons--marginRight">
                save
              </i>
              Save
            </button>
          </section>
        </div>
      </div>
    )
  }
}

const selector = formValueSelector('ExpenseAddNewModal')

ExpenseAddNewModal = reduxForm({
  form: 'ExpenseAddNewModal',
  touchOnChange: true,
  touchOnBlur: true,
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: false,
  destroyOnUnmount: false
})(ExpenseAddNewModal)

// You have to connect() to any reducers that you wish to connect to yourself
ExpenseAddNewModal = connect(
  state => ({
    synchronousError: getFormSyncErrors('ExpenseAddNewModal')(state),
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
    createExpenseRecord,
    createExpenseRecordAws,
    uploadAwsFile,
    fetchExpenseRecords
  } // bind account loading action creator
)(ExpenseAddNewModal)

export default ExpenseAddNewModal
