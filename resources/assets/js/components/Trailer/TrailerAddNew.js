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
import { createTrailer } from '../../actions/trailer/createTrailer.js'

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

class TrailerAddNew extends Component {
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
    window.scrollTo(0, 0)
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)

    let dateAquired = document.querySelectorAll('.dateAquired')
    let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      onSelect: this.handleDate,
      autoClose: true
    })
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(',')
    date = date[0]
    // changes value in redux form state
    this.props.change('trailer_date_aquired', date)
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
    this.props.createTrailer(id, newValues, () => {
      this.props.history.push('/trailers/trailerlist')
    })
    M.toast({
      html: `New Trailer ***  ${values.trailer_reference
        .toUpperCase()
        .trim()} ***  added !`,
      classes: 'materialize__toastSuccess'
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <section id="trailer-add-new" className="app-container">
        <div className="form__container">
          <form
            className="form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form__sectionContainer">
              <section className="form__group">
                <h1 className="form__formTitle">Add New Trailer</h1>
                <div className="row form__row form__row--column">
                  <Field
                    label="Reference"
                    name="trailer_reference"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex2"
                    type="text"
                    validate={[required, maxLength50]}
                    placeholder="testing"
                  />

                  <Field
                    label="Date Aquired"
                    name="trailer_date_aquired"
                    component={renderDateField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    dateField="dateAquired"
                  />
                  <Field
                    label="Year"
                    name="trailer_year"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={[onlyInteger, maxLength4, minLength4]}
                  />
                </div>
                <div className="row form__row form__row--column">
                  <Field
                    label="Manufacturer"
                    name="trailer_manufacturer"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={maxLength100}
                  />
                  <Field
                    label="Model"
                    name="trailer_model"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={maxLength50}
                  />
                </div>
                <div className="row form__row form__row--column">
                  <Field
                    label="License"
                    name="trailer_license"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={maxLength10}
                  />
                  <Field
                    label="Vin"
                    name="trailer_vin"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    validate={maxLength20}
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
                  <Link to="/trailers/trailerlist" className="btn-floating red">
                    <i className="material-icons">cancel</i>
                  </Link>
                </li>
              </ul>
              <h4 className="fixed-action-btn__title save">Save Trailer</h4>
            </div>
          </form>
        </div>
      </section>
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
  form: 'TrailerAddNew'
})(
  connect(
    mapStatetoProps,
    { createTrailer }
  )(TrailerAddNew)
)
