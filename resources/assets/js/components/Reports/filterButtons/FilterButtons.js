import React from "react";
import ButtonFilters from "./buttonFilters";

const FilterButtons = ({
  handleFilterButton,
  processedType,
  paymentStatus
}) => (
  <div id="reports-filter-buttons">
    <div className="group-filter">
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "factor")}
        loadStatusName="factor"
        title="Factored"
        loadStatus={processedType}
      />

      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "notFactored")}
        loadStatusName="notFactored"
        title="Not Factored"
        loadStatus={processedType}
        className="marginLeft"
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "allProcessedType")}
        loadStatusName="allProcessedType"
        title="All"
        loadStatus={processedType}
        className="marginLeft"
      />
    </div>
    <div className="group-filter">
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "Unpaid")}
        loadStatusName="Unpaid"
        title="Unpaid"
        loadStatus={paymentStatus}
      />

      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "paid")}
        loadStatusName="paid"
        title="Paid"
        loadStatus={paymentStatus}
        className="marginLeft"
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "allPaymentStatus")}
        loadStatusName="allPaymentStatus"
        title="All"
        loadStatus={paymentStatus}
        className="marginLeft"
      />
    </div>
  </div>
);

export default FilterButtons;
