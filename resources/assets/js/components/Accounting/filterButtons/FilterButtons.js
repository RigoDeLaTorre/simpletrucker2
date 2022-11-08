import React from "react";
import ButtonFilters from "./buttonFilters";

const FilterButtons = ({
  handleFilterButton,
  loadStatus,
  deliveredLength,
  readyLength,
  processedTodayLength,
  paidLength,
  factorUnpaidLength,
  factorUnpaidReservesLength,
  customerUnpaidLength,
  allLength,
  currentScreen,
  type
}) => (
  <div id="accounting-filter-buttons">
    <div className="group-filter">
      <div className="sub-group">
        <div
          className={
            currentScreen === "ready" ? "button-group active" : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "ready")}
            loadStatusName="ready"
            title="Ready to Process"
            loadStatus={loadStatus}
            loadlength={readyLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
        <div
          className={
            currentScreen === "delivered"
              ? "button-group active"
              : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "delivered")}
            loadStatusName="delivered"
            title="Need Bol"
            loadStatus={loadStatus}
            loadlength={deliveredLength}
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
      </div>
      <div className="sub-group reserves">
        <div
          className={
            currentScreen === "customer-unpaid"
              ? "button-group active"
              : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(
              this,
              "customer-unpaid"
            )}
            loadStatusName="customer-unpaid"
            title="Customer Payment Due"
            loadStatus={loadStatus}
            loadlength={customerUnpaidLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
        <div
          className={
            currentScreen === "factor-unpaid"
              ? "button-group active"
              : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "factor-unpaid")}
            loadStatusName="factor-unpaid"
            title="Factored Payment Due"
            loadStatus={loadStatus}
            loadlength={factorUnpaidLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>

        <div
          className={
            currentScreen === "factor-unpaid-reserves"
              ? "button-group active"
              : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(
              this,
              "factor-unpaid-reserves"
            )}
            loadStatusName="factor-unpaid-reserves"
            title="Reserves Due"
            loadStatus={loadStatus}
            loadlength={factorUnpaidReservesLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
      </div>

      <div className="sub-group">
        <div
          className={
            currentScreen === "processedToday"
              ? "button-group active"
              : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "processedToday")}
            loadStatusName="processedToday"
            title="Processed Today"
            loadStatus={loadStatus}
            loadlength={processedTodayLength}
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
        <div
          className={
            currentScreen === "paid" ? "button-group active" : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "paid")}
            loadStatusName="paid"
            title="All Paid Loads"
            loadStatus={loadStatus}
            loadlength={paidLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
      </div>

      <div className="sub-group">
        <div
          className={
            currentScreen === "all" ? "button-group active" : "button-group"
          }
        >
          <ButtonFilters
            handleFilterButton={handleFilterButton.bind(this, "all")}
            loadStatusName="all"
            title="All Loads"
            loadStatus={loadStatus}
            loadlength={allLength}
            className="marginLeft"
            isActive={
              loadStatus == "active"
                ? "load-length__span load-length__active"
                : "load-length__span"
            }
            type={type}
          />
        </div>
      </div>
    </div>
  </div>
);

export default FilterButtons;
