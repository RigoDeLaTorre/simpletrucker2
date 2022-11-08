import React, { Component } from "react";
import { connect } from "react-redux";

class DisplayLoadTable extends Component {
  render() {
    const {
      handleInvoiceAsc,
      handleInvoiceDesc,
      handlePickupAsc,
      handlePickupDesc,
      handleCustomerAsc,
      handleCustomerDesc,
      renderList,
      rowHeaders,
      pickupAsc,
      invoiceAsc,
      customerAsc
    } = this.props;
    return (
      <div className="display-table">
        <table className="table-container responsive-table display-table__container">
          <thead className="display-table__thead">
            <tr className="tr-customer">
              {rowHeaders.map(item => (
                <th key={item} className="row-header display-table__th">
                  {item}{" "}
                  {item == "Pickup" ? (
                    <span>
                      <i
                        className={`material-icons ${
                          pickupAsc
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handlePickupAsc}
                      >
                        arrow_drop_up
                      </i>
                      <i
                        className={`material-icons ${
                          pickupAsc === false
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handlePickupDesc}
                      >
                        arrow_drop_down
                      </i>
                    </span>
                  ) : item == "Invoice" ? (
                    <span>
                      <i
                        className={`material-icons ${
                          invoiceAsc
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handleInvoiceAsc}
                      >
                        arrow_drop_up
                      </i>
                      <i
                        className={`material-icons ${
                          invoiceAsc === false
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handleInvoiceDesc}
                      >
                        arrow_drop_down
                      </i>
                    </span>
                  ) : item == "Customer" ? (
                    <span>
                      <i
                        className={`material-icons ${
                          customerAsc
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handleCustomerAsc}
                      >
                        arrow_drop_up
                      </i>
                      <i
                        className={`material-icons ${
                          customerAsc === false
                            ? "material-icons__hover material-icons__active"
                            : "material-icons__hover"
                        }`}
                        onClick={handleCustomerDesc}
                      >
                        arrow_drop_down
                      </i>
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="display-table__list-items">{renderList}</tbody>
        </table>
      </div>
    );
  }
}

function mapStatetoProps(state) {
  return {
    alert: state.alert,
    settings: state.settings
  };
}
export default connect(
  mapStatetoProps,
  {}
)(DisplayLoadTable);
