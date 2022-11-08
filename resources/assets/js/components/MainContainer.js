import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { fetchProfile } from '../actions/company/fetchProfile.js'
import { getUserInfo } from '../actions/user/getUserInfo.js'
import LoginWelcome from './LoginWelcome.js'
import LoadingComponent from './LoadingComponent'
class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.fetchProfile()
    this.props.getUserInfo()

    // theElement.addEventListener("touchend", handlerFunction, false);
    //
    // function handlerFunction(event) {
    // }
  }

  checkCredits() {
    if (this.props.company && this.props.company.created_at) {
      let trialDays = moment
        .duration(moment(new Date()).diff(this.props.company.created_at))
        .asDays()

      if (this.props.company && trialDays <= 30) {
        //trial period
        return this.props.children
      } else if (this.props.company && this.props.company.credits > 0) {
        return this.props.children
      } else if (this.props.company.credits <= 0) {
        // trial ended, no credits
        return (
          <h1
            style={{
              textAlign: 'center',
              display: 'block',
              margin: '5rem 0',
              fontSize: '2em'
            }}>
            Please purchase credits to continute
          </h1>
        )
      }
    } else if (this.props.company == '' || this.props.company == null) {
      return this.props.children
    } else {
      return <LoadingComponent />
    }
  }

  render() {
    return (
      <div
        className={
          this.props.settings &&
          this.props.settings.settings &&
          this.props.settings.settings.theme_option_id == 22
            ? 'right-home-container themeLightTopDark'
            : this.props.settings &&
              this.props.settings.settings &&
              this.props.settings.settings.theme_option_id == 12
              ? 'right-home-container themeLight'
              : 'right-home-container themeDark'
        }>
        {this.props.isFetching.isFetching ? <LoadingComponent /> : null}
        {this.checkCredits()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    company: state.company,
    isFetching: state.isFetching
  }
}
export default connect(
  mapStateToProps,
  { fetchProfile, getUserInfo }
)(MainContainer)
