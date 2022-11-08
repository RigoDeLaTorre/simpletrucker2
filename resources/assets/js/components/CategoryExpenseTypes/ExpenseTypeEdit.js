import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState,
  renderSelectFieldReactSelect
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from "../forms/validation/normalizeForm";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import { updateExpenseType, deleteExpenseType } from "../../actions/expense";

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
} from "../forms/validation/fieldValidations";

class ExpenseTypeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: "",
      date: ""
    };
  }

  componentDidMount() {
    this.updateMaterialize();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.expense.selectedExpenseType !==
      this.props.expense.selectedExpenseType
    ) {
      //Instance for MaterializeCSS
      this.updateMaterialize();
    }
  }

  updateMaterialize() {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);

    let dateAquired = document.querySelectorAll(".dateAquired");
    let dateAquiredInstance = M.Datepicker.init(dateAquired, {
      onSelect: this.handleDate,
      autoClose: true
    });
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("truck_date_aquired", date);
  };

  handleLicenseExp = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change("driver_license_expiration", date);
  };

  onSubmit(values) {
    let newValues = {
      id: values.id,
      label: values.label.trim(),
      category_expense_id: values.category_expense_id.value
    };

    this.props.updateExpenseType(newValues, () => {
      document.getElementById("close-modal-expenseTypeEdit").click();
    });
    M.toast({
      html: "Expense List updated !",
      classes: "materialize__toastUpdated"
    });
  }

  handleDelete = () => {
    let id = this.props.expense.selectedExpenseType.id;

    if (
      confirm(
        "Are You sure you want to delete this Sub-Category and ALL related Expenses ?"
      ) == true
    ) {
      this.props.deleteExpenseType(id, message => {
        if (message.success) {
          M.toast({
            html: message.success,
            classes: "materialize__toastUpdated"
          });
        } else {
          M.toast({
            html: message.error,
            classes: "materialize__toastError"
          });
        }
      });
    } else {
      return false;
    }
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    // const expenseList = this.props.trucks.expenseList.find((item)=>item.id===this.props.initialValues.truckexpenselists_id) || ""

    return (
      <div id="expenseTypeEdit" className="modal load-modal">
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <div className="permanentlyDeleteModal" onClick={this.handleDelete}>
              delete
            </div>
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
            >
              <div className="form__sectionContainer form__sectionContainer--noMargin">
                <section className="form__group form__group--fillContainer">
                  <a
                    href="#!"
                    id="close-modal-expenseTypeEdit"
                    className="modal-close waves-effect waves-green btn grey darken-4 right form__closeButton"
                  >
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Edit Sub-Category</h1>
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
                      label="Expense Type"
                      name="label"
                      component={renderField}
                      className="col s12 form__field form__field--column form__field--minWidth300 form__field--flex1"
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
                        disabled={submitting}
                      >
                        {" "}
                        <i className="large material-icons">save</i>
                      </button>
                      <h4 className="form__buttonContainer__buttonTitle save">
                        Update
                      </h4>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ExpenseTypeEdit = reduxForm({
  form: "ExpenseTypeEdit"
})(ExpenseTypeEdit);

ExpenseTypeEdit = connect(
  state => ({
    company: state.company,
    expense: state.expense,
    settings: state.settings,
    initialValues: {
      ...state.expense.selectedExpenseType,
      category_expense_id: state.expense.categories.find(
        category =>
          category.id === state.expense.selectedExpenseType.category_expense_id
      )
    },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateExpenseType,
    deleteExpenseType
  }
)(ExpenseTypeEdit);

export default ExpenseTypeEdit;
