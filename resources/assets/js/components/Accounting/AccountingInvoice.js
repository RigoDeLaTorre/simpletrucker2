import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactToPrint from 'react-to-print'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Link } from 'react-router-dom'
import { getTodaysDate } from '../filterFunctions.js'
// import printJS from 'print-js'
class AccountingInvoice extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  testCanvas = () => {
    let currentInvoice = this.props.loads.selectedLoad.invoice_id
    const input = document.getElementById('invoice-section')

    // html2canvas(input).then(canvas => {
    //   document.body.appendChild(canvas);
    //
    // });

    html2canvas(input).then(canvas => {
      document.body.appendChild(canvas)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 8.5, 11)
      pdf.save(`Invoice${currentInvoice}.pdf`)
      document.body.removeChild(canvas)
    })
  }

  render() {
    return (
      <div
        id="modal-invoice"
        className="modal"
        ref={el => (this.componentRef = el)}>
        <div className="modal-content">
          <div className="invoice-section" id="invoice-section">
            {!this.props.company ||
            !this.props.loads ||
            !this.props.loads.selectedLoad ||
            !this.props.loads.selectedLoad.customer ||
            !this.props.loads.selectedLoad.driver ||
            !this.props.loads.selectedLoad.pickups ||
            !this.props.loads.selectedLoad.deliveries ? (
              <h1 style={{ color: 'red' }}>This is not showing up</h1>
            ) : (
              <div className="invoice-container" id="invoice-container">
                <div className="printSave">
                  <i
                    className="material-icons icon icon-pdf"
                    onClick={this.testCanvas}>
                    picture_as_pdf
                  </i>

                  <ReactToPrint
                    trigger={() => <i className="material-icons icon">print</i>}
                    content={() => this.componentRef}
                  />
                </div>
                <h4 className="todays-date">{getTodaysDate()}</h4>
                <div className="company-profile">
                  <h4>{this.props.company.company_bill_name}</h4>
                  <h4>{this.props.company.company_bill_address}</h4>
                  <h4>
                    {this.props.company.company_bill_city}{' '}
                    {this.props.company.company_bill_state},{' '}
                    {this.props.company.company_bill_zip}
                  </h4>
                </div>
                <h1 className="invoice-number">
                  Invoice #{this.props.loads.selectedLoad.invoice_id}
                </h1>
                <div className="load-ref-section">
                  <div className="load-group">
                    <div className="load-refs">
                      <h3 className="ref-title">Load#</h3>
                      <h3> {this.props.loads.selectedLoad.load_reference}</h3>
                    </div>
                    <div className="load-refs">
                      <h3 className="ref-title">BOL#</h3>
                      <h3>
                        {this.props.loads.selectedLoad.bill_of_lading_number}{' '}
                      </h3>
                    </div>

                    <div className="load-refs">
                      <h3 className="ref-title">Rate</h3>
                      <h3>
                        {' '}
                        $
                        {parseFloat(
                          this.props.loads.selectedLoad.rate_confirmation_amount
                        ).toFixed(2)}
                      </h3>
                    </div>
                    <div className="load-refs">
                      <h3 className="ref-title">Reimburse</h3>
                      <h3>
                        ${' '}
                        {parseFloat(
                          this.props.loads.selectedLoad.load_reimbursement
                        ).toFixed(2)}
                      </h3>
                    </div>
                    <div className="load-refs">
                      <h3 className="ref-title">Deduction</h3>
                      <h3>
                        ${' '}
                        {parseFloat(
                          this.props.loads.selectedLoad.load_deduction
                        ).toFixed(2)}
                      </h3>
                    </div>

                    <div className="load-refs due">
                      <h3 className="ref-title due ">Total Due</h3>
                      <h3 className="due">
                        ${' '}
                        {(
                          parseFloat(
                            this.props.loads.selectedLoad
                              .rate_confirmation_amount
                          ) +
                          parseFloat(
                            this.props.loads.selectedLoad.load_reimbursement
                          ) -
                          parseFloat(
                            this.props.loads.selectedLoad.load_deduction
                          )
                        ).toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
                {this.props.loads.selectedLoad.invoice_notes !== null &&
                this.props.loads.selectedLoad.invoice_notes != '' ? (
                  <div className="invoice-notes">
                    <h4>Notes</h4>
                    <p>{this.props.loads.selectedLoad.invoice_notes}</p>
                  </div>
                ) : (
                  undefined
                )}
                <hr />
                <div className="payto-container">
                  <div className="payments remit">
                    {this.props.loads.selectedLoad.load_processed_type ==
                    'factor' ? (
                      <div className="factoryCompany">
                        <h3>Remit Payments To:</h3>
                        <h4>{this.props.company.factory_company_name}</h4>
                        <h4>{this.props.company.factory_company_address}</h4>
                        <h4>
                          {this.props.company.factory_company_city}{' '}
                          {this.props.company.factory_company_state},{' '}
                          {this.props.company.factory_company_zip}
                        </h4>
                      </div>
                    ) : (
                      <div className="factoryCompany">
                        <h3>Remit Payments To:</h3>
                        <h4>{this.props.company.company_bill_name}</h4>
                        <h4>{this.props.company.company_bill_address}</h4>
                        <h4>
                          {this.props.company.company_bill_city},{' '}
                          {this.props.company.company_bill_state}{' '}
                          {this.props.company.company_bill_zip}
                        </h4>
                      </div>
                    )}
                  </div>
                  {this.props.loads.selectedLoad.load_processed_type ==
                  'quickpay' ? (
                    <div className="payments bill-to quickpay">
                      <h3>
                        Bill To:{' '}
                        {this.props.loads.selectedLoad.load_processed_type ==
                        'quickpay'
                          ? 'QUICKPAY'
                          : ''}
                      </h3>
                      <h2>
                        <a
                          href={`mailto:${
                            this.props.loads.selectedLoad.customer
                              .quickpay_email
                          }?Subject=Invoice# ${
                            this.props.loads.selectedLoad.id
                          } LoadReference# ${
                            this.props.loads.selectedLoad.load_reference
                          }`}>
                          {
                            this.props.loads.selectedLoad.customer
                              .quickpay_email
                          }
                        </a>
                      </h2>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_name
                        }
                      </h4>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_address
                        }
                      </h4>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_city
                        }{' '}
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_state
                        }{' '}
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_zip
                        }
                      </h4>
                    </div>
                  ) : (
                    <div className="payments bill-to">
                      <h3>Bill To:</h3>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_name
                        }
                      </h4>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_address
                        }
                      </h4>
                      <h4>
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_city
                        }{' '}
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_state
                        }{' '}
                        {
                          this.props.loads.selectedLoad.customer
                            .customer_bill_zip
                        }
                      </h4>
                    </div>
                  )}
                </div>
                <hr />
                <div className="pickupAndDelivery">
                  <div className="group load-pickups capitalize">
                    <h1 className="load-title">
                      {' '}
                      <i className="material-icons">arrow_drop_up</i>Pickups
                    </h1>
                    <div className="group-pickup-details driver col s12">
                      {this.props.handleRenderPickupAddress}
                    </div>
                  </div>
                  <div className="group load-deliveries capitalize">
                    <h1 className="load-title">
                      <i className="material-icons">arrow_drop_down</i>Deliveries
                    </h1>
                    <div className="group-delivery-details driver">
                      {this.props.handleRenderDeliveryAddress}
                    </div>
                  </div>
                </div>
                <div className="thankyou">
                  <h1>Thank You for your business !</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loads: state.loads,
    company: state.company
  }
}
export default connect(mapStateToProps)(AccountingInvoice)
