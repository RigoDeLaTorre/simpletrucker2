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
import { fetchExpenseTypes, createTruckList } from '../../actions/truck'

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

class TruckExpenseListAddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: '',
      date: ''
    }
  }

  componentDidMount() {
    this.props.fetchExpenseTypes()
    let elems = document.querySelectorAll('select')
    let instances = M.FormSelect.init(elems)

    let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    let actionButton = M.FloatingActionButton.init(actionButtonElement)
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
    this.props.createTruckList(id, newValues, () => {
      this.props.history.push('/trucks/expenseListView')
    })
    M.toast({
      html: `Expense Item ***  ${values.expense_type
        .toUpperCase()
        .trim()} ***  added !`,
      classes: 'materialize__toastSuccess'
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <section id="truck-add-new" className="app-container">
        <LoadingComponent loadingText="Add New Driver" />
        <h1 className="form__section-title">Truck Expense Type - Add New</h1>
        <div className="form__container">
          <form
            className="form"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <div className="form__sectionContainer">
              <section className="form__group">
                <h1 className="form__formTitle">Expense Type</h1>
                <div className="row form__row">
                  <Field
                    label="Expense Type"
                    name="expense_type"
                    component={renderField}
                    className="col s12 form__field"
                    type="text"
                    validate={[required, maxLength50]}
                    placeholder="testing"
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
                  <Link to="/drivers" className="btn-floating red">
                    <i className="material-icons">cancel</i>
                  </Link>
                </li>
              </ul>
              <h4 className="fixed-action-btn__title save">Save</h4>
            </div>
          </form>
        </div>
      </section>
    )
  }
}

function mapStatetoProps(state) {
  return {
    company: state.company
  }
}

export default reduxForm({
  form: 'TruckExpenseListAddNew'
})(
  connect(
    mapStatetoProps,
    { fetchExpenseTypes, createTruckList }
  )(TruckExpenseListAddNew)
)
