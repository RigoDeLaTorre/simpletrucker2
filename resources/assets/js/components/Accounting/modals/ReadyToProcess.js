import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { convertDate } from "../../common";
import { updateLoad } from "../../../actions/loads/updateLoad.js";
import processTypes from "../../forms/validation/processTypeOptions";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";

class ReadyToProcess extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      let collapsibleElem = document.querySelectorAll(".collapsible");
      let collapsibleInstance = M.Collapsible.init(collapsibleElem);
    }, 0);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loads.selectedLoad !== this.props.loads.selectedLoad) {
      setTimeout(() => {
        let collapsibleElem = document.querySelectorAll(".collapsible");
        let collapsibleInstance = M.Collapsible.init(collapsibleElem);
      }, 0);
    }
  }
  render() {
    const {
      loadStatus,
      rateconfirmationPdfUrl,
      bolPdfUrl,
      handleToggle,
      handleToggleLoadProcessed,
      handleCheckedLoadStatus,
      handleCheckedBol,
      handleCheckedLoadProcessed,
      handleRenderPickupAddress,
      handleRenderDeliveryAddress
    } = this.props;

    return (
      <div id="modal-readyToProcess" className="modal load-modal">
        {this.props.loads.selectedLoad &&
        this.props.loads.selectedLoad.customer &&
        this.props.loads.selectedLoad.driver ? (
          <div>
            <div className="modal-content modal-content--noPadding">
              <div className="modal__topBar">
                <h4 className="modal__topBar__text">
                  Invoice #{this.props.loads.selectedLoad.invoice_id}
                </h4>
                <div>
                  <h4 className="modal__topBar__text modal__topBar__customerTitle">
                    {" "}
                    {
                      this.props.loads.selectedLoad.customer.customer_name
                    } # {this.props.loads.selectedLoad.load_reference}
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
                          {
                            this.props.loads.selectedLoad.driver
                              .driver_first_name
                          }{" "}
                          {
                            this.props.loads.selectedLoad.driver
                              .driver_last_name
                          }
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
                        Process Type:{" "}
                        {this.props.loads.selectedLoad.load_processed_type}
                      </div>
                      <div className="collapsible-body modal__collapsibleBody">
                        <h3>Options</h3>
                        <h4>
                          Preferred :{" "}
                          {this.props.loads.selectedLoad.customer
                            .process_type == "quickpay"
                            ? "Quickpay " +
                              this.props.loads.selectedLoad.customer
                                .quickpay_charge +
                              "%"
                            : this.props.loads.selectedLoad.customer
                                .process_type == "factor"
                            ? "Factor " +
                              this.props.company.factory_company_process_fee +
                              " %"
                            : "Not Factored"}
                        </h4>
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
                          {this.props.company.factory_company_process_fee !=
                            0 &&
                          this.props.company.factory_company_process_fee != null
                            ? this.props.company.factory_company_process_fee +
                              " %"
                            : "N/A"}
                        </h4>
                      </div>
                    </li>
                  </ul>
                  <div className="group-details col s12">
                    <h4 className="modal-content__h4 details-title">
                      Reimbursement
                    </h4>
                    <h4 className="modal-content__h4 details-info">
                      {this.props.loads.selectedLoad.load_reimbursement}
                    </h4>
                  </div>
                  <div className="group-details col s12">
                    <h4 className="modal-content__h4 details-title">
                      Deductions
                    </h4>
                    <h4 className="modal-content__h4 details-info">
                      {this.props.loads.selectedLoad.load_deduction}
                    </h4>
                  </div>
                  <div className="group-details col s12">
                    <h4 className="modal-content__h4 details-title">
                      Fuel Advance
                    </h4>
                    <h4 className="modal-content__h4 details-info">
                      {this.props.loads.selectedLoad.fuel_advance_amount}
                    </h4>
                  </div>
                  <div className="group-details col s12">
                    <h4 className="modal-content__h4 details-title">
                      Fuel Advance Fee
                    </h4>
                    <h4 className="modal-content__h4 details-info">
                      {this.props.loads.selectedLoad.fuel_advance_fee}
                    </h4>
                  </div>
                  {loadStatus == "none" ? (
                    <div className="switch">
                      <label>
                        Active
                        <input
                          type="checkbox"
                          name="isDelivered"
                          onChange={handleToggle}
                          checked={
                            this.props.loads.selectedLoad.load_status ==
                            "delivered"
                              ? true
                              : false
                          }
                        />{" "}
                        <span className="lever" />
                        Delivered
                      </label>
                    </div>
                  ) : (
                    ""
                  )}

                  {loadStatus == "ready" ? (
                    <div className="switch">
                      <label>
                        Not Processed
                        <input
                          type="checkbox"
                          name="isProcessed"
                          onChange={handleToggleLoadProcessed}
                          checked={handleCheckedLoadProcessed}
                        />{" "}
                        <span className="lever" />
                        Processed
                      </label>
                    </div>
                  ) : (
                    ""
                  )}

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

                <div className="group load-pickups load-pickups--flex1 capitalize">
                  <ul className="collapsible modal__collapsible">
                    {handleRenderPickupAddress}
                    {handleRenderDeliveryAddress}
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
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <section className="details-button">
                <Link
                  to="/accounting/edit"
                  className="modal-close waves-effect waves-green btn red darken-4 left"
                >
                  Edit<i className="material-icons right">edit</i>
                </Link>
                <a
                  href="#modal-invoice"
                  className="modal-trigger waves-effect waves-green btn grey darken-4 center"
                >
                  Preview Invoice
                  <i className="material-icons right">pageview</i>
                </a>
                <a
                  href="#!"
                  className="modal-close waves-effect waves-green btn grey darken-4 right"
                >
                  Close<i className="material-icons right">close</i>
                </a>
              </section>
            </div>
          </div>
        ) : (
          <div className="modal-content">testing</div>
        )}
      </div>
    );
  }
}

ReadyToProcess = reduxForm({
  form: "ReadyToProcess"
})(ReadyToProcess);

ReadyToProcess = connect(
  state => ({
    company: state.company,
    loads: state.loads,
    settings: state.settings
  }),
  {
    updateLoad
  } // bind account loading action creator
)(ReadyToProcess);

export default ReadyToProcess;
