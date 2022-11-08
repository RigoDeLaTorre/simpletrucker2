import _ from "lodash";
import moment from "moment";
import ReactToPrint from "react-to-print";
import React, { Component } from "react";
let converter = require("json-2-csv");
import { connect } from "react-redux";
import { convertDate } from "../common";
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import { loadDateSearchFilter } from "../Loads/filterFunctions";
import {
  fetchAllLoadsDetails,
  selectedLoad,
  updateLoadStatus
} from "../../actions/loads";

import FilterButtons from "./filterButtons/FilterButtons.js";
import {
  Pagination,
  reactSelectStylesPagination,
  reactSelectStylesPaginationThemeLight
} from "../common";
import SearchBarNewOne from "../common/SearchBarNewOne";
import DisplayLoadTable from "../common/DisplayLoadTable";
import ReadyToProcess from "./modals/ReadyToProcess.js";
import NeedBol from "./modals/NeedBol.js";
import ModalUnpaid from "./modals/ModalUnpaid.js";
import AccountingInvoice from "./AccountingInvoice.js";
import { fetchRequest, fetchComplete } from "../../actions/fetching";

import {
  deliveredFilter,
  deliveredFilterSearchName,
  deliveredFilterSearchById,
  readyFilter,
  readyFilterSearchName,
  readyFilterSearchById,
  processedToday,
  processedTodayFilterSearchName,
  processedTodayFilterSearchById,
  processedPaidFilter,
  processedPaidFilterSearchName,
  processedPaidFilterSearchById,
  factorUnpaidFilter,
  factorUnpaidFilterSearchName,
  factorUnpaidFilterSearchById,
  factorUnpaidReservesFilter,
  factorUnpaidReservesFilterSearchName,
  factorUnpaidReservesFilterSearchById,
  customerUnpaidFilter,
  customerUnpaidFilterSearchName,
  customerUnpaidFilterSearchById,
  allFilterSearchName,
  dateDiffInDays,
  getTodaysDate,
  deliveredFilterByCustomer,
  readyFilterByCustomer,
  processedTodayByCustomer,
  factorUnpaidFilterByCustomer,
  factorUnpaidReservesFilterByCustomer,
  customerUnpaidFilterByCustomer,
  processedPaidFilterByCustomer
} from "../filterFunctions.js";

class LoadAccounting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayedLoads: this.props.loads.loads,
      loadStatus: "delivered",
      searchId: "all",
      searchTerm: "all",
      currentInputName: "customer",
      deliveredLength: "",
      readyLength: "",
      processedTodayLength: "",
      allLength: "",
      paidLength: "",
      factorUnpaidLength: "",
      factorUnpaidReservesLength: "",
      customerUnpaidLength: "",
      currentScreen: "delivered",
      currentPage: 1,
      resultsPerPage: 25,
      showAllButtons: false,
      pickupAsc: null,
      invoiceAsc: null,
      customerAsc: null,
      searchBy: "customer",
      pickupDateFilter: false,
      pickupSearchStartDate: "",
      pickupSearchEndDate: "",
      pickupDateFilter: false,
      dateFilter: false,

      open: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    this.props.fetchRequest("Accounting");
    window.scrollTo(0, 0);

    this.props.fetchAllLoadsDetails(() => {
      this.handleFilterButton();
      this.props.fetchComplete();
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // Re-initallizes Materialize modal after the redux store data comes in and sets react state.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentDisplayedLoads != this.state.currentDisplayedLoads) {
      setTimeout(() => {
        let modal = document.querySelectorAll(".modal");
        let modalInstance = M.Modal.init(modal);
      }, 0);
    }
    if (prevProps.loads.loads != this.props.loads.loads) {
      this.handleFilterButton();
      setTimeout(() => {
        let modal = document.querySelectorAll(".modal");
        let modalInstance = M.Modal.init(modal);
      }, 0);
    }
  }

  handleClickOutside = event => {
    if (this.container1 && !this.container1.contains(event.target)) {
      this.setState({
        open: false
      });
    }
  };

  // ***********  FilterButtons Section  *******************
  handleFilterButton = (target = this.state.loadStatus) => {
    const loads = this.props.loads.loads;
    let currentDisplayedLoads;
    let totalPages;

    let sortBy =
      this.state.invoiceAsc == true
        ? "invoice-asc"
        : this.state.invoiceAsc == false
        ? "invoice-desc"
        : this.state.customerAsc == true
        ? "customer-asc"
        : this.state.customerAsc == false
        ? "customer-desc"
        : this.state.pickupAsc == true
        ? "pickup-asc"
        : this.state.pickupAsc == false
        ? "pickup-desc"
        : null;

    if (target == "delivered") {
      // delivered, but missing bol
      (currentDisplayedLoads = deliveredFilter(loads)),
        (totalPages = Math.ceil(
          deliveredFilter(loads).length / this.state.resultsPerPage
        ));
    } else if (target == "ready") {
      //delivered and has bol
      currentDisplayedLoads = readyFilter(loads);
      totalPages = Math.ceil(
        readyFilter(loads).length / this.state.resultsPerPage
      );
    } else if (target == "processedToday") {
      //processed with todays dateyy

      currentDisplayedLoads = processedToday(loads);
      totalPages = Math.ceil(
        processedToday(loads).length / this.state.resultsPerPage
      );
    } else if (target == "factor-unpaid") {
      //processed with todays dateyy

      currentDisplayedLoads = factorUnpaidFilter(loads);
      totalPages = Math.ceil(
        factorUnpaidFilter(loads).length / this.state.resultsPerPage
      );
    } else if (target == "factor-unpaid-reserves") {
      //processed with todays dateyy

      currentDisplayedLoads = factorUnpaidReservesFilter(loads);
      totalPages = Math.ceil(
        factorUnpaidReservesFilter(loads).length / this.state.resultsPerPage
      );
    } else if (target == "customer-unpaid") {
      //processed with todays dateyy
      currentDisplayedLoads = customerUnpaidFilter(loads);
      totalPages = Math.ceil(
        customerUnpaidFilter(loads).length / this.state.resultsPerPage
      );
    } else if (target == "paid") {
      //processed with todays dateyy
      currentDisplayedLoads = processedPaidFilter(loads);
      totalPages = Math.ceil(
        processedPaidFilter(loads).length / this.state.resultsPerPage
      );
    } else if (target == "all") {
      //processed with todays dateyy
      currentDisplayedLoads = loads.filter(
        load => load.load_status !== "deleted"
      );
      // currentDisplayedLoads = loads
      totalPages = Math.ceil(
        currentDisplayedLoads.length / this.state.resultsPerPage
      );
    } else {
      currentDisplayedLoads = loads;
      totalPages = Math.ceil(loads.length / this.state.resultsPerPage);
    }

    let pickupDateFilterOn = this.state.dateFilter;
    currentDisplayedLoads = pickupDateFilterOn
      ? loadDateSearchFilter(
          currentDisplayedLoads,
          this.state.pickupSearchStartDate,
          this.state.pickupSearchEndDate
        )
      : currentDisplayedLoads;

    this.setState(
      {
        currentDisplayedLoads,
        loadStatus: target,
        searchId: "all",
        searchTerm: "all",
        totalPages,
        currentPage: 1
      },
      () => {
        if (sortBy) {
          this.handleLoadFilters(sortBy, "none");
        }
        this.runLoadLength();
      }
    );
  };

  // ***********  SearchBar Section  *******************

  //When a user types on one field, it sets the state, and then clears the field state of the other input at the same time.
  //Has callback to this.HandleSearch(currentInputName, searchTerm)

  handleInputState = (target, event) => {
    let currentInputName = target; //customer or invoice
    let search = event;
    let searchTerm = event.value; // {value:load.id , label:"whatever"}

    if (currentInputName == "invoice") {
      this.setState(
        {
          // loadStatus: event.load_status == 'active' ? 'active' : 'delivered',
          currentInputName: currentInputName,
          searchId: event,
          searchTerm: {
            value: "all",
            label: "All"
          }
        },
        () => this.handleSearch(currentInputName, searchTerm)
      );
    } else {
      this.setState(
        {
          currentInputName: currentInputName,
          searchId: {
            value: "all",
            label: "All"
          },
          searchTerm: event
        },
        () => this.handleSearch(currentInputName, searchTerm)
      );
    }
  };

  handleSearch = (
    currentInputName = this.state.currentInputName,
    searchTerm = this.state.searchTerm
  ) => {
    let status = this.state.loadStatus;
    searchTerm = searchTerm.value ? searchTerm.value : searchTerm;
    let pickupDateFilterOn = this.state.dateFilter;
    let sortBy =
      this.state.invoiceAsc == true
        ? "invoice-asc"
        : this.state.invoiceAsc == false
        ? "invoice-desc"
        : this.state.customerAsc == true
        ? "customer-asc"
        : this.state.customerAsc == false
        ? "customer-desc"
        : this.state.pickupAsc == true
        ? "pickup-asc"
        : this.state.pickupAsc == false
        ? "pickup-desc"
        : null;

    let loads = pickupDateFilterOn
      ? loadDateSearchFilter(
          this.props.loads.loads,
          this.state.pickupSearchStartDate,
          this.state.pickupSearchEndDate
        )
      : this.props.loads.loads;

    //target is either id or name coming from the binded search inputs
    switch (currentInputName) {
      case "customer":
        // Status is the tab hits , todo, payment pending, paid, all
        if (status == "all") {
          if (searchTerm == "all") {
            let searchResult = loads.filter(
              load => load.load_status !== "deleted"
            );
            this.setState(
              {
                currentDisplayedLoads: searchResult,
                currentInputName: currentInputName,
                totalPages: Math.ceil(
                  searchResult.length / this.state.resultsPerPage
                ),
                currentPage: 1,
                pickupAsc: null,
                invoiceAsc: null
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          } else {
            let searchResult = loads.filter(function(load) {
              return load.customer_id === searchTerm;
            });

            this.setState(
              {
                currentDisplayedLoads: searchResult,
                currentInputName: currentInputName,
                totalPages: Math.ceil(
                  searchResult.length / this.state.resultsPerPage
                ),
                currentPage: 1,
                pickupAsc: null,
                invoiceAsc: null
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          }
        } else {
          let searchResult;

          if (searchTerm == "all") {
            if (status === "delivered") {
              searchResult = deliveredFilter(loads, searchTerm);
            } else if (status === "ready") {
              searchResult = readyFilter(loads, searchTerm);
            } else if (status === "processedToday") {
              searchResult = processedToday(loads, searchTerm);
            } else if (status === "factor-unpaid") {
              searchResult = factorUnpaidFilter(loads, searchTerm);
            } else if (status === "factor-unpaid-reserves") {
              searchResult = factorUnpaidReservesFilter(loads, searchTerm);
            } else if (status === "customer-unpaid") {
              searchResult = customerUnpaidFilter(loads, searchTerm);
            } else if (status === "paid") {
              searchResult = processedPaidFilter(loads, searchTerm);
            }
          } else {
            if (status === "delivered") {
              searchResult = deliveredFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "ready") {
              searchResult = readyFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "processedToday") {
              searchResult = processedTodayByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "factor-unpaid") {
              searchResult = factorUnpaidFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "factor-unpaid-reserves") {
              searchResult = factorUnpaidReservesFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "customer-unpaid") {
              searchResult = customerUnpaidFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            } else if (status === "paid") {
              searchResult = processedPaidFilterByCustomer(
                loads,
                searchTerm,
                "customer_id"
              );
            }
          }
          this.setState(
            {
              currentDisplayedLoads: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1,
              pickupAsc: null,
              invoiceAsc: null
            },
            () => {
              if (sortBy) {
                this.handleLoadFilters(sortBy, "none");
              }
              this.runLoadLength();
            }
          );
        }
        break;
      case "invoice":
        // IF "ALL" FILTER IS CHECKED
        if (status == "all") {
          if (searchTerm == "all") {
            this.setState(
              {
                currentDisplayedLoads: loads,
                currentInputName: currentInputName,
                totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
                currentPage: 1,
                pickupAsc: null,
                invoiceAsc: null
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          } else {
            let searchResult = loads.filter(load => load.id == searchTerm);
            this.setState(
              {
                currentDisplayedLoads: searchResult,
                currentInputName: currentInputName,
                totalPages: Math.ceil(
                  searchResult.length / this.state.resultsPerPage
                ),
                currentPage: 1,
                pickupAsc: null,
                invoiceAsc: null
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          }
        } else {
          let searchResult;

          if (searchTerm == "all") {
            if (status === "delivered") {
              searchResult = deliveredFilter(loads, searchTerm);
            } else if (status === "ready") {
              searchResult = readyFilter(loads, searchTerm);
            } else if (status === "processedToday") {
              searchResult = processedToday(loads, searchTerm);
            } else if (status === "factor-unpaid") {
              searchResult = factorUnpaidFilter(loads, searchTerm);
            } else if (status === "factor-unpaid-reserves") {
              searchResult = factorUnpaidReservesFilter(loads, searchTerm);
            } else if (status === "customer-unpaid") {
              searchResult = customerUnpaidFilter(loads, searchTerm);
            } else if (status === "paid") {
              searchResult = processedPaidFilter(loads, searchTerm);
            }
          } else {
            if (status === "delivered") {
              searchResult =
                deliveredFilterByCustomer(loads, searchTerm, "id") != undefined
                  ? deliveredFilterByCustomer(loads, searchTerm, "id")
                  : "lol wat";
            } else if (status === "ready") {
              searchResult = readyFilterByCustomer(loads, searchTerm, "id");
            } else if (status === "processedToday") {
              searchResult = processedTodayByCustomer(loads, searchTerm, "id");
            } else if (status === "factor-unpaid") {
              searchResult = factorUnpaidFilterByCustomer(
                loads,
                searchTerm,
                "id"
              );
            } else if (status === "factor-unpaid-reserves") {
              searchResult = factorUnpaidReservesFilterByCustomer(
                loads,
                searchTerm,
                "id"
              );
            } else if (status === "customer-unpaid") {
              searchResult = customerUnpaidFilterByCustomer(
                loads,
                searchTerm,
                "id"
              );
            } else if (status === "paid") {
              searchResult = processedPaidFilterByCustomer(
                loads,
                searchTerm,
                "id"
              );
            }
          }

          this.setState(
            {
              currentDisplayedLoads: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1,
              pickupAsc: null,
              invoiceAsc: null
            },
            () => {
              if (sortBy) {
                this.handleLoadFilters(sortBy, "none");
              }
              this.runLoadLength();
            }
          );
        }
        break;
      default:
        this.setState(
          {
            currentDisplayedLoads: loads,
            // currentInputName:currentInputName,
            totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
            currentPage: 1,
            pickupAsc: null,
            invoiceAsc: null
          },
          () => {
            if (sortBy) {
              this.handleLoadFilters(sortBy, "none");
            }
            this.runLoadLength();
          }
        );
    }
  };

  // Runs after toggle bol/delivered is switched, gets new number of loads for each fitler
  runLoadLength = () => {
    let deliveredLength = deliveredFilter(this.props.loads.loads).length;
    let readyLength = readyFilter(this.props.loads.loads).length;
    let processedTodayLength = processedToday(this.props.loads.loads).length;
    let paidLength = processedPaidFilter(this.props.loads.loads).length;
    let factorUnpaidLength = factorUnpaidFilter(this.props.loads.loads).length;
    let customerUnpaidLength = customerUnpaidFilter(this.props.loads.loads)
      .length;

    let allLength = this.props.loads.loads.filter(
      load => load.load_status !== "deleted"
    ).length;
    let factorUnpaidReservesLength = factorUnpaidReservesFilter(
      this.props.loads.loads
    ).length;

    this.setState({
      deliveredLength,
      readyLength,
      processedTodayLength,
      paidLength,
      factorUnpaidLength,
      factorUnpaidReservesLength,
      customerUnpaidLength,
      allLength
    });
  };

  // ***********  List Items Section  *******************

  //Renders the table/list of loads
  renderList = () => {
    // If theres no loads
    if (
      !this.state.currentDisplayedLoads ||
      this.state.currentDisplayedLoads.length == 0
    ) {
      return (
        <tr className="modal-trigger">
          <td style={{ paddingLeft: "26px" }}>No Loads Found</td>
        </tr>
      );
    } else {
      // Renders the rows for each load
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
              href={
                this.state.loadStatus == "delivered"
                  ? "#modal-needBol"
                  : this.state.loadStatus == "ready"
                  ? "#modal-readyToProcess"
                  : "#modal-processedUnpaid"
              }
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
                  {load.deliveries.length < 2
                    ? load.deliveries.length + " Drop"
                    : load.deliveries.length + " Drops"}
                </h5>
              </td>
              <td className="cell modal-trigger__td modal-trigger__dropoff">
                <h5 className="modal-trigger__h5">
                  {load.deliveries
                    ? convertDate(load.deliveries.slice(-1)[0].delivery_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.deliveries
                    ? load.deliveries.slice(-1)[0].delivery_name
                    : "No Name"}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.deliveries
                    ? `${load.deliveries.slice(-1)[0].delivery_city}, ${
                        load.deliveries.slice(-1)[0].delivery_state
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

              <td
                className={
                  load.customer_paid_amount &&
                  load.customer_paid_amount != 0 &&
                  load.customer_paid_date
                    ? "modal-trigger__td modal-trigger__paid"
                    : "modal-trigger__td modal-trigger__notPaid"
                }
              >
                {load.customer_paid_amount &&
                load.customer_paid_amount != 0 &&
                load.customer_paid_date
                  ? "Paid"
                  : "Un-Paid"}
              </td>
              <td className="cell modal-trigger__td">
                {!load.load_processed_type
                  ? load.customer.process_type
                  : load.load_processed_type}
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.load_processed_date ? (
                    load.load_processed_date
                  ) : (
                    <span>X</span>
                  )}{" "}
                  <span className="modal-trigger__processedDateSpan">
                    {" "}
                    {load.load_processed_date
                      ? dateDiffInDays(
                          new Date(load.load_processed_date),
                          new Date(getTodaysDate())
                        ) + " Days"
                      : ""}
                  </span>
                </h5>
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
              href={
                this.state.loadStatus == "delivered"
                  ? "#modal-needBol"
                  : this.state.loadStatus == "ready"
                  ? "#modal-readyToProcess"
                  : "#modal-processedUnpaid"
              }
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
                  {load.deliveries.length < 2
                    ? load.deliveries.length + " Drop"
                    : load.deliveries.length + " Drops"}
                </h5>
              </td>
              <td className="cell modal-trigger__td modal-trigger__dropoff">
                <h5 className="modal-trigger__h5">
                  {load.deliveries
                    ? convertDate(load.deliveries.slice(-1)[0].delivery_date)
                    : "No Date"}
                </h5>
                <h3 className="modal-trigger__h3">
                  {load.deliveries
                    ? load.deliveries.slice(-1)[0].delivery_name
                    : "No Name"}
                </h3>
                <h4 className="modal-trigger__h4">
                  {load.deliveries
                    ? `${load.deliveries.slice(-1)[0].delivery_city}, ${
                        load.deliveries.slice(-1)[0].delivery_state
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

              <td
                className={
                  load.customer_paid_amount &&
                  load.customer_paid_amount != 0 &&
                  load.customer_paid_date
                    ? "modal-trigger__td modal-trigger__paid"
                    : "modal-trigger__td modal-trigger__notPaid"
                }
              >
                {load.customer_paid_amount &&
                load.customer_paid_amount != 0 &&
                load.customer_paid_date
                  ? "Paid"
                  : "Un-Paid"}
              </td>
              <td className="cell modal-trigger__td">
                {!load.load_processed_type
                  ? load.customer.process_type
                  : load.load_processed_type}
              </td>
              <td className="cell modal-trigger__td">
                <h5 className="modal-trigger__h5">
                  {load.load_processed_date ? (
                    load.load_processed_date
                  ) : (
                    <span>X</span>
                  )}{" "}
                  <span className="modal-trigger__processedDateSpan">
                    {" "}
                    {load.load_processed_date
                      ? dateDiffInDays(
                          new Date(load.load_processed_date),
                          new Date(getTodaysDate())
                        ) + " Days"
                      : ""}
                  </span>
                </h5>
              </td>
            </tr>
          );
        });
      }
    }
  };

  // Handles the Asc- Desc filters on the table headers
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

  // let firstNameAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
  //   return a.driver_first_name.localeCompare(b.driver_first_name);
  // });

  // ***********  Load Modal Section  *******************
  // Sets the state of the load selected, at the same time the modal pops up to show that data
  loadModal = load => {
    this.props.selectedLoad(load);
    this.setState({
      currentLoad: load
    });
  };

  // Renders the pickup addresses for the modal
  renderModalPickupAddress = () => {
    return this.state.currentLoad.pickups.map((pickup, index) => {
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
    return this.state.currentLoad.deliveries.map((delivery, index) => {
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

  //THIS IS FOR REACT TO PRINT INVOICE

  // Renders the pickup addresses for the modal
  renderModalPickupAddressPrint = () => {
    return this.state.currentLoad.pickups.map((pickup, index) => {
      return (
        <div className="group-address" key={pickup.id}>
          <h4 className="number-title">
            Pickup #{index + 1} : {convertDate(pickup.pickup_date)}
          </h4>
          <h4 className="address-name">{pickup.pickup_name} </h4>
          <h4>{pickup.pickup_address} </h4>
          <h4>
            {pickup.pickup_city} {pickup.pickup_state}, {pickup.pickup_zipcode}
          </h4>
        </div>
      );
    });
  };
  renderModalDeliveryAddressPrint = () => {
    return this.state.currentLoad.deliveries.map((delivery, index) => {
      return (
        <div className="group-address" key={delivery.id}>
          <h4 className="number-title">
            Delivery #{index + 1} : {convertDate(delivery.delivery_date)}
          </h4>
          <h4 className="address-name">{delivery.delivery_name} </h4>
          <h4>{delivery.delivery_address} </h4>
          <h4>
            {delivery.delivery_city} {delivery.delivery_state},{" "}
            {delivery.delivery_zipcode}
          </h4>
        </div>
      );
    });
  };

  handleToggle = event => {
    // Delivered or Active toggle switch
    let load_status = event.target.checked == true ? "delivered" : "active";
    // This is the id of the load
    let id = this.props.loads.selectedLoad.id;
    let values = { id, load_status };

    // sets the react state to either "delivered or active"
    let currentLoad = { ...this.state.currentLoad };
    currentLoad.load_status = load_status;
    this.setState({
      currentLoad
    });
    setTimeout(() => {
      this.props.updateLoadStatus(values, () => {
        this.handleFilterButton();
      });
    }, 300);
  };

  handleToggleLoadProcessed = event => {
    //changes date to 12/12/2018 format

    // gets the value of the load_processed switch
    let load_processed = event.target.checked == true ? 1 : 0;

    // This is the id of the load
    let id = this.props.loads.selectedLoad.id;

    //This is sent to the back-end updateLoadstatus
    let values = { id, load_processed, load_processed_date: getTodaysDate() };

    let currentLoad = { ...this.state.currentLoad };
    currentLoad.load_processed = load_processed;

    this.setState({
      currentLoad
    });
    setTimeout(() => {
      this.props.updateLoadStatus(values, () => {
        this.handleFilterButton();
      });
    }, 300);
  };
  //User clicks on filter buttons Active, Delivered, Cancelled, All, pulls datat from redux to react.
  handleAccountingChange = e => {
    this.getSubButtons();
    switch (e) {
      // case "todo":
      //   this.handleFilterButton("ready");
      //   this.setState({
      //     currentScreen: e
      //   });
      //   break;
      case "delivered":
        this.handleFilterButton("delivered");
        this.setState({
          currentScreen: e
        });
        break;
      case "ready":
        this.handleFilterButton("ready");
        this.setState({
          currentScreen: e
        });
        break;

      // case "processed":
      //   this.handleFilterButton("customer-unpaid");
      //   this.setState({
      //     currentScreen: e
      //   });
      //   break;
      case "customer-unpaid":
        this.handleFilterButton("customer-unpaid");
        this.setState({
          currentScreen: e
        });
        break;
      case "factor-unpaid":
        this.handleFilterButton("factor-unpaid");
        this.setState({
          currentScreen: e
        });
        break;
      case "factor-unpaid-reserves":
        this.handleFilterButton("factor-unpaid-reserves");
        this.setState({
          currentScreen: e
        });
        break;
      case "processedToday":
        this.handleFilterButton("processedToday");
        this.setState({
          currentScreen: e
        });
        break;
      case "paid":
        this.handleFilterButton("paid");
        this.setState({
          currentScreen: e
        });
        break;
      case "all":
        this.handleFilterButton("all");
        this.setState({
          currentScreen: e
        });
        break;
    }

    this.setState({
      open: false
    });
  };

  renderCsv = () => {
    let options = { expandArrayObjects: true };
    const array = this.state.currentDisplayedLoads.map(load => {
      return {
        Load: load.invoice_id,
        DriverFirstName: load.driver.driver_first_name,
        DriverLastName: load.driver.driver_last_name,
        Pickup: load.pickups.map(
          item =>
            ` ${item.pickup_date} ${item.pickup_city} ${item.pickup_state}`
        ),
        Delivery: load.deliveries.map(
          item =>
            ` ${item.delivery_date} ${item.delivery_city} ${item.delivery_state}`
        ),
        Customer: load.customer.customer_name,
        RateConfirmationNumber: load.load_reference,
        BillOfLading: load.bill_of_lading_number,
        AdvanceOrDeduction: load.load_deduction,
        Reimbursement: load.load_reimbursement,
        Rate: load.rate_confirmation_amount,
        CustomerPaid: load.customer_paid_amount,
        CustomerPaidDate: load.customer_paid_date,
        FactorAdvanced: load.factor_total_advanced,
        FactorPaidDate: load.factor_paid_date,
        FactorPaidReserve: load.factor_paid_reserve_amount,
        FactorPaidReserveDate: load.factor_paid_reserve_amount_date,
        LoadProcessedType: load.load_processed_type,
        LoadProcessedDate: load.load_processed_date,
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
        downloadLink.download = `Accounting_${this.state.loadStatus}.csv`; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
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

  // handleResultsPerPage =(event)=>{
  //
  //   this.setState({
  //     resultsPerPage:event.value
  //   },()=>this.handleFilterButton())
  // }
  handleResultsPerPage = event => {
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(
        this.state.currentDisplayedLoads.length / event.value
      ),
      currentPage: 1
    });
  };
  getSubButtons = () => {
    this.setState((prevState, props) => {
      return {
        showAllButtons: !prevState.showAllButtons
      };
    });
  };

  handleSearchBy = (target, event) => {
    this.setState(
      {
        searchBy: target,
        searchId: "all",
        searchTerm: "all"
      },
      () => this.handleSearch()
    );
  };

  dateFilterOnChange = () => {
    this.setState(
      (prevState, props) => {
        return {
          pickupSearchStartDate: "",
          pickupSearchEndDate: "",
          dateFilter: !prevState.dateFilter
        };
      },
      () => this.handleSearch()
    );
  };

  handleDateChange = (target, event) => {
    this.setState(
      {
        [target]: event._d
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
    const customerOptions = [
      {
        value: "all",
        label: "All"
      },
      ...this.props.customers.map(item => ({
        value: item.id,
        label: item.customer_name
      }))
    ];
    const invoiceOptions = [
      {
        value: "all",
        label: "All"
      },
      ...this.props.loads.loads.reduce((acc, curr) => {
        if (curr.load_status !== "deleted") {
          acc.push({
            value: curr.id,
            label: `Inv#:${curr.invoice_id}-Pro#${curr.load_reference}`,
            load_status: curr.load_status
          });
          return acc;
        } else {
          return acc;
        }
      }, [])
    ];

    return (
      <section id="accounting-load" className="app-container">
        {/*-------------------All of the filter buttons, Active , Delivered, Cancelled, ALL----------------------------  */}

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
                  Sort By:{" "}
                  <span>
                    {this.state.currentScreen == "processed"
                      ? "Payments Due"
                      : this.state.currentScreen == "completed"
                      ? "Paid Loads"
                      : this.state.currentScreen == "factor-unpaid-reserves"
                      ? "Reserves-Unpaid"
                      : this.state.currentScreen}
                  </span>
                  <i className="material-icons">arrow_drop_down</i>
                </a>
                {this.state.open && (
                  <div className="dropdown1">
                    <ul>
                      <li
                        onClick={() => this.handleAccountingChange("delivered")}
                      >
                        <div className="dropdown-triggerSortBy--green">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            TODO:
                          </h4>
                          NEED BOL{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.deliveredLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.deliveredLength}
                          </span>
                        </div>
                      </li>
                      <li onClick={() => this.handleAccountingChange("ready")}>
                        <div className="dropdown-triggerSortBy--green">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            TODO:
                          </h4>
                          Ready To Process{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.readyLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.readyLength}
                          </span>
                        </div>
                      </li>
                      <li
                        onClick={() =>
                          this.handleAccountingChange("customer-unpaid")
                        }
                      >
                        <div className="dropdown-triggerSortBy--purple">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Payments Due:
                          </h4>
                          Customer{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.customerUnpaidLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.customerUnpaidLength}
                          </span>
                        </div>
                      </li>
                      <li
                        onClick={() =>
                          this.handleAccountingChange("factor-unpaid")
                        }
                      >
                        <div className="dropdown-triggerSortBy--purple">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Payments Due:
                          </h4>
                          Factored{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.factorUnpaidLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.factorUnpaidLength}
                          </span>
                        </div>
                      </li>

                      <li
                        onClick={() =>
                          this.handleAccountingChange("factor-unpaid-reserves")
                        }
                      >
                        <div className="dropdown-triggerSortBy--purple">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Payments Due:
                          </h4>
                          Reserves{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.factorUnpaidReservesLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.factorUnpaidReservesLength}
                          </span>
                        </div>
                      </li>
                      <li
                        onClick={() =>
                          this.handleAccountingChange("processedToday")
                        }
                      >
                        <div className="dropdown-triggerSortBy--gray">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Processed:
                          </h4>
                          Today{" "}
                          <span
                            className="customer-tabs__load-length__span"
                            style={
                              this.state.processedTodayLength != 0
                                ? { color: "orange" }
                                : { color: "#fff" }
                            }
                          >
                            {this.state.processedTodayLength}
                          </span>
                        </div>
                      </li>

                      <li onClick={() => this.handleAccountingChange("paid")}>
                        <div className="dropdown-triggerSortBy--gray">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Paid:
                          </h4>
                          All{" "}
                          <span className="customer-tabs__load-length__span">
                            {this.state.paidLength}
                          </span>
                        </div>
                      </li>
                      <li onClick={() => this.handleAccountingChange("all")}>
                        <div className="dropdown-triggerSortBy--gray">
                          <h4 className="dropdown-triggerSortBy__firstPartTitle">
                            Loads:
                          </h4>
                          All{" "}
                          <span className="customer-tabs__load-length__span">
                            {this.state.allLength}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <FilterButtons
                handleFilterButton={this.handleFilterButton}
                loadStatus={this.state.loadStatus}
                deliveredLength={this.state.deliveredLength}
                readyLength={this.state.readyLength}
                processedTodayLength={this.state.processedTodayLength}
                allLength={this.state.allLength}
                factorUnpaidLength={this.state.factorUnpaidLength}
                factorUnpaidReservesLength={
                  this.state.factorUnpaidReservesLength
                }
                customerUnpaidLength={this.state.customerUnpaidLength}
                paidLength={this.state.paidLength}
                currentScreen={this.state.currentScreen}
                type="customer-past-loads"
                showAllButtons={this.state.showAllButtons}
                getSubButtons={this.getSubButtons}
              />
            </section>
            <SearchBarNewOne
              handleSearchPhone={this.handleInputState}
              searchTerm={this.state.searchTerm}
              searchNumber={this.state.searchId}
              searchTermPlaceholder="Customer"
              searchNumberPlaceholder="Invoice or Pro#"
              onChangeText={this.handleInputState.bind(this, "customer")}
              onChangeNumber={this.handleInputState.bind(this, "invoice")}
              optionsText={customerOptions}
              optionsNumber={invoiceOptions}
              defaultValueText={customerOptions[0]}
              defaultValueNumber={invoiceOptions[0]}
              labelText="Customer"
              labelNumber="Invoice or Pro#"
              positionAbsoulteMinTablet="search-container-navTop--positionAbsoulteMinTablet"
              themeStyle={
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? reactSelectStylesPaginationThemeLight
                  : reactSelectStylesPagination
              }
              searchBy={this.state.searchBy}
              handleSearchBy={this.handleSearchBy}
              dateFilter={this.state.dateFilter}
              dateFilterOnChange={this.dateFilterOnChange}
              handleDateChange={this.handleDateChange}
            />
            <Pagination
              loadStatus={this.state.loadStatus}
              currentPage={this.state.currentPage}
              deliveredLength={this.state.deliveredLength}
              allLength={this.state.allLength}
              readyLength={this.state.readyLength}
              processedTodayLength={this.state.processedTodayLength}
              paidLength={this.state.paidLength}
              factorUnpaidLength={this.state.factorUnpaidLength}
              factorUnpaidReservesLength={this.state.factorUnpaidReservesLength}
              customerUnpaidLength={this.state.customerUnpaidLength}
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

        {/*-------------------Search Bar : Customer Name/ Loadref  && Invoice Id -----------------------------  */}

        {/*-------------------Displays the actual loads in the table-----------------------------  */}

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
          pickupAsc={this.state.pickupAsc}
          invoiceAsc={this.state.invoiceAsc}
          customerAsc={this.state.customerAsc}
          renderList={this.renderList()}
          rowHeaders={[
            "Invoice",
            "Driver",
            "Pickup",
            "Distance",
            "Delivery",
            "Customer",
            "Paid",
            "Type",
            "Processed"
          ]}
        />

        {/*-------------------Modals-----------------------------  */}
        <NeedBol
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
        <ModalUnpaid
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
          currentDisplayedLoads={this.state.currentDisplayedLoads}
        />

        <ReadyToProcess
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
          handleToggle={this.handleToggle}
          handleToggleLoadProcessed={this.handleToggleLoadProcessed}
          handleCheckedLoadStatus={
            this.state.currentLoad &&
            this.state.currentLoad.load_status == "delivered"
              ? true
              : false
          }
          handleCheckedLoadProcessed={
            this.state.currentLoad && this.state.currentLoad.load_processed
              ? "true"
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
        />
        <AccountingInvoice
          handleRenderPickupAddress={
            this.state.currentLoad
              ? this.renderModalPickupAddressPrint()
              : "Loading"
          }
          handleRenderDeliveryAddress={
            this.state.currentLoad
              ? this.renderModalDeliveryAddressPrint()
              : "Loading"
          }
        />
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    customers: state.customers.customers,
    settings: state.settings
  };
}
export default connect(
  mapStatetoProps,
  {
    selectedLoad,
    updateLoadStatus,
    fetchAllLoadsDetails,
    fetchRequest,
    fetchComplete
  }
)(LoadAccounting);
