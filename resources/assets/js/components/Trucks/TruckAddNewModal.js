import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
import { createTruck } from '../../actions/truck/createTruck.js'

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

class TruckAddNewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: '',
      date: ''
    }
  }
  // componentWillMount() {
  //   this.props.fetchProfile();
  // }
  componentDidMount() {
    let elemsTruckAddNew = document.querySelectorAll('select')
    let instancesTruckAddNew = M.FormSelect.init(elemsTruckAddNew)

    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)

    let truckDate = document.querySelectorAll('.truckDate')
    let truckDateInstance = M.Datepicker.init(truckDate, {
      onSelect: this.handleDate,
      autoClose: true
    })
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.trucks.expenseRecords !== this.props.trucks.expenseRecords) {
    //   //Instance for MaterializeCSS
    //   console.log("compoentupdated inside Truck Add New !")
    //
    // }
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change('truck_date_aquired', date)
  }

  handleLicenseExp = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change('driver_license_expiration', date)
  }

  onSubmit(values) {
    let newValues = _.mapValues(values, function(val) {
      if (typeof val === 'string') {
        return val.toLowerCase().trim()
      }
      if (_.isInteger(val)) {
        return val
      }
    })

    let id = this.props.company.id
    this.props.createTruck(id, newValues, () => {
      document.getElementById('close-modal-newTruck').click()
      this.props.reset()
    })
    M.toast({
      html: `New Truck ***  ${values.truck_reference
        .toUpperCase()
        .trim()} ***  added !`,
      classes: 'materialize__toastSuccess'
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <div
        id="truckAddNewModal"
        className="modal load-modal load-modal--noPadding">
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="form__sectionContainer form__sectionContainer--noMargin form__sectionContainer--modal">
                <section className="form__group">
                  <a
                    href="#!"
                    id="close-modal-newTruck"
                    className="modal-close waves-effect waves-green btn grey darken-4 right">
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Add Truck</h1>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Reference"
                      name="truck_reference"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={[required, maxLength50]}
                      placeholder="testing"
                    />

                    <Field
                      label="Date Aquired"
                      name="truck_date_aquired"
                      component={renderDateField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      dateField="truckDate"
                    />

                    <Field
                      label="Initial Odometer"
                      name="truck_initial_odometer"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={onlyInteger}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="Year"
                      name="truck_year"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={[onlyInteger, maxLength4, minLength4]}
                    />
                    <Field
                      label="Manufacturer"
                      name="truck_manufacturer"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength100}
                    />
                    <Field
                      label="Model"
                      name="truck_model"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength50}
                    />
                  </div>
                  <div className="row form__row form__row--column">
                    <Field
                      label="License"
                      name="truck_license"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength10}
                    />
                    <Field
                      label="Vin"
                      name="truck_vin"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      validate={maxLength20}
                    />
                  </div>
                  <div className="form__saveContainer">
                    <div className="form__buttonContainer">
                      <button
                        className="btn-floating btn-large green right"
                        type="submit"
                        disabled={submitting}>
                        {' '}
                        <i className="large material-icons">save</i>Save
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Add Truck
                      </h4>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStatetoProps(state) {
  return {
    company: state.company,
    settings: state.settings
  }
}

export default reduxForm({
  form: 'TruckAddNewModal'
})(
  connect(
    mapStatetoProps,
    { createTruck }
  )(TruckAddNewModal)
)
