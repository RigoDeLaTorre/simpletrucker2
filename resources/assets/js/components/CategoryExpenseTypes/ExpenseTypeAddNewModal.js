import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  normalizeZip
} from '../forms/validation/normalizeForm'
import { Field, FieldArray, formValueSelector, reduxForm } from 'redux-form'
import {
  fetchExpenseTypes,
  createExpenseType,
  fetchCategoryExpenses
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

import CategoryAddNewModal from '../CategoryExpense/CategoryAddNewModal'

class ExpenseTypeAddNewModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: '',
      date: ''
    }
  }

  componentDidMount() {
    this.props.fetchExpenseTypes()
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
    let newValues = {
      label: values.label.trim(),
      category_expense_id: values.category_expense_id.value
    }

    let id = this.props.company.id
    this.props.createExpenseType(id, newValues, () => {
      document.getElementById('close-modal-expenseTypeAddNew').click()
      this.props.reset()
    })
    M.toast({
      html: `Expense Item ***  ${values.label
        .toUpperCase()
        .trim()} ***  added !`,
      classes: 'materialize__toastSuccess'
    })
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return (
      <div
        id="expenseTypeAddNew"
        className="modal load-modal load-modal--noPadding overflowAutoSubCategory">
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <div className="form__sectionContainer form__sectionContainer--modal">
                <section className="form__group">
                  <a
                    href="#!"
                    id="close-modal-expenseTypeAddNew"
                    className="modal-close waves-effect waves-green btn grey darken-4 right form__closeButton">
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Add New Sub-Category</h1>
                  <div className="row form__row form__row--marginBottom">
                    <Field
                      label="Category"
                      name="category_expense_id"
                      iconLink="#categoryAddNewModal"
                      iconDisplayNone="label-group__addItemIcon--displayIcon"
                      className="col s12 form__field form__field--column form__field--minWidth300 form__field--flex1"
                      type="select"
                      onBlur={() => input.onBlur(input.value)}
                      component={RenderSelectFieldReactSelectClass}
                      validate={required}
                      placeholder="Choose Category"
                      options={this.props.expense.categories.map(item => ({
                        value: item.id,
                        label: item.label
                      }))}
                    />
                  </div>
                  <div className="row form__row">
                    <Field
                      label="Sub-Category"
                      name="label"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--minWidth300 form__field--flex1"
                      type="text"
                      validate={[required, maxLength50]}
                      placeholder="Sub-Category"
                    />
                  </div>
                  <div className="form__saveContainer">
                    <div className="form__buttonContainer">
                      <button
                        className="btn-floating btn-flat btn-large green right btn-floating--zeroIndex"
                        type="submit"
                        disabled={submitting}>
                        {' '}
                        <i className="large material-icons">save</i>
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Add Sub-Category
                      </h4>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </div>
        <CategoryAddNewModal />
      </div>
    )
  }
}

function mapStatetoProps(state) {
  return {
    company: state.company,
    expense: state.expense,
    settings: state.settings
  }
}

export default reduxForm({
  form: 'ExpenseTypeAddNew'
})(
  connect(
    mapStatetoProps,
    { fetchExpenseTypes, createExpenseType, fetchCategoryExpenses }
  )(ExpenseTypeAddNewModal)
)
