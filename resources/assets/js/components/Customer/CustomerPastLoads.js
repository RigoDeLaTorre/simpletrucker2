import _ from "lodash";
import Select from "react-select";
import moment from "moment";
import React, { Component } from "react";
import LoadingComponent from "../LoadingComponent";
import { connect } from "react-redux";
let converter = require("json-2-csv");
import { Link } from "react-router-dom";
import { normalizePhone } from "../forms/validation/normalizeForm";
import { selectedCustomer } from "../../actions/customer/selectedCustomer.js";
import { fetchAllLoadsDetails } from "../../actions/loads/fetchAllLoadsDetails.js";
import { selectedLoad } from "../../actions/loads";
import { fetchRequest, fetchComplete } from "../../actions/fetching";
import FilterButtons from "../Loads/filterButtonsLoads/FilterButtons.js";
import {
  Pagination,
  convertDate,
  reactSelectStylesPaginationThemeLight,
  reactSelectStylesPagination
} from "../common";
import DisplayLoadTable from "../common/DisplayLoadTable";

import LoadModal from "../Loads/LoadModal";

class CustomerSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      currentDisplayedCustomers: this.props.customer,
      currentDisplayedLoads: this.props.loads.loads,
      loadStatus: "active",
      customerPicked: "all",
      currentPage: 1,
      resultsPerPage: 25,
      totalPages: 1,
      showAllButtons: false,
      pickupAsc: null,
      invoiceAsc: null,
      customerAsc: null,
      activeLength: "",
      deliveredLength: "",
      cancelledLength: "",
      allLength: "",
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
        Rate: load.rate_confirmation_amount,
        AmountPaid: load.customer_paid_amount,
        RateConfirmationNumber: load.load_reference,
        AdvanceOrDeduction: load.load_deduction,
        Reimbursement: load.load_reimbursement,
        BillOfLading: load.bill_of_lading_number,
        Status: load.load_status,
        LoadNotes: load.load_notes,
        InvoiceNotes: load.invoice_notes
      };
    });
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `CustomersPastLoads.csv`; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
  };

  loadModal = load => {
    this.props.selectedLoad(load);
    this.setState({
      currentLoad: load
    });
  };

  initMaterialize() {
    setTimeout(() => {
      let modal = document.querySelectorAll(".modal");
      let modalInstance = M.Modal.init(modal);
      let selectInstance3 = document.querySelectorAll("select");
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3);
    }, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedCustomers !=
      this.state.currentDisplayedCustomers
    ) {
      this.initMaterialize();
    }
    // NEWLY ADDED FEB 28, 2019
    if (prevState.currentDisplayedLoads != this.state.currentDisplayedLoads) {
      // this.handleFilterButton()
      this.initMaterialize();

      //
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.props.fetchRequest("Customer Past Loads");
    window.scrollTo(0, 0);

    this.props.fetchAllLoadsDetails(() => {
      this.handleFilterButton();
      this.props.fetchComplete();
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.container1 && !this.container1.contains(event.target)) {
      this.setState({
        open: false
      });
    }
  };

  // Dispatches action which stores selected customer to customers/ selectedCustomer in Redux
  customerModal(customer) {
    this.props.selectedCustomer(customer);
  }

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

  handleLoadFilters = (target, e) => {
    switch (target) {
      case "invoice-desc":
        let loads = this.state.currentDisplayedLoads.sort((a, b) => {
          return b.invoice_id - a.invoice_id;
        });
        this.setState({
          currentDisplayedLoads: loads,
          customerAsc: null,
          invoiceAsc: false,
          pickupAsc: null
        });
        break;
      case "invoice-asc":
        let loadAsc = this.state.currentDisplayedLoads.sort((a, b) => {
          return a.invoice_id - b.invoice_id;
        });
        this.setState({
          currentDisplayedLoads: loadAsc,
          customerAsc: null,
          invoiceAsc: true,
          pickupAsc: null
        });
        break;
      case "pickup-asc":
        let pickuploadAsc = this.state.currentDisplayedLoads.sort((a, b) => {
          let firstPickup = moment(a.pickups[0].pickup_date);
          let firstPickupB = moment(b.pickups[0].pickup_date);

          return moment.utc(firstPickup).diff(moment.utc(firstPickupB));
        });
        this.setState({
          currentDisplayedLoads: pickuploadAsc,
          customerAsc: null,
          invoiceAsc: null,
          pickupAsc: true
        });
        break;
      case "pickup-desc":
        let pickuploadDesc = this.state.currentDisplayedLoads.sort((b, a) => {
          let firstPickup = moment(a.pickups[0].pickup_date);
          let firstPickupB = moment(b.pickups[0].pickup_date);

          return moment.utc(firstPickup).diff(moment.utc(firstPickupB));
        });
        this.setState({
          currentDisplayedLoads: pickuploadDesc,
          customerAsc: null,
          invoiceAsc: null,
          pickupAsc: false
        });
        break;
      case "customer-asc":
        let customerAsc = this.state.currentDisplayedLoads.sort((a, b) => {
          return a.customer.customer_name.localeCompare(
            b.customer.customer_name
          );
        });

        this.setState({
          currentDisplayedLoads: customerAsc,
          invoiceAsc: null,
          pickupAsc: null,
          customerAsc: true
        });
        break;
      case "customer-desc":
        let customerDesc = this.state.currentDisplayedLoads.sort((a, b) => {
          return b.customer.customer_name.localeCompare(
            a.customer.customer_name
          );
        });

        this.setState({
          currentDisplayedLoads: customerDesc,
          invoiceAsc: null,
          pickupAsc: null,
          customerAsc: false
        });
        break;
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

  handleAccountingChange = event => {
    this.setState(
      {
        customerPicked: event
      },
      () => this.handleFilterButton()
    );
  };

  handleFilterButton = (target = this.state.loadStatus, event) => {
    const loads = this.props.loads.loads;
    let customerPicked = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;
    {
      /*FILTER BUTTON ALL   */
    }
    if (target == "all") {
      if (customerPicked === "all") {
        this.setState({
          currentDisplayedLoads: loads,
          loadStatus: target,
          totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load => load.customer.id == customerPicked
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

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
      if (customerPicked === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);

        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.load_status == target && load.customer.id == customerPicked
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

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
      if (customerPicked === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.load_status == target && load.customer.id == customerPicked
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    } else if (target == "cancelled") {
      if (customerPicked === "all") {
        let currentLoads = loads.filter(load => load.load_status == target);
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      } else {
        let currentLoads = loads.filter(
          load =>
            load.load_status == target && load.customer.id == customerPicked
        );
        this.setState({
          currentDisplayedLoads: currentLoads,
          loadStatus: target,

          totalPages: Math.ceil(
            currentLoads.length / this.state.resultsPerPage
          ),
          currentPage: 1
        });
      }
    }

    this.runLoadLength();
    // setTimeout(()=>this.getSubButtons(),0)
  };

  handleSearch = (currentInputName = "name", searchTerm = " ") => {
    const loads = this.props.loads.loads;
    let status = this.state.loadStatus;
    let customerPicked = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;

    //all , active, delivered, cancelled
    if (status == "all") {
      let searchResult = loads.filter(function(load) {
        if (customerPicked == "all") {
          return load.load_status !== "deleted";
        } else {
          return load.customer_id == customerPicked;
        }
      });
      this.setState({
        currentDisplayedLoads: searchResult
      });
    } else {
      let searchResult = loads.filter(function(load) {
        if (customerPicked == "all") {
          return load.load_status == status;
        } else {
          return (
            load.customer_id == customerPicked && load.load_status == status
          );
        }
      });

      this.setState({
        currentDisplayedLoads: searchResult
      });
    }
  };

  runLoadLength = () => {
    let customerPicked = this.state.customerPicked.value
      ? this.state.customerPicked.value
      : this.state.customerPicked;

    // if (customerPicked === 'all') {
    let activeLength = this.props.loads.loads.filter(
      load => load.load_status == "active"
    ).length;
    let deliveredLength = this.props.loads.loads.filter(
      load => load.load_status == "delivered"
    ).length;
    let cancelledLength = this.props.loads.loads.filter(
      load => load.load_status == "cancelled"
    ).length;
    let allLength = this.props.loads.loads.filter(
      load => load.load_status !== "deleted"
    ).length;

    this.setState({
      activeLength,
      deliveredLength,
      cancelledLength,
      allLength
    });
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
      () => this.handleSearch()
    );
  };

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      };
    });
  };

  render() {
    const options = [
      {
        value: "all",
        label: "All"
      },
      ...this.props.customer.customers.map(item => ({
        value: item.id,
        label: item.customer_name + " PH:" + normalizePhone(item.customer_phone)
      }))
    ];
    return (
      <section
        id="customer-search"
        className="app-container customer-past-loads"
      >
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

            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Customer or Phone
              </h4>
              <Select
                label="Customer"
                name="customer_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={this.handleAccountingChange}
                defaultValue={options[0]}
                value={this.state.customerPicked}
                placeholder="Choose Customer"
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
          handleInvoiceAsc={this.handleLoadFilters.bind(this, "invoice-asc")}
          handleInvoiceDesc={this.handleLoadFilters.bind(this, "invoice-desc")}
          handlePickupAsc={this.handleLoadFilters.bind(this, "pickup-asc")}
          handlePickupDesc={this.handleLoadFilters.bind(this, "pickup-desc")}
          handleCustomerAsc={this.handleLoadFilters.bind(this, "customer-asc")}
          handleCustomerDesc={this.handleLoadFilters.bind(
            this,
            "customer-desc"
          )}
          renderList={this.renderList()}
          rowHeaders={[
            "Invoice",
            "Driver",
            "Pickup",
            "Distance",
            "Delivery",
            "Reference#",
            "Rate",
            "Status"
          ]}
          pickupAsc={this.state.pickupAsc}
          invoiceAsc={this.state.invoiceAsc}
          customerAsc={this.state.customerAsc}
        />

        <LoadModal
          rateconfirmationPdfUrl={
            this.state.currentLoad &&
            this.state.currentLoad.rate_confirmation_pdf
              ? this.state.currentLoad.rate_confirmation_pdf
              : null
          }
          bolPdfUrl={
            this.state.currentLoad && this.state.currentLoad.bill_of_lading_pdf
              ? this.state.currentLoad.bill_of_lading_pdf
              : null
          }
          loadStatus={this.state.loadStatus}
          history={this.props.history}
          handleFilterButton={this.handleFilterButton}
        />
        <div className="fixed-action-btn">
          <Link to="/customers/addnew">
            <button
              className="btn-floating btn-large blue lighten-2"
              type="submit"
            >
              <i className="large material-icons">add_circle</i>
            </button>
            <h4 className="fixed-action-btn__title add">Add Customer</h4>
          </Link>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  let customers = state.customers.customers.sort((a, b) =>
    a.customer_name.localeCompare(b.customer_name)
  );
  return {
    loads: state.loads,
    company: state.company,
    customer: state.customers,
    currentSelected: state.customers.selectedCustomer,
    settings: state.settings
  };
}

export default connect(
  mapStatetoProps,
  {
    selectedCustomer,
    selectedLoad,
    fetchAllLoadsDetails,
    fetchRequest,
    fetchComplete
  }
)(CustomerSearch);
