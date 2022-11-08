import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { Link } from "react-router-dom";
import { fetchAllLoadsDetails } from "../../../actions/loads/fetchAllLoadsDetails.js";
import { updateDriverPayroll } from "../../../actions/accounting";
import { convertDate } from "../../common";
import {
  normalizeZip,
  normalizePhone,
  submitValidationAccounting
} from "../../forms/validation";
import {
  dropDownSelectState,
  renderField,
  renderDateField,
  renderTextArea,
  stateOptions
} from "../../forms";

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
} from "../../forms/validation/fieldValidations";

class AccountingDriversPayModalEdit extends Component {
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

  onSubmit = values => {
    values.id = this.props.currentLoadsSelected[0].id;

    let newValues = _.mapValues(values, function(val) {
      if (typeof val === "string") {
        return val.toLowerCase().trim();
      }
      if (_.isInteger(val)) {
        return val;
      }
    });

    this.props.updateDriverPayroll([newValues], () => {
      M.toast({ html: `Payroll Update Completed !` });
      // document.getElementById('modal-close-button').click()
      this.props.fetchAllLoadsDetails(() => {
        console.log("fetched load details");
      });
      // this.props.history.push('/accountingDrivers')
    });
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div id="driverPayModalEdit" className="modal driverPayModalEdit">
        <div className="modal-content">
          {this.props.loadStatus === "paid" ? (
            <h1 className="modal-content--editing">Editing....</h1>
          ) : null}

          <h3 className="load-details__startingPoint" />

          <div className="load-details">
            <div className="load-details__leftContainer">
              <div className="top-details-container">
                <div className="top-details">
                  <h4 className="top-details__listItem">
                    Load Id :{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].invoice_id
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Customer:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].customer
                          .customer_name
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Pickups:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].pickups.length
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Deliveries:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].deliveries.length
                      : null}
                  </h4>
                </div>
                <div className="top-details">
                  <h4 className="top-details__listItem">
                    Driver:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].driver
                          .driver_first_name +
                        " " +
                        this.props.currentLoadsSelected[0].driver
                          .driver_last_name
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Phone:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? normalizePhone(
                          this.props.currentLoadsSelected[0].driver.driver_phone
                        )
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Email:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].driver.driver_email
                      : null}
                  </h4>
                  <h4 className="top-details__listItem">
                    Salary:{" "}
                    {this.props.currentLoadsSelected.length !== 0
                      ? this.props.currentLoadsSelected[0].driver
                          .driver_pay_amount
                      : null}
                  </h4>
                </div>
              </div>
              {/*Pickup and delivery section*/}
              <div className="load-details__pickupDelivery">
                <div className="load-details__pickupDelivery__group">
                  <h4 className="load-details__pickupDelivery__title">
                    Pickup
                  </h4>
                  {this.renderPickups()}
                </div>

                <div className="load-details__pickupDelivery__group">
                  <h4 className="load-details__pickupDelivery__title">
                    Delivery
                  </h4>
                  {this.renderDeliveries()}
                </div>
              </div>
              {/*Load mileage */}
              <div className="load-details__mileage">
                <h3 className="load-details__mileage__listItem">
                  Starting Point to Fontana, CA 35 miles
                </h3>
                <h3 className="load-details__mileage__listItem">
                  Starting Point to Fontana, CA 35 miles
                </h3>
              </div>
              {/*TOTAL DUE  */}
              <div className="load-total">
                <h2 className="load-total__amount">Total Due : $586.44</h2>
                <h6 className="load-total__disclaimer">
                  *Based on{" "}
                  {this.props.currentLoadsSelected.length !== 0
                    ? this.props.currentLoadsSelected[0].driver
                        .driver_pay_amount
                    : null}{" "}
                  cents per mile
                </h6>
              </div>
            </div>
            <div className="payContainer">
              <form
                onSubmit={handleSubmit(this.onSubmit.bind(this))}
                className="load-form"
              >
                <div className="load-form-section">
                  <div className="row load-form-section__topGroup">
                    <div className="load-form-section__topGroup__group load-form-section__topGroup__group--driverPaySection">
                      <div className="load-form-section__topGroup__group__flexColumn">
                        <h4 className="load-form-section__topGroup__group__flexColumn__h4">
                          Pay Type
                        </h4>
                        <Field
                          label=""
                          name="driver_paid_type"
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
                          name="driver_paid_reference"
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
                          name="driver_paid_amount"
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
                          name="driver_paid_date"
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

                <div className="fixed-action-btn__mainButton">
                  <button
                    className="btn-floating btn-large green right"
                    type="submit"
                    disabled={submitting}
                  >
                    <i className="large material-icons">save</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <section className="details-button">
            <a
              href="#!"
              id="modal-close-button"
              className="modal-close waves-effect waves-green btn grey darken-4 right"
            >
              Close<i className="material-icons right">close</i>
            </a>
          </section>
        </div>
      </div>
    );
  }
}

AccountingDriversPayModalEdit = reduxForm({
  form: "DriverPayrollSingleEdit"
})(AccountingDriversPayModalEdit);

AccountingDriversPayModalEdit = connect(
  state => ({
    currentLoadsSelected: state.accounting.loadSelected,
    currentForm: state.form.DriverPayrollSingleEdit,
    settings: state.settings,
    initialValues: { ...state.accounting.loadSelected[0] } || null,
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateDriverPayroll,
    fetchAllLoadsDetails
  }
)(AccountingDriversPayModalEdit);

export default AccountingDriversPayModalEdit;
