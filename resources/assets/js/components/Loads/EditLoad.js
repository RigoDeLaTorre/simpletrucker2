import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import DateTimeField from "../forms/DateTimeField";
import {
  Field,
  FieldArray,
  reduxForm,
  formValueSelector,
  arrayRemove
} from "redux-form";
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import { UploadFile, convertDate } from "../common";
import {
  createLoad,
  deleteLoad,
  updateLoad,
  uploadRateBol,
  deletePickup,
  deleteDelivery
} from "../../actions/loads";
import { uploadAwsFileLoads, deleteAwsFileLoads } from "../../actions/aws";
import { normalizeZip, submitValidationAccounting } from "../forms/validation";
import {
  dropDownSelectState,
  renderField,
  renderTextArea,
  stateOptions
} from "../forms";
import RenderSelectFieldReactSelectClass from "../forms/RenderSelectFieldReactSelectClass";
import {
  required,
  maxLength,
  maxLength10,
  maxLength20,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  number
} from "../forms/validation/fieldValidations";

class EditLoad extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleFileChange = e => {
    //file
    const file = e.target.files[0];
    //name of file
    // const fileName = e.target.files[0].name
    // // type of file  - bol or rateconfirmation
    const type = e.target.name;

    // current load id
    let loadId = this.props.selectedLoad.id;

    this.setState({
      [`${type}File`]: file,
      [`${type}FileName`]: file.name
    });

    // deleting value, so that if the user selects file A , then cancels, ..and then selects the same file, it will work
    e.target.value = "";
  };
  //
  // handleFileUpload(currentFile, folder) {
  //   const image = new FormData()
  //   image.append('image', currentFile, currentFile.name)
  //   let load = this.props.selectedLoad.id
  //   let invoiceId = this.props.selectedLoad.invoice_id
  //
  //   // ********* Stores file to database *********
  //   this.props.uploadRateBol(image, folder, load, invoiceId)
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.customers.length !== this.props.customers.length) {
      //Instance for MaterializeCSS
      this.updateMaterialize();
    }
    if (prevProps.drivers.length !== this.props.drivers.length) {
      //Instance for MaterializeCSS
      this.updateMaterialize();
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //adds active to the labels, so that materialize transitions the label to the top of the input box.
    let newLabel = document.querySelectorAll("label");
    for (let label of newLabel) {
      label.classList.add("active");
    }

    //Instance for MaterializeCSS
    this.updateMaterialize();
  }

  //Each time a pickup or delivery is added, materialize is re-initialized
  updateMaterialize = props => {
    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);
    // initializes drop down - customer, driver
    let elems = document.querySelectorAll("select");
    let stateSelectInstance = M.FormSelect.init(elems);
    // floating action button
    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);
  };

  deletePickup = pickup => {
    let pickup_id = pickup.id;
    let pickup_load_id = pickup.load_id;
    let pickupItem = { pickup_id, pickup_load_id };

    this.props.deletePickup(pickupItem, () => {
      console.log("pickup item deleted");
    });
  };

  deleteDelivery = delivery => {
    let delivery_id = delivery.id;
    let delivery_load_id = delivery.load_id;
    let deliveryItem = { delivery_id, delivery_load_id };

    this.props.deleteDelivery(deliveryItem, () => {
      console.log("delivery item deleted");
    });
  };

  handleDate = date => {
    // stores date as MM/DD/YYYY
    date = date.toLocaleString().split(",");
    date = date[0];
    // changes value in redux form state
    this.props.change(this.state.focused, date);
  };

  selectField = ({
    children,
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div
      className={`input-field ${className} ${
        touched && error ? "has-danger" : ""
      }`}
    >
      <label className="field-label active">{label}</label>
      <select className="form-control" {...input}>
        {children}
      </select>
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

  renderpickups = ({ fields, meta: { error, submitFailed } }) => {
    return (
      <div className="pickup-delivery-container  pickups">
        {submitFailed && error && <span>{error}</span>}

        <ul className="form-group-one">
          {fields.map((pickups, index, array) => (
            <li key={index} className="load-item">
              <div className="group-remove">
                <div className="group-remove__number">
                  <h4 className="group-remove__numberText group-remove__pickup">
                    Pickup #{index + 1}
                  </h4>
                  <a
                    className="group-remove__link"
                    onClick={() => {
                      fields.push({});
                      setTimeout(() => {
                        this.updateMaterialize();
                      }, 0);
                    }}
                  >
                    <i className="material-icons add-pickup">add_circle</i>
                  </a>
                </div>
                {index !== 0 &&
                index >= this.props.selectedLoad.pickups.length ? (
                  <button
                    type="button"
                    title="Remove pickups"
                    onClick={() => fields.remove(index)}
                    className="group-remove__button group-remove__remove_button btn orange darken-2 waves-effect waves-light white-text left"
                  >
                    <i className="material-icons remove-icon">cancel</i> Remove
                  </button>
                ) : index !== 0 &&
                  index < this.props.selectedLoad.pickups.length ? (
                  <button
                    type="button"
                    title="Remove pickups"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this pickup?")
                      ) {
                        this.deletePickup(
                          this.props.selectedLoad["pickups"][index]
                        );
                        fields.remove(index);
                      }
                    }}
                    className="group-remove__button group-remove__delete__button btn red darken-2 waves-effect waves-light white-text left"
                  >
                    <i className="material-icons remove-icon">delete_forever</i>{" "}
                    Delete
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div className="row form__row form__row--columnPhone">
                <Field
                  name={`${pickups}.pickup_name`}
                  type="text"
                  component={renderField}
                  label="Name"
                  className="col s12 form__field form__field--column form__field--flex4"
                  validate={maxLength100}
                />

                <Field
                  name={`${pickups}.pickup_date`}
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={DateTimeField}
                  label="Date"
                  className="col s12 form__field form__field--column form__field--flex2"
                  placeholder="Date"
                  validate={required}
                />
              </div>

              <div className="row address-section">
                <Field
                  name={`${pickups}.pickup_address`}
                  type="text"
                  component={renderField}
                  label="Address"
                  className="col s12"
                  validate={maxLength100}
                />
              </div>
              <div className="row form__row form__row--columnPhone">
                <Field
                  name={`${pickups}.pickup_city`}
                  type="text"
                  component={renderField}
                  label="City"
                  className="col s12 form__field form__field--column form__field--flex4"
                  validate={[required, maxLength50]}
                />
                <Field
                  label="State"
                  name={`${pickups}.pickup_state`}
                  className="col s12 form__field form__field--column form__field--flex2"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  type="select"
                  defaultValue={this.props.selectedLoad.pickups[index]}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="State"
                  options={stateOptions.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
                {/*
                <Field
                  label="State"
                  name={`${pickups}.pickup_state`}
                  className="formSelectFields col s4"
                  type="select"
                  component={this.selectField}
                  validate={required}>
                  <option value="" disabled defaultValue>
                    State
                  </option>
                  {stateOptions.map(state => {
                    return (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    )
                  })}
                </Field>
*/}
                <Field
                  name={`${pickups}.pickup_zipcode`}
                  type="text"
                  component={renderField}
                  label="Zipcode"
                  className="col s12 form__field form__field--column form__field--flex1"
                  normalize={normalizeZip}
                  validate={[minLength5, maxLength10]}
                />
              </div>
              <div className="row">
                <Field
                  name={`${pickups}.pickup_po_number`}
                  type="text"
                  component={renderField}
                  label="#PO"
                  className="col s12"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  renderdeliveries = ({ fields, meta: { error, submitFailed } }) => (
    <div className="pickup-delivery-container right-side">
      {submitFailed && error && <span>{error}</span>}
      <ul className="form-group-one">
        {fields.map((deliveries, index) => (
          <li key={index} className="load-item load-item--delivery">
            <div className="group-remove">
              <div className="group-remove__number">
                <h4 className="group-remove__numberText group-remove__delivery">
                  Delivery #{index + 1}
                </h4>
                <a
                  className="group-remove__link"
                  onClick={() => {
                    fields.push({});
                    setTimeout(() => {
                      this.updateMaterialize();
                    }, 0);
                  }}
                >
                  <i className="material-icons add-pickup">add_circle</i>
                </a>
              </div>
              {index !== 0 &&
              index >= this.props.selectedLoad.deliveries.length ? (
                <button
                  type="button"
                  title="Remove delivery"
                  onClick={() => fields.remove(index)}
                  className="group-remove__button group-remove__remove btn orange darken-2 waves-effect waves-light white-text left"
                >
                  <i className="material-icons group-remove__button--remove-icon">
                    cancel
                  </i>{" "}
                  Remove
                </button>
              ) : index !== 0 &&
                index < this.props.selectedLoad.deliveries.length ? (
                <button
                  type="button"
                  title="Remove deliveries"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this delivery?")
                    ) {
                      this.deleteDelivery(
                        this.props.selectedLoad["deliveries"][index]
                      );
                      fields.remove(index);
                    }
                  }}
                  className="group-remove__button group-remove__delete_button btn red darken-2 waves-effect waves-light white-text left"
                >
                  <i className="material-icons group-remove__button--delete-icon">
                    delete_forever
                  </i>{" "}
                  Delete
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="row form__row form__row--columnPhone">
              <Field
                name={`${deliveries}.delivery_name`}
                type="text"
                component={renderField}
                label="Name"
                className="col s12 form__field form__field--column form__field--flex4"
                validate={maxLength100}
              />
              <Field
                name={`${deliveries}.delivery_date`}
                type="select"
                onBlur={() => input.onBlur(input.value)}
                component={DateTimeField}
                label="Date"
                className="col s12 form__field form__field--column form__field--flex2"
                placeholder="Date"
                validate={required}
              />
            </div>
            <div className="row address-section">
              <Field
                name={`${deliveries}.delivery_address`}
                type="text"
                component={renderField}
                label="Address"
                className="col s12"
                validate={maxLength100}
              />
            </div>
            <div className="row form__row form__row--columnPhone">
              <Field
                name={`${deliveries}.delivery_city`}
                type="text"
                component={renderField}
                label="City"
                className="col s12 form__field form__field--column form__field--flex4"
                validate={[required, maxLength50]}
              />
              {/*
              <Field
                label="State"
                name={`${deliveries}.delivery_state`}
                className="formSelectFields col s4"
                type="select"
                component={this.selectField}
                validate={required}>
                <option value="" disabled defaultValue>
                  State
                </option>
                {stateOptions.map(state => {
                  return (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  )
                })}
              </Field>
            */}

              <Field
                label="State"
                name={`${deliveries}.delivery_state`}
                className="col s12 form__field form__field--column form__field--flex2"
                iconDisplayNone="label-group__addItemIcon--displayNone"
                type="select"
                defaultValue={this.props.selectedLoad.deliveries[index]}
                component={RenderSelectFieldReactSelectClass}
                validate={required}
                placeholder="State"
                onBlur={() => input.onBlur(input.value)}
                options={stateOptions.map(item => ({
                  value: item.value,
                  label: item.label
                }))}
              />
              <Field
                name={`${deliveries}.delivery_zipcode`}
                type="text"
                component={renderField}
                label="Zipcode"
                className="col s12 form__field form__field--column form__field--flex1"
                normalize={normalizeZip}
                validate={(minLength5, maxLength10)}
              />
            </div>
            <div className="row">
              <Field
                name={`${deliveries}.delivery_po_number`}
                type="text"
                component={renderField}
                label="#PO"
                className="col s12"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  onSubmit = values => {
    let bolLink;
    let rateLink;

    if (this.state.rateconfirmationFile && this.state.bolFile) {
      let saveFile = sendData => {
        this.props.uploadAwsFileLoads(
          this.state.rateconfirmationFile,
          "rateconfirmation",
          linkUrl => {
            rateLink = linkUrl;
            this.props.uploadAwsFileLoads(
              this.state.bolFile,
              "bol",
              linkUrl => {
                bolLink = linkUrl;
                sendData();
              }
            );
          }
        );
      };

      let sendData = () => {
        let newValues = submitValidationAccounting(values, "editload");

        newValues.rate_confirmation_pdf = rateLink;
        newValues.bill_of_lading_pdf = bolLink;

        this.props.updateLoad(newValues, () => {
          this.props.history.push("/loads/loadboard");
        });
        M.toast({
          html: `Load Id# ${newValues.invoice_id} ***  updated !`,
          classes: "materialize__toastUpdated"
        });
      };

      saveFile(sendData);
    } else if (this.state.rateconfirmationFile) {
      this.props.uploadAwsFileLoads(
        this.state.rateconfirmationFile,
        "rateconfirmation",
        linkUrl => {
          let newValues = submitValidationAccounting(values, "editload");
          newValues.rate_confirmation_pdf = linkUrl;

          this.props.updateLoad(newValues, () => {
            this.props.history.push("/loads/loadboard");
          });
          M.toast({
            html: `Load Id# ${newValues.invoice_id} ***  updated !`,
            classes: "materialize__toastUpdated"
          });
        }
      );
    } else if (this.state.bolFile) {
      this.props.uploadAwsFileLoads(this.state.bolFile, "bol", linkUrl => {
        let newValues = submitValidationAccounting(values, "editload");
        newValues.bill_of_lading_pdf = linkUrl;

        this.props.updateLoad(newValues, () => {
          this.props.history.push("/loads/loadboard");
        });
        M.toast({
          html: `Load Id# ${newValues.invoice_id} ***  updated !`,
          classes: "materialize__toastUpdated"
        });
      });
    } else {
      let newValues = submitValidationAccounting(values, "editload");
      this.props.updateLoad(newValues, () => {
        this.props.history.push("/loads/loadboard");
      });
      M.toast({
        html: `Load Id# ${newValues.invoice_id} ***  updated !`,
        classes: "materialize__toastUpdated"
      });
    }
  };

  handleRemoveRateLink = () => {
    this.setState({
      rateconfirmationFile: null,
      rateconfirmationFileName: null
    });
  };
  handleRemoveBolLink = () => {
    this.setState({
      bolFile: null,
      bolFileName: null
    });
  };

  deleteRateConfirmation = () => {
    if (confirm("Are you sure you want to delete rate confirmation??")) {
      let newValues = {
        id: this.props.selectedLoad.id,
        rate_confirmation_pdf: null
      };
      let delValues = {
        id: this.props.selectedLoad.id,
        link: this.props.selectedLoad.rate_confirmation_pdf,
        fieldName: "rate_confirmation_pdf"
      };
      this.props.deleteAwsFileLoads(delValues);
      this.props.change("rate_confirmation_pdf", null);

      this.props.updateLoad(newValues, () => {
        // this.props.history.push('/loads/loadboard')
      });
    } else {
      return false;
    }
  };
  deleteBol = () => {
    if (confirm("Are you sure you want to delete proof of delivery??")) {
      let delValues = {
        id: this.props.selectedLoad.id,
        link: this.props.selectedLoad.bill_of_lading_pdf,
        fieldName: "bill_of_lading_pdf"
      };
      this.props.deleteAwsFileLoads(delValues);
      this.props.change("bill_of_lading_pdf", null);
      let newValues = {
        id: this.props.selectedLoad.id,
        bill_of_lading_pdf: null
      };
      this.props.updateLoad(newValues, () => {
        // this.props.history.push('/loads/loadboard')
      });
    } else {
      return false;
    }
  };

  deleteLoad = () => {
    let invoiceId = this.props.selectedLoad.invoice_id;
    if (confirm("Are you sure you want to PERMANENTLY DELETE THIS LOAD?")) {
      this.props.deleteLoad(
        {
          id: this.props.selectedLoad.id,
          company_id: this.props.selectedLoad.company_id
        },
        callback => {
          if (callback.success) {
            M.toast({
              html: `Load Id# ${invoiceId}  deleted !`,
              classes: "materialize__toastUpdated"
            });
          } else {
            M.toast({
              html: `Sorry, Load Id# ${invoiceId} Not Deleted !`,
              classes: "materialize__toastError"
            });
          }
          this.props.history.push("/loads/loadboard");
        }
      );
    }
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const customers = this.props.customers;
    const drivers = this.props.drivers;
    const options = this.props.customers.map(item => ({
      value: item.id,
      label: item.customer_name
    }));
    const driverOptions = this.props.drivers.map(item => ({
      value: item.id,
      label: item.driver_first_name + " " + item.driver_last_name
    }));

    if (_.isEmpty(this.props.selectedLoad)) {
      return (
        <div>
          <h4>
            No Load was selected, go back to{" "}
            <Link
              to="/loads/loadboard"
              className="nav-section__link nav-section__link--flex"
            >
              Load Board
            </Link>{" "}
            and try again !
          </h4>
        </div>
      );
    }

    return (
      <section id="load-edit" className="load-form-container app-container">
        <LoadingComponent loadingText="Edit Load" />
        <ul className="tabs tabs__accountingEdit">
          <li className="tab tab__accountingEdit">
            <a className="active" href="#test1">
              General Info
            </a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test2">Notes</a>
          </li>
          <li className="tab tab__accountingEdit">
            <a href="#test3">Attachments</a>
          </li>
          <li className="tab tab__accountingEdit tab__accountingEdit--red">
            <a href="#test4">Delete Load</a>
          </li>
        </ul>

        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <div id="test1" className="col s12">
            <div className="form__section form__section--accounting">
              <div className="row form__row form__row--column">
                <Field
                  label="Customer"
                  name="customer_id"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  className="col s12 form__field form__field--column form__field--minWidth300"
                  type="select"
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Choose Customer"
                  options={options}
                />
                <Field
                  label="Driver"
                  name="driver_id"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  className="col s12 form__field form__field--column form__field--minWidth300"
                  type="select"
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Choose Driver"
                  options={driverOptions}
                />

                <Field
                  name="load_reference"
                  type="text"
                  component={renderField}
                  label="Load Reference #"
                  className="col s12 form__field form__field--column"
                  validate={[required, maxLength100]}
                />
                <Field
                  label="Pay Amount $"
                  name="rate_confirmation_amount"
                  component={renderField}
                  className="col s12 form__field form__field--column"
                  type="text"
                  validate={[required, number]}
                />
              </div>
            </div>
          </div>

          <div id="test2" className="col s12">
            <div className="form__section form__section--accounting">
              <div className="row load-notes-section">
                <Field
                  label="Load Notes (Personal Notes)"
                  name="load_notes"
                  component={renderTextArea}
                  className="col s12"
                  labelClass="personal-notes"
                  type="textarea"
                />
                <Field
                  label="Invoice Notes ( Will show up on invoice )"
                  name="invoice_notes"
                  component={renderTextArea}
                  className="col s12"
                  labelClass="invoice-notes"
                  type="textarea"
                />
              </div>
            </div>
          </div>

          <div id="test3" className="col s12">
            <div className="form__section form__section--accounting">
              <UploadFile
                rateconfirmationPdfUrl={
                  this.props.selectedLoad.rate_confirmation_pdf
                }
                rateconfirmationFile={this.state.rateconfirmationFile}
                rateconfirmationFileName={this.state.rateconfirmationFileName}
                handleFileChange={this.handleFileChange}
                handleRemoveRateLink={this.handleRemoveRateLink}
                bolPdfUrl={this.props.selectedLoad.bill_of_lading_pdf}
                bolFile={this.state.bolFile}
                bolFileName={this.state.bolFileName}
                handleRemoveBolLink={this.handleRemoveBolLink}
                deleteRateConfirmation={this.deleteRateConfirmation}
                deleteBol={this.deleteBol}
              />
            </div>
          </div>
          <div id="test4" className="col s12 deleteLoad">
            <div className="form__section form__section--accounting">
              <p>
                To permanently delete this load, click the delete button below.
                <br />
                It will ask you to confirm the deletion.
              </p>

              <h4 className="deleteLoad__button" onClick={this.deleteLoad}>
                Delete This Load
              </h4>
            </div>
          </div>
          <h2 className="form__section__title generalBackgroundColor">
            Pickup & Delivery
          </h2>
          <div className="row">
            <div className="pickup-delivery-section">
              <FieldArray name="pickups" component={this.renderpickups} />
              <FieldArray name="deliveries" component={this.renderdeliveries} />
            </div>
          </div>

          <div className="fixed-action-btn">
            <div className="fixed-action-btn__mainButton">
              <button
                className="btn-floating btn-large green"
                type="submit"
                disabled={submitting}
              >
                <i className="large material-icons">save</i>
              </button>
            </div>
            <ul>
              <li>
                <Link to="/loads/loadboard" className="btn-floating red">
                  <i className="material-icons">cancel</i>
                </Link>
              </li>
            </ul>
            <h4 className="fixed-action-btn__title save">Save Changes</h4>
          </div>
        </form>
      </section>
    );
  }
}

EditLoad = reduxForm({
  form: "EditLoad"
})(EditLoad);

EditLoad = connect(
  state => ({
    company: state.company,
    customers: state.customers.customers,
    drivers: state.drivers.drivers,
    selectedLoad: state.loads.selectedLoad,
    settings: state.settings,
    initialValues: {
      ...state.loads.selectedLoad,
      customer_id:
        _.isEmpty(state.loads.selectedLoad) != true
          ? {
              value: state.loads.selectedLoad.customer_id,
              label: state.loads.selectedLoad.customer.customer_name
            }
          : "",
      driver_id:
        _.isEmpty(state.loads.selectedLoad) != true
          ? {
              value: state.loads.selectedLoad.driver_id,
              label:
                state.loads.selectedLoad.driver.driver_first_name +
                " " +
                state.loads.selectedLoad.driver.driver_last_name
            }
          : "",
      pickups:
        _.isEmpty(state.loads.selectedLoad) !== true
          ? state.loads.selectedLoad.pickups.map(item => {
              return {
                ...item,
                pickup_state: stateOptions.find(
                  s => s.value === item.pickup_state
                ),
                pickup_date: convertDate(item.pickup_date)
              };
            })
          : "",
      deliveries:
        _.isEmpty(state.loads.selectedLoad) !== true
          ? state.loads.selectedLoad.deliveries.map(item => {
              return {
                ...item,
                delivery_state: stateOptions.find(
                  s => s.value === item.delivery_state
                ),
                delivery_date: convertDate(item.delivery_date)
              };
            })
          : ""
    },
    initialized: true,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true
  }),
  {
    createLoad,
    deleteLoad,
    updateLoad,
    uploadRateBol,
    deletePickup,
    deleteDelivery,
    uploadAwsFileLoads,
    deleteAwsFileLoads
  }
)(EditLoad);

export default EditLoad;
