import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { Link } from "react-router-dom";
import { convertDate } from "../common";
import { updateDriverPayroll } from "../../actions/accounting";
import {
  normalizeZip,
  normalizePhone,
  submitValidationAccounting
} from "../forms/validation";
import {
  dropDownSelectState,
  renderField,
  renderDateField,
  renderTextArea,
  stateOptions
} from "../forms";

import {
  required,
  maxLength,
  maxLength10,
  maxLength20,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  number
} from "../forms/validation/fieldValidations";

class AccountingDriversPayMultipleEdit extends Component {
  state = {
    focused: "",
    date: ""
  };

  componentDidMount() {
    //Instance for MaterializeCSS
    this.updateMaterialize();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.currentLoadsSelected.length !==
      this.props.currentLoadsSelected.length
    ) {
      //Instance for MaterializeCSS
      this.updateMaterialize();
    }
  }

  //Each time a pickup or delivery is added, this is triggered
  updateMaterialize = props => {
    let elems = document.querySelectorAll("select");
    let stateSelectInstance = M.FormSelect.init(elems);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);

    let pickupdate = document.querySelectorAll(".loadPickup");
    let pickupdateInstance = M.Datepicker.init(pickupdate, {
      onSelect: this.handleDate,
      autoClose: true
    });
  };

  selectField = ({
    children,
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <label className="active">{label}</label>
      <select className="form-control" {...input}>
        {children}
      </select>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change(this.state.focused, date);
  };

  renderPickups = () => {
    if (this.props.currentLoadsSelected.length != 0) {
      let curr = this.props.currentLoadsSelected[0].pickups;
      return curr.map(load => {
        return (
          <h4 key={load.id} className="load-details__pickupDelivery__listItem">
            {convertDate(load.pickup_date)} : {load.pickup_address}
            {load.pickup_city}, {load.pickup_state}, {load.pickup_zipcode}
          </h4>
        );
      });
    }
  };
  renderDeliveries = () => {
    if (this.props.currentLoadsSelected.length != 0) {
      let curr = this.props.currentLoadsSelected[0].deliveries;
      return curr.map(load => {
        return (
          <h4 key={load.id} className="load-details__pickupDelivery__listItem">
            {convertDate(load.delivery_date)} {load.delivery_city},{" "}
            {load.delivery_state}, {load.delivery_zipcode}
          </h4>
        );
      });
    } else {
      return <h1>nuttin</h1>;
    }
  };

  renderAllPickups = () => {
    if (this.props.currentLoadsSelected.length != 0) {
      let curr = this.props.currentLoadsSelected;
      return curr.map(load => {
        return load.pickups.map(item => (
          <h4>
            Load Id:{load.id} Pickup :{item.id}
          </h4>
        ));
      });
    } else {
      return <h1>nuttin</h1>;
    }
  };

  onSubmit = ({ loadSelected }) => {
    let newValues = loadSelected.map(item => {
      return {
        id: item.id,
        driver_paid_type: item.driver_paid_type,
        driver_paid_reference: item.driver_paid_reference.trim(),
        driver_paid_amount: item.driver_paid_amount,
        driver_paid_date: item.driver_paid_date
      };
    });

    this.props.updateDriverPayroll(newValues, resData => {
      this.props.history.push("/accounting/drivers");
      if (resData) {
        M.toast({ html: `Payroll Update Completed !` });
      } else {
        M.toast({ html: `Sorry, it did NOT save..please try again ` });
      }
    });
  };

  renderpickupsArray = ({ fields, meta: { error, submitFailed } }) => {
    return (
      <div className="pickup-delivery-container pickups">
        {submitFailed && error && <span>{error}</span>}
        <ul className="form-group-one">
          {fields.map((loadSelected, index, array) => {
            return (
              <li key={index} className="load-item">
                {/*LOAD DETAILS GROUP ,pickup, delivery, mileage*/}
                <div className="load-details">
                  <div className="load-details__leftContainer">
                    {/*TOP SECTION DETAILS*/}
                    <div className="top-details-container">
                      <div className="top-details">
                        <h4 className="top-details__listItem">
                          Load Id :
                          {this.props.currentLoadsSelected[index].invoice_id}
                        </h4>
                        <h4 className="top-details__listItem">
                          Customer:{" "}
                          {
                            this.props.currentLoadsSelected[index].customer
                              .customer_name
                          }
                        </h4>
                        <h4 className="top-details__listItem">
                          Pickups{" "}
                          {
                            this.props.currentLoadsSelected[index].pickups
                              .length
                          }
                        </h4>
                        <h4 className="top-details__listItem">
                          Deliveries{" "}
                          {
                            this.props.currentLoadsSelected[index].deliveries
                              .length
                          }
                        </h4>
                      </div>
                      <div className="top-details">
                        <h4 className="top-details__listItem">
                          Driver:{" "}
                          {this.props.currentLoadsSelected[index].driver
                            .driver_first_name +
                            " " +
                            this.props.currentLoadsSelected[index].driver
                              .driver_last_name}
                        </h4>
                        <h4 className="top-details__listItem">
                          Phone:{" "}
                          {normalizePhone(
                            this.props.currentLoadsSelected[index].driver
                              .driver_phone
                          )}
                        </h4>
                        <h4 className="top-details__listItem">
                          Email:{" "}
                          {
                            this.props.currentLoadsSelected[index].driver
                              .driver_email
                          }
                        </h4>
                        <h4 className="top-details__listItem">
                          Salary:{" "}
                          {
                            this.props.currentLoadsSelected[index].driver
                              .driver_pay_amount
                          }
                        </h4>
                      </div>
                    </div>
                    <div className="load-details__pickupDelivery">
                      <div className="load-details__pickupDelivery__group">
                        <h3 className="load-details__startingPoint">
                          Starting Point
                        </h3>
                        <h3 className="load-details__startingPoint">
                          Fontana Yard 58383 cherry st, fontana, ca 91739.
                        </h3>
                        <h4 className="load-details__pickupDelivery__title">
                          Pickup
                        </h4>

                        {this.props.currentLoadsSelected[index].pickups.map(
                          load => {
                            return (
                              <h4
                                key={load.id}
                                className="load-details__pickupDelivery__listItem"
                              >
                                {convertDate(load.pickup_date)}{" "}
                                {load.pickup_address} {load.pickup_city},{" "}
                                {load.pickup_state}, {load.pickup_zipcode}
                              </h4>
                            );
                          }
                        )}
                      </div>
                      <div className="load-details__pickupDelivery__group">
                        <h3 className="load-details__startingPoint">
                          Ending Point
                        </h3>
                        <h3 className="load-details__startingPoint">
                          Fontana Yard 58383 cherry st, fontana, ca 91739.
                        </h3>
                        <h4 className="load-details__pickupDelivery__title">
                          Delivery
                        </h4>
                        {this.props.currentLoadsSelected[index].deliveries.map(
                          load => {
                            return (
                              <h4
                                key={load.id}
                                className="load-details__pickupDelivery__listItem"
                              >
                                {convertDate(load.delivery_date)}{" "}
                                {load.delivery_address} {load.delivery_city},{" "}
                                {load.delivery_state}, {load.delivery_zipcode}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="load-details__mileage">
                      <h3 className="load-details__mileage__listItem">
                        Starting Point to Fontana, CA 35 miles
                      </h3>
                      <h3 className="load-details__mileage__listItem">
                        Starting Point to Fontana, CA 35 miles
                      </h3>
                    </div>
                    {/*TOTAL DUE : $586 example */}
                    <div className="load-total">
                      <h2 className="load-total__amount">
                        Total Due : $586.44
                      </h2>
                      <h6 className="load-total__disclaimer">
                        *Based on{" "}
                        {
                          this.props.currentLoadsSelected[index].driver
                            .driver_pay_amount
                        }{" "}
                        cents per mile
                      </h6>
                    </div>
                  </div>

                  {/*PAY CONTAINER */}
                  <div className="payContainer">
                    <div className="load-form-section">
                      <div className="row load-form-section__topGroup">
                        <div className="load-form-section__topGroup__group load-form-section__topGroup__group--driverPaySection">
                          <div className="load-form-section__topGroup__group__flexColumn">
                            <h4 className="load-form-section__topGroup__group__flexColumn__h4">
                              Pay Type
                            </h4>
                            <Field
                              label=""
                              name={`loadSelected[${index}].driver_paid_type`}
                              className="formSelectFields"
                              type="select"
                              component={this.selectField}
                              validate={required}
                            >
                              <option value="" disabled defaultValue>
                                Pay Type
                              </option>
                              <option key="check" value="check">
                                Check
                              </option>
                              <option key="ach" value="ach">
                                ACH
                              </option>
                              <option key="transfer" value="transfer">
                                Online Transfer
                              </option>
                            </Field>
                          </div>
                          <div className="load-form-section__topGroup__group__flexColumn">
                            <h4 className="load-form-section__topGroup__group__flexColumn__h4">
                              Reference #
                            </h4>
                            <Field
                              name={`loadSelected[${index}].driver_paid_reference`}
                              type="text"
                              component={renderField}
                              label=""
                              className=""
                              validate={[required, maxLength100]}
                            />
                          </div>
                          <div className="load-form-section__topGroup__group__flexColumn">
                            <h4 className="load-form-section__topGroup__group__flexColumn__h4">
                              Pay Amount $
                            </h4>
                            <Field
                              label=""
                              name={`loadSelected[${index}].driver_paid_amount`}
                              component={renderField}
                              className=""
                              type="text"
                              validate={[required, number]}
                            />
                          </div>
                          <div className="load-form-section__topGroup__group__flexColumn">
                            <h4 className="load-form-section__topGroup__group__flexColumn__h4">
                              Date
                            </h4>
                            <Field
                              label=""
                              name={`loadSelected[${index}].driver_paid_date`}
                              component={renderDateField}
                              className=""
                              type="text"
                              dateField="loadPickup"
                              validate={required}
                              onFocus={event =>
                                this.setState({ focused: event.target.name })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div id="driverPayMultipleModal" className="driverPayModalEdit">
        <div className="app-container">
          <div className="top-section">
            <h1 className="top-section__title">Accounting -Drivers Payroll</h1>
          </div>
          <div className="modal-content">
            <form
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
              className="load-form"
            >
              <FieldArray
                name="loadSelected"
                component={this.renderpickupsArray}
              />
              <div className="fixed-action-btn">
                <button
                  className="btn-floating btn-large green"
                  type="submit"
                  disabled={submitting}
                >
                  <i className="large material-icons">save</i>
                </button>
                <ul>
                  <li>
                    <Link to="/accounting/Drivers" className="btn-floating red">
                      <i className="material-icons">cancel</i>
                    </Link>
                  </li>
                </ul>
                <h4 className="fixed-action-btn__title save">Save Changes</h4>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <section className="details-button">
              <a
                href="#!"
                className="modal-close waves-effect waves-green btn grey darken-4 right"
              >
                Close<i className="material-icons right">close</i>
              </a>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

AccountingDriversPayMultipleEdit = reduxForm({
  form: "DriverPayrollMultipleEdit"
})(AccountingDriversPayMultipleEdit);

AccountingDriversPayMultipleEdit = connect(
  state => ({
    currentLoadsSelected: state.accounting.loadSelected,
    settings: state.settings,
    currentForm: state.form.DriverPayrollMultipleEdit,
    initialValues: { ...state.accounting },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateDriverPayroll
  }
)(AccountingDriversPayMultipleEdit);

export default AccountingDriversPayMultipleEdit;
