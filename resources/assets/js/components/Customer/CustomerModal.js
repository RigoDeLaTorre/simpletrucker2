import React from "react";
import { Link } from "react-router-dom";
import { normalizePhone } from "../forms/validation/normalizeForm";

const CustomerModal = ({
  customerName,
  customerAddress,
  customerCity,
  customerState,
  customerZipCode,
  customerPhone,
  customerFax,
  customerEmail,
  customerBillName,
  customerBillAddress,
  customerBillCity,
  customerBillState,
  customerBillZipCode,
  customerBillPhone,
  customerBillFax,
  customerBillEmail
}) => (
  <div id="modal1" className="modal modal-customer">
    <div className="modal-content">
      <div className="customer-container col s12">
        <div className="customer-profile col s6">
          <div className="row col s12">
            <h1>Profile</h1>
          </div>
          <div className="modal-info-container">
            <div className="customer-info">
              <div className="address-group">
                <i className="material-icons">business</i>
                <div className="address-container">
                  <h4>{customerName}</h4>
                  <h4>{customerAddress}</h4>
                  <h4>
                    {customerCity} {customerState}, {customerZipCode}
                  </h4>
                </div>
              </div>
            </div>
            <div className="contact-group">
              <h4>
                <i className="material-icons">call</i>
                <a href={`tel:${customerPhone}`}>
                  {normalizePhone(customerPhone)}
                </a>
              </h4>
              <h4>
                <img src="/img/icons/printer.svg" />
                {normalizePhone(customerFax)}
              </h4>
              <h4>
                <i className="material-icons">email</i>
                <a href={`mailto:${customerEmail}`}>{customerEmail}</a>
              </h4>
            </div>
          </div>
        </div>
        <div className="customer-accounting col s6">
          <div className="row col s12">
            <h1>Invoice/Accounting</h1>
          </div>
          <div className="modal-info-container">
            <div className="customer-info">
              <div className="address-group">
                <i className="material-icons">business</i>
                <div className="address-container">
                  <h4>{customerBillName}</h4>
                  <h4>{customerBillAddress}</h4>
                  <h4>
                    {customerBillCity} {customerBillState},{" "}
                    {customerBillZipCode}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-group">
            <h4>
              <i className="material-icons">call</i>
              <a href={`tel:${customerBillPhone}`}>
                {normalizePhone(customerBillPhone)}
              </a>
            </h4>
            <h4>
              <img src="/img/icons/printer.svg" />
              {normalizePhone(customerBillFax)}
            </h4>
            <h4>
              <i className="material-icons">email</i>
              <a href={`mailto:${customerBillEmail}`}>{customerBillEmail}</a>
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-footer">
      <section className="details-button">
        <Link
          to="/customers/edit"
          className="modal-close waves-effect waves-green btn red darken-4 left"
        >
          Edit<i className="material-icons right">edit</i>
        </Link>
        <a
          href="#!"
          className="modal-close waves-effect waves-green btn grey darken-4 right"
        >
          Close<i className="material-icons right">close</i>
        </a>
      </section>
    </div>
  </div>
);

export default CustomerModal;
