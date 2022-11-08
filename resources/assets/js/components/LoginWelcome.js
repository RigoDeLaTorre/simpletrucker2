import React, { Component } from "react";
import axios from "axios";
import jsPDF from "jspdf";
let converter = require("json-2-csv");
import moment from "moment";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Field, FieldArray, reduxForm } from "redux-form";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// import { fetchAllLoadsDetails } from "./actions/loads";
// import { uploadAwsFile } from "./actions/aws/uploadAwsFile";
// import { deleteAwsFile } from "./actions/aws/deleteAwsFile";
// import { fetchExpenses } from "./actions/expenses/fetchExpenses.js";

import { fetchDrivers } from "../actions/driver/fetchDrivers.js";
import { getUserInfo } from "../actions/user/getUserInfo.js";
import { fetchUserSettings } from "../actions/user/fetchUserSettings.js";
import { fetchProfile } from "../actions/company/fetchProfile.js";
import { fetchCustomers } from "../actions/customer/fetchCustomers.js";
import { fetchTrucks } from "../actions/truck/fetchTrucks.js";

import Profile from "./Profile/Profile.js";

class LoginWelcome extends Component {
  componentDidMount() {
    this.props.getUserInfo();
    this.props.fetchUserSettings();
    this.props.fetchProfile();
    this.props.fetchDrivers();
    this.props.fetchCustomers();
    this.props.fetchTrucks();
  }
  noCompany() {
    return (
      <section id="login-welcome-nocompany">
        <div className="arrow-img">
          <NavLink
            to="/profile"
            activeClassName="selected"
            className="add-company"
          />
        </div>
        <div className="instructions">
          <h1>Welcome {this.props.user.first_name}</h1>
          <h2>In order to get started, please add your company profile</h2>
          <p>
            After your company profile has been added, you will unlock the full
            functionality.
          </p>
        </div>
      </section>
    );
  }

  yesCompany() {
    let testingIt =
      moment
        .duration(moment(new Date()).diff(this.props.company.created_at))
        .asDays() <= 30;
    let tMessage = testingIt
      ? ` Your trial began on ${moment(
          this.props.company.created_at,
          "YYYY-MM-DD"
        ).format("MM-DD-YYYY")} and lasts for 30 days. It will end on ${moment(
          this.props.company_created_at
        )
          .add(30, "d")
          .format("MM-DD-YYYY")} `
      : "";

    return (
      <section id="login-welcome">
        <div className="welcome-message">
          <h1 className="welcome-message__text">
            Good {new Date().getHours() > 12 ? "Afternoon" : "Morning"}{" "}
            <span className="welcome-message__name">
              {this.props.user.first_name}
            </span>, you are logged in.
          </h1>
          {/*
          <h1>Date1 : 2019-06-12 19:50:36</h1>
          <h1>
            Databse date Converted :{" "}
            {parseInt(
              moment("2019-06-12 19:50:36")
                .valueOf()
                .toString()
                .slice(0, 10)
            )}
          </h1>
          <h1>
            Days Difference{" "}
            {moment
              .duration(moment(new Date()).diff("2019-06-12 12:50:36"))
              .asDays()}
          </h1>
          */}

          <h3>Logged In at : {new Date().toLocaleString()}</h3>
          {testingIt ? (
            <div className="welcome-message__trial">
              <h4>You are currently Trialing Simple Trucker</h4>
              <h4>{tMessage}</h4>
              <h4>
                To continue using Simple Trucker after your trial ends, please
                purchase more load credits.
              </h4>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="welcome-img">
          {new Date().getHours() > 12 ? (
            <img src="./img/afternoon.jpg" />
          ) : (
            <img src="./img/morning-coffee.jpg" />
          )}
        </div>
      </section>
    );
  }
  render() {
    return this.props.user.company_id === null ||
      this.props.user.company_id === ""
      ? this.noCompany()
      : this.yesCompany();
  }
}

function mapStatetoProps(state) {
  return {
    user: state.user,
    company: state.company
  };
}

export default connect(
  mapStatetoProps,
  {
    getUserInfo,
    fetchUserSettings,
    fetchProfile,
    fetchCustomers,
    fetchDrivers,
    fetchTrucks
  }
)(LoginWelcome);
