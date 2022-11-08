import React, { Component } from "react";
import Select from "react-select";
let converter = require("json-2-csv");
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import { connect } from "react-redux";
import { normalizePhone } from "../forms/validation/normalizeForm";
import { selectedLoad } from "../../actions/loads";
import {
  fetchDrivers,
  selectedDriver,
  createDriverUser,
  deleteDriver
} from "../../actions/driver";
import { fetchRequest, fetchComplete } from "../../actions/fetching";
import { dateDiffInDays, getTodaysDate } from "../filterFunctions.js";
import FilterButtons from "../Loads/filterButtonsLoads/FilterButtons.js";
import {
  SearchBar,
  Pagination,
  SearchBarNew,
  customStyles,
  reactSelectStylesPaginationThemeLight,
  reactSelectStylesPagination
} from "../common";
import DriverModal from "./DriverModal.js";

import DisplayLoadTable from "../common/DisplayLoadTable";
class DriverSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      currentDisplayedDrivers: this.props.driver,
      searchPhone: "",
      searchTerm: "",
      currentPage: 1,
      resultsPerPage: 25,
      allLength: "",
      totalPages: 1,
      isDesktop: true
    };
  }

  // INITIALIZES MATERIALIZE FOR MODAL AND SELECT DROPDOWN
  initMaterialize() {
    setTimeout(() => {
      let modal = document.querySelectorAll(".modal");
      let modalInstance = M.Modal.init(modal);
      let selectInstance3 = document.querySelectorAll("select");
      let customerSelectInstance3 = M.FormSelect.init(selectInstance3);
    }, 0);
  }

  componentDidMount() {
    this.props.fetchRequest("Drivers");
    let isDesktop = true; //initiate as false
    // device detection
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      isDesktop = false;
    }

    window.scrollTo(0, 0);

    this.props.fetchDrivers();
    this.initMaterialize();
    this.setState({
      isDesktop,
      allLength: this.state.currentDisplayedDrivers.length
    });
    setTimeout(() => {
      this.props.fetchComplete();
    }, 300);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentDisplayedDrivers != this.state.currentDisplayedDrivers
    ) {
      this.initMaterialize();
      this.setState({
        allLength: this.state.currentDisplayedDrivers.length
      });
    }
    if (prevProps.driver !== this.props.driver) {
      this.setState({
        currentDisplayedDrivers: this.props.driver
      });
    }
  }

  // Dispatches action which stores selected driver to drivers/ selectedCustomer in Redux
  driverModal(driver) {
    this.props.selectedDriver(driver);
    if (this.state.isDesktop == false) {
      this.props.history.push("/drivers/view");
    }
  }

  // DISPLAYS LIST OF DRIVERS ONTO LOAD TABLE
  renderDrivers = () => {
    if (this.state.currentDisplayedDrivers.length === 0) {
      return (
        <tr
          className={
            this.state.isDesktop &&
            this.props.settings &&
            this.props.settings.settings &&
            this.props.settings.settings.theme_option_id == 12
              ? "modal-trigger themeLight"
              : this.state.isDesktop &&
                this.props.settings &&
                this.props.settings.settings
              ? "modal-trigger"
              : this.state.isDesktop == false &&
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
              ? "themeLight"
              : ""
          }
        >
          <td className="modal-trigger__td">No Drivers Found</td>
        </tr>
      );
    } else {
      if (this.state.currentPage == 1) {
        let resultsPerPage = this.state.resultsPerPage;
        let currentPage = this.state.currentPage;
        const drivers = this.state.currentDisplayedDrivers.slice(
          0,
          currentPage * resultsPerPage
        );
        let totalPages = Math.ceil(drivers.length / resultsPerPage);
        return drivers.map(driver => {
          return (
            <tr
              className={
                this.state.isDesktop &&
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? "modal-trigger themeLight"
                  : this.state.isDesktop &&
                    this.props.settings &&
                    this.props.settings.settings
                  ? "modal-trigger"
                  : this.state.isDesktop == false &&
                    this.props.settings &&
                    this.props.settings.settings &&
                    this.props.settings.settings.theme_option_id == 12
                  ? "themeLight"
                  : ""
              }
              href="#modal1"
              key={driver.id}
              onClick={() => this.driverModal(driver)}
            >
              <td className="modal-trigger__td">{driver.driver_first_name}</td>
              <td className="modal-trigger__td">{driver.driver_last_name}</td>
              <td className="modal-trigger__td">
                {normalizePhone(driver.driver_phone)}
              </td>
              <td className="modal-trigger__td">{driver.driver_email}</td>
              <td className="modal-trigger__td">{driver.driver_city}</td>
            </tr>
          );
        });
      } else {
        let resultsPerPage = this.state.resultsPerPage;
        let currentPage = this.state.currentPage;
        const drivers = this.state.currentDisplayedDrivers.slice(
          currentPage * resultsPerPage - resultsPerPage,
          currentPage * resultsPerPage
        );
        let totalPages = Math.ceil(drivers.length / resultsPerPage);

        return drivers.map(driver => {
          return (
            <tr
              className={
                this.props.settings &&
                this.props.settings.settings &&
                this.props.settings.settings.theme_option_id == 12
                  ? "modal-trigger themeLight"
                  : "modal-trigger"
              }
              href="#modal1"
              key={driver.id}
              onClick={() => this.driverModal(driver)}
            >
              <td className="modal-trigger__td">{driver.driver_first_name}</td>
              <td className="modal-trigger__td">{driver.driver_last_name}</td>
              <td className="modal-trigger__td">
                {normalizePhone(driver.driver_phone)}
              </td>
              <td className="modal-trigger__td">{driver.driver_email}</td>
              <td className="modal-trigger__td">{driver.driver_city}</td>
            </tr>
          );
        });
      }
    }
  };

  // SEARCH BOX BY NAME,EMAIL AND PHONE
  handleSearchPhone = event => {
    const term = event;
    //target name will be  "customer"||"phone"

    if (term.value === "all") {
      this.setState({
        currentDisplayedDrivers: this.props.driver,
        totalPages: Math.ceil(
          this.props.driver.length / this.state.resultsPerPage
        )
      });
    } else {
      let searchResult = this.props.driver.filter(
        driver => driver.id == term.value
      );

      this.setState({
        currentDisplayedDrivers: searchResult,
        totalPages: Math.ceil(searchResult.length / this.state.resultsPerPage)
      });
    }
  };
  //SORTS TABLE DATA BY FIRST NAME, LAST NAME
  handleLoadFilters = (target, e) => {
    switch (target) {
      case "firstNameAsc":
        let firstNameAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return a.driver_first_name.localeCompare(b.driver_first_name);
        });
        this.setState({
          currentDisplayedDrivers: firstNameAsc
        });
        break;
      case "firstNameDesc":
        let firstNameDesc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return b.driver_first_name.localeCompare(a.driver_first_name);
        });
        this.setState({
          currentDisplayedDrivers: firstNameDesc
        });
        break;
      case "lastNameAsc":
        let lastNameAsc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return a.driver_last_name.localeCompare(b.driver_last_name);
        });
        this.setState({
          currentDisplayedDrivers: lastNameAsc
        });
        break;
      case "lastNameDesc":
        let lastNameDesc = this.state.currentDisplayedDrivers.sort((a, b) => {
          return b.driver_last_name.localeCompare(a.driver_last_name);
        });
        this.setState({
          currentDisplayedDrivers: lastNameDesc
        });
        break;
      default:
    }
  };

  renderCsv = () => {
    let options = { expandArrayObjects: true };
    const array = this.state.currentDisplayedDrivers.map(load => {
      return {
        FirstName: load.driver_first_name,
        LastName: load.driver_last_name,
        Phone: normalizePhone(load.driver_phone),
        Email: load.driver_email,
        Address: load.driver_address,
        City: load.driver_city,
        State: load.driver_state,
        Zipcode: load.driver_zip,
        LicenseNumber: load.driver_license_number,
        LicenseExpiration: load.driver_license_expiration,
        HireDate: load.driver_hire_date,
        Salary: load.driver_pay_amount
      };
    });
    converter.json2csv(
      array,
      (err, csv) => {
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "DriverList.csv"; //Name the file here
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      },
      options
    );
  };

  renderNextPage = () => {
    if (
      this.state.currentPage <
      Math.ceil(
        this.state.currentDisplayedDrivers.length / this.state.resultsPerPage
      )
    ) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage + 1
      }));
    }
  };
  renderPrevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState(prevState => ({
        currentPage: prevState.currentPage - 1
      }));
    }
  };

  handleResultsPerPage = event => {
    const loads = this.props.driver;
    this.setState({
      resultsPerPage: event.value,
      totalPages: Math.ceil(loads.length / event.value),
      currentPage: 1
    });
  };

  renderDriverAlert = () => {
    let currentDate = new Date(getTodaysDate());
    let drivers = this.props.driver.filter(
      item =>
        dateDiffInDays(currentDate, new Date(item.driver_license_expiration)) <=
        30
    );
    if (drivers.length) {
      let driverAlerts = drivers.map(driver => {
        return (
          <h4
            className="modal-trigger licenseExpire__driverName"
            href="#modal1"
            key={driver.id}
            onClick={() => this.driverModal(driver)}
          >
            {driver.driver_first_name}
          </h4>
        );
      });
      return (
        <div className="licenseExpire">
          Licenses to expire within 30 days : {driverAlerts}
        </div>
      );
    } else {
      return "";
    }
  };

  handleDelete = () => {
    let id = this.props.currentSelected.id;

    if (
      confirm(
        "Are You sure you want to delete this Vendor and ALL related Expenses ?"
      ) == true
    ) {
      this.props.deleteDriver(id, message => {
        if (message.success) {
          M.toast({
            html: message.success,
            classes: "materialize__toastUpdated"
          });
        } else {
          M.toast({
            html: message.error,
            classes: "materialize__toastError"
          });
        }
      });
    } else {
      return false;
    }
  };

  render() {
    const driverOptions = [
      {
        value: "all",
        label: "All"
      },
      ...this.props.driver.map(item => ({
        value: item.id,
        label: `${item.driver_first_name} ${
          item.driver_last_name
        } -Ph# ${normalizePhone(item.driver_phone)}`
      }))
    ];
    return (
      <section id="driver-search" className="app-container driver-search">
        <div className="top-section">
          <div className="top-section__filterMobileGroup">
            <div className="top-section__labelContainer">
              <h4 className="top-section__labelContainer__label">
                Search by Driver or Phone
              </h4>
              <Select
                label="Driver"
                name="driver_id"
                className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
                type="select"
                onChange={this.handleSearchPhone}
                defaultValue={driverOptions[0]}
                placeholder="Choose Driver"
                options={driverOptions}
                styles={
                  this.props.settings &&
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
            <Pagination
              loadStatus={"all"}
              currentPage={this.state.currentPage}
              allLength={this.state.allLength}
              resultsPerPage={this.state.resultsPerPage}
              renderNextPage={this.renderNextPage}
              renderPrevPage={this.renderPrevPage}
              renderCsv={this.renderCsv}
              handleResultsPerPage={this.handleResultsPerPage}
              totalPages={this.state.totalPages}
              totalResults={this.state.currentDisplayedDrivers.length}
              positionAbsolute="paginationSection__groupContainer--positionAbsolute"
            />
          </div>
        </div>
        {this.renderDriverAlert()}
        <DisplayLoadTable
          handleAsc={this.handleLoadFilters.bind(this, "firstNameAsc")}
          handleDesc={this.handleLoadFilters.bind(this, "firstNameDesc")}
          lastNameAsc={this.handleLoadFilters.bind(this, "lastNameAsc")}
          lastNameDesc={this.handleLoadFilters.bind(this, "lastNameDesc")}
          renderList={this.renderDrivers()}
          rowHeaders={["First Name", "Last Name", "Phone", "Email", "City"]}
        />

        <DriverModal
          currentSelected={this.props.currentSelected}
          theme={
            this.props.settings &&
            this.props.settings.settings &&
            this.props.settings.settings.theme_option_id == 12
              ? 2
              : 1
          }
          createDriverUser={this.props.createDriverUser}
          handleDelete={this.handleDelete}
          historyPush={() => this.props.history.push("/driver/adduser")}
        />

        <div className="fixed-action-btn">
          <Link to="/drivers/addnew">
            <button
              className="btn-floating btn-large blue lighten-2"
              type="submit"
            >
              <i className="large material-icons">add_circle</i>
            </button>
            <h4 className="fixed-action-btn__title add">Add Driver</h4>
          </Link>
        </div>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    driver: state.drivers.drivers,
    currentSelected: state.drivers.selectedDriver,
    settings: state.settings
  };
}

export default connect(
  mapStatetoProps,
  {
    selectedDriver,
    selectedLoad,
    fetchDrivers,
    deleteDriver,
    createDriverUser,
    fetchRequest,
    fetchComplete
  }
)(DriverSearch);
