import React from "react";

const ButtonFiltersDrivers = ({
  handleFilterButton,
  loadStatus,
  loadStatusName,
  title,
  loadlength,
  isActive,
  type
}) => {

  return (
    <div
      className={
        loadStatus == loadStatusName && type=="customer-past-loads"
          ? "btn filter-button filter-button--buttonActive sub-button"
          : loadStatus == loadStatusName && type !="customer-past-loads" ? "btn filter-button filter-button--buttonActive" : loadStatus != loadStatusName && type=="customer-past-loads" ? "btn filter-button sub-button" :"btn filter-button"
      }
      onClick={handleFilterButton}
    >

      <h5 className="filter-button__title sub-button__title">{title}</h5>

      <div className="filter-button__load-length sub_button__load-length">
        <span
        className={isActive}>
          {loadlength}
        </span>
      </div>
    </div>
  );
};

export default ButtonFiltersDrivers;
