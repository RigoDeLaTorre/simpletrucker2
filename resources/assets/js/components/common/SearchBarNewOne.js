import _ from "lodash";
import moment from "moment";
import React, { Component } from "react";
import Select from "react-select";
import Datetime from "react-datetime";
import { connect } from "react-redux";

import { reactSelectStylesPagination } from "./reactSelectStylesPagination.js";
import { reactSelectStylesPaginationThemeLight } from "./reactSelectStylesPaginationThemeLight.js";
import { reactSelectStylesPaginationThemeLightTopDark } from "./reactSelectStylesPaginationThemeLightTopDark.js";

class SearchBarNewOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    var elemsSearchBy = document.querySelectorAll(".dropdown-triggerSearchBy");
    var instanceSearchBy = M.Dropdown.init(elemsSearchBy);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.container1 && !this.container1.contains(event.target)) {
      this.setState({
        open: false
      });
    }
  };

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      };
    });
  };

  handleCloseButton = (target, event) => {
    this.setState({
      open: false
    });
    this.props.handleSearchBy(target, event);
  };
  render() {
    const {
      handleSearchPhone,
      searchTerm,
      searchNumber,
      searchTermPlaceholder,
      searchNumberPlaceholder,
      onChangeText,
      onChangeNumber,
      optionsText,
      optionsNumber,
      defaultValueText,
      defaultValueNumber,
      labelText,
      labelNumber,
      positionAbsolute,
      positionAbsoulteMinTablet,
      themeStyle,
      dateFilter,
      dateFilterOnChange,
      handleDateChange,
      searchBy,
      handleSearchBy
    } = this.props;

    return (
      <div
        className={`search-container-navTop ${positionAbsolute} ${positionAbsoulteMinTablet}`}
      >
        <section className="searchBy">
          <div
            className="container1"
            ref={input => {
              this.container1 = input;
            }}
          >
            <a className="button1" onClick={this.handleButtonClick}>
              Search By: <span>{searchBy}</span>
              <i className="material-icons">arrow_drop_down</i>
            </a>

            {this.state.open && (
              <div className="dropdown1">
                <ul>
                  <li
                    className="dropdown1__single"
                    onClick={this.handleCloseButton.bind(this, "customer")}
                  >
                    <div>
                      <h4>Customer</h4>
                    </div>
                  </li>
                  <li
                    className="dropdown1__single"
                    onClick={this.handleCloseButton.bind(this, "invoice")}
                  >
                    <div>
                      <h4>Invoice or Pro #</h4>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {searchBy == "customer" ? (
            <div className="group-search group-search--leftSide">
              <Select
                label="Customer"
                name="customer_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={onChangeText}
                defaultValue={defaultValueText}
                value={searchTerm}
                placeholder={searchTermPlaceholder}
                options={optionsText}
                styles={
                  this.props.settings &&
                  this.props.settings.settings &&
                  this.props.settings.settings.theme_option_id == 22
                    ? reactSelectStylesPaginationThemeLightTopDark
                    : this.props.settings &&
                      this.props.settings.settings &&
                      this.props.settings.settings.theme_option_id == 12
                    ? reactSelectStylesPaginationThemeLight
                    : reactSelectStylesPagination
                }
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    //background
                    // neutral0:"white",

                    //border and divider of arrow - initial
                    neutral20: "#2f3c63",

                    //arrow down - after its not pristine
                    neutral60: "#7f64e3",

                    // no options text when user searching
                    neutral40: "orange",
                    //chosen field on dropdown from previous
                    primary: "#7f64e3",

                    //highlight at hover
                    primary25: "#e0d8fe",
                    //Placeholder
                    neutral50: "#8c8bcc",

                    //selectd value text color
                    neutral80: "rgba(0,0,0,0.87)",
                    //hover over container
                    neutral30: "#7f64e3"

                    // neutral5:"#dd4c4c",
                    // neutral10:"#dd4c4c",
                    //
                    // primay50:"#dd4c4c",
                    // neutral70:"#dd4c4c",
                    // neutral90:"#dd4c4c"
                  }
                })}
              />
            </div>
          ) : (
            <div className="group-search input-field top-section__customer-search-field">
              <Select
                label="Number"
                name="number_id"
                className="formSelectFields col s12 form__field form__field--minWidth300"
                type="select"
                onChange={onChangeNumber}
                defaultValue={defaultValueNumber}
                value={searchNumber}
                placeholder={searchNumberPlaceholder}
                options={optionsNumber}
                styles={
                  this.props.settings &&
                  this.props.settings.settings &&
                  this.props.settings.settings.theme_option_id == 22
                    ? reactSelectStylesPaginationThemeLightTopDark
                    : this.props.settings &&
                      this.props.settings.settings &&
                      this.props.settings.settings.theme_option_id == 12
                    ? reactSelectStylesPaginationThemeLight
                    : reactSelectStylesPagination
                }
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    //background
                    // neutral0:"white",

                    //border and divider of arrow - initial
                    neutral20: "#2f3c63",

                    //arrow down - after its not pristine
                    neutral60: "#7f64e3",

                    // no options text when user searching
                    neutral40: "orange",
                    //chosen field on dropdown from previous
                    primary: "#7f64e3",

                    //highlight at hover
                    primary25: "#e0d8fe",
                    //Placeholder
                    neutral50: "#8c8bcc",

                    //selectd value text color
                    neutral80: "rgba(0,0,0,0.87)",
                    //hover over container
                    neutral30: "#7f64e3"

                    // neutral5:"#dd4c4c",
                    // neutral10:"#dd4c4c",
                    //
                    // primay50:"#dd4c4c",
                    // neutral70:"#dd4c4c",
                    // neutral90:"#dd4c4c"
                  }
                })}
              />
            </div>
          )}
        </section>
        <section className="pickupDateSearch__container">
          <div className="switch">
            <label>
              Date Picked Up
              <input
                type="checkbox"
                value={dateFilter}
                onChange={dateFilterOnChange}
              />
              <span className="lever" />
            </label>
          </div>

          {dateFilter ? (
            <div className="pickupDateSearch">
              <div className="pickupDateSearch__row">
                <Datetime
                  className="pickupDateSearch__field"
                  onChange={handleDateChange.bind(
                    this,
                    "pickupSearchStartDate"
                  )}
                  inputProps={{ placeholder: "Pickup Date" }}
                />
              </div>
              <h4>
                <i className="material-icons">arrow_forward</i>
              </h4>
              <div className="pickupDateSearch__row">
                <Datetime
                  className="pickupDateSearch__field"
                  onChange={handleDateChange.bind(this, "pickupSearchEndDate")}
                  inputProps={{ placeholder: "Pickup Date" }}
                />
              </div>
            </div>
          ) : (
            <h2>OFF</h2>
          )}
        </section>
      </div>
    );
  }
}

function mapStatetoProps(state) {
  return {
    settings: state.settings
  };
}
export default connect(
  mapStatetoProps,
  {}
)(SearchBarNewOne);
