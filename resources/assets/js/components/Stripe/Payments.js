import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { connect } from 'react-redux'
import {
  handleToken10,
  handleToken30,
  handleToken50
} from '../../actions/stripe'
import { fetchRequest, fetchComplete } from '../../actions/fetching'

class Payments extends Component {
  handleToken(token, amount) {
    this.props.fetchRequest('Processing Payment..may take up to 30 seconds')
    if (amount == 10) {
      this.props.handleToken10(token, res => {
        if (res.error) {
          M.toast({
            html: res.error,
            displayLength: 5000,
            classes: 'materialize__toastError'
          })

          this.props.fetchComplete()
        } else {
          M.toast({
            html: res.success,
            displayLength: 5000,
            classes: 'materialize__toastSuccess'
          })
          this.props.fetchComplete()
        }
      })
    } else if (amount === 30) {
      this.props.handleToken30(token, res => {
        if (res.error) {
          M.toast({
            html: res.error,
            displayLength: 5000,
            classes: 'materialize__toastError'
          })
          this.props.fetchComplete()
        } else {
          M.toast({
            html: res.success,
            displayLength: 5000,
            classes: 'materialize__toastSuccess'
          })
          this.props.fetchComplete()
        }
      })
    } else if (amount === 50) {
      this.props.handleToken50(token, res => {
        if (res.error) {
          M.toast({
            html: res.error,
            displayLength: 5000,
            classes: 'materialize__toastError'
          })
          this.props.fetchComplete()
        } else {
          M.toast({
            html: res.success,
            displayLength: 5000,
            classes: 'materialize__toastSuccess'
          })
          this.props.fetchComplete()
        }
      })
    }
  }
  render() {
    return (
      <div className="credits">
        <ul className="credits__ul">
          <h4 className="credits__add">
            <i className="material-icons credits__addButton">add_circle</i>
            Credits
          </h4>
          <StripeCheckout
            ComponentClass="li"
            name="Simple Trucker"
            description="$10 for 5 Load credits"
            amount={1000}
            token={token => this.handleToken(token, 10)}
            zipCode={true}
            stripeKey="pk_live_7pduzTxWsI8ugrG9ZLJIkIIk">
            <button className="credits__button">$10</button>
          </StripeCheckout>
          <StripeCheckout
            ComponentClass="li"
            name="Simple Trucker"
            description="$30 for 15 Load credits"
            amount={3000}
            token={token => this.handleToken(token, 30)}
            zipCode={true}
            stripeKey="pk_live_7pduzTxWsI8ugrG9ZLJIkIIk">
            <button className="credits__button">$30</button>
          </StripeCheckout>
          <StripeCheckout
            ComponentClass="li"
            name="Simple Trucker"
            description="$50 for 25 Load credits"
            amount={5000}
            token={token => this.handleToken(token, 50)}
            zipCode={true}
            stripeKey="pk_live_7pduzTxWsI8ugrG9ZLJIkIIk">
            <button className="credits__button">$50</button>
          </StripeCheckout>
        </ul>
      </div>
    )
  }
}

export default connect(
  null,
  { handleToken10, handleToken30, handleToken50, fetchRequest, fetchComplete }
)(Payments)
