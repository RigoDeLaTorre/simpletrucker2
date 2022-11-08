import React from "react";
import ButtonFilters from "./buttonFiltersDrivers";

const FilterButtonsDrivers = ({
  handleFilterButton,
  loadStatus,
  unpaidLength,
  paidLength,
  cancelledLength,
  allLength,
  type
}) => (
  <div className="load-filter-buttons">
    <div className="group-filter">
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "unpaid")}
        loadStatusName="unpaid"
        title="Unpaid"
        loadStatus={loadStatus}
        loadlength={unpaidLength}
        isActive={loadStatus =="unpaid" ? "sub-button__load-length__span sub-button__load-length__active": "sub-button__load-length__span"}
        type={type}
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "paid")}
        loadStatusName="paid"
        title="Paid"
        loadStatus={loadStatus}
        loadlength={paidLength}
        isActive={loadStatus =="paid" ? "sub-button__load-length__span sub-button__load-length__active": "sub-button__load-length__span"}
        type={type}
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "cancelled")}
        loadStatusName="cancelled"
        title="Cancelled"
        loadStatus={loadStatus}
        loadlength={cancelledLength}
        isActive={loadStatus =="cancelled" ? "sub-button__load-length__span sub-button__load-length__active": "sub-button__load-length__span"}
        type={type}
      />
      <ButtonFilters
        handleFilterButton={handleFilterButton.bind(this, "all")}
        loadStatusName="all"
        title="All"
        loadStatus={loadStatus}
        loadlength={allLength}
        isActive={loadStatus =="all" ? "sub-button__load-length__span sub-button__load-length__active": "sub-button__load-length__span"}
        type={type}
      />
    </div>
  </div>
);

export default FilterButtonsDrivers;
