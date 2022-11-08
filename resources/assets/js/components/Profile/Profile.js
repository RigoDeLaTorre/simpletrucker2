import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";

import { connect } from "react-redux";

import ProfileAddNew from "./ProfileAddNew";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

class Profile extends Component {
  render() {
    if (this.props.company === null || this.props.company === "") {
      return <ProfileAddNew history={this.props.history} />;
    }
    return (
      <section id="profile">
        <Route path="/profile/addnew" component={ProfileAddNew} />
        <Route path="/profile/edit" component={ProfileEdit} />
        <Route exact path="/profile" component={ProfileView} />
      </section>
    );
  }
}
function mapStatetoProps(state) {
  return {
    user: state.user,
    company: state.company,
    settings:state.settings
  };
}

export default connect(mapStatetoProps)(Profile);
