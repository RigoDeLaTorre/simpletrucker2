import _ from "lodash";
import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import Checkbox from "./Checkbox";
import {
  renderField,
  renderSelectField,
  renderDateField,
  dropDownSelectState
} from "../forms";

import {
  normalizeDriverPay,
  normalizePhone,
  normalizeZip,
  submitValidationExpense
} from "../forms/validation";

import { customStyles } from "../common";
import { updateExpenseRecord } from "../../actions/expense";
import { uploadAwsFile, deleteAwsFile } from "../../actions/aws";

class ExpenseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "expense",
      focused: "",
      date: "",
      vehicle: "Truck",
      vehicleOptions: [],
      field_name: "truck_id",
      vehicleChosen: "",
      general: false,
      wut: "",
      deleteUploads: [],
      deleteId: [],
      checkedItems: new Map()
    };
  }

  componentDidMount() {
    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.expense.selectedExpenseRecord !==
      this.props.expense.selectedExpenseRecord
    ) {
      let elemTabs = document.querySelectorAll(".tabs");

      var elemTabsInstance = M.Tabs.init(elemTabs);
    }
  }
  renderAttachments = () => {
    if (
      this.props.expense.selectedExpenseRecord.attachments &&
      this.props.expense.selectedExpenseRecord.attachments.length !== 0
    ) {
      return this.props.expense.selectedExpenseRecord.attachments.map(item => (
        <div key={item.id} className="form__attachment">
          <a
            key={item.id}
            className="linkWithMaterializeIcon"
            href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${item.attachment}`}
            target="_blank"
          >
            <i className="material-icons">attachment</i>
            {item.attachment.split("/").pop()}
          </a>
        </div>
      ));
    } else {
      return <div>...</div>;
    }
  };

  // shouldComponentUpdate(nextProps) {
  //   const differentTitle =
  //     this.props.trailers.trailers.length !== nextProps.trailers.trailers.length
  //   const differentDone =
  //     this.props.trucks.trucks.length !== nextProps.trucks.trucks.length
  //   return differentTitle || differentDone
  // }
  render() {
    return (
      <div className="app-container">
        <div className="modal-content">
          <ul className="tabs tabs__accountingEdit">
            <li className="tab tab__accountingEdit">
              <a
                className="active"
                href="#expenseViewTab"
                onClick={() => this.setState({ tab: "expense" })}
              >
                Expense
              </a>
            </li>
            <li className="tab tab__accountingEdit">
              <a
                href="#expenseViewTab2"
                onClick={() => this.setState({ tab: "vendor" })}
              >
                Vendor
              </a>
            </li>
            <li className="tab tab__accountingEdit">
              <a
                href="#expenseViewTab3"
                onClick={() => this.setState({ tab: "alert" })}
              >
                Alert
              </a>
            </li>
            <li className="tab tab__accountingEdit">
              <a
                href="#expenseViewTab4"
                onClick={() => this.setState({ tab: "attachments" })}
              >
                Attachments
              </a>
            </li>
          </ul>

          <form className="form">
            <div id="expenseViewTab" className="col s12">
              <section className="form__section">
                <h1 className="form__title">Expense Details</h1>
                <h4 className="form__subTitleRequired">
                  <span className="form__subTitleRequired--asterick">* </span>{" "}
                  Required Fields
                </h4>
                <div className="row form__row form__row--column form__row--column form__row--column--marginBottom5rem">
                  <Field
                    label="Type"
                    name="choose_vehicle_type"
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    placeholder="Choose Type"
                    component={renderField}
                    disabled={true}
                  />

                  {(this.props.expense.selectedExpenseRecord &&
                    this.props.expense.selectedExpenseRecord.truck_id) ||
                  (this.props.expense.selectedExpenseRecord &&
                    this.props.expense.selectedExpenseRecord.trailer_id) ? (
                    <Field
                      label={
                        this.props.expense.selectedExpenseRecord.truck_id
                          ? "Truck"
                          : "Trailer"
                      }
                      name="truck_id"
                      className="col s12 form__field form__field--column form__field--flex1"
                      type="text"
                      component={renderField}
                      disabled={true}
                    />
                  ) : (
                    ""
                  )}

                  <Field
                    label="Category"
                    name="category_expense_id"
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    component={renderField}
                    placeholder="Category"
                    disabled={true}
                  />

                  <Field
                    label="Sub-Category"
                    name="category_expense_type_id"
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    component={renderField}
                    placeholder="Sub-Category"
                    disabled={true}
                  />
                </div>

                <div className="row form__row form__row--column">
                  <Field
                    label="Date of Transaction"
                    name="date"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    disabled={true}
                  />

                  <Field
                    label="Amount"
                    name="amount"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    disabled={true}
                  />

                  <Field
                    label="Description"
                    name="description"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex3"
                    type="text"
                    disabled={true}
                  />
                </div>
              </section>
            </div>
            <div id="expenseViewTab2" className="col s12">
              <section className="form__section">
                <h1 className="form__title form__title--marginBottom">
                  Vendor Information
                </h1>

                <Field
                  label="Vendor"
                  name="vendor_id"
                  className="col s12 form__field form__field--column form__field--flex1"
                  type="text"
                  component={renderField}
                  placeholder="Vendor"
                  disabled={true}
                />
              </section>
            </div>
            <div id="expenseViewTab3" className="col s12">
              <section className="form__section">
                <h1 className="form__title form__title--marginBottom">Alert</h1>
                <div className="row form__row form__row--columnPhone">
                  <Field
                    label="Alert (Days) from Transaction Date"
                    name="expense_alert_days"
                    component={renderField}
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    disabled={true}
                  />
                  <Field
                    label="Alert on/off"
                    name="expense_alert"
                    className="col s12 form__field form__field--column form__field--flex1"
                    type="text"
                    placeholder="Inactive"
                    component={renderField}
                    disabled={true}
                  />
                </div>
              </section>
            </div>
            <div id="expenseViewTab4" className="col s12">
              <section className="form__section">
                <h1 className="form__title form__title--marginBottom">
                  Upload Attachments
                </h1>
                <div className="row form__row form__row--column">
                  {this.renderAttachments()}
                </div>
              </section>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <section className="details-button">
            <Link
              to="/expense/edit"
              className="modal-close waves-effect waves-green btn red darken-4 left modal__editButton--width100"
            >
              Edit<i className="material-icons right">edit</i>
            </Link>
          </section>
        </div>
      </div>
    );
  }
}

ExpenseView = reduxForm({
  form: "ExpenseView",
  initialized: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  updateUnregisteredFields: true
})(ExpenseView);

ExpenseView = connect(
  state => ({
    company: state.company,
    expense: state.expense,
    alert: state.alert,
    settings: state.settings,
    initialValues: {
      ...state.expense.selectedExpenseRecord,
      choose_vehicle_type:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.truck_id
          ? "Truck"
          : state.expense.selectedExpenseRecord &&
            state.expense.selectedExpenseRecord.trailer_id
          ? "Trailer"
          : "General",
      truck_id: state.expense.selectedExpenseRecord.truck
        ? state.expense.selectedExpenseRecord.truck.truck_reference
        : state.expense.selectedExpenseRecord.trailer
        ? state.expense.selectedExpenseRecord.trailer.trailer_reference
        : null,
      category_expense_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expenseCategory
          ? state.expense.selectedExpenseRecord.expenseCategory.label
          : null,
      category_expense_type_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expenseType
          ? state.expense.selectedExpenseRecord.expenseType.label
          : null,
      vendor_id:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.vendor
          ? state.expense.selectedExpenseRecord.vendor.vendor_name
          : null,
      expense_alert:
        state.expense.selectedExpenseRecord &&
        state.expense.selectedExpenseRecord.expense_alert === 0
          ? "Inactive"
          : "Active"
    }
  }),
  {}
)(ExpenseView);

export default ExpenseView;
