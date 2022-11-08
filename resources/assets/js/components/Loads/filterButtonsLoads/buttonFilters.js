import React from "react";

const ButtonFilters = ({
  handleFilterButton,
  loadStatus,
  loadStatusName,
  title,
  loadlength,
  isActive,
  type,
  showAllButtons
}) => {

  return (
    <div
      className={
        loadStatus == loadStatusName ? "btn filter-button sub-button filter-button--buttonActive": showAllButtons ? "btn filter-button sub-button" : "btn filter-button sub-button filter-button--displayNone"
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

export default ButtonFilters;
