import React, { Component } from "react";

class ListItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.processedType == "notFactored" ? (
      <div className="customer-list-report">
        <div className="load-overview">
          <h1>Loads : {this.props.numberofLoads}</h1>
          <h2>
            Process Type :{" "}
            {this.props.processedType == "allProcessedType"
              ? "Factored & Not Factored"
              : this.props.processedType}
          </h2>
          <h2>
            Payment Status :{" "}
            {this.props.paymentStatus == "allPaymentStatus"
              ? "Unpaid & Paid"
              : this.props.paymentStatus}
          </h2>
        </div>
        <table className="table-container responsive-table">
          <thead className="table-headers">
            <tr className="tr-customer">
              <th className="row-header">
                Invoice
                <span>
                  <i
                    className="material-icons asc"
                    onClick={this.props.handleInvoiceAsc}
                  >
                    arrow_drop_up
                  </i>
                  <i
                    className="material-icons desc"
                    onClick={this.props.handleInvoiceDesc}
                  >
                    arrow_drop_down
                  </i>
                </span>
              </th>
              <th className="row-header">Driver</th>
              <th className="row-header">Date</th>
              <th className="row-header">Pickup</th>
              <th className="row-header">Date</th>
              <th className="row-header">Drop</th>
              <th className="row-header">Customer</th>
              <th className="row-header">Load #</th>
              <th className="row-header">Cus.Paid</th>
              <th className="row-header">Type</th>
            </tr>
          </thead>
          <tbody className="list-items">{this.props.handleRenderList}</tbody>
        </table>
      </div>
    ) : (
      <div className="customer-list-report">
        <div className="load-overview">
          <h1>Loads : {this.props.numberofLoads}</h1>
          <h2>
            Process Type :{" "}
            {this.props.processedType == "allProcessedType"
              ? "Factored & Not Factored"
              : this.props.processedType}
          </h2>
          <h2>
            Payment Status :{" "}
            {this.props.paymentStatus == "allPaymentStatus"
              ? "Unpaid & Paid"
              : this.props.paymentStatus}
          </h2>
        </div>
        <table className="table-container responsive-table">
          <thead className="table-headers">
            <tr className="tr-customer">
              <th className="row-header">
                Invoice
                <span>
                  <i
                    className="material-icons asc"
                    onClick={this.props.handleInvoiceAsc}
                  >
                    arrow_drop_up
                  </i>
                  <i
                    className="material-icons desc"
                    onClick={this.props.handleInvoiceDesc}
                  >
                    arrow_drop_down
                  </i>
                </span>
              </th>
              <th className="row-header">Driver</th>
              <th className="row-header">Date</th>
              <th className="row-header">Pickup</th>
              <th className="row-header">Date</th>
              <th className="row-header">Drop</th>
              <th className="row-header">Customer</th>
              <th className="row-header">Load #</th>
              <th className="row-header">Fact.Paid</th>
              <th className="row-header">Cus.Paid</th>
              <th className="row-header">Type</th>
            </tr>
          </thead>
          <tbody className="list-items">{this.props.handleRenderList}</tbody>
        </table>
      </div>
    );
  }
}

export default ListItems;
