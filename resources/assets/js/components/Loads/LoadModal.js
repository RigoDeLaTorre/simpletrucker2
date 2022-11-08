import _ from "lodash";
import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { convertDate } from "../common";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { updateLoadStatus } from "../../actions/loads";
import {
  processTypes,
  processTypesNoQuickPay,
  processTypesNoFactor
} from "../forms/validation/processTypeOptions";

import { renderTextArea, renderField, renderSelectField } from "../forms";

import { normalizeRateAmount } from "../forms/validation";
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
} from "../forms/validation/fieldValidations";

class LoadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bol:
        this.props.loads.selectedLoad.load_status === "delivered" ? true : false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loads.selectedLoad !== this.props.loads.selectedLoad) {
      this.setState({
        bol:
          this.props.loads.selectedLoad.load_status === "delivered"
            ? true
            : false
      });
      setTimeout(() => {
        let elems = document.querySelectorAll("select");
        let instances = M.FormSelect.init(elems);
        let collapsibleElem = document.querySelectorAll(".collapsible");
        let collapsibleInstance = M.Collapsible.init(collapsibleElem);
      }, 0);
    }
  }
  componentDidMount() {
    setTimeout(() => {
      let elems = document.querySelectorAll("select");
      let instances = M.FormSelect.init(elems);
      let collapsibleElem = document.querySelectorAll(".collapsible");
      let collapsibleInstance = M.Collapsible.init(collapsibleElem);
    }, 0);
  }

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

  onSubmit({
    load_status,
    load_reimbursement,
    load_deduction,
    invoice_notes,
    load_notes,
    bill_of_lading,
    bill_of_lading_number,
    id,
    invoice_id
  }) {
    load_status = this.state.bol === true ? "delivered" : "active";

    let newValues = {
      load_status,
      load_reimbursement,
      load_deduction,
      invoice_notes,
      load_notes,
      bill_of_lading,
      bill_of_lading_number,
      id,
      invoice_id
    };

    this.props.updateLoadStatus(newValues, () => {
      this.props.handleFilterButton();
    });
    M.toast({
      html: `Load Id# ${newValues.invoice_id} ***  updated !`,
      classes: "materialize__toastUpdated"
    });
  }

  handleSwitch = event => {
    this.setState({
      bol: !this.state.bol
    });
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <div id="modal2" className="modal load-modal">
        {_.isEmpty(this.props.loads.selectedLoad) ||
        !this.props.loads ||
        !this.props.loads.selectedLoad ||
        !this.props.loads.selectedLoad.customer ||
        !this.props.loads.selectedLoad.driver ||
        !this.props.loads.selectedLoad.pickups ||
        !this.props.loads.selectedLoad.deliveries ? (
          <h4>none</h4>
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
                  <Field
                    label="BOL # :"
                    name="bill_of_lading_number"
                    component={renderField}
                    className="col s12"
                    type="text"
                    validate={[required, maxLength100]}
                    columnStyle="true"
                  />

                  <Field
                    label="Reimbursements :"
                    name="load_reimbursement"
                    component={renderField}
                    className="col s12"
                    type="number"
                    validate={[required, number]}
                    columnStyle="true"
                  />

                  <Field
                    label="Deductions :"
                    name="load_deduction"
                    component={renderField}
                    className="col s12"
                    type="number"
                    validate={[required, number]}
                    columnStyle="true"
                  />
                </div>

                <ul className="collapsible modal__collapsible">
                  <li>
                    <div className="collapsible-header modal__collapsibleHeader modal__collapsibleHeader--field">
                      <i className="material-icons">arrow_drop_down</i> Load
                      Notes
                    </div>
                    <div className="collapsible-body modal__collapsibleBody">
                      <Field
                        label="Load Notes"
                        name="load_notes"
                        component={renderTextArea}
                        className="col s12"
                        type="textarea"
                        labelClass="textarea__notes"
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

                <div className="switch">
                  <label>
                    Active
                    <input
                      type="checkbox"
                      name="load_status"
                      onChange={this.handleSwitch}
                      checked={this.state.bol}
                    />{" "}
                    <span className="lever" />
                    Delivered
                  </label>
                </div>

                <div className="form__saveContainer form__saveContainer--flexSpaceBetween">
                  <div className="form__buttonContainer">
                    <Link
                      to="/loads/edit"
                      className="btn-floating btn-large red left"
                    >
                      <i className="large material-icons">edit</i>
                    </Link>
                    <h4 className="form__buttonContainer__buttonTitle">
                      Edit Load
                    </h4>
                  </div>

                  <div className="form__buttonContainer">
                    <button
                      className="btn-floating btn-large green right"
                      type="submit"
                      disabled={submitting}
                    >
                      {" "}
                      <i className="large material-icons">save</i>
                    </button>
                    <h4 className="form__buttonContainer__buttonTitle">
                      Update Load
                    </h4>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

LoadModal = reduxForm({
  form: "LoadModalForm"
})(LoadModal);

LoadModal = connect(
  state => ({
    company: state.company,
    loads: state.loads,
    settings: state.settings,
    initialValues: {
      id: state.loads.selectedLoad.id,
      invoice_id: state.loads.selectedLoad.invoice_id,
      load_reimbursement: state.loads.selectedLoad.load_reimbursement,
      load_deduction: state.loads.selectedLoad.load_deduction,
      invoice_notes: state.loads.selectedLoad.invoice_notes,
      load_notes: state.loads.selectedLoad.load_notes,
      load_status:
        state.loads.selectedLoad.load_status === "delivered" ? true : false,
      bill_of_lading_number: state.loads.selectedLoad.bill_of_lading_number
    },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateLoadStatus
  } // bind account loading action creator
)(LoadModal);

export default LoadModal;
