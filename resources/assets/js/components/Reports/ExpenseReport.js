import _ from "lodash";
import React, { Component } from "react";
let converter = require("json-2-csv");
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import LoadingComponent from "../LoadingComponent";

class ExpenseReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadStatus: "active",
      searchId: "all",
      searchTerm: "all",
      currentInputName: "",
      activeLength: "",
      deliveredLength: "",
      cancelledLength: "",
      allLength: "",
      currentPage: 1,
      resultsPerPage: 25,
      totalPages: 1,
      showAllButtons: false
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
            ` ${item.pickup_date} ${item.pickup_city} ${item.pickup_state}`
        ),
        Delivery: load.deliveries.map(
          item =>
            ` ${item.delivery_date} ${item.delivery_city} ${
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
        downloadLink.download = `ExpenseReport_${this.state.loadStatus}.csv`; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
  };

  // ***********  FilterButtons Section  *******************

  // Runs after toggle bol/delivered is switched, gets new number of loads for each fitler

  // ***********  List Items Section  *******************

  render() {
    return (
      <section id="reports" className="app-container">
        <LoadingComponent loadingText="Reports" />
        <h1>Expense Reports Page</h1>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    isFetching: state.isFetching,
    settings: state.settings
  };
}
export default connect(
  mapStatetoProps,
  {}
)(ExpenseReport);
