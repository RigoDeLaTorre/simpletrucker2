import React from 'react'
import ButtonFilters from './buttonFilters'

const FilterButtons = ({
  handleFilterButton,
  loadStatus,
  activeLength,
  deliveredLength,
  cancelledLength,
  allLength,
  type,
  showAllButtons,
  getSubButtons
}) => (
  <div className="load-filter-buttons">
    <div className="group-filter">
      <i
        className="material-icons top-section__hideFilterIcon"
        onClick={getSubButtons}
        id="moreButtons">
        filter_list
      </i>

      {loadStatus == 'all' ? (
        <ButtonFilters
          handleFilterButton={handleFilterButton.bind(this, 'all')}
          loadStatusName="all"
          title="All"
          loadStatus={loadStatus}
          loadlength={allLength}
          isActive={
            loadStatus == 'all'
              ? 'sub-button__load-length__span sub-button__load-length__active'
              : 'sub-button__load-length__span'
          }
          type={type}
          showAllButtons={showAllButtons}
        />
      ) : loadStatus == 'active' ? (
        <ButtonFilters
          handleFilterButton={handleFilterButton.bind(this, 'active')}
          loadStatusName="active"
          title="Active"
          loadStatus={loadStatus}
          loadlength={activeLength}
          isActive={
            loadStatus == 'active'
              ? 'sub-button__load-length__span sub-button__load-length__active'
              : 'sub-button__load-length__span'
          }
          type={type}
          showAllButtons={showAllButtons}
        />
      ) : loadStatus == 'delivered' ? (
        <ButtonFilters
          handleFilterButton={handleFilterButton.bind(this, 'delivered')}
          loadStatusName="delivered"
          title="Delivered"
          loadStatus={loadStatus}
          loadlength={deliveredLength}
          isActive={
            loadStatus == 'delivered'
              ? 'sub-button__load-length__span sub-button__load-length__active'
              : 'sub-button__load-length__span '
          }
          type={type}
          showAllButtons={showAllButtons}
        />
      ) : loadStatus == 'cancelled' ? (
        <ButtonFilters
          handleFilterButton={handleFilterButton.bind(this, 'cancelled')}
          loadStatusName="cancelled"
          title="Cancelled"
          loadStatus={loadStatus}
          loadlength={cancelledLength}
          isActive={
            loadStatus == 'cancelled'
              ? 'sub-button__load-length__span sub-button__load-length__active'
              : 'sub-button__load-length__span'
          }
          type={type}
          showAllButtons={showAllButtons}
        />
      ) : null}
    </div>
  </div>
)

export default FilterButtons
