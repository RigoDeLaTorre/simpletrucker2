import React from "react";
import ButtonFilters from "./buttonFilters";

const FilterButtonsDrivers = ({
  handleFilterButton,
  loadStatus,
  paidLength,
  unpaidLength,
  allLength
}) => (
  <div id="accounting-filter-buttons">
    <div className="group-filter">
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "unpaid")}
        loadStatusName="unpaid"
        title="Unpaid"
        loadStatus={loadStatus}
        loadlength={unpaidLength}
      />
    </div>
    <div className="group-filter">
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "paid")}
        loadStatusName="paid"
        title="Paid"
        loadStatus={loadStatus}
        loadlength={paidLength}
        className="marginLeft"
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "all")}
        loadStatusName="all"
        title="All"
        loadStatus={loadStatus}
        loadlength={allLength}
        className="marginLeft"
      />
    </div>
  </div>
);

export default FilterButtonsDrivers;
