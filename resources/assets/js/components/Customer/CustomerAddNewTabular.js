import React, { Component } from 'react'
import _ from 'lodash'
import LoadingComponent from '../LoadingComponent'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Field,
  FieldArray,
  formValues,
  formValueSelector,
  reduxForm,
  registerField,
  getFormSyncErrors,
  getFormSubmitErrors
} from 'redux-form'
import {
  renderField,
  renderTextArea,
  stateOptions,
  renderSelectFieldReactSelect
} from '../forms'
import RenderSelectFieldReactSelectClass from '../forms/RenderSelectFieldReactSelectClass'

import {
  processTypes,
  processTypesNoQuickPay,
  processTypesNoFactor,
  normalizePhone,
  normalizeZip,
  normalizeQuickpay,
  submitValidationCustomer,
  required,
  maxLength,
  maxLength10,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  minLengthPhone,
  number
} from '../forms/validation'
import { createCustomer } from '../../actions/customer/createCustomer.js'

const { updateSyncErrors } = require('redux-form/lib/actions').default
class CustomerAddNewTabular extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'profile'
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    // materialize select dropdown

    let elemTabs = document.querySelectorAll('.tabs')
    var elemTabsInstance = M.Tabs.init(elemTabs)

    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
    // materialize action button
    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)
    // this.registerAllFields()
  }
  registerAllFields = () => {
    let fields = [
      'customer_bill_name',
      'customer_bill_address',
      'customer_bill_city',
      'customer_bill_state',
      'customer_bill_zip',
      'customer_bill_phone',
      'customer_bill_fax',
      'customer_bill_email',
      'quickpay_email',
      'quickpay_phone',
      'quickpay_fax',
      'quickpay_charge',
      'quickpay_notes'
    ]

    for (let field of fields) {
      this.props.dispatch(registerField('CustomerNew', field, 'Field'))
    }
    // this.props.touch(...Object.keys({ customer_bill_name: 'required' }))
    setTimeout(
      () =>
        this.props.dispatch(
          updateSyncErrors('CustomerNew', {
            customer_bill_name: 'Some Error Message'
          })
        ),
      0
    )
  }

  processTypeFields = () => {
    if (this.props.company.factory_company_name) {
      // IF COMPANY HAS A FACTORY COMPANY

      return processTypes.map(processType => {
        return { value: processType.value, label: processType.label }
      })
    } else {
      return processTypesNoFactor.map(processType => {
        return { value: processType.value, label: processType.label }
      })
    }
  }

  // copies customer fields to customer bill fields
  copyFields = () => {
    const {
      customer_name,
      customer_address,
      customer_city,
      customer_state,
      customer_zip,
      customer_phone,
      customer_fax,
      customer_email
    } = this.props.companyProfileValues

    let customerBillNames = [
      'customer_bill_name',
      'customer_bill_address',
      'customer_bill_city',
      'customer_bill_state',
      'customer_bill_zip',
      'customer_bill_phone',
      'customer_bill_fax',
      'customer_bill_email'
    ]
    let customerNames = [
      customer_name,
      customer_address,
      customer_city,
      customer_state,
      customer_zip,
      customer_phone,
      customer_fax,
      customer_email
    ]

    for (let i in customerNames) {
      if (customerNames[i] != undefined) {
        if (typeof customerNames[i] === 'object') {
          this.props.change(customerBillNames[i], customerNames[i])
        } else {
          this.props.change(customerBillNames[i], customerNames[i])
          // let newLabel = document.querySelectorAll(
          //   `label.${customerBillNames[i]}`
          // )
          // console.log("labells", newLabel)
          // newLabel[0].classList.add('active')
        }
      }
    }

    // let toastHTML = updatedList.map(
    //   item => `<span className="toastDiv">${item}</span> <br />`
    // );

    setTimeout(function() {
      let elems = document.querySelectorAll('select')
      let instances = M.FormSelect.init(elems)
      M.toast({
        html: 'Copied'
      })
    }, 0)
  }

  validateQuickPay = () => {
    if (
      (this.props.processTypeValue &&
        this.props.processTypeValue.value == 'quickpay') ||
      this.props.quickpayEmailValue ||
      this.props.quickpayChargeValue
    ) {
      return required
    } else {
      return undefined
    }
  }

  // Before data is inserted, lowercase/trim/ takes hyphens out of phone number/fax.

  onSubmit = values => {
    let formErrors = this.renderErrors()

    if (
      _.isEmpty(this.props.synchronousError) &&
      formErrors.billerror === false &&
      formErrors.quickpayerror === false &&
      formErrors.customererror === false
    ) {
      // this function is in the folder forms/ validation
      let newValues = submitValidationCustomer(values)
      let id = this.props.company.id

      this.props.createCustomer(id, newValues, () => {
        this.props.history.push('/customers/search')
      })
      M.toast({
        html: `New customer ***  ${newValues.customer_name.toUpperCase()} ***  added !`,
        classes: 'materialize__toastSuccess'
      })
    } else {
      alert(formErrors.messageError)
    }
  }

  renderErrors = () => {
    const errors = this.props.synchronousError
    let billerror = false
    let quickpayerror = false
    let customererror = false

    if (this.state.tab === 'profile') {
      if (
        errors.customer_name === undefined &&
        errors.customer_address === undefined &&
        errors.customer_city === undefined &&
        errors.customer_state === undefined &&
        errors.customer_zip === undefined &&
        errors.customer_phone === undefined &&
        errors.customer_fax === undefined &&
        errors.customer_email === undefined
      ) {
        customererror = false
        if (
          errors.customer_bill_name !== undefined ||
          errors.customer_bill_address !== undefined ||
          errors.customer_bill_city !== undefined ||
          errors.customer_bill_state !== undefined ||
          errors.customer_bill_zip !== undefined ||
          errors.customer_bill_phone !== undefined ||
          errors.customer_bill_fax !== undefined ||
          errors.customer_bill_email !== undefined ||
          errors.process_type !== undefined ||
          this.props.customerBillName === undefined ||
          this.props.customerBillPhone === undefined ||
          this.props.processTypeValue === undefined
        ) {
          billerror = true
        }

        if (
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue == '') ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue === null) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue === undefined) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue == '') ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue === null) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue === undefined)
        ) {
          quickpayerror = true
        }
        if (
          this.props.processTypeValue &&
          this.props.processTypeValue.value === 'quickpay' &&
          !this.props.quickpayEmailValue &&
          !this.props.quickpayChargeValue
        ) {
          quickpayerror = true
        }
        if (
          this.props.processTypeValue &&
          this.props.processTypeValue.value !== 'quickpay'
        ) {
          quickpayerror = false
        }
      }
    } else if (this.state.tab === 'billing') {
      const companyProfileCheckValues = this.props.companyProfileCheckValues
      let result =
        companyProfileCheckValues.hasOwnProperty('customer_name') &&
        companyProfileCheckValues.hasOwnProperty('customer_phone')

      if (
        errors.customer_name !== undefined ||
        errors.customer_address !== undefined ||
        errors.customer_city !== undefined ||
        errors.customer_state !== undefined ||
        errors.customer_zip !== undefined ||
        errors.customer_phone !== undefined ||
        errors.customer_fax !== undefined ||
        errors.customer_email !== undefined ||
        !result
      ) {
        customererror = true
      }

      if (
        errors.quickpay_email !== undefined ||
        errors.quickpay_fax !== undefined ||
        errors.quickpay_phone !== undefined ||
        errors.quickpay_charge !== undefined ||
        errors.quickpay_notes !== undefined
      ) {
        quickpayerror = true
      }
      if (
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayEmailValue == '') ||
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayEmailValue === null) ||
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayEmailValue === undefined) ||
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayChargeValue == '') ||
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayChargeValue === null) ||
        (this.props.processTypeValue.value === 'quickpay' &&
          this.props.quickpayChargeValue === undefined)
      ) {
        quickpayerror = true
      }
      if (this.props.processTypeValue.value !== 'quickpay') {
        quickpayerror = false
      }
    } else if (this.state.tab === 'quickpay') {
      const companyProfileCheckValues = this.props.companyProfileCheckValues
      let result =
        companyProfileCheckValues.hasOwnProperty('customer_name') &&
        companyProfileCheckValues.hasOwnProperty('customer_phone')

      if (
        errors.quickpay_email === undefined &&
        errors.quickpay_fax === undefined &&
        errors.quickpay_phone === undefined &&
        errors.quickpay_charge === undefined &&
        errors.quickpay_notes === undefined
      ) {
        quickpayerror = false
        if (
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue == '') ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue === null) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayEmailValue === undefined) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue == '') ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue === null) ||
          (this.props.processTypeValue &&
            this.props.processTypeValue.value === 'quickpay' &&
            this.props.quickpayChargeValue === undefined)
        ) {
          quickpayerror = true
        }
        if (
          this.props.processTypeValue &&
          this.props.processTypeValue.value !== 'quickpay'
        ) {
          quickpayerror = false
        }
        if (
          errors.customer_name !== undefined ||
          errors.customer_address !== undefined ||
          errors.customer_city !== undefined ||
          errors.customer_state !== undefined ||
          errors.customer_zip !== undefined ||
          errors.customer_phone !== undefined ||
          errors.customer_fax !== undefined ||
          errors.customer_email !== undefined ||
          !result
        ) {
          customererror = true
        }
        if (
          errors.customer_bill_name !== undefined ||
          errors.customer_bill_address !== undefined ||
          errors.customer_bill_city !== undefined ||
          errors.customer_bill_state !== undefined ||
          errors.customer_bill_zip !== undefined ||
          errors.customer_bill_phone !== undefined ||
          errors.customer_bill_fax !== undefined ||
          errors.customer_bill_email !== undefined ||
          errors.process_type !== undefined
        ) {
          billerror = true
        }
        if (this.props.processTypeValue === undefined) {
          billerror = true
        }
      }
    }

    return {
      billerror,
      quickpayerror,
      customererror,
      messageError:
        customererror && billerror && quickpayerror
          ? 'Please fill required fields in Profile,Billing & Quickpay Tab'
          : customererror && billerror
            ? 'Please fill required fields in Profile & Billing Tab'
            : customererror && quickpayerror
              ? 'Please fill required fields in Profile and Quickpay tab'
              : billerror && quickpayerror
                ? 'Please fill required fields in Billing and Quickpay tab'
                : customererror
                  ? 'Please fill required fields in Profile Tab'
                  : billerror
                    ? 'Please fill required fields in Billing Tab'
                    : 'Please fill required fileds in Quickpay Tab'
    }
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <section id="customer-add-new" className="app-container">
        <LoadingComponent loadingText="Add New Customer" />

        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack active"
              href="#test1"
              onClick={() => this.setState({ tab: 'profile' })}>
              Profile
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack"
              href="#test2"
              onClick={() => this.setState({ tab: 'billing' })}>
              Billing
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a
              className="theme__text--whitetoblack"
              href="#test3"
              onClick={() => this.setState({ tab: 'quickpay' })}>
              QuickPay
            </a>
          </li>
        </ul>

        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div id="test1" className="col s12">
            <section className="form__section">
              <div className="form__copyButton" onClick={this.copyFields}>
                {' '}
                Copy Fields To Accounting
                <i className="material-icons arrow-copy">arrow_forward</i>
              </div>
              <h1 className="form__title">Customer Profile</h1>
              <h2 className="form__subTitle">Office Location</h2>
              <h4 className="form__subTitleRequired">
                <span className="form__subTitleRequired--asterick">*</span>{' '}
                Required Fields
              </h4>
              <div className="row">
                <Field
                  label="Customer Name"
                  requiredStar="*"
                  name="customer_name"
                  component={renderField}
                  className="col s12"
                  type="text"
                  validate={[required, maxLength200]}
                />
              </div>
              <div className="row">
                <Field
                  label="Address"
                  name="customer_address"
                  component={renderField}
                  className="col s12"
                  type="text"
                  validate={maxLength100}
                />
              </div>
              <div className="row form__row form__row--column">
                <Field
                  label="City"
                  name="customer_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="text"
                  validate={maxLength50}
                />

                <Field
                  label="State"
                  name="customer_state"
                  className="col s12 form__field form__field--column form__field--flex2"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  placeholder="State"
                  options={stateOptions.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />

                <Field
                  label="ZipCode"
                  name="customer_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeZip}
                  validate={[minLength5, maxLength10]}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Phone"
                  requiredStar="*"
                  name="customer_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={[required, minLengthPhone]}
                />
                <Field
                  label="Fax"
                  name="customer_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Email"
                  name="customer_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="email"
                />
              </div>
            </section>
          </div>
          <div id="test2" className="col s12">
            <section className="form__section">
              <h1 className="form__title">Accounting</h1>
              <h2 className="form__subTitle">Billing Information</h2>
              <h4 className="form__subTitleRequired">
                <span className="form__subTitleRequired--asterick">*</span>{' '}
                Required Fields
              </h4>
              <div className="row">
                <Field
                  label="Company Name"
                  requiredStar="*"
                  name="customer_bill_name"
                  component={renderField}
                  className="col s12"
                  labelClass="customer_bill_name"
                  type="text"
                  validate={[required, maxLength200]}
                />
              </div>
              <div className="row">
                <Field
                  label="Address"
                  name="customer_bill_address"
                  component={renderField}
                  className="col s12"
                  labelClass="customer_bill_address"
                  type="text"
                  validate={maxLength100}
                />
              </div>
              <div className="row form__row form__row--column">
                <Field
                  label="City"
                  name="customer_bill_city"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  labelClass="customer_bill_city"
                  type="text"
                  validate={maxLength50}
                />

                <Field
                  label="State"
                  name="customer_bill_state"
                  labelClass="customer_bill_state"
                  className="col s12 form__field form__field--column form__field--flex2"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  placeholder="State"
                  options={stateOptions.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
                <Field
                  label="ZipCode"
                  name="customer_bill_zip"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="customer_bill_zip"
                  type="text"
                  normalize={normalizeZip}
                  validate={(minLength5, maxLength10)}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Phone"
                  requiredStar="*"
                  name="customer_bill_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="customer_bill_phone"
                  type="text"
                  normalize={normalizePhone}
                  validate={[required, minLengthPhone]}
                />
                <Field
                  label="Fax"
                  name="customer_bill_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  labelClass="customer_bill_fax"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  label="Email"
                  name="customer_bill_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  labelClass="customer_bill_email"
                  type="email"
                />
                <Field
                  label="Process Type"
                  requiredStar="*"
                  name="process_type"
                  className="col s12 form__field form__field--column form__field--flex1"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Process Type"
                  options={this.processTypeFields()}
                />
              </div>
            </section>
          </div>
          <div id="test3" className="col s12">
            <section className="form__section form__section--quickpay">
              <h1 className="form__title">Quickpay</h1>
              <h2 className="form__subTitle">
                If Customer provides quickpay on loads
              </h2>
              <h4 className="form__subTitleRequired">
                <span className="form__subTitleRequired--asterick">*</span>{' '}
                Required Fields
              </h4>
              <div className="row form__row form__row--column">
                <Field
                  label="Email"
                  requiredStar="*"
                  name="quickpay_email"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex3"
                  type="email"
                />
                <Field
                  label="Phone"
                  name="quickpay_phone"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
                <Field
                  label="Fax"
                  name="quickpay_fax"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex2"
                  type="text"
                  normalize={normalizePhone}
                  validate={minLengthPhone}
                />
                <Field
                  label="Charge %"
                  requiredStar="*"
                  name="quickpay_charge"
                  component={renderField}
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  normalize={normalizeQuickpay}
                />
              </div>
              <div className="row load-textarea">
                <Field
                  label="QuickPay Notes"
                  name="quickpay_notes"
                  component={renderTextArea}
                  className="col s12"
                  type="textarea"
                />
              </div>
            </section>
          </div>
          <div className="fixed-action-btn">
            <button
              className="btn-floating btn-large green"
              type="submit"
              disabled={submitting}>
              <i className="large material-icons">save</i>
            </button>
            <ul>
              <li>
                <Link to="/customers/search" className="btn-floating red">
                  <i className="material-icons">cancel</i>
                </Link>
              </li>
            </ul>
            <h4 className="fixed-action-btn__title save">Save Customer</h4>
          </div>
        </form>

        {/*  <div className="add-load" onClick={this.handleSubmit}>
          <img src="./img/plus.svg" />
        </div> */}
      </section>
    )
  }
}

function mapStatetoProps(state) {
  const selector = formValueSelector('CustomerNew')
  return {
    synchronousError: getFormSyncErrors('CustomerNew')(state),
    company: state.company,
    customer: state.customers.customers,
    settings: state.settings,
    customerBillName: selector(state, 'customer_bill_name'),
    customerBillPhone: selector(state, 'customer_bill_phone'),
    processTypeValue: selector(state, 'process_type'),
    quickpayEmailValue: selector(state, 'quickpay_email'),
    quickpayChargeValue: selector(state, 'quickpay_charge'),
    companyProfileCheckValues: selector(
      state,
      'customer_name',
      'customer_phone'
    ),
    companyProfileValues: selector(
      state,
      'customer_name',
      'customer_address',
      'customer_city',
      'customer_state',
      'customer_zip',
      'customer_phone',
      'customer_fax',
      'customer_email'
    ),
    customerBillingState: selector(state, 'customer_bill_state')
  }
}

export default reduxForm({
  form: 'CustomerNew',
  touchOnChange: true,
  touchOnBlur: true,
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: false
  // destroyOnUnmount: false
})(
  connect(
    mapStatetoProps,
    { createCustomer }
  )(CustomerAddNewTabular)
)
