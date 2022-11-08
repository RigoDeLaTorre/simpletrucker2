import React from "react";

const ButtonFilters = ({
  handleFilterButton,
  loadStatus,
  loadStatusName,
  title,

  className
}) => {
  return (
    <div
      className={
        loadStatus == loadStatusName
          ? `btn filter-button-container buttonActive ${className}`
          : `btn filter-button-container ${className}`
      }
      onClick={handleFilterButton}
    >
      <div className="filter-check">
        <i
          className={`search-icon small material-icons filter-box ${
            loadStatus == loadStatusName ? "active" : " "
          } `}
        >
          {loadStatus == loadStatusName ? "check_circle" : "panorama_fish_eye"}
        </i>
      </div>
      <h5>{title}</h5>
    </div>
  );
};

export default ButtonFilters;
