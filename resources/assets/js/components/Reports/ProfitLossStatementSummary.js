import React, { Component } from "react";
import _ from "lodash";

class ProfitLossStatementSummary extends Component {
  constructor(props) {
    super(props);
  }

  // showExpenses = () => {
  //   let allCategorizedExpenses = n.reduce((acc, curr) => {
  //     let currentCategory = curr.expenseCategory.label
  //
  //     let w = acc[currentCategory]
  //       ? parseFloat(acc[currentCategory]) + parseFloat(curr.amount)
  //       : curr.amount
  //     acc = {
  //       ...acc,
  //       ...{
  //         [curr.expenseCategory.label]: parseFloat(w).toFixed(2)
  //       }
  //     }
  //     return acc
  //   }, {})
  // }
  showTotalRevenue = () => {
    let totalRevenue = (
      parseFloat(
        this.props.currentstate.dataLoads.factored.factor_total_advanced +
          this.props.currentstate.dataLoads.factored.factor_fee_amount +
          this.props.currentstate.dataLoads.factored.factor_fee_other +
          this.props.currentstate.dataLoads.factored.fuel_advance_amount +
          this.props.currentstate.dataLoads.factored.fuel_advance_fee +
          this.props.currentstate.dataLoads.factored.other_deduction +
          this.props.currentstate.dataLoads.factored.load_deduction +
          this.props.currentstate.dataLoads.factored.factor_reserve_amount_paid
      ) +
      parseFloat(
        this.props.currentstate.dataLoads.notfactored.customer_paid_amount +
          this.props.currentstate.dataLoads.notfactored.customer_quickpay_fee +
          this.props.currentstate.dataLoads.notfactored.load_deduction
      )
    ).toFixed(2);

    return totalRevenue;
  };
  showExpenses = () => {
    if (
      this.props.currentstate.expenses == null ||
      Object.keys(this.props.currentstate.expenses).length === 0
    ) {
      return "";
    } else {
      return _.map(this.props.currentstate.expenses, (val, key) => {
        return (
          <div className="profitlossSummary__row" key={key}>
            <h4>{key}</h4>
            <h4>${val}</h4>
          </div>
        );
      });
    }
  };
  showTotalExpenses = () => {
    let totalFees = (
      parseFloat(
        this.props.currentstate.dataLoads.factored.factor_fee_amount +
          this.props.currentstate.dataLoads.factored.factor_fee_other +
          this.props.currentstate.dataLoads.factored.fuel_advance_fee +
          this.props.currentstate.dataLoads.factored.other_deduction +
          this.props.currentstate.dataLoads.factored.load_deduction
      ) +
      parseFloat(
        this.props.currentstate.dataLoads.notfactored.customer_quickpay_fee +
          this.props.currentstate.dataLoads.notfactored.load_deduction
      )
    ).toFixed(2);

    if (
      this.props.currentstate.expenses == null ||
      Object.keys(this.props.currentstate.expenses).length === 0
    ) {
      return totalFees;
    } else {
      const sumValues = obj =>
        Object.values(obj).reduce((a, b) => parseFloat(a) + parseFloat(b));

      let theSum = (
        parseFloat(sumValues(this.props.currentstate.expenses)) +
        parseFloat(totalFees)
      ).toFixed(2);

      return theSum;
    }
  };

  showNetRevenue = () => {
    let netRevenue = (
      parseFloat(this.showTotalRevenue()) - parseFloat(this.showTotalExpenses())
    ).toFixed(2);

    return netRevenue;
  };

  findTitle = () => {
    const periodOptions = [
      { value: "all-year", label: "All Year" },
      { value: "first-quarter", label: "First Quarter" },
      { value: "second-quarter", label: "Second Quarter" },
      { value: "third-quarter", label: "Third Quarter" },
      { value: "fourth-quarter", label: "Fourth Quarter" },
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" }
    ];
    let title = periodOptions.find(
      x => x.value == this.props.currentstate.period
    );

    return title.label;
  };

  render() {
    if (!this.props.currentstate) {
      return <h1>Loading</h1>;
    } else {
      return (
        <div className="profitlossSummary" ref={this.props.currentRef}>
          <h1 className="profitlossSummary__title">
            Profit & Loss {this.findTitle()} - {this.props.currentstate.year}
          </h1>
          <h2>Revenue</h2>
          <div className="profitlossSummary__rowContainer">
            <div className="profitlossSummary__row">
              <h4> Factored Revenue:</h4>
              <h4>
                $
                {parseFloat(
                  this.props.currentstate.dataLoads.factored
                    .factor_total_advanced +
                    this.props.currentstate.dataLoads.factored
                      .factor_fee_amount +
                    this.props.currentstate.dataLoads.factored
                      .factor_fee_other +
                    this.props.currentstate.dataLoads.factored
                      .fuel_advance_amount +
                    this.props.currentstate.dataLoads.factored.other_deduction +
                    this.props.currentstate.dataLoads.factored.load_deduction +
                    this.props.currentstate.dataLoads.factored
                      .fuel_advance_fee +
                    this.props.currentstate.dataLoads.factored
                      .factor_reserve_amount_paid
                ).toFixed(2)}
              </h4>
            </div>

            <div className="profitlossSummary__row">
              <h4> Not Factored Revenue :</h4>
              <h4>
                $
                {parseFloat(
                  this.props.currentstate.dataLoads.notfactored
                    .customer_paid_amount +
                    this.props.currentstate.dataLoads.notfactored
                      .customer_quickpay_fee +
                    this.props.currentstate.dataLoads.notfactored.load_deduction
                ).toFixed(2)}
              </h4>
            </div>
          </div>

          <div className="profitlossSummary__row">
            <h4> Total Revenue:</h4>
            <h4>${this.showTotalRevenue()}</h4>
          </div>
          <hr />
          <h2>Expenses</h2>
          <div className="profitlossSummary__rowContainer">
            <div className="profitlossSummary__row">
              <h4>Fees(Factor/Adv/Quickpay/Deductions)</h4>
              <h4>
                {" "}
                $
                {(
                  parseFloat(
                    this.props.currentstate.dataLoads.factored
                      .factor_fee_amount +
                      this.props.currentstate.dataLoads.factored
                        .factor_fee_other +
                      this.props.currentstate.dataLoads.factored
                        .fuel_advance_fee +
                      this.props.currentstate.dataLoads.factored
                        .other_deduction +
                      this.props.currentstate.dataLoads.factored.load_deduction
                  ) +
                  parseFloat(
                    this.props.currentstate.dataLoads.notfactored
                      .customer_quickpay_fee +
                      this.props.currentstate.dataLoads.notfactored
                        .load_deduction
                  )
                ).toFixed(2)}
              </h4>
            </div>
            {this.showExpenses()}
          </div>
          <div className="profitlossSummary__row">
            <h4>Total Expenses</h4>
            <h4>$ {this.showTotalExpenses()}</h4>
          </div>
          <hr />
          <h2>Net Income</h2>
          <div className="profitlossSummary__row profitlossSummary__row--netincome">
            <h4>Net(Before Taxes)</h4>
            <h4>$ {this.showNetRevenue()}</h4>
          </div>
        </div>
      );
    }
  }
}
export default ProfitLossStatementSummary;
