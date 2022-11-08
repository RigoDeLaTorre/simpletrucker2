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
  reduxForm
} from 'redux-form'
import {
  renderField,
  renderTextArea,
  stateOptions
} from '../forms'
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass"
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

class CustomerAddNew extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
    // materialize select dropdown
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)
    // materialize action button
    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)
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
          let newLabel = document.querySelectorAll(
            `label.${customerBillNames[i]}`
          )
          newLabel[0].classList.add('active')
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

  onSubmit(values) {
    let newValues = submitValidationCustomer(values)
    // this function is in the folder forms/ validation
    let id = this.props.company.id
    this.props.createCustomer(id, newValues, () => {
      this.props.history.push('/customers/search')
    })
    M.toast({
      html: `New customer ***  ${newValues.customer_name.toUpperCase()} ***  added !`
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <section id="customer-add-new" className="app-container">
        <LoadingComponent loadingText="Add New Customer" />
        <div className="customer-form-container">
          <form
            className="customer-form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="customer-form__sectionContainer">
              <section className="customer-form__section">
                <div
                  className="customer-form__copyButton"
                  onClick={this.copyFields}>
                  {' '}
                  Copy Fields To<i className="material-icons arrow-copy">
                    arrow_forward
                  </i>
                </div>
                <h1 className="customer-form__title">Customer Profile</h1>
                <h2 className="customer-form__subTitle">Office Location</h2>
                <div className="row">
                  <Field
                    label="Customer Name"
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
                    validate={[required, maxLength100]}
                  />
                </div>
                <div className="row form__row form__row--column">
                  <Field
                    label="City"
                    name="customer_city"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="text"
                    validate={[required, maxLength50]}
                  />

                  <Field
                    label="State"
                    name="customer_state"
                    className="col s12 form__field form__field--column form__field--flex2"
                    iconDisplayNone="label-group__addItemIcon--displayNone"
                    type="select"
                    onBlur={() => input.onBlur(input.value)}
                    component={RenderSelectFieldReactSelectClass}
                    validate={required}
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
                    validate={[required, minLength5, maxLength10]}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Phone"
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
                    validate={required}
                  />

                  <Field
                    label="Process Type"
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

              <section className="customer-form__section">
                <h1 className="customer-form__title">Accounting</h1>
                <h2 className="customer-form__subTitle">Billing Information</h2>
                <div className="row">
                  <Field
                    label="Company Name"
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
                    validate={[required, maxLength100]}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="City"
                    name="customer_bill_city"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    labelClass="customer_bill_city"
                    type="text"
                    validate={[required, maxLength50]}
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
                    validate={required}
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
                    validate={[required, minLength5, maxLength10]}
                  />
                </div>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Phone"
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
                <div className="row">
                  <Field
                    label="Email"
                    name="customer_bill_email"
                    component={renderField}
                    className="col s12"
                    labelClass="customer_bill_email"
                    type="email"
                    validate={required}
                  />
                </div>
              </section>

              <section className="customer-form__section customer-form__section--quickpay customer-form--lightBlue">
                <h1 className="customer-form__title">Quickpay</h1>
                <h2 className="customer-form__subTitle">
                  If Customer provides quickpay on loads
                </h2>
                <div className="row form__row form__row--column">
                  <Field
                    label="Email"
                    name="quickpay_email"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="email"
                    validate={this.validateQuickPay()}
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
                    name="quickpay_charge"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    normalize={normalizeQuickpay}
                    validate={this.validateQuickPay()}
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
        </div>

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
    company: state.company,
    customer: state.customers.customers,
    processTypeValue: selector(state, 'process_type'),
    quickpayEmailValue: selector(state, 'quickpay_email'),
    quickpayChargeValue: selector(state, 'quickpay_charge'),
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
  touchOnChange: true
})(
  connect(
    mapStatetoProps,
    { createCustomer }
  )(CustomerAddNew)
)
