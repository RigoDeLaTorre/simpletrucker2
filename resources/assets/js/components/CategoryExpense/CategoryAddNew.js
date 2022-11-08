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
import {
  fetchCategoryExpenses,
  createCategoryExpense
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

class CategoryAddNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: '',
      date: ''
    }
  }

  componentDidMount() {
    // this.props.fetchCategoryExpenses()
    // let elems = document.querySelectorAll('select')
    // let instances = M.FormSelect.init(elems)
    //
    // let actionButtonElement = document.querySelectorAll('.fixed-action-btn')
    // let actionButton = M.FloatingActionButton.init(actionButtonElement)
    //
    // setTimeout(() => {
    //   let modal = document.querySelectorAll('.modal')
    //   let modalInstance = M.Modal.init(modal)
    // }, 0)
  }

  onSubmit(values) {
    let newValues = { label: values.label.trim() }
    let id = this.props.company.id

    this.props.createCategoryExpense(id, newValues, () => {
      this.props.history.push('/category/categoryExpenseList')
      M.toast({
        html: `Category ***  ${newValues.label
          .toUpperCase()
          .trim()} ***  added !`,
        classes: 'materialize__toastSuccess'
      })
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <div id="categoryAddNew" className="app-container">
        <div className="modal-content">
          <div className="form__container">
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="form__sectionContainer form__sectionContainer--noMargin">
                <section className="form__group form__group--fillContainer">
                  <h1 className="form__formTitle">Add New Category</h1>
                  <div className="row form__row">
                    <Field
                      label="Category"
                      name="label"
                      component={renderField}
                      className="col s12 form__field"
                      type="text"
                      validate={[required, maxLength50]}
                      placeholder="testing"
                    />
                  </div>
                  <div className="form__saveContainer">
                    <div className="form__buttonContainer">
                      <button
                        className="btn-floating btn-large green right"
                        type="submit"
                        disabled={submitting}>
                        {' '}
                        <i className="large material-icons">save</i>
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Add Category
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
  form: 'CategoryAddNewModal'
})(
  connect(
    mapStatetoProps,
    { fetchCategoryExpenses, createCategoryExpense }
  )(CategoryAddNew)
)
