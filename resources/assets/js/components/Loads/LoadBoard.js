import _ from "lodash";
import React, { Component } from "react";
import Datetime from "react-datetime";
import moment from "moment";
let converter = require("json-2-csv");
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { selectedLoad, updateLoadStatus } from "../../actions/loads";
import { fetchAllLoadsDetails } from "../../actions/loads/fetchAllLoadsDetails.js";
import LoadingComponent from "../LoadingComponent";
import FilterButtons from "./filterButtonsLoads/FilterButtons.js";
import { FixedActionButton, Pagination, convertDate } from "../common";
import { loadDateSearchFilter } from "./filterFunctions";

import SearchBarNewOne from "../common/SearchBarNewOne";
import DisplayLoadTable from "../common/DisplayLoadTable";
import { stateOptions } from "../forms";

import LoadView from "./LoadView";
import LoadModal from "./LoadModal";
import { fetchRequest, fetchComplete } from "../../actions/fetching";
class LoadBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDisplayedLoads: this.props.loads.loads.filter(
        load => load.load_status === "active"
      ),
      loadStatus: "active",
      searchId: "all",
      searchTerm: "all",
      currentInputName: "customer",
      activeLength: "",
      deliveredLength: "",
      cancelledLength: "",
      allLength: "",
      currentPage: 1,
      resultsPerPage: 25,
      totalPages: 1,
      showAllButtons: false,
      isDesktop: true,
      pickupAsc: null,
      invoiceAsc: null,
      customerAsc: null,
      pickupDateFilter: false,
      dateFilter: false,
      searchBy: "customer",
      pickupSearchStartDate: "",
      pickupSearchEndDate: "",
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
        Rate: load.rate_confirmation_amount,
        RateConfirmationNumber: load.load_reference,
        AdvanceOrDeduction: load.load_deduction,
        Reimbursement: load.load_reimbursement,
        BillOfLading: load.bill_of_lading_number,
        Status: load.load_status,
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
        downloadLink.download = `LoadBoard_${this.state.loadStatus}.csv`; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
  };

  // Sets state of redux to react, to better manipulate the data locally. I.e. : search, filter etc.
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.props.fetchRequest("Load Board");
    window.scrollTo(0, 0);

    this.props.fetchAllLoadsDetails(() => {
      this.handleFilterButton();
      setTimeout(() => {
        this.props.fetchComplete();
      }, 300);
    });

    let isDesktop = true; //initiate as false
    // device detection
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isDesktop = false;
    }
    this.setState({
      isDesktop
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // Re-initallizes Materialize modal after the redux store data comes in and sets react state.
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentDisplayedLoads != this.state.currentDisplayedLoads) {
      let modal = document.querySelectorAll(".modal");
      let modalInstance = M.Modal.init(modal);

      setTimeout(() => {
        let modal = document.querySelectorAll(".modal");
        let modalInstance = M.Modal.init(modal);
      }, 0);
    }
    if (prevProps.loads.loads != this.props.loads.loads) {
      this.props.fetchRequest("Load Board");
      this.handleFilterButton();
      setTimeout(() => {
        let modal = document.querySelectorAll(".modal");
        let modalInstance = M.Modal.init(modal);
        this.props.fetchComplete();
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

  //User clicks on filter buttons Active, Delivered, Cancelled, All, pulls datat from redux to react.
  handleFilterButton = (target = this.state.loadStatus) => {
    const loads = this.props.loads.loads;

    if (target == "all") {
      this.setState({
        currentDisplayedLoads: loads,
        loadStatus: target,
        searchId: "all",
        searchTerm: "all",
        totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
        currentPage: 1
      });
    } else {
      let currentLoads = loads.filter(load => load.load_status == target);
      this.setState({
        currentDisplayedLoads: currentLoads,
        loadStatus: target,
        searchId: "all",
        searchTerm: "all",
        totalPages: Math.ceil(currentLoads.length / this.state.resultsPerPage),
        currentPage: 1
      });
    }

    this.runLoadLength();
    setTimeout(() => this.getSubButtons(), 0);
  };

  // ***********  SearchBar Section  *******************

  //When a user types on one field, it sets the state, and then clears the field state of the other input at the same time.
  //Has callback to this.HandleSearch(currentInputName, searchTerm)

  //Search field, updates REACT STATE, passes in searchType from binding the input.

  // handleInputState = event => {
  //   let currentInputName = event.target.name
  //   let searchTerm = event.target.value
  //
  //   if (currentInputName == 'invoice') {
  //     this.setState(
  //       {
  //         searchId: searchTerm,
  //         searchTerm: ''
  //       },
  //       () => this.handleSearch(currentInputName, searchTerm)
  //     )
  //   } else {
  //     this.setState(
  //       {
  //         searchId: '',
  //         searchTerm: searchTerm
  //       },
  //       () => this.handleSearch(currentInputName, searchTerm)
  //     )s
  //   }
  // }

  handleInputState = (target, event) => {
    let currentInputName = target; //customer or invoice
    let searchTerm = event.value; // {value:load.id , label:"whatever"}
    let loadStatus =
      event.load_status == "active"
        ? "active"
        : event.load_status == "delivered"
        ? "delivered"
        : this.state.loadStatus;
    let currentLoadStatus = this.state.loadStatus;

    if (currentInputName == "invoice") {
      this.setState(
        {
          loadStatus: loadStatus ? loadStatus : currentLoadStatus,
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
          // loadStatus: loadStatus ? loadStatus : currentLoadStatus,
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
    searchTerm = searchTerm.value ? searchTerm.value : searchTerm;
    let status = this.state.loadStatus;
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
          if (searchTerm == "all") {
            let searchResult = loads.filter(load => load.load_status == status);
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
            let searchResult = loads.filter(
              load =>
                load.load_status == status && load.customer_id == searchTerm
            );

            this.setState({
              currentDisplayedLoads: searchResult,
              currentInputName: currentInputName,
              totalPages: Math.ceil(
                searchResult.length / this.state.resultsPerPage
              ),
              currentPage: 1,
              pickupAsc: null,
              invoiceAsc: null
            });
          }
        }
        break;
      case "invoice":
        // IF "ALL" FILTER IS CHECKED
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
                currentPage: 1
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
                currentPage: 1
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
          // IF !ALL filter is checked

          if (searchTerm == "all") {
            let searchResult = loads.filter(load => load.load_status == status);
            this.setState(
              {
                currentDisplayedLoads: searchResult,
                currentInputName: currentInputName,
                totalPages: Math.ceil(
                  searchResult.length / this.state.resultsPerPage
                ),
                currentPage: 1
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          } else {
            let searchResult = loads.filter(
              load => load.load_status == status && load.id == searchTerm
            );
            this.setState(
              {
                currentDisplayedLoads: searchResult,
                currentInputName: currentInputName,
                totalPages: Math.ceil(
                  searchResult.length / this.state.resultsPerPage
                ),
                currentPage: 1
              },
              () => {
                if (sortBy) {
                  this.handleLoadFilters(sortBy, "none");
                }
                this.runLoadLength();
              }
            );
          }
        }
        break;
      default:
        this.setState(
          {
            currentDisplayedLoads: loads,
            // currentInputName:currentInputName,
            totalPages: Math.ceil(loads.length / this.state.resultsPerPage),
            currentPage: 1
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
    const loads = this.props.loads.loads;
    let activeLength = loads.filter(load => load.load_status == "active")
      .length;
    let deliveredLength = loads.filter(load => load.load_status == "delivered")
      .length;
    let cancelledLength = loads.filter(load => load.load_status == "cancelled")
      .length;
    let allLength = loads.filter(load => load.load_status !== "deleted").length;

    this.setState({
      activeLength,
      deliveredLength,
      cancelledLength,
      allLength
    });
  };

  // ***********  List Items Section  *******************

  //Renders the table/list of loads
  renderList = () => {
    if (this.state.currentDisplayedLoads.length == 0) {
      return (
        <tr>
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
                  {/*
                  <div className="modal-trigger__driver__imgContainer">
                    <img
                      className="modal-trigger__driver__img"
                      src={faker.image.avatar()}
                    />
                  </div>
                  */}
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
                    ? convertDate(load.deliveries.slice(-1)[0].delivery_date)
                    : "No Date"}{" "}
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
                  {/*
                  <div className="modal-trigger__driver__imgContainer">
                    <img
                      className="modal-trigger__driver__img"
                      src={faker.image.avatar()}
                    />
                  </div>
                  */}
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
                    ? convertDate(load.deliveries.slice(-1)[0].delivery_date)
                    : "No Date"}{" "}
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
      default:
        this.setState({
          currentDisplayedLoads: this.state.currentDisplayedLoads,
          invoiceAsc: null,
          pickupAsc: null,
          customerAsc: null
        });
    }
  };

  // ***********  Load Modal Section  *******************

  // Sets the state of the load selected, at the same time the modal pops up to show that data
  loadModal = load => {
    this.props.selectedLoad(load);
    this.setState({
      currentLoad: load
    });
    if (this.state.isDesktop == false) {
      this.props.history.push("/loads/loadview");
    }
  };

  // Renders the pickup addresses for the modal
  renderModalPickupAddress = () => {
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
            {pickup.pickup_city} {pickup.pickup_state}, {pickup.pickup_zipcode}
          </h4>
        </div>
      );
    });
  };
  renderModalDeliveryAddress = () => {
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
  };

  //When the user switches the load from active to deliver.
  // Updates the database as well as react state.
  handleToggleisDelivered = event => {
    let load_status = event.target.checked == true ? "delivered" : "active";
    let id = this.props.loads.selectedLoad.id;
    let values = { id, load_status };

    let currentLoad = { ...this.state.currentLoad };
    currentLoad.load_status = load_status;
    this.setState({
      currentLoad
    });
    //This is the id of the load
    setTimeout(() => {
      this.props.updateLoadStatus(values, () => {
        this.handleFilterButton();
      });
    }, 300);
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
  handleSortBy = (target, event) => {
    this.setState(
      {
        loadStatus: target,
        searchId: "all",
        searchTerm: "all",
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
      <section id="loadboard" className="app-container">
        <div className="top-section top-section--loadboard">
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
                        <span
                          className="customer-tabs__load-length__span"
                          style={
                            this.state.activeLength != 0
                              ? { color: "orange" }
                              : { color: "#fff" }
                          }
                        >
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
              positionAbsoulteMinTablet={`${
                this.state.searchContainer
                  ? " search-container-navTop--positionAbsoulteMinTablet tempHideThis"
                  : "search-container-navTop--positionAbsoulteMinTablet"
              }`}
              dateFilter={this.state.dateFilter}
              dateFilterOnChange={this.dateFilterOnChange}
              handleDateChange={this.handleDateChange}
              searchBy={this.state.searchBy}
              handleSearchBy={this.handleSearchBy}
            />
            <Pagination
              loadStatus={this.state.loadStatus}
              currentPage={this.state.currentPage}
              activeLength={this.state.activeLength}
              deliveredLength={this.state.deliveredLength}
              cancelledLength={this.state.cancelledLength}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              totalPages={this.state.totalPages}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalResults={this.state.currentDisplayedLoads.length}
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
            "Customer",
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
        <FixedActionButton link="/loads/addnew" />
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    customers: state.customers.customers || [],
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
)(LoadBoard);
