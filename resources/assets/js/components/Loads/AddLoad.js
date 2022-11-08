import React, { Component } from "react";

import { connect } from "react-redux";
import Datetime from "react-datetime";
import _ from "lodash";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { Link } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import DateTimeField from "../forms/DateTimeField";
import UploadFile from "../common/UploadFile";
import {
  createLoad,
  uploadRateBol,
  fetchAllLoadsDetails
} from "../../actions/loads";

import { fetchCustomers } from "../../actions/customer/fetchCustomers.js";
import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
import { uploadAwsFileLoads } from "../../actions/aws";

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

class AddLoad extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
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
    //Instance for MaterializeCSS
    this.updateMaterialize();

    // Fetches all customers and drivers associated with the company.
    this.props.fetchCustomers(this.props.company.id);
    this.props.fetchDrivers(this.props.company.id);
  }

  //Each time a pickup or delivery is added, this is triggered
  updateMaterialize = props => {
    let elemTabs = document.querySelectorAll(".tabs");
    var elemTabsInstance = M.Tabs.init(elemTabs);

    let elems = document.querySelectorAll("select");
    let stateSelectInstance = M.FormSelect.init(elems);

    let actionButtonElement = document.querySelectorAll(".fixed-action-btn");
    let actionButton = M.FloatingActionButton.init(actionButtonElement);
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
      <label className="active">{label}</label>
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
                  <h4 className="group-remove__numberText group-remove__pickup theme__text--blacktowhite">
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
                {index !== 0 ? (
                  <button
                    type="button"
                    title="Remove pickup"
                    onClick={() => fields.remove(index)}
                    className="group-remove__button group-remove__remove btn orange darken-2 waves-effect waves-light white-text left"
                  >
                    <i className="material-icons group-remove__button--remove-icon">
                      cancel
                    </i>{" "}
                    Remove
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
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="State"
                  options={stateOptions.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />

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
                <h4 className="group-remove__numberText group-remove__delivery theme__text--blacktowhite">
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
              {index !== 0 ? (
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
                onBlur={() => input.onBlur(input.value)}
                component={RenderSelectFieldReactSelectClass}
                validate={required}
                placeholder="State"
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

  handleFileChange = e => {
    const file = e.target.files[0];

    // name of the file uploaded
    let uploadName = file.name;

    // rateconfirmation || bol
    let folder = e.target.name;
    const fileName = "rate_confirmation_pdf";
    // folder = rateconfirmation ||bol
    this.setState({
      [`${folder}File`]: file,
      [`${folder}FileName`]: uploadName
    });

    // Updating redux to path of values

    // file location where to upload the file
    // ex: rateconfirmation/8403/rateconfimraion.pdf
    //ex2: bol/8403/bol.pdf

    // const fileLocation =
    //   folder == 'rateconfirmation'
    //     ? `/${folder}/${loadId}/rateconfirmation.pdf`
    //     : `/${folder}/${loadId}/bol.pdf`

    // ex : updates redux  rate_confirmation_pdf: /rateconfirmation/4855/rateconfirmation.pdf
    // this.props.change(fileName, "rateconfimraion")

    // deleting value, so that if the user selects file A , then cancels, ..and then selects the same file, it will work
    e.target.value = "";
  };

  // handleFileUpload(currentFile, folder, load, invoiceId) {
  //   const image = new FormData()
  //   image.append('image', currentFile, currentFile.name)
  //
  //   // ********* Stores file to database *********
  //   this.props.uploadRateBol(image, folder, load, invoiceId)
  //
  //   // axios
  //   //   .post('/api/uploadRateBol', image, {
  //   //     params: {
  //   //       load: id,
  //   //       folder
  //   //     }
  //   //   })
  //   //   .then(function(response) {
  //   //     console.log('the response is', response)
  //   //   })
  //   //   .catch(function(error) {
  //   //     console.log('the error isssss', error)
  //   //   })
  // }

  onSubmit(values) {
    // located in folder : components/forms/validation

    let newValues = submitValidationAccounting(values, "addnewload");

    if (this.state.rateconfirmationFile) {
      this.props.uploadAwsFileLoads(
        this.state.rateconfirmationFile,
        "rateconfirmation",
        linkUrl => {
          newValues.rate_confirmation_pdf = linkUrl;

          this.props.createLoad(newValues, (id, invoiceId) => {
            M.toast({
              html: `New Load #${invoiceId} added !`,
              classes: "materialize__toastSuccess"
            });
            this.props.history.push("/loads/loadboard");
          });
        }
      );
    } else {
      this.props.createLoad(newValues, (id, invoiceId) => {
        this.props.history.push("/loads/loadboard");
        M.toast({
          html: `New Load #${invoiceId} added !`,
          classes: "materialize__toastSuccess"
        });
      });
    }
  }

  handleRemoveRateLink = () => {
    this.setState({
      rateconfirmationFile: null,
      rateconfirmationFileName: null
    });
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const customers = this.props.customers;
    const drivers = this.props.drivers.sort((a, b) => {
      return a.driver_first_name.localeCompare(b.driver_first_name);
    });
    //
    // if (customers.length == 0) {
    //   console.log(customers.length);
    //   return <h1>Testing this stuff out</h1>;
    // }
    return (
      <section id="load-add-new" className="load-form-container app-container">
        <LoadingComponent loadingText="Add New Load" />

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
        </ul>

        <form
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
          className="form"
        >
          <div id="test1" className="col s12">
            <div className="form__section form__section--accounting">
              <div className="row form__row form__row--column">
                <Field
                  label="Customer"
                  name="customer_id"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Choose Customer"
                  options={customers.map(item => ({
                    value: item.id,
                    label: item.customer_name
                  }))}
                />
                <Field
                  label="Driver"
                  name="driver_id"
                  iconDisplayNone="label-group__addItemIcon--displayNone"
                  className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
                  type="select"
                  onBlur={() => input.onBlur(input.value)}
                  component={RenderSelectFieldReactSelectClass}
                  validate={required}
                  placeholder="Choose Driver"
                  options={drivers.map(item => ({
                    value: item.id,
                    label: item.driver_first_name + " " + item.driver_last_name
                  }))}
                />
                <Field
                  name="load_reference"
                  type="text"
                  component={renderField}
                  label="Load Reference #"
                  className="formSelectFields col s12 form__field form__field--column"
                  validate={[required, maxLength100]}
                />
                <Field
                  label="Pay Amount $"
                  name="rate_confirmation_amount"
                  component={renderField}
                  className="formSelectFields col s12 form__field form__field--column"
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
              <div className="file-upload-section">
                <div className="upload-group load-rateconfirmation">
                  <div
                    className={
                      this.state.rateconfirmationPdfUrl ? "pdf-link" : ""
                    }
                  >
                    {this.state.rateconfirmationPdfUrl ? (
                      <a
                        className="upload-attachment-file"
                        href={this.state.rateconfirmationPdfUrl}
                        target="_blank"
                      >
                        <i className="material-icons tiny">attach_file</i> Rate
                        Confirmation
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                  <label className="custom-file-upload">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={this.handleFileChange}
                      name="rateconfirmation"
                    />
                    <i className="upload-icon material-icons tiny">
                      cloud_upload
                    </i>
                    Rate Confirmation Upload
                  </label>
                  {this.state.rateconfirmationFileName ? (
                    <div className="file-link-name">
                      <a
                        className="blob-url"
                        href={URL.createObjectURL(
                          this.state.rateconfirmationFile
                        )}
                        target="_blank"
                      >
                        {this.state.rateconfirmationFileName}
                      </a>
                      <h4
                        className="remove-link"
                        onClick={this.handleRemoveRateLink}
                      >
                        Cancel
                      </h4>
                    </div>
                  ) : null}
                </div>
              </div>
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
            <ul className="fixed-action-button__sublinks">
              <li>
                <Link to="/loads/loadboard" className="btn-floating red">
                  <i className="material-icons">cancel</i>
                </Link>
              </li>
            </ul>
            <h4 className="fixed-action-btn__title save">Save Load</h4>
          </div>
        </form>
      </section>
    );
  }
}

function mapStatetoProps(state) {
  return {
    loads: state.loads,
    company: state.company,
    customers: state.customers.customers,
    drivers: state.drivers.drivers,
    currentForm: state.form.AddNewLoad,
    settings: state.settings
  };
}
export default reduxForm({
  // validate,
  form: "AddNewLoad",
  initialValues: {
    pickups: [{ pickup_name: "" }],
    deliveries: [{ delivery_name: "" }]
  }
})(
  connect(
    mapStatetoProps,
    {
      createLoad,
      fetchCustomers,
      fetchDrivers,
      fetchAllLoadsDetails,
      uploadRateBol,
      uploadAwsFileLoads
    }
  )(AddLoad)
);
