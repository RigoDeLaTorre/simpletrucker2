import React, { Component } from "react";
import Select from "react-select";
let converter = require("json-2-csv");
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import { connect } from "react-redux";
import { normalizePhone } from "../forms/validation/normalizeForm";
import {
  selectPayrollDriver,
  clearDriverPayroll
} from "../../actions/accounting";
import { renderSelectFieldReactSelect } from "../forms";
import { selectedDriver } from "../../actions/driver/selectedDriver.js";
import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
import { fetchAllLoadsDetails } from "../../actions/loads/fetchAllLoadsDetails.js";
// import FilterButtons from '../Loads/filterButtonsLoads/FilterButtons.js'
import FilterButtonsDrivers from "./filterButtons/FilterButtonsDrivers.js";
import {
  SearchBar,
  Pagination,
  convertDate,
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from "../common";
import DisplayLoadTable from "../common/DisplayLoadTable";
import AccountingDriversPayModalEdit from "./modals/AccountingDriversPayModalEdit";

class AccountingDrivers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      currentDisplayedDrivers: this.props.driver,
      currentDisplayedLoads: this.props.loads.loads,
      loadStatus: "unpaid",
      allLength: "",
      unpaidLength: "",
      paidLength: "",
      cancelledLength: "",
      searchPhone: "",
      searchTerm: "",
      customerPicked: "all",
      currentPage: 1,
      resultsPerPage: 50
    };
  }

  renderCsv = () => {
    let options = { expandArrayObjects: true };
    const array = this.state.currentDisplayedLoads.map(load => {
      return {
        Load: load.invoice_id,
        DriverFirstName: load.driver.driver_first_name,
        DriverLastName: load.driver.driver_last_name,
        Pickup: load.pickups.map(
          item =>
            ` ${convertDate(item.pickup_date)} ${item.pickup_city} ${
              item.pickup_state
            }`
        ),
        Delivery: load.deliveries.map(
          item =>
            ` ${convertDate(item.delivery_date)} ${item.delivery_city} ${
              item.delivery_state
            }`
        ),
        Customer: load.customer.customer_name,
        RateConfirmation: load.load_reference,
        Status: load.load_status,
        DriverPayment: load.driver_paid_amount
          ? load.driver_paid_amount
          : "Unpaid"
      };
    });
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `DriverPayrollHistory_${this.state.loadStatus}.csv`; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
  };

  initMaterialize() {
    setTimeout(() => {
      let modal = document.querySelectorAll(".modal");
      let modalInstance = M.Modal.init(modal);
      let selectInstance3 = document.querySelectorAll("select");
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3);
    }, 0);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.fetchDrivers();
    this.props.fetchAllLoadsDetails(() => {
      this.handleFilterButton();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedDrivers != this.state.currentDisplayedDrivers
    ) {
      this.initMaterialize();
      this.handleFilterButton();
    }
    // NEWLY ADDED FEB 28, 2019
    if (prevProps.loads.loads != this.props.loads.loads) {
      this.initMaterialize();
      this.handleFilterButton();
      //
    }
    if (
      prevProps.currentLoadsSelected.length !==
      this.props.currentLoadsSelected.length
    ) {
      this.initMaterialize();
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  driverModal(driver) {
    this.props.selectedDriver(driver);
  }

  handleSearchPhone = event => {
    let val = event.target.name;
    //target name will be  "name"||"phone"
    if (val == "phone") {
      let term = normalizePhone(event.target.value);
      this.setState(
        {
          searchPhone: term,
          searchTerm: ""
        },
        () => runPhoneSearch()
      );

      let runPhoneSearch = () => {
        let phone = this.state.searchPhone.split("-").join("");
        let searchResult = this.props.driver.filter(function(driver) {
          return driver.driver_phone.includes(phone);
        });

        this.setState({
          currentDisplayedDrivers: searchResult
        });
      };
    } else {
      let term = event.target.value.toLowerCase();
      this.setState(
        {
          searchPhone: "",
          searchTerm: term
        },
        () => runSearchTerm()
      );

      let runSearchTerm = () => {
        let searchTerm = this.state.searchTerm;
        let searchResult = this.props.driver.filter(function(driver) {
          return (
            driver.driver_first_name.toLowerCase().includes(searchTerm) ||
            driver.driver_last_name.toLowerCase().includes(searchTerm) ||
            driver.driver_email.toLowerCase().includes(searchTerm)
          );
        });

        this.setState({
          currentDisplayedDrivers: searchResult
        });
      };
    }
  };

  //Search field, updates REACT STATE only based on search by name, email

  handleLoadFilters = (target, e) => {
    switch (target) {
      case "firstNameAsc":
        let firstNameAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return a.driver_first_name.localeCompare(b.driver_first_name);
        });
        this.setState({
          currentDisplayedDrivers: firstNameAsc
        });
        break;
      case "firstNameDesc":
        let firstNameDesc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return b.driver_first_name.localeCompare(a.driver_first_name);
        });
        this.setState({
          currentDisplayedDrivers: firstNameDesc
        });
        break;
      case "lastNameAsc":
        let lastNameAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return a.driver_last_name.localeCompare(b.driver_last_name);
        });
        this.setState({
          currentDisplayedDrivers: lastNameAsc
        });
        break;
      case "lastNameDesc":
        let lastNameDesc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return b.driver_last_name.localeCompare(a.driver_last_name);
        });
        this.setState({
          currentDisplayedDrivers: lastNameDesc
        });
        break;
      default:
    }
  };

  renderTopNav() {
    const drivers = this.props.driver;

    return (
      <div className="input-field col s12 top-section__customer-search-field">
        <h1 className="top-section__customer-search-field__title">
          Choose driver
        </h1>
        <select
          className="customer-select-box"
          onChange={this.handleAccountingChange}
        >
          <option
            defaultValue
            className="top-section__customer-search-field__option"
            key="all"
            value="all"
          >
            All
          </option>
          {drivers.map(driver => {
            return (
              <option
                className="top-section__customer-search-field__option"
                key={driver.id}
                value={driver.id}
              >
                {driver.driver_first_name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  handleAccountingChange = event => {
    this.setState(
      {
        customerPicked: event.target.value
      },
      () => this.handleFilterButton()
    );
  };

  handleFilterButton = (target = this.state.loadStatus, event) => {
    const loads = this.props.loads.loads;
    const customerPicked = this.state.customerPicked;
    this.props.clearDriverPayroll();

    {
      /*FILTER BUTTON ALL   */
    }
    if (target == "all") {
      if (customerPicked === "all") {
        let currentLoads = loads.filter(
          load => load.load_status == "delivered"
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.driver.id == customerPicked && load.load_status == "delivered"
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      }
      {
        /*FILTER BUTTON ACTIVE   */
      }
    } else if (target == "unpaid") {
      if (customerPicked === "all") {
        let currentLoads = loads.filter(
          load =>
            load.load_status == "delivered" && load.driver_paid_amount === null
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.load_status == "delivered" &&
            load.driver.id == customerPicked &&
            load.driver_paid_amount === null
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      }

      {
        /*FILTER BUTTON DELIVERED   */
      }
    } else if (target == "paid") {
      if (customerPicked === "all") {
        let currentLoads = loads.filter(
          load =>
            load.load_status == "delivered" && load.driver_paid_amount != null
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.load_status == "delivered" &&
            load.driver.id == customerPicked &&
            load.driver_paid_amount != null
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      }
    } else if (target == "cancelled") {
      let currentLoads = loads.filter(load => load.load_status == target);
      if (customerPicked === "all") {
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == customerPicked
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: currentLoads.length / this.state.resultsPerPage,
          currentPage: 1
        });
      }
    }

    this.runLoadLength();
  };

  runLoadLength = () => {
    const customerPicked = this.state.customerPicked;
    if (customerPicked === "all") {
      let unpaidLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "delivered" && load.driver_paid_amount === null
      ).length;
      let paidLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "delivered" && load.driver_paid_amount != null
      ).length;
      let cancelledLength = this.props.loads.loads.filter(
        load => load.load_status == "cancelled"
      ).length;
      let allLength = this.props.loads.loads.filter(
        load => load.load_status == "delivered"
      ).length;

      this.setState({
        unpaidLength,
        paidLength,
        cancelledLength,
        allLength
      });
    } else {
      let unpaidLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "delivered" &&
          load.driver.id == customerPicked &&
          load.driver_paid_amount === null
      ).length;
      let paidLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "delivered" &&
          load.driver.id == customerPicked &&
          load.driver_paid_amount != null
      ).length;
      let cancelledLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "cancelled" && load.driver.id == customerPicked
      ).length;
      let allLength = this.props.loads.loads.filter(
        load =>
          load.driver.id == customerPicked && load.load_status == "delivered"
      ).length;

      this.setState({
        unpaidLength,
        paidLength,
        cancelledLength,
        allLength
      });
    }
  };

  loadModal = load => {
    this.props.selectPayrollDriver(load);
    this.setState({
      currentLoad: load
    });
  };

  //Renders the table/list of loads
  renderList = () => {
    if (this.state.currentDisplayedLoads.length == 0) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: "26px" }}>No Loads Found</td>
        </tr>
      );
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage;
        let currentPage = this.state.currentPage;
        const loads = this.state.currentDisplayedLoads.slice(
          0,
          currentPage * resultsPerPage
        );
        let totalPages = Math.ceil(loads.length / resultsPerPage);
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              key={load.id}
              onClick={() => this.loadModal(load)}
            >
              <td className="cell invoice modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.invoice_id}</h5>
              </td>
              <td className="cell driver modal-trigger__td">
                <div className="modal-trigger__driver">
                  <h5 className="modal-trigger__h5 modal-trigger__driver__driverName">
                    {load.driver.driver_first_name}{" "}
                    {load.driver.driver_last_name.slice(0, 1)}.
                  </h5>
                </div>
              </td>
              <td className="cell modal-trigger__td modal-trigger__pickup">
                <h5 className="modal-trigger__h5">
                  {load.pickups[0]
                    ? convertDate(load.pickups[0].pickup_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.pickups[0] ? load.pickups[0].pickup_name : "No Pickup "}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.pickups[0]
                    ? `${load.pickups[0].pickup_city}, ${load.pickups[0].pickup_state}`
                    : "No City"}
                </h4>
              </td>
              <td className="cell pickup-details modal-trigger__td">
                <img
                  className="modal-trigger__arrow-img"
                  src="/img/right-arrow.svg"
                />

                <h5 className="modal-trigger__h5 modal-trigger__h5--pickup">
                  {load.pickups.length < 2
                    ? load.pickups.length + " Pickup"
                    : load.pickups.length + " Pickups"}
                </h5>
                <h5 className="modal-trigger__h5">
                  {load.deliveries && load.deliveries.length < 2
                    ? load.deliveries.length + " Drop"
                    : load.deliveries.length + " Drops"}
                </h5>
              </td>
              <td className="cell modal-trigger__td modal-trigger__dropoff">
                <h5 className="modal-trigger__h5">
                  {load.deliveries
                    ? convertDate(load.deliveries.slice(-1).pop().delivery_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.deliveries
                    ? load.deliveries.slice(-1).pop().delivery_name
                    : "No Name"}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.deliveries
                    ? `${load.deliveries.slice(-1).pop().delivery_city}, ${
                        load.deliveries.slice(-1).pop().delivery_state
                      }`
                    : "No City"}
                </h4>
              </td>

              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.customer.customer_name}
                </h5>
                <h5 className="modal-trigger__h5">
                  Pro # {load.load_reference}
                </h5>
              </td>

              <td className="cell modal-trigger__td">
                $ {load.rate_confirmation_amount}
              </td>
              <td className="cell modal-trigger__td">{load.load_status}</td>
              <td className="material-icons cell modal-trigger__td">
                {this.props.currentLoadsSelected.find(
                  curr => curr.id === load.id
                )
                  ? "check_circle"
                  : "panorama_fish_eye"}
              </td>
            </tr>
          );
        });
      } else {
        let resultsPerPage = this.state.resultsPerPage;
        let currentPage = this.state.currentPage;
        const loads = this.state.currentDisplayedLoads.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        );
        let totalPages = Math.ceil(loads.length / resultsPerPage);
        return loads.map(load => {
          return (
            <tr
              className="modal-trigger"
              key={load.id}
              onClick={() => this.loadModal(load)}
            >
              <td className="cell invoice modal-trigger__td">
                <h5 className="modal-trigger__h5">{load.invoice_id}</h5>
              </td>
              <td className="cell driver modal-trigger__td">
                <div className="modal-trigger__driver">
                  <h5 className="modal-trigger__h5 modal-trigger__driver__driverName">
                    {load.driver.driver_first_name}{" "}
                    {load.driver.driver_last_name.slice(0, 1)}.
                  </h5>
                </div>
              </td>
              <td className="cell modal-trigger__td modal-trigger__pickup">
                <h5 className="modal-trigger__h5">
                  {load.pickups[0]
                    ? convertDate(load.pickups[0].pickup_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.pickups[0] ? load.pickups[0].pickup_name : "No Pickup "}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.pickups[0]
                    ? `${load.pickups[0].pickup_city}, ${load.pickups[0].pickup_state}`
                    : "No City"}
                </h4>
              </td>
              <td className="cell pickup-details modal-trigger__td">
                <img
                  className="modal-trigger__arrow-img"
                  src="/img/right-arrow.svg"
                />

                <h5 className="modal-trigger__h5 modal-trigger__h5--pickup">
                  {load.pickups.length < 2
                    ? load.pickups.length + " Pickup"
                    : load.pickups.length + " Pickups"}
                </h5>
                <h5 className="modal-trigger__h5">
                  {load.deliveries && load.deliveries.length < 2
                    ? load.deliveries.length + " Drop"
                    : load.deliveries.length + " Drops"}
                </h5>
              </td>
              <td className="cell modal-trigger__td modal-trigger__dropoff">
                <h5 className="modal-trigger__h5">
                  {load.deliveries
                    ? convertDate(load.deliveries.slice(-1).pop().delivery_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.deliveries
                    ? load.deliveries.slice(-1).pop().delivery_name
                    : "No Name"}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.deliveries
                    ? `${load.deliveries.slice(-1).pop().delivery_city}, ${
                        load.deliveries.slice(-1).pop().delivery_state
                      }`
                    : "No City"}
                </h4>
              </td>

              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.customer.customer_name}
                </h5>
                <h5 className="modal-trigger__h5">
                  Pro # {load.load_reference}
                </h5>
              </td>

              <td className="cell modal-trigger__td">
                $ {load.rate_confirmation_amount}
              </td>
              <td className="cell modal-trigger__td">{load.load_status}</td>
              <td className="material-icons cell modal-trigger__td">
                {this.props.currentLoadsSelected.find(
                  curr => curr.id === load.id
                )
                  ? "check_circle"
                  : "panorama_fish_eye"}
              </td>
            </tr>
          );
        });
      }
    }
  };

  // Renders the pickup addresses for the modal
  renderModalPickupAddress = () => {
    if (this.state.currentLoad && this.state.currentLoad.pickups) {
      return this.state.currentLoad.pickups.map((pickup, index) => {
        return (
          <div className="group-address" key={pickup.id}>
            <h4>
              PU #{index + 1} : {convertDate(pickup.pickup_date)}
            </h4>
            {pickup.pickup_po_number ? (
              <h4>PO# :{pickup.pickup_po_number}</h4>
            ) : null}
            <h4 className="address-name">{pickup.pickup_name} </h4>
            <h4>{pickup.pickup_address} </h4>
            <h4>
              {pickup.pickup_city} {pickup.pickup_state},{" "}
              {pickup.pickup_zipcode}
            </h4>
          </div>
        );
      });
    }
  };
  renderModalDeliveryAddress = () => {
    if (this.state.currentLoad && this.state.currentLoad.deliveries) {
      return this.state.currentLoad.deliveries.map((delivery, index) => {
        return (
          <div className="group-address" key={delivery.id}>
            <h4>
              Drop #{index + 1} : {convertDate(delivery.delivery_date)}
            </h4>
            {delivery.delivery_po_number ? (
              <h4>PO# :{delivery.delivery_po_number}</h4>
            ) : null}
            <h4 className="address-name">{delivery.delivery_name} </h4>
            <h4>{delivery.delivery_address} </h4>
            <h4>
              {delivery.delivery_city} {delivery.delivery_state},{" "}
              {delivery.delivery_zipcode}
            </h4>
          </div>
        );
      });
    }
  };

  // Renders the pay button
  // If a single load is selected, it will show a modal ONCLICK
  // If multiple loads are selected, it will render a different page ONCLICK.
  renderPayButton = () => {
    let selectedLength = this.props.currentLoadsSelected.length;
    let loadsSelected = this.props.currentLoadsSelected.map(load => (
      <span key={load.id} className="driversPayButton__loadSelected__listItem">
        {load.invoice_id},
      </span>
    ));

    if (selectedLength < 1) {
      return (
        <div className="driversPayButton">
          <div className="driversPayButton__loadSelected">
            <h4 className="driversPayButton__loadSelected__selectedText">
              Loads Selected :{selectedLength}
            </h4>
            <div className="driversPayButton__loadSelected__list">
              {loadsSelected}
            </div>
          </div>
          <div className="driversPayButton__button driversPayButton__button--disabled">
            {this.state.loadStatus === "unpaid" ? "Pay" : "Edit"}
          </div>
        </div>
      );
    }
    if (selectedLength == 1) {
      return (
        <div
          className="driversPayButton modal-trigger"
          data-target="driverPayModalEdit"
        >
          <div className="driversPayButton__loadSelected">
            <h4 className="driversPayButton__loadSelected__selectedText">
              Loads Selected :{selectedLength}
            </h4>
            <div className="driversPayButton__loadSelected__list">
              {loadsSelected}
            </div>
          </div>
          <div
            className={
              this.state.loadStatus === "unpaid"
                ? "driversPayButton__button driversPayButton__button--pay driversPayButton__button--unpaid"
                : "driversPayButton__button driversPayButton__button--edit"
            }
          >
            {this.state.loadStatus === "unpaid" ? "Pay" : "Edit"}
          </div>
        </div>
      );
    }
    if (selectedLength > 1) {
      return (
        <Link
          to="/accounting/driversPayrollEdit"
          className="driversPayButton__button__link"
        >
          <div className="driversPayButton">
            <div className="driversPayButton__loadSelected">
              <h4 className="driversPayButton__loadSelected__selectedText">
                Loads Selected :{selectedLength}
              </h4>
              <div className="driversPayButton__loadSelected__list">
                {loadsSelected}
              </div>
            </div>
            <div
              className={
                this.state.loadStatus === "unpaid"
                  ? "driversPayButton__button driversPayButton__button--pay driversPayButton__button--unpaid"
                  : "driversPayButton__button driversPayButton__button--edit"
              }
            >
              {this.state.loadStatus === "unpaid" ? "Pay" : "Edit"}
            </div>
          </div>
        </Link>
      );
    }
  };

  renderNextPage = () => {
    if (this.state.currentPage < this.state.totalPages) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1
      }));
    }
  };
  renderPrevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage - 1
      }));
    }
  };

  handleResultsPerPage = event => {
    this.setState(
      {
        resultsPerPage: event.value
      },
      () => this.handleFilterButton()
    );
  };

  render() {
    const options = [
      {
        value: "all",
        label: "All"
      },
      ...this.props.driver.map(item => ({
        value: item.id,
        label: item.driver_first_name + " " + item.driver_last_name
      }))
    ];
    return (
      <section
        id="accountingDrivers"
        className="accountingDrivers app-container"
      >
        <LoadingComponent loadingText="Accounting / Drivers" />
        <div className="top-section">
          <div className="top-section__filterMobileGroup top-section__filterMobileGroup--flexSpaceBetween">
            <FilterButtonsDrivers
              handleFilterButton={this.handleFilterButton}
              loadStatus={this.state.loadStatus}
              unpaidLength={this.state.unpaidLength}
              paidLength={this.state.paidLength}
              cancelledLength={this.state.cancelledLength}
              allLength={this.state.allLength}
              type="customer-past-loads"
            />
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Name
              </h4>
              <Select
                label="Customer"
                name="customer_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleAccountingChange}
                defaultValue={options[0]}
                placeholder="Choose Driver"
                options={options}
                styles={
                  this.props.settings &&
                  this.props.settings.settings &&
                  this.props.settings.settings.theme_option_id == 12
                    ? reactSelectStylesPaginationThemeLight
                    : reactSelectStylesPagination
                }
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    //background
                    // neutral0:"white",

                    //border and divider of arrow - initial
                    neutral20: "#2f3c63",

                    //arrow down - after its not pristine
                    neutral60: "#7f64e3",

                    // no options text when user searching
                    neutral40: "orange",
                    //chosen field on dropdown from previous
                    primary: "#7f64e3",

                    //highlight at hover
                    primary25: "#e0d8fe",
                    //Placeholder
                    neutral50: "#8c8bcc",

                    //selectd value text color
                    neutral80: "rgba(0,0,0,0.87)",
                    //hover over container
                    neutral30: "#7f64e3"

                    // neutral5:"#dd4c4c",
                    // neutral10:"#dd4c4c",
                    //
                    // primay50:"#dd4c4c",
                    // neutral70:"#dd4c4c",
                    // neutral90:"#dd4c4c"
                  }
                })}
              />
            </div>
            <Pagination
              loadStatus={this.state.loadStatus}
              currentPage={this.state.currentPage}
              unpaidLength={this.state.unpaidLength}
              paidLength={this.state.paidLength}
              cancelledLength={this.state.cancelledLength}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
            />
          </div>
        </div>
        {this.renderPayButton()}

        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, "invoice-asc")}
          handleDesc={this.handleLoadFilters.bind(this, "invoice-desc")}
          renderList={this.renderList()}
          rowHeaders={[
            "Invoice",
            "Driver",
            "Pickup",
            "Distance",
            "Delivery",
            "Customer",
            "Rate",
            "Status"
          ]}
        />

        <AccountingDriversPayModalEdit
          history={this.props.history}
          loadStatus={this.state.loadStatus}
        />
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    driver: state.drivers.drivers,
    settings: state.settings,
    currentSelected: state.drivers.selectedDriver,
    currentLoadsSelected: state.accounting.loadSelected
  };
}

export default connect(
  mapStatetoProps,
  {
    fetchDrivers,
    selectedDriver,
    selectPayrollDriver,
    clearDriverPayroll,
    fetchAllLoadsDetails
  }
)(AccountingDrivers);
