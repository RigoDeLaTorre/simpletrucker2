import React from "react";

const ButtonFilters = ({
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
          ? "btn filter-button-container customer-past-loads buttonActive"
          : loadStatus == loadStatusName && type !="customer-past-loads" ? "btn filter-button-container buttonActive" : loadStatus != loadStatusName && type=="customer-past-loads" ? "btn filter-button-container customer-past-loads" :"btn filter-button-container"
      }
      onClick={handleFilterButton}
    >
      <div className="filter-check">
        <i
          className={`search-icon small material-icons filter-box ${
            loadStatus == loadStatusName ? "active" : " "
          } `}
        >
          {loadStatus == loadStatusName
            ? "check_box"
            : "check_box_outline_blank"}
        </i>
      </div>
      <h5>{title}</h5>

      <div className="load-length">
        <span
        className={isActive}>
          {loadlength}
        </span>
      </div>
    </div>
  );
};

export default ButtonFilters;
