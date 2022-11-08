import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { updateLoad } from "../../../actions/loads/updateLoad.js";
import { convertDate } from "../../common";
import { updateLoadProcessedPayment } from "../../../actions/loads/updateLoadProcessedPayment.js";
import RenderSelectFieldReactSelectClass from "../../forms/RenderSelectFieldReactSelectClass";
import {
  processTypes,
  processTypesNoQuickPay
} from "../../forms/validation/processTypeOptions";
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

class ModalUnpaid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bol: false,
      focused: "",
      date: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loads.selectedLoad !== this.props.loads.selectedLoad) {
      let elems = document.querySelectorAll("select");
      let selectInstance = M.FormSelect.init(elems);

      let pickupdateUnpaid = document.querySelectorAll(".dateModalUnpaid");
      let pickupdateInstance = M.Datepicker.init(pickupdateUnpaid, {
        onSelect: this.handleDate,
        autoClose: true
      });
      let collapsibleElem = document.querySelectorAll(".collapsible");
      let collapsibleInstance = M.Collapsible.init(collapsibleElem);
    }

    if (prevProps.currentDisplayedLoads != this.props.currentDisplayedLoads) {
      let pickupdateUnpaid = document.querySelectorAll(".dateModalUnpaid");
      let pickupdateInstance = M.Datepicker.init(pickupdateUnpaid, {
        onSelect: this.handleDate,
        autoClose: true
      });
      let collapsibleElem = document.querySelectorAll(".collapsible");
      let collapsibleInstance = M.Collapsible.init(collapsibleElem);
    }
  }
  componentDidMount() {
    let elems = document.querySelectorAll("select");
    let selectInstance = M.FormSelect.init(elems);

    let datePaid = document.querySelectorAll(".dateModalUnpaid");
    let pickupdateInstance = M.Datepicker.init(datePaid, {
      onSelect: this.handleDate,
      autoClose: true
    });
    let collapsibleElem = document.querySelectorAll(".collapsible");
    let collapsibleInstance = M.Collapsible.init(collapsibleElem);
  }

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change(this.state.focused, date);
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

  renderField = ({
    className,
    input,
    label,
    type,
    disabled,
    labelClass,
    inputClass,
    inputGroup,
    meta: { touched, error }
  }) => (
    <div className={`input ${className} `}>
      <div className={inputGroup ? `input-group ${inputGroup}` : "input-group"}>
        <label className={labelClass ? labelClass : ""}>{label}</label>
        <input
          className={inputClass ? `form-control ${inputClass}` : "form-control"}
          autoComplete="new-password"
          autoCorrect="false"
          spellCheck="false"
          type={type}
          disabled={disabled}
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
            {index + 1} :{convertDate(pickup.pickup_date)} -{" "}
            {pickup.pickup_city} , {pickup.pickup_state}
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
            {index + 1} :{convertDate(delivery.delivery_date)} -{" "}
            {delivery.delivery_city}, {delivery.delivery_state}
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
  renderTextArea = ({
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div className={`input-field ${className} `}>
      <label className="active textarea">{label}</label>
      <textarea
        className="form-control materialize-textarea white-text"
        autoComplete="new-password"
        type="text"
        rows="4"
        cols="50"
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

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
  onSubmit({
    id,
    invoice_id,
    customer_paid_amount,
    customer_paid_date,
    factor_fee_percentage,
    factor_fee_other,
    factor_fee_amount,
    factor_total_advanced,
    factor_paid_date,
    factor_reserve_percentage,
    factor_reserve_held,
    factor_reserve_amount_paid,
    factor_reserve_amount_paid_date,
    factor_company_name,
    load_deduction,
    load_reimbursement,
    other_deduction,
    other_reimbursement,
    customer_quickpay_fee
  }) {
    let newValues = {
      id,
      invoice_id,
      customer_paid_amount,
      customer_paid_date,
      factor_fee_percentage,
      factor_fee_other,
      factor_fee_amount,
      factor_total_advanced,
      factor_paid_date,
      factor_reserve_percentage,
      factor_reserve_held,
      factor_reserve_amount_paid,
      factor_reserve_amount_paid_date,
      factor_company_name,
      load_deduction,
      load_reimbursement,
      other_deduction,
      other_reimbursement,
      customer_quickpay_fee
    };

    this.props.updateLoadProcessedPayment(newValues, () => {
      this.props.handleFilterButton();
    });
    M.toast({
      html: `Load Id# ${newValues.invoice_id} ***  updated !`
    });
  }
  changeValues = reserves => {
    setTimeout(() => {
      let total;
      let totalReservesHeld =
        reserves == "reserves"
          ? parseFloat(this.props.factorValues.factor_reserve_held)
          : (
              (parseFloat(
                this.props.loads.selectedLoad.rate_confirmation_amount
              ) +
                parseFloat(this.props.factorValues.load_reimbursement) -
                parseFloat(this.props.factorValues.load_deduction)) *
              (parseFloat(
                this.props.loads.selectedLoad.factor_reserve_percentage
              ) /
                100)
            ).toFixed(2);
      if (this.props.factorValues.factor_reserve_held == 0) {
        total = (
          parseFloat(this.props.loads.selectedLoad.rate_confirmation_amount) -
          parseFloat(this.props.factorValues.load_deduction) +
          parseFloat(this.props.factorValues.load_reimbursement) -
          parseFloat(this.props.factorValues.factor_fee_amount) -
          parseFloat(this.props.factorValues.factor_fee_other) -
          parseFloat(totalReservesHeld) -
          parseFloat(this.props.factorValues.fuel_advance_amount) -
          parseFloat(this.props.factorValues.fuel_advance_fee)
        ).toFixed(2);
      } else {
        total = (
          parseFloat(this.props.loads.selectedLoad.rate_confirmation_amount) -
          parseFloat(this.props.factorValues.load_deduction) +
          parseFloat(this.props.factorValues.load_reimbursement) -
          parseFloat(this.props.factorValues.factor_fee_other) -
          parseFloat(totalReservesHeld) -
          parseFloat(this.props.factorValues.fuel_advance_amount) -
          parseFloat(this.props.factorValues.fuel_advance_fee)
        ).toFixed(2);
      }
      if (reserves == "reserves") {
        this.props.change("factor_total_advanced", total);
      } else {
        this.props.change("factor_reserve_held", totalReservesHeld);
        this.props.change("factor_total_advanced", total);
      }
    }, 0);
  };

  changeValuesReserves = () => {
    setTimeout(() => {
      let total = (
        parseFloat(this.props.factorValues.show_total_invoice) -
        parseFloat(this.props.factorValues.factor_reserve_held) -
        parseFloat(this.props.factorValues.factor_fee_other)
      ).toFixed(2);

      this.props.change("factor_total_advanced", total);
    }, 0);
  };
  changeValuesCustomerPaid = () => {
    setTimeout(() => {
      let total = (
        parseFloat(this.props.loads.selectedLoad.rate_confirmation_amount) -
        parseFloat(this.props.factorValues.load_deduction) +
        parseFloat(this.props.factorValues.load_reimbursement) +
        parseFloat(this.props.factorValues.other_reimbursement) -
        parseFloat(this.props.factorValues.customer_quickpay_fee) -
        parseFloat(this.props.factorValues.other_deduction)
      ).toFixed(2);

      this.props.change("customer_paid_amount", total);
    }, 0);
  };

  handleModalReserves = () => {
    setTimeout(() => {
      let total = (
        parseFloat(this.props.loads.selectedLoad.factor_reserve_held) -
        parseFloat(this.props.factorValues.factor_fee_amount) -
        parseFloat(this.props.factorValues.factor_fee_other) -
        parseFloat(this.props.factorValues.other_deduction) +
        parseFloat(this.props.factorValues.other_reimbursement)
      ).toFixed(2);

      this.props.change("factor_reserve_amount_paid", total);
    }, 0);
  };

  showFields = () => {
    if (this.props.loads.selectedLoad.load_processed_type == "quickpay") {
      return (
        <div className="row load-details-row">
          <div className="row">
            <Field
              label="Load Deduction :"
              name="load_deduction"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Load Reimbursment :"
              name="load_reimbursement"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Customer QuickPay Fee :"
              name="customer_quickpay_fee"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Customer Paid (NET):"
              name="customer_paid_amount"
              component={this.renderField}
              className="col s12 addBorder"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>

          <div className="row">
            <Field
              label="Customer Paid Date"
              name="customer_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              validate={
                this.props.factorValues.customer_paid_amount != 0
                  ? required
                  : null
              }
              onFocus={event => this.setState({ focused: event.target.name })}
            />
          </div>
        </div>
      );
    }
    //FACTORED / PAID
    else if (
      this.props.loads.selectedLoad.load_processed_type == "factor" &&
      this.props.loads.selectedLoad.factor_total_advanced !== null &&
      this.props.loads.selectedLoad.factor_paid_date !== null &&
      this.props.loadStatus != "factor-unpaid-reserves"
    ) {
      return (
        <div className="row load-details-row show-both">
          <div className="row">
            <Field
              label="Factor Paid Date"
              name="factor_paid_date"
              component={this.renderField}
              className="col s12"
              type="text"
              disabled={true}
            />
          </div>

          <div className="row">
            <Field
              label="Load Reimbursment :"
              name="load_reimbursement"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>
          <div className="row">
            <Field
              label="Load Deduction :"
              name="load_deduction"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>
          <div className="row">
            <Field
              label="Other Deduction :"
              name="other_deduction"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Other Reimbursement:"
              name="other_reimbursement"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Customer Paid :"
              name="customer_paid_amount"
              component={this.renderField}
              className="col s12 modalUnpaid__totalRow"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>

          <div className="row">
            <Field
              label="Customer Paid Date"
              name="customer_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              validate={
                this.props.factorValues.customer_paid_amount != 0
                  ? required
                  : null
              }
              onFocus={event => this.setState({ focused: event.target.name })}
            />
          </div>
        </div>
      );
    } else if (
      // FACTOR / UNPAID
      this.props.loads.selectedLoad.load_processed_type == "factor" &&
      this.props.loadStatus == "factor-unpaid" &&
      this.props.loads.selectedLoad.factor_reserve_percentage != 0
    ) {
      return (
        <div className="row load-details-row show-both">
          <div className="row">
            <h2 className="form__modalSectionTitle" />
          </div>

          <div className="row">
            <h2 className="form__modalSectionTitle">Factor</h2>
          </div>
          <div className="row">
            <Field
              label="Load Deduction :"
              name="load_deduction"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Load Reimbursment :"
              name="load_reimbursement"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Fuel Advance :"
              name="fuel_advance_amount"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Fuel Advance Fee :"
              name="fuel_advance_fee"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />

            <Field
              label={`Factor Fee (${this.props.loads.selectedLoad.factor_fee_percentage} %)`}
              name="factor_fee_amount"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />

            <Field
              label="Other Fees :"
              name="factor_fee_other"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="text"
              validate={[required, number]}
            />

            <Field
              label={`Escrow/Reserved (${this.props.loads.selectedLoad.factor_reserve_percentage} %)`}
              name="factor_reserve_held"
              component={this.renderField}
              onChange={() => this.changeValues("reserves")}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
            <Field
              label="Date Paid"
              name="factor_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              validate={required}
              onFocus={event => this.setState({ focused: event.target.name })}
            />
          </div>

          <div className="row modalUnpaid__totalRow">
            <h4>Minus Fuel Adv & fees</h4>
            <Field
              label="Total Advanced"
              labelClass="modalUnpaid__label"
              inputClass="modalUnpaid__input"
              inputGroup="modalUnpaid__inputGroup"
              name="factor_total_advanced"
              component={this.renderField}
              className="col s12 "
              type="text"
              disabled={true}
              validate={[required, number]}
            />
          </div>
        </div>
      );
    } else if (
      // FACTOR / UNPAID
      this.props.loads.selectedLoad.load_processed_type == "factor" &&
      this.props.loadStatus == "factor-unpaid"
    ) {
      return (
        <div className="row load-details-row show-both">
          <div className="row">
            <Field
              label="Total Invoice :"
              name="show_total_invoice"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="number"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label={`Factor Fee (${this.props.loads.selectedLoad.factor_fee_percentage} %)`}
              name="factor_fee_amount"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="number"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Other Fees :"
              name="factor_fee_other"
              component={this.renderField}
              onChange={this.changeValues}
              className="col s12"
              type="number"
              validate={[required, number]}
            />
          </div>

          <div className="row">
            <Field
              label="Date"
              name="factor_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              validate={required}
              onFocus={event => this.setState({ focused: event.target.name })}
            />
          </div>
          <div className="row modalUnpaid__totalRow">
            <Field
              label="Total Advanced"
              labelClass="modalUnpaid__label"
              inputClass="modalUnpaid__input"
              inputGroup="modalUnpaid__inputGroup"
              name="factor_total_advanced"
              component={this.renderField}
              className="col s12 "
              type="number"
              disabled={true}
              validate={[required, number]}
            />
          </div>
        </div>
      );
    } else if (
      //FACTOR /RESERVES UNPAID
      this.props.loads.selectedLoad.load_processed_type == "factor" &&
      this.props.loadStatus == "factor-unpaid-reserves"
    ) {
      return (
        <div className="row load-details-row show-both">
          <div className="row">
            <Field
              label="Reserves Held"
              name="factor_reserve_heldTrue"
              component={this.renderField}
              className="col s12"
              type="text"
              disabled={true}
            />
          </div>
          <div className="row">
            <Field
              label={`Factor Fee (${this.props.loads.selectedLoad.factor_fee_percentage} %)`}
              name="factor_fee_amount"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              onChange={this.handleModalReserves}
            />
          </div>
          <div className="row">
            <Field
              label="ACH/Other Fees :"
              name="factor_fee_other"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              onChange={this.handleModalReserves}
            />
          </div>
          <div className="row">
            <Field
              label="Other Deduction :"
              name="other_deduction"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>
          <div className="row">
            <Field
              label="Other Reimbursement:"
              name="other_reimbursement"
              component={this.renderField}
              className="col s12"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>
          <div className="row">
            <Field
              label="Net Reserves Released:"
              name="factor_reserve_amount_paid"
              component={this.renderField}
              className="col s12 addBorder"
              type="text"
              disabled={true}
              validate={[required]}
            />
          </div>

          <div className="row">
            <Field
              label="Reserves Released Date"
              name="factor_reserve_amount_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              onFocus={event => this.setState({ focused: event.target.name })}
              validate={
                this.props.factorValues.factor_reserve_amount_paid != 0
                  ? required
                  : null
              }
            />
          </div>
        </div>
      );
    } else {
      return (
        //FACTORED NOT PAID
        <div className="row load-details-row">
          <div className="row">
            <Field
              label="Load Deduction :"
              name="load_deduction"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Load Reimbursment :"
              name="load_reimbursement"
              component={this.renderField}
              onChange={this.changeValuesCustomerPaid}
              className="col s12"
              type="text"
              validate={[required, number]}
            />
          </div>
          <div className="row">
            <Field
              label="Customer Paid :"
              name="customer_paid_amount"
              component={this.renderField}
              className="col s12 modalUnpaid__totalRow"
              type="text"
              validate={[required, number]}
              disabled={true}
            />
          </div>

          <div className="row">
            <Field
              label="Customer Paid Date"
              name="customer_paid_date"
              component={this.renderDateField}
              className="col s12"
              type="text"
              dateField="dateModalUnpaid"
              validate={
                this.props.factorValues.customer_paid_amount != 0
                  ? required
                  : null
              }
              onFocus={event => this.setState({ focused: event.target.name })}
            />
          </div>
        </div>
      );
    }
  };
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div id="modal-processedUnpaid" className="modal load-modal">
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
                      Process Type:
                      {this.props.loads.selectedLoad.load_processed_type ==
                      "quickpay"
                        ? "Quickpay " +
                          this.props.loads.selectedLoad.customer
                            .quickpay_charge +
                          "%"
                        : this.props.loads.selectedLoad.load_processed_type ==
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

                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--data">
                      <i className="material-icons">attach_money</i>
                      Reimbursements:{" "}
                      {this.props.loads.selectedLoad.load_reimbursement}
                    </div>
                  </li>
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--data">
                      <i className="material-icons">attach_money</i>Deductions:{" "}
                      {this.props.loads.selectedLoad.load_deduction}
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
                {this.showFields()}
                <div className="button-container">
                  {this.props.loads.selectedLoad.load_processed_type ==
                    "factor" &&
                  this.props.loadStatus == "factor-unpaid-reserves" &&
                  this.props.loads.selectedLoad.customer_paid_date == null ? (
                    <div>
                      <h2
                        style={{
                          color: "#d68686 !important ",
                          letterSpacing: "2px !important "
                        }}
                      >
                        Customer Has Not Paid Yet
                        <br /> Once you have entered that the customer has paid,
                        the submit buttons will show here.
                      </h2>
                    </div>
                  ) : (
                    <div className="buttons">
                      <Link
                        to="/accounting/edit"
                        className="btn-floating btn-large red left-button"
                      >
                        {" "}
                        <i className="large material-icons">edit</i>
                      </Link>

                      <button
                        className="btn-floating btn-large green right-button"
                        type="submit"
                        disabled={submitting}
                      >
                        {" "}
                        <i className="large material-icons">save</i>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const selector = formValueSelector("ProcessedUnpaidForm");

ModalUnpaid = reduxForm({
  form: "ProcessedUnpaidForm"
})(ModalUnpaid);

ModalUnpaid = connect(
  state => ({
    loads: state.loads,
    settings: state.settings,
    company: state.company,
    initialValues: {
      ...state.loads.selectedLoad,
      show_total_invoice: parseFloat(
        state.loads.selectedLoad.rate_confirmation_amount
      ),
      customer_paid_amount:
        state.loads.selectedLoad.load_processed_type != "quickpay"
          ? parseFloat(
              state.loads.selectedLoad.rate_confirmation_amount -
                state.loads.selectedLoad.load_deduction +
                state.loads.selectedLoad.load_reimbursement -
                state.loads.selectedLoad.other_deduction
            )
          : parseFloat(
              state.loads.selectedLoad.rate_confirmation_amount -
                state.loads.selectedLoad.load_deduction +
                state.loads.selectedLoad.load_reimbursement -
                state.loads.selectedLoad.other_deduction -
                (
                  (state.loads.selectedLoad.rate_confirmation_amount +
                    state.loads.selectedLoad.load_reimbursement -
                    state.loads.selectedLoad.load_deduction) *
                  (parseFloat(
                    state.loads.selectedLoad.customer.quickpay_charge
                  ) /
                    100)
                ).toFixed(2)
            ),
      factor_fee_amount:
        ((parseFloat(state.loads.selectedLoad.rate_confirmation_amount) +
          parseFloat(state.loads.selectedLoad.load_reimbursement) -
          parseFloat(state.loads.selectedLoad.load_deduction)) *
          parseFloat(state.loads.selectedLoad.factor_fee_percentage)) /
        100,
      factor_total_advanced:
        state.loads.selectedLoad.factor_reserve_percentage == 0
          ? (
              parseFloat(state.loads.selectedLoad.rate_confirmation_amount) +
              parseFloat(state.loads.selectedLoad.load_reimbursement) -
              parseFloat(state.loads.selectedLoad.load_deduction) -
              parseFloat(state.loads.selectedLoad.fuel_advance_amount) -
              parseFloat(state.loads.selectedLoad.fuel_advance_fee) -
              ((parseFloat(state.loads.selectedLoad.rate_confirmation_amount) +
                parseFloat(state.loads.selectedLoad.load_reimbursement) -
                parseFloat(state.loads.selectedLoad.load_deduction)) *
                parseFloat(state.loads.selectedLoad.factor_fee_percentage)) /
                100
            ).toFixed(2)
          : (
              parseFloat(state.loads.selectedLoad.rate_confirmation_amount) +
              parseFloat(state.loads.selectedLoad.load_reimbursement) -
              parseFloat(state.loads.selectedLoad.load_deduction) -
              parseFloat(state.loads.selectedLoad.fuel_advance_amount) -
              parseFloat(state.loads.selectedLoad.fuel_advance_fee) -
              ((parseFloat(state.loads.selectedLoad.rate_confirmation_amount) +
                parseFloat(state.loads.selectedLoad.load_reimbursement) -
                parseFloat(state.loads.selectedLoad.load_deduction)) *
                parseFloat(
                  state.loads.selectedLoad.factor_reserve_percentage
                )) /
                100
            ).toFixed(2),

      factor_reserve_held: (
        (state.loads.selectedLoad.rate_confirmation_amount +
          state.loads.selectedLoad.load_reimbursement -
          state.loads.selectedLoad.load_deduction) *
        (state.loads.selectedLoad.factor_reserve_percentage / 100)
      ).toFixed(2),
      factor_reserve_heldTrue: state.loads.selectedLoad.factor_reserve_held,

      fuel_advance_from:
        state.loads.selectedLoad.fuel_advance_from === 0
          ? { label: "Factor Company", value: 0 }
          : { label: "Broker/Customer", value: 1 },
      factor_reserve_amount_paid: (
        parseFloat(state.loads.selectedLoad.factor_reserve_held) -
        parseFloat(state.loads.selectedLoad.factor_fee_amount) -
        parseFloat(state.loads.selectedLoad.factor_fee_other) -
        parseFloat(state.loads.selectedLoad.other_deduction) +
        parseFloat(state.loads.selectedLoad.other_reimbursement)
      ).toFixed(2),
      customer_quickpay_fee:
        state.loads.selectedLoad.load_processed_type == "quickpay"
          ? (
              (state.loads.selectedLoad.rate_confirmation_amount +
                state.loads.selectedLoad.load_reimbursement -
                state.loads.selectedLoad.load_deduction) *
              (parseFloat(state.loads.selectedLoad.customer.quickpay_charge) /
                100)
            ).toFixed(2)
          : 0
    },
    initialized: true,
    enableReinitialize: true,
    factorValues: selector(
      state,
      "factor_fee_percentage",
      "factor_fee_amount",
      "factor_fee_other",
      "factor_total_advanced",
      "factor_reserve_held",
      "fuel_advance_amount",
      "fuel_advance_fee",
      "factor_reserve_amount_paid",
      "customer_paid_amount",
      "load_deduction",
      "load_reimbursement",
      "customer_quickpay_fee",
      "other_deduction",
      "other_reimbursement"
    )
  }),
  {
    updateLoad,
    updateLoadProcessedPayment
  } // bind account loading action creator
)(ModalUnpaid);

export default ModalUnpaid;
