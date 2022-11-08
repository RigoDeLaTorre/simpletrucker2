import React, { Component } from 'react'

class ProfitLossStatement extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (!this.props.currentstate) {
      return <h1>Loading</h1>
    } else {
      return (
        <div className="profitlossContainer">
          <h1>
            Profit & Loss {this.props.currentstate.period} -{' '}
            {this.props.currentstate.year} -{' '}
            {this.props.currentstate.selectedAccountType}
          </h1>
          <h2>Revenue</h2>

          <section className="section factored">
            <h3>Factored</h3>
            <div>
              <h4> Rate Confirmation : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored
                    .rate_confirmation_amount
                }
              </h4>
            </div>
            <div>
              <h4> Load Reimbursement : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.load_reimbursement}
              </h4>
            </div>
            <div>
              <h4> Load Deduction : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.load_deduction}
              </h4>
            </div>
            <div>
              <h4> Other Deductions : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.other_deduction}
              </h4>
            </div>
            <div>
              <h4> Total Factor Advanced : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored
                    .factor_total_advanced
                }
              </h4>
            </div>
            <div>
              <h4> Factor Fee Amount : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.factor_fee_amount}
              </h4>
            </div>
            <div>
              <h4> Factor Fee Other : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.factor_fee_other}
              </h4>
            </div>
            <div>
              <h4> Fuel Advance : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored.fuel_advance_amount
                }
              </h4>
            </div>

            <div>
              <h4> Fuel Advance Fee : </h4>
              <h4>
                ${this.props.currentstate.dataLoads.factored.fuel_advance_fee}
              </h4>
            </div>
            <div>
              <h4> Reserves Currently Held : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored.factor_reserve_held
                }
              </h4>
            </div>
            <div>
              <h4> Reserves Paid Out : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored
                    .factor_reserve_amount_paid
                }
              </h4>
            </div>

            <div>
              <h4> Customer Paid :</h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.factored
                    .customer_paid_amount
                }
              </h4>
            </div>
            <div className="grossRevenue">
              <h4> Gross Revenue :</h4>
              <h4>
                $
                {this.props.grossRevenue}
              </h4>
            </div>
            <div className="grossDeductions">
              <h4> Total Factor Fees :</h4>
              <h4>
                $
                {this.props.factorFees}
              </h4>
            </div>
            <p>
              * Gross Revenue based on Factor Advanced+Factor Fee+Factor Fee
              Other+Fuel Adv Fee+Fuel Adv+Reserves paid.
            </p>
            <p>
              Total Deductions : Factor Fee + Factor Fee Other + Fuel Adv Fee
            </p>
          </section>

          <section className="section notfactored">
            <h3>Not Factored</h3>
            <div>
              <h4> Rate Confirmation: </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.notfactored
                    .rate_confirmation_amount
                }
              </h4>
            </div>
            <div>
              <h4>Load Reimbursement: </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.notfactored
                    .load_reimbursement
                }
              </h4>
            </div>
            <div>
              <h4> Load Deduction: </h4>
              <h4>
                ${this.props.currentstate.dataLoads.notfactored.load_deduction}
              </h4>
            </div>

            <div>
              <h4>Customer Quickpay Fees: </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.notfactored
                    .customer_quickpay_fee
                }
              </h4>
            </div>
            <div>
              <h4>Customer Paid : </h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.notfactored
                    .customer_paid_amount
                }
              </h4>
            </div>

            <div className="grossRevenue">
              <h4> Not Factored Revenue :</h4>
              <h4>
                $
                {this.props.notfactoredRevenue}
              </h4>
            </div>

            <div className="grossDeductions">
              <h4> Not Factored Deductions :</h4>
              <h4>
                ${
                  this.props.currentstate.dataLoads.notfactored
                    .customer_quickpay_fee
                }
              </h4>
            </div>
            <p>
              *Revenue based on Rate confirmation + Customer quickpay fees
              <br /> Rate confirmation+ Load Reimbursments - Load Deductions -
              Customer Quickpay fees SHOULD equal customer paid <br />
            </p>
            <p>*Deductions are customer quickpay fees.</p>
          </section>
        </div>
      )
    }
  }
}
export default ProfitLossStatement
