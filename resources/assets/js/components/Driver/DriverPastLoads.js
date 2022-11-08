import React, { Component } from "react";
import Select from "react-select";

let converter = require("json-2-csv");
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import { connect } from "react-redux";
import { normalizePhone } from "../forms/validation/normalizeForm";
import {
  dropDownSelectState,
  renderField,
  renderDateField,
  renderTextArea,
  stateOptions
} from "../forms";
import { selectedLoad } from "../../actions/loads";
import { selectedDriver } from "../../actions/driver/selectedDriver.js";
import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
import { fetchAllLoadsDetails } from "../../actions/loads/fetchAllLoadsDetails.js";
import { fetchRequest, fetchComplete } from "../../actions/fetching";
import FilterButtons from "../Loads/filterButtonsLoads/FilterButtons.js";
import {
  SearchBar,
  Pagination,
  convertDate,
  customStyles,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from "../common";

import DisplayLoadTable from "../common/DisplayLoadTable";

import LoadModal from "../Loads/LoadModal";

class DriverPastLoads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allLength: "",
      deliveredLength: "",
      cancelledLength: "",
      activeLength: "",
      date: "",
      currentDisplayedDrivers: this.props.driver,
      currentDisplayedLoads: this.props.loads.loads,
      loadStatus: "active",
      searchPhone: "",
      searchTerm: "",
      customerPicked: "all",
      currentPage: 1,
      resultsPerPage: 50,
      showAllButtons: false,
      searchContainer: false,
      open: false
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
        RateConfirmationNumber: load.load_reference,
        BillOfLading: load.bill_of_lading_number,
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
        downloadLink.download = `DriversPastLoads_${this.state.loadStatus}.csv`; //Name the file here
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
      var elemsSortBy = document.querySelectorAll(".dropdown-triggerSortBy");
      var instanceSortBy = M.Dropdown.init(elemsSortBy, {
        onOpenStart: () => this.startSortBy(""),
        onCloseStart: () => this.endSortBy()
      });
    }, 0);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.props.fetchRequest("Driver Past Loads");
    window.scrollTo(0, 0);
    var elemsSortBy = document.querySelectorAll(".dropdown-triggerSortBy");
    var instanceSortBy = M.Dropdown.init(elemsSortBy, {
      onOpenStart: () => this.startSortBy(""),
      onCloseStart: () => this.endSortBy()
    });
    this.props.fetchDrivers();
    this.props.fetchAllLoadsDetails(() => {
      this.handleFilterButton();
      this.props.fetchComplete();
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedDrivers != this.state.currentDisplayedDrivers
    ) {
      this.initMaterialize();
    }
    // NEWLY ADDED FEB 28, 2019
    if (prevState.currentDisplayedLoads != this.state.currentDisplayedLoads) {
      this.initMaterialize();
      //
    }
  }

  startSortBy = () => {
    this.setState({
      searchContainer: true
    });
  };

  endSortBy = () => {
    this.setState({
      searchContainer: false
    });
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

  // WHEN DRIVER IS SELECTED, THIS IS TRIGGERED TO UPDATE STATE AS TO WHAT DRIVER WAS SELECTED.
  handleAccountingChange = event => {
    this.setState(
      {
        customerPicked: event
      },
      () => this.handleSearch()
    );
  };

  handleSearch = (target = this.state.loadStatus, event) => {
    const loads = this.props.loads.loads;
    let selectedItem = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;
    {
      /*FILTER BUTTON ALL   */
    }
    if (target == "all") {
      if (selectedItem === "all") {
        this.setState({
          currentDisplayedLoads: loads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(load => load.driver.id == selectedItem);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
      {
        /*FILTER BUTTON ACTIVE   */
      }
    } else if (target == "active") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }

      {
        /*FILTER BUTTON DELIVERED   */
      }
    } else if (target == "delivered") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    } else if (target == "cancelled") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    }
  };

  handleFilterButton = (target = this.state.loadStatus, event) => {
    const loads = this.props.loads.loads;
    let selectedItem = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;
    {
      /*FILTER BUTTON ALL   */
    }
    if (target == "all") {
      if (selectedItem === "all") {
        this.setState({
          currentDisplayedLoads: loads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(load => load.driver.id == selectedItem);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
      {
        /*FILTER BUTTON ACTIVE   */
      }
    } else if (target == "active") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }

      {
        /*FILTER BUTTON DELIVERED   */
      }
    } else if (target == "delivered") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    } else if (target == "cancelled") {
      if (selectedItem === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.load_status == target && load.driver.id == selectedItem
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,
          searchId: "",
          searchTerm: "",
          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    }

    this.runLoadLength();
  };

  runLoadLength = () => {
    let customerPicked = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;

    if (customerPicked === "all") {
      let activeLength = this.props.loads.loads.filter(
        load => load.load_status == "active"
      ).length;
      let deliveredLength = this.props.loads.loads.filter(
        load => load.load_status == "delivered"
      ).length;
      let cancelledLength = this.props.loads.loads.filter(
        load => load.load_status == "cancelled"
      ).length;
      let allLength = this.props.loads.loads.length;

      this.setState({
        activeLength,
        deliveredLength,
        cancelledLength,
        allLength
      });
    } else {
      let activeLength = this.props.loads.loads.filter(
        load => load.load_status == "active" && load.driver.id == customerPicked
      ).length;
      let deliveredLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "delivered" && load.driver.id == customerPicked
      ).length;
      let cancelledLength = this.props.loads.loads.filter(
        load =>
          load.load_status == "cancelled" && load.driver.id == customerPicked
      ).length;
      let allLength = this.props.loads.loads.filter(
        load => load.driver.id == customerPicked
      ).length;

      this.setState({
        activeLength,
        deliveredLength,
        cancelledLength,
        allLength
      });
    }
  };

  loadModal = load => {
    this.props.selectedLoad(load);
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
              href="#modal2"
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
              href="#modal2"
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

  getSubButtons = () => {
    this.setState((prevState, props) => {
      return {
        showAllButtons: !prevState.showAllButtons
      };
    });
  };

  handleSortBy = (target, event) => {
    this.setState(
      {
        loadStatus: target,
        customerPicked: "all",
        open: false
      },
      () => this.handleFilterButton()
    );
  };

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      };
    });
  };
  handleClickOutside = event => {
    if (this.container1 && !this.container1.contains(event.target)) {
      this.setState({
        open: false
      });
    }
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
      <section id="driver-search" className="app-container driver-past-loads">
        <LoadingComponent loadingText="Drivers" />
        <div className="top-section">
          <div className="top-section__filterMobileGroup top-section__filterMobileGroup--flexSpaceBetween">
            <section className="sortBy">
              <div
                className="container1"
                ref={input => {
                  this.container1 = input;
                }}
              >
                <a className="button1" onClick={this.handleButtonClick}>
                  Sort By: <span>{this.state.loadStatus}</span>
                  <i className="material-icons">arrow_drop_down</i>
                </a>
                {this.state.open && (
                  <div className="dropdown1">
                    <ul>
                      <li
                        className="dropdown1__double"
                        onClick={this.handleSortBy.bind(this, "active")}
                      >
                        <h5>Active</h5>
                        <span className="customer-tabs__load-length__span">
                          {this.state.activeLength}
                        </span>
                      </li>
                      <li
                        className="dropdown1__double"
                        onClick={this.handleSortBy.bind(this, "delivered")}
                      >
                        <h5>Delivered</h5>
                        <span className="customer-tabs__load-length__span">
                          {this.state.deliveredLength}
                        </span>
                      </li>

                      <li
                        className="dropdown1__double"
                        onClick={this.handleSortBy.bind(this, "cancelled")}
                      >
                        <h5>Cancelled </h5>
                        <span className="customer-tabs__load-length__span">
                          {this.state.cancelledLength}
                        </span>
                      </li>

                      <li
                        className="dropdown1__double"
                        onClick={this.handleSortBy.bind(this, "all")}
                      >
                        <h5>All</h5>
                        <span className="customer-tabs__load-length__span">
                          {this.state.allLength}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <FilterButtons
                handleFilterButton={this.handleFilterButton}
                loadStatus={this.state.loadStatus}
                activeLength={this.state.activeLength}
                deliveredLength={this.state.deliveredLength}
                cancelledLength={this.state.cancelledLength}
                allLength={this.state.allLength}
                type="customer-past-loads"
                showAllButtons={this.state.showAllButtons}
                getSubButtons={this.getSubButtons}
              />
            </section>

            <div
              className={
                this.state.searchContainer
                  ? "top-section__labelContainer tempHideThis"
                  : "top-section__labelContainer"
              }
            >
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
              activeLength={this.state.activeLength}
              deliveredLength={this.state.deliveredLength}
              cancelledLength={this.state.cancelledLength}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalResults={this.state.currentDisplayedLoads.length}
              totalPages={this.state.totalPages}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>

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

        <LoadModal
          type="customer"
          loadStatus={this.state.loadStatus}
          customerName={
            _.isEmpty(this.state.currentLoad)
              ? "Customer"
              : this.state.currentLoad.customer.customer_name
          }
          loadId={
            this.state.currentLoad
              ? this.state.currentLoad.invoice_id
              : "id not found"
          }
          loadReference={
            this.state.currentLoad
              ? this.state.currentLoad.load_reference
              : "pro# not found"
          }
          confirmationAmount={
            this.state.currentLoad
              ? this.state.currentLoad.rate_confirmation_amount
              : "not found"
          }
          driverFirstName={
            this.state.currentLoad && this.state.currentLoad.driver
              ? this.state.currentLoad.driver.driver_first_name
              : "not found"
          }
          numberOfPickups={
            this.state.currentLoad && this.state.currentLoad.pickups
              ? `${this.state.currentLoad.pickups.length} pickups`
              : "Cant find Pickups"
          }
          numberOfDrops={
            this.state.currentLoad && this.state.currentLoad.deliveries
              ? `${this.state.currentLoad.deliveries.length} drops`
              : "Cant find Drops"
          }
          loadNotes={
            this.state.currentLoad
              ? this.state.currentLoad.load_notes
              : "No Notes"
          }
          handleToggle={this.handleToggleisDelivered}
          handleCheckedLoadStatus={
            this.state.currentLoad &&
            this.state.currentLoad.load_status == "delivered"
              ? true
              : false
          }
          handleRenderPickupAddress={
            this.state.currentLoad ? this.renderModalPickupAddress() : "Loading"
          }
          handleRenderDeliveryAddress={
            this.state.currentLoad
              ? this.renderModalDeliveryAddress()
              : "Loading"
          }
          rateconfirmationPdfUrl={
            this.state.currentLoad &&
            this.state.currentLoad.rate_confirmation_pdf
              ? this.state.currentLoad.rate_confirmation_pdf
              : null
          }
          handleFilterButton={this.handleFilterButton}
        />
        <div className="fixed-action-btn">
          <Link to="/drivers/addnew">
            <button
              className="btn-floating btn-large blue lighten-2"
              type="submit"
            >
              <i className="large material-icons">add_circle</i>
            </button>
            <h4 className="fixed-action-btn__title add">Add Driver</h4>
          </Link>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    driver: state.drivers.drivers,
    currentSelected: state.drivers.selectedDriver,
    settings: state.settings
  };
}

export default connect(
  mapStatetoProps,
  {
    selectedDriver,
    selectedLoad,
    fetchAllLoadsDetails,
    fetchDrivers,
    fetchRequest,
    fetchComplete
  }
)(DriverPastLoads);
