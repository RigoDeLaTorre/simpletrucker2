import React from "react";
import { Link } from "react-router-dom";
import { normalizePhone } from "../forms/validation/normalizeForm";

const DriverModal = ({
  currentSelected,
  theme,
  createDriverUser,
  historyPush,
  handleDelete
}) => {
  const {
    driver_first_name,
    driver_last_name,
    driver_address,
    driver_city,
    driver_state,
    driver_zip,
    driver_phone,
    driver_fax,
    driver_email,
    driver_license_number,
    driver_license_expiration,
    driver_pay_amount,
    driver_hire_date
  } = currentSelected;

  return (
    <div id="modal1" className="modal modal-driver">
      <div
        className={
          theme == 2
            ? "modal-content modal-content--themeLight"
            : "modal-content"
        }
      >
        <div className="permanentlyDeleteModal" onClick={handleDelete}>
          delete
        </div>
        <div className="modal-driver__container col s12">
          <div className="driver-profile col s6">
            <div className="row col s12">
              <h1
                className="modal-driver__title modal-driver--capitalize"
                onClick={() => (window.location = "/driver/adduser")}
              >
                Profile
              </h1>
            </div>
            <div className="row col s12">
              <h4 className="modal-driver__h4 modal-driver__driverName modal-driver--capitalize">
                <i className="material-icons">person</i>
                {driver_first_name} {driver_last_name}
              </h4>
              <div className="modal-driver__addressGroup">
                <i className="material-icons modal-driver__material-icons">
                  home
                </i>
                <div className="address-container">
                  <h4 className="modal-driver__h4 modal-driver--capitalize">
                    {driver_address}{" "}
                  </h4>
                  <h4 className="modal-driver__h4 modal-driver--capitalize">
                    {driver_city} {driver_state}, {driver_zip}
                  </h4>
                </div>
              </div>
              <div className="modal-driver__contactGroup">
                <h4 className="modal-driver__h4">
                  <i className="material-icons modal-driver__material-icons">
                    call
                  </i>
                  <a
                    href={`tel:${driver_phone}`}
                    className="modal-driver__contactInfo"
                  >
                    {normalizePhone(driver_phone)}
                  </a>
                </h4>
                <h4 className="modal-driver__h4 modal-driver__contactInfo">
                  <img
                    className="modal-driver__svgIcon modal-driver__contactInfo"
                    src="/img/icons/printer.svg"
                  />
                  {normalizePhone(driver_fax)}
                </h4>
                <h4 className="modal-driver__h4 modal-driver__contactInfo">
                  <i className="material-icons">email</i>
                  <a
                    className="modal-driver__contactInfo"
                    href={`mailto:${driver_email}`}
                  >
                    {driver_email}
                  </a>
                </h4>
              </div>
            </div>
          </div>
          <div className="modal-driver__hiringSection col s6">
            <div className="row col s12">
              <h1 className="modal-driver__title">Hiring Info</h1>
            </div>
            <div className="row col s12">
              <div className="modal-driver__licenseGroup">
                <h4 className="modal-driver__h4 modal-driver--capitalize">
                  <i className="material-icons modal-driver__material-icons">
                    drive_eta
                  </i>
                  License Number : {driver_license_number}
                </h4>
                <h4 className="modal-driver__h4 modal-driver--capitalize">
                  <i className="material-icons modal-driver__material-icons">
                    access_time
                  </i>{" "}
                  Expiration : {driver_license_expiration}
                </h4>
              </div>
              <div className="modal-driver__contactGroup">
                <h4 className="modal-driver__h4 modal-driver--capitalize">
                  <i className="material-icons modal-driver__material-icons">
                    attach_money
                  </i>
                  Pay/Salary : {driver_pay_amount} cents per mile
                </h4>
                <h4 className="modal-driver__h4 modal-driver--capitalize">
                  <i className="material-icons modal-driver__material-icons">
                    date_range
                  </i>
                  Hire Date :{driver_hire_date}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <section className="details-button">
          <Link
            to="/drivers/edit"
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
};

export default DriverModal;
