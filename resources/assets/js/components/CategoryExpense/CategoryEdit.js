import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from "../forms";
import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip
} from "../forms/validation/normalizeForm";
import { Field, FieldArray, formValueSelector, reduxForm } from "redux-form";
import {
  updateCategoryExpense,
  deleteCategoryExpense
} from "../../actions/expense";

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
} from "../forms/validation/fieldValidations";

class CategoryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: "",
      date: ""
    };
  }

  componentDidMount() {
    // this.updateMaterialize()
  }

  componentDidUpdate(prevProps) {
    // if (prevProps.trucks.selectedTruckExpenseList !== this.props.trucks.selectedTruckExpenseList) {
    //   //Instance for MaterializeCSS
    //   this.updateMaterialize()
    // }
  }

  updateMaterialize() {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);
  }

  onSubmit(values) {
    let newValues = { id: values.id, label: values.label.trim() };

    this.props.updateCategoryExpense(newValues, () => {
      // document.getElementById('close-modal').click()
      M.toast({
        html: `${values.label.toUpperCase()} updated`,
        classes: "materialize__toastUpdated"
      });
    });
  }

  handleDelete = () => {
    let id = this.props.selectedCategory.id;
    console.log("iddd", id);

    if (
      confirm(
        "Are You sure you want to delete this Category and ALL related Sub-Categories & Expenses ?"
      ) == true
    ) {
      this.props.deleteCategoryExpense(id, message => {
        console.log("the message is", message);
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
      <div id="categoryEdit" className="modal load-modal load-modal--noPadding">
        <div className="modal-content modal-content--noPadding">
          <div className="form__container">
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
            >
              <div
                className="permanentlyDeleteModal"
                onClick={this.handleDelete}
              >
                delete
              </div>
              <div className="form__sectionContainer form__sectionContainer--noMargin form__sectionContainer--modal">
                <section className="form__group">
                  <a
                    href="#!"
                    id="close-modal"
                    className="modal-close waves-effect waves-green btn grey darken-4 right form__closeButton"
                  >
                    Close<i className="material-icons right">close</i>
                  </a>
                  <h1 className="form__formTitle">Edit Category</h1>
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

CategoryEdit = reduxForm({
  form: "CategoryEdit"
})(CategoryEdit);

CategoryEdit = connect(
  state => ({
    company: state.company,
    trucks: state.trucks,
    settings: state.settings,
    categories: state.expense.categories,
    selectedCategory: state.expense.selectedCategory,
    initialValues: {
      ...state.expense.selectedCategory
    },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateCategoryExpense,
    deleteCategoryExpense
  }
)(CategoryEdit);

export default CategoryEdit;
