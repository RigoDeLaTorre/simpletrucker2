import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { updateLoad } from "../../../actions/loads/updateLoad.js";
import { convertDate } from "../../common";
import {
  processTypes,
  processTypesNoQuickPay,
  processTypesNoFactor
} from "../../forms/validation/processTypeOptions";

import { renderTextArea } from "../../forms";
import RenderSelectFieldReactSelectClass from "../../forms/RenderSelectFieldReactSelectClass";

import { normalizeRateAmount } from "../../forms/validation";
import {
  required,
  maxLength,
  maxLength10,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  number
} from "../../forms/validation/fieldValidations";

class NeedBol extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bol: this.props.loads.selectedLoad.bill_of_lading
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loads.selectedLoad !== this.props.loads.selectedLoad) {
      this.setState({
        bol: this.props.loads.selectedLoad.bill_of_lading
      });
      setTimeout(() => {
        let elems = document.querySelectorAll("select");
        let instances = M.FormSelect.init(elems);
        let collapsibleElem = document.querySelectorAll(".collapsible");

        let collapsibleInstance = M.Collapsible.init(collapsibleElem);

        let pickupdateUnpaid = document.querySelectorAll(".loadDatePaid");
        let pickupdateInstance = M.Datepicker.init(pickupdateUnpaid, {
          onSelect: this.handleDate,
          autoClose: true
        });
      }, 0);
    }
  }
  componentDidMount() {
    setTimeout(() => {
      let elems = document.querySelectorAll("select");
      let instances = M.FormSelect.init(elems);
      let collapsibleElem = document.querySelectorAll(".collapsible");

      let collapsibleInstance = M.Collapsible.init(collapsibleElem);
      let pickupdateUnpaid = document.querySelectorAll(".loadDatePaid");
      let pickupdateInstance = M.Datepicker.init(pickupdateUnpaid, {
        onSelect: this.handleDate,
        autoClose: true
      });
    }, 0);
  }

  renderField = ({
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div className={`input ${className} `}>
      <div className="input-group">
        <label>{label}</label>
        <input
          className="form-control"
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          type={type}
          {...input}
        />
      </div>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  renderModalPickupAddress = () => {
    return this.props.loads.selectedLoad.pickups.map((pickup, index) => {
      return (
        <li key={pickup.id}>
          <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--pickup">
            <i className="material-icons">arrow_drop_down</i> Pickup #
            {index + 1} :{pickup.pickup_city} , {pickup.pickup_state}
          </div>
          <div className="collapsible-body modal__collapsibleBody">
            <h4>
              Pickup #{index + 1} : {convertDate(pickup.pickup_date)}
            </h4>
            <h4 className="address-name">{pickup.pickup_name} </h4>
            <h4>{pickup.pickup_address} </h4>
            <h4>
              {pickup.pickup_city} {pickup.pickup_state},{" "}
              {pickup.pickup_zipcode}
            </h4>
          </div>
        </li>
      );
    });
  };

  renderModalDeliveryAddress = () => {
    return this.props.loads.selectedLoad.deliveries.map((delivery, index) => {
      return (
        <li key={delivery.id}>
          <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--delivery">
            <i className="material-icons">arrow_drop_down</i> Delivery #
            {index + 1} :{delivery.delivery_city}, {delivery.delivery_state}
          </div>
          <div className="collapsible-body modal__collapsibleBody">
            <h4>
              Delivery #{index + 1} : {convertDate(delivery.delivery_date)}
            </h4>
            <h4 className="address-name">{delivery.delivery_name} </h4>
            <h4>{delivery.delivery_address} </h4>
            <h4>
              {delivery.delivery_city} {delivery.delivery_state},{" "}
              {delivery.delivery_zipcode}
            </h4>
          </div>
        </li>
      );
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
      className={`input ${className} ${touched && error ? "has-danger" : ""}`}
    >
      <div className="input-group">
        <label className={touched ? "active" : ""}>{label}</label>
        <select className="form-control" {...input}>
          {children}
        </select>
      </div>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  // Select Dropdown for Process Type ( Not Factored, Factored, Quickpay)
  processTypeFields = () => {
    if (this.props.company.factory_company_name) {
      // IF COMPANY HAS A FACTORY COMPANY
      if (
        this.props.selectedLoad.customer.quickpay_email &&
        this.props.selectedLoad.customer.quickpay_email !== ""
      ) {
        return processTypes.map(processType => {
          return { value: processType.value, label: processType.label };
        });
      } else {
        return processTypesNoQuickPay.map(processType => {
          return { value: processType.value, label: processType.label };
        });
      }
    } else {
      //NO FACTOR COMPANY
      if (
        this.props.selectedLoad.customer.quickpay_email &&
        this.props.selectedLoad.customer.quickpay_email !== ""
      ) {
        return processTypesNoFactor.map(processType => {
          return { value: processType.value, label: processType.label };
        });
      } else {
        return [{ value: "notfactored", label: "Not Factored" }];
      }
    }
  };

  onSubmit({
    load_processed_type,
    rate_confirmation_amount,
    load_reimbursement,
    load_deduction,
    invoice_notes,
    bill_of_lading,
    bill_of_lading_number,
    fuel_advance_from,
    fuel_advance_amount,
    fuel_advance_fee,
    fuel_advance_date,
    id,
    invoice_id
  }) {
    bill_of_lading = this.state.bol === true ? 1 : 0;
    let newValues = {
      load_processed_type,
      rate_confirmation_amount,
      load_reimbursement,
      load_deduction,
      invoice_notes,
      bill_of_lading,
      bill_of_lading_number,
      fuel_advance_from,
      fuel_advance_amount,
      fuel_advance_fee,
      fuel_advance_date,
      id,
      invoice_id
    };
    typeof newValues.load_processed_type == "object"
      ? (newValues.load_processed_type = newValues.load_processed_type.value)
      : null;

    this.props.updateLoad(newValues, () => {
      this.props.handleFilterButton();
    });
    M.toast({
      html: `Load Id# ${newValues.invoice_id} ***  updated !`
    });
  }

  handleSwitch = event => {
    this.setState({
      bol: !this.state.bol
    });
  };
  renderDateField = ({
    dateField,
    className,
    input,
    label,
    type,

    meta: { touched, error }
  }) => (
    <div
      className={`input ${className} ${touched && error ? "has-danger" : ""}`}
    >
      <div className="input-group">
        <label>{label}</label>
        <input
          className={`form-control ${dateField}`}
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          type={type}
          {...input}
        />
      </div>
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

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div id="modal-needBol" className="modal load-modal">
        {!this.props.loads ||
        !this.props.loads.selectedLoad ||
        !this.props.loads.selectedLoad.customer ||
        !this.props.loads.selectedLoad.driver ||
        !this.props.loads.selectedLoad.pickups ||
        !this.props.loads.selectedLoad.deliveries ? (
          "none"
        ) : (
          <div className="modal-content modal-content--noPadding">
            <div className="modal__topBar">
              <h4 className="modal__topBar__text">
                Invoice #{this.props.loads.selectedLoad.invoice_id}
              </h4>
              <div>
                <h4 className="modal__topBar__text modal__topBar__customerTitle">
                  {" "}
                  {this.props.loads.selectedLoad.customer.customer_name} #{" "}
                  {this.props.loads.selectedLoad.load_reference}
                </h4>
                <div className="modal__topBar__displayNumberofDrops">
                  <h4 className="modal__topBar__text modal-content__h4">
                    <i className="material-icons">arrow_drop_up</i>
                    Pickups : {this.props.loads.selectedLoad.pickups.length}
                  </h4>
                  <h4 className="modal__topBar__text modal-content__h4">
                    <i className="material-icons">arrow_drop_down</i>
                    Drops : {this.props.loads.selectedLoad.deliveries.length}
                  </h4>
                </div>
              </div>

              <h4 className="modal__topBar__text">
                ${this.props.loads.selectedLoad.rate_confirmation_amount}{" "}
              </h4>
            </div>

            <div className="load-container" id="test-modal">
              <div className="group load-details">
                <ul className="collapsible modal__collapsible">
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--data">
                      <i className="material-icons">drive_eta</i>Driver:{" "}
                      {this.props.loads.selectedLoad.driver.driver_first_name}
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <h4>
                        {this.props.loads.selectedLoad.driver.driver_first_name}{" "}
                        {this.props.loads.selectedLoad.driver.driver_last_name}
                      </h4>
                      <h4>
                        {this.props.loads.selectedLoad.driver.driver_phone}
                      </h4>
                      <h4>
                        {this.props.loads.selectedLoad.driver.driver_email}
                      </h4>
                    </div>
                  </li>

                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--data">
                      <i className="material-icons">fiber_manual_record</i>
                      Accounting Preferred:{" "}
                      {this.props.loads.selectedLoad.load_processed_type ==
                      "quickpay"
                        ? "Quickpay " +
                          this.props.loads.selectedLoad.customer
                            .quickpay_charge +
                          "%"
                        : this.props.loads.selectedLoad.customer.process_type ==
                          "factor"
                        ? "Factor " +
                          this.props.company.factory_company_process_fee +
                          " %"
                        : "Not Factored"}
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <h3>Options</h3>
                      <h4>
                        QuickPay :{" "}
                        {this.props.loads.selectedLoad.customer
                          .quickpay_email &&
                        this.props.loads.selectedLoad.customer
                          .quickpay_email !== ""
                          ? this.props.loads.selectedLoad.customer
                              .quickpay_charge + "%"
                          : "N/A"}
                      </h4>
                      <h4>
                        Factor:{" "}
                        {this.props.company.factory_company_process_fee != 0 &&
                        this.props.company.factory_company_process_fee != null
                          ? this.props.company.factory_company_process_fee +
                            " %"
                          : "N/A"}
                      </h4>
                    </div>
                  </li>
                </ul>

                <ul className="collapsible modal__collapsible">
                  {this.renderModalPickupAddress()}

                  {this.renderModalDeliveryAddress()}
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--notes">
                      <i className="material-icons">note</i> Load Notes
                      {this.props.loads.selectedLoad.load_notes ? (
                        <h3 className="modal__collapsibleNotes">
                          :{" "}
                          {this.props.loads.selectedLoad.load_notes.slice(
                            0,
                            15
                          )}{" "}
                          ...
                        </h3>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <p className="details-info">
                        {this.props.loads.selectedLoad.load_notes}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--notes">
                      <i className="material-icons">note</i> Invoice Notes
                      {this.props.loads.selectedLoad.invoice_notes ? (
                        <h3 className="modal__collapsibleNotes">
                          :{" "}
                          {this.props.loads.selectedLoad.invoice_notes.slice(
                            0,
                            15
                          )}{" "}
                          ...
                        </h3>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <p className="details-info">
                        {this.props.loads.selectedLoad.invoice_notes}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="upload-container">
                  {this.props.loads.selectedLoad.rate_confirmation_pdf ? (
                    <div className="pdf-link">
                      <a
                        className="upload-attachment-file"
                        href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${this.props.loads.selectedLoad.rate_confirmation_pdf}`}
                        target="_blank"
                      >
                        <i className="material-icons tiny attatch-icon">
                          attach_file
                        </i>{" "}
                        Rate Confirmation
                      </a>
                    </div>
                  ) : (
                    <h4
                      className="modal-content__h4"
                      style={{ color: "orange" }}
                    >
                      No Rate Confirmation Attached
                    </h4>
                  )}
                  {this.props.bolPdfUrl ? (
                    <div className="pdf-link">
                      <a
                        className="upload-attachment-file"
                        href={`https://s3-us-west-1.amazonaws.com/simpletrucker/${this.props.loads.selectedLoad.bill_of_lading_pdf}`}
                        target="_blank"
                      >
                        <i className="material-icons tiny attatch-icon">
                          attach_file
                        </i>{" "}
                        BOL
                      </a>
                    </div>
                  ) : (
                    <h4
                      className="modal-content__h4"
                      style={{ color: "orange" }}
                    >
                      BOL Missing
                    </h4>
                  )}
                </div>
              </div>

              <form
                className="load-form"
                onSubmit={handleSubmit(this.onSubmit.bind(this))}
              >
                <div className="row load-details-row">
                  <div className="col s12 fieldLabel__group">
                    <div className="fieldLabel__subGroup fieldLabel__subGroup--maxWidth100">
                      <label className="fieldLabel__label">Process Type</label>
                    </div>
                    <div className="fieldLabel__subGroup">
                      <Field
                        label="Process Type"
                        name="load_processed_type"
                        iconDisplayNone="label-group__addItemIcon--displayNone"
                        className="formSelectFields form__field form__field--column form__field--minWidth150"
                        type="select"
                        component={RenderSelectFieldReactSelectClass}
                        validate={required}
                        placeholder="Process Type"
                        options={this.processTypeFields()}
                        noLabel="true"
                      />
                    </div>
                  </div>

                  <Field
                    label="Reimbursements :"
                    name="load_reimbursement"
                    component={this.renderField}
                    className="col s12"
                    type="number"
                    validate={[required, number]}
                  />

                  <Field
                    label="Deductions :"
                    name="load_deduction"
                    component={this.renderField}
                    className="col s12"
                    type="number"
                    validate={[required, number]}
                  />
                </div>
                <ul className="collapsible modal__collapsible">
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--field">
                      <i className="material-icons">arrow_drop_down</i> Fuel
                      Advance
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <div className="col s12 fieldLabel__group">
                        <div className="fieldLabel__subGroup fieldLabel__subGroup--maxWidth100">
                          <label className="fieldLabel__label">
                            Fuel Advance By
                          </label>
                        </div>
                        <div className="fieldLabel__subGroup">
                          <Field
                            label="Fuel Advance By"
                            name="fuel_advance_from"
                            iconDisplayNone="label-group__addItemIcon--displayNone"
                            className="formSelectFields form__field form__field--column form__field--minWidth150"
                            type="select"
                            component={RenderSelectFieldReactSelectClass}
                            validate={required}
                            placeholder="Fuel Advance By"
                            options={[
                              { label: "Factor Company", value: 0 },
                              { label: "Broker/Customer", value: 1 }
                            ]}
                            noLabel="true"
                          />
                        </div>
                      </div>

                      <Field
                        label="Fuel Adv. Amount"
                        name="fuel_advance_amount"
                        component={this.renderField}
                        className="col s12"
                        type="number"
                        validate={[required, number]}
                      />
                      <Field
                        label="Fuel Adv. Fee :"
                        name="fuel_advance_fee"
                        component={this.renderField}
                        className="col s12"
                        type="number"
                        validate={[required, number]}
                      />
                      <Field
                        label="Fuel Advance Date"
                        name="fuel_advance_date"
                        component={this.renderDateField}
                        className="col s12"
                        type="text"
                        dateField="loadDatePaid"
                        validate={this.props.fuelValue != 0 ? required : null}
                        onFocus={event =>
                          this.setState({ focused: event.target.name })
                        }
                      />
                    </div>
                  </li>
                </ul>

                <ul className="collapsible modal__collapsible">
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--field">
                      <i className="material-icons">arrow_drop_down</i> Invoice
                      Notes
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <Field
                        label="Invoice Notes"
                        name="invoice_notes"
                        component={renderTextArea}
                        className="col s12"
                        type="textarea"
                        labelClass="textarea__notes"
                      />
                    </div>
                  </li>
                </ul>

                {this.props.loadStatus == "delivered" ? (
                  <div className="switch">
                    <label>
                      Bol Missing
                      <input
                        type="checkbox"
                        name="bill_of_lading"
                        onChange={this.handleSwitch}
                        checked={this.state.bol}
                      />{" "}
                      <span className="lever" />
                      Bol Received
                    </label>
                  </div>
                ) : (
                  ""
                )}
                <Link
                  to="/accounting/edit"
                  className="btn-floating btn-large red left"
                >
                  {" "}
                  <i className="large material-icons">edit</i>
                </Link>

                <button
                  className="btn-floating btn-large green right"
                  type="submit"
                  disabled={submitting}
                >
                  {" "}
                  <i className="large material-icons">save</i>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const selector = formValueSelector("NeedBolForm");

NeedBol = reduxForm({
  form: "NeedBolForm"
})(NeedBol);

NeedBol = connect(
  state => ({
    settings: state.settings,
    company: state.company,
    loads: state.loads,
    selectedLoad: state.loads.selectedLoad,
    initialValues: {
      ...state.loads.selectedLoad,
      id: state.loads.selectedLoad.id,
      invoice_id: state.loads.selectedLoad.invoice_id,
      load_processed_type:
        state.loads.selectedLoad.load_processed_type == "factor"
          ? { value: "factor", label: "Factor" }
          : state.loads.selectedLoad.load_processed_type == "quickpay"
          ? { value: "quickpay", label: "Quickpay" }
          : state.loads.selectedLoad.load_processed_type == "notfactored"
          ? { value: "notfactored", label: "Not Factored" }
          : {
              value:
                state.loads.selectedLoad &&
                state.loads.selectedLoad.customer &&
                state.loads.selectedLoad.customer.process_type
                  ? state.loads.selectedLoad.customer.process_type
                  : "notfactored",
              label:
                state.loads.selectedLoad &&
                state.loads.selectedLoad.customer &&
                state.loads.selectedLoad.customer.process_type === "factor"
                  ? "Factor"
                  : state.loads.selectedLoad &&
                    state.loads.selectedLoad.customer &&
                    state.loads.selectedLoad.customer.process_type ===
                      "quickpay"
                  ? "Quickpay"
                  : "Not Factored"
            },
      rate_confirmation_amount:
        state.loads.selectedLoad.rate_confirmation_amount,
      load_reimbursement: state.loads.selectedLoad.load_reimbursement,
      load_deduction: state.loads.selectedLoad.load_deduction,
      invoice_notes: state.loads.selectedLoad.invoice_notes,
      bill_of_lading: state.loads.selectedLoad.bill_of_lading,
      bill_of_lading_number: state.loads.selectedLoad.bill_of_lading_number,
      fuel_advance_from:
        state.loads.selectedLoad.fuel_advance_from === 0
          ? { label: "Factor Company", value: 0 }
          : { label: "Broker/Customer", value: 1 }
    },
    initialized: true,
    enableReinitialize: true,
    fuelValue: selector(state, "fuel_advance_amount")
  }),
  {
    updateLoad
  } // bind account loading action creator
)(NeedBol);

export default NeedBol;
