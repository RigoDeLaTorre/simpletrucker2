import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Field, FieldArray, reduxForm, formValueSelector } from "redux-form";
import { updateLoad } from "../../../actions/loads/updateLoad.js";
import { convertDate } from "../../common";
import {
  processTypes,
  processTypesNoQuickPay,
  processTypesNoFactor
} from "../../forms/validation/processTypeOptions";
import { normalizeRateAmount } from "../../forms/validation";
import {
  required,
  maxLength,
  maxLength10,
  maxLength50,
  maxLength100,
  maxLength200,
  minLength,
  minLength5,
  number
} from "../../forms/validation/fieldValidations";

class DriverPayModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bol: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loads.selectedLoad !== this.props.loads.selectedLoad) {
      let elems = document.querySelectorAll("select");
      let instances = M.FormSelect.init(elems);
    }
  }
  componentDidMount() {
    let elems = document.querySelectorAll("select");
    let instances = M.FormSelect.init(elems);
  }

  renderField = ({
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div className={`input-field ${className} `}>
      <label>{label}</label>
      <input
        className="form-control"
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );
  renderModalPickupAddress = () => {
    return this.props.loads.selectedLoad.pickups.map((pickup, index) => {
      return (
        <div className="group-address" key={pickup.id}>
          <h4>
            Pickup #{index + 1} : {convertDate(pickup.pickup_date)}
          </h4>
          <h4 className="address-name">{pickup.pickup_name} </h4>
          <h4>{pickup.pickup_address} </h4>
          <h4>
            {pickup.pickup_city} {pickup.pickup_state}, {pickup.pickup_zipcode}
          </h4>
        </div>
      );
    });
  };

  renderModalDeliveryAddress = () => {
    return this.props.loads.selectedLoad.deliveries.map((delivery, index) => {
      return (
        <div className="group-address" key={delivery.id}>
          <h4>
            Delivery #{index + 1} : {convertDate(delivery.delivery_date)}
          </h4>
          <h4 className="address-name">{delivery.delivery_name} </h4>
          <h4>{delivery.delivery_address} </h4>
          <h4>
            {delivery.delivery_city} {delivery.delivery_state},{" "}
            {delivery.delivery_zipcode}
          </h4>
        </div>
      );
    });
  };

  renderTextArea = ({
    className,
    input,
    label,
    type,
    meta: { touched, error }
  }) => (
    <div className={`input-field ${className} `}>
      <label className="active textarea">{label}</label>
      <textarea
        className="form-control materialize-textarea white-text"
        autoComplete="new-password"
        type="text"
        rows="4"
        cols="50"
        {...input}
      />
      <div className="text-help">{touched ? error : ""}</div>
    </div>
  );

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
  processTypeFields = () => {
    if (this.props.company.factory_company_name) {
      // IF COMPANY HAS A FACTORY COMPANY
      if (
        this.props.loads.selectedLoad.customer.quickpay_email &&
        this.props.loads.selectedLoad.customer.quickpay_email !== ""
      ) {
        return processTypes.map(processType => {
          return (
            <option key={processType.value} value={processType.value}>
              {processType.label}
            </option>
          );
        });
      } else {
        return processTypesNoQuickPay.map(processType => {
          return (
            <option key={processType.value} value={processType.value}>
              {processType.label}
            </option>
          );
        });
      }
    } else {
      //NO FACTOR COMPANY
      if (
        this.props.loads.selectedLoad.customer.quickpay_email &&
        this.props.loads.selectedLoad.customer.quickpay_email !== ""
      ) {
        return processTypesNoFactor.map(processType => {
          return (
            <option key={processType.value} value={processType.value}>
              {processType.label}
            </option>
          );
        });
      } else {
        return (
          <option key="notfactored" value="notfactored">
            Not Factored
          </option>
        );
      }
    }
  };

  renderDriverPaymentLoads = ({ fields, meta: { error, submitFailed } }) => (
    <div className="form-section-container right-side">
      {submitFailed && error && <span>{error}</span>}
      <ul className="form-group-one">
        {this.props.loads.loads.map((loadPayments, index) => (
          <li key={index} className="load-item">
            <h1>load: {loadPayments.id}</h1>
            <div className="row col s12 load-detail-data">
              <Field
                label="Pay Type"
                name={`${loadPayments}.driver_pay_type`}
                className="inline"
                type="select"
                component={this.selectField}
                validate={required}
              >
                <option value={""} disabled defaultValue>
                  Process Type{" "}
                </option>
                {this.processTypeFields()}
              </Field>

              <Field
                label="Check/ACH # :"
                name={`${loadPayments}.driver_pay_reference`}
                component={this.renderField}
                className="inline"
                type="text"
                validate={[required, maxLength100]}
              />

              <Field
                label="Base Pay :"
                name={`${loadPayments}.driver_pay_amount`}
                component={this.renderField}
                className="inline"
                type="text"
                validate={[required, number]}
              />

              <Field
                label="Reimbursements :"
                name={`${loadPayments}.driver_pay_reimbursement`}
                component={this.renderField}
                className="inline"
                type="text"
                validate={[required, number]}
              />

              <Field
                label="Deductions :"
                name={`${loadPayments}.driver_pay_deduction`}
                component={this.renderField}
                className="inline"
                type="text"
                validate={[required, number]}
              />
              {/*
            <Field
              label="Notes"
              name="driver_pay_notes"
              component={this.renderTextArea}
              className="col s12"
              type="textarea"
            /> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  onSubmit({
    load_processed_type,
    rate_confirmation_amount,
    load_reimbursement,
    invoice_notes,
    bill_of_lading,
    bill_of_lading_number,
    id
  }) {
    bill_of_lading = this.state.bol === true ? 1 : 0;
    let newValues = {
      load_processed_type,
      rate_confirmation_amount,
      load_reimbursement,
      invoice_notes,
      bill_of_lading,
      bill_of_lading_number,
      id
    };

    this.props.updateLoad(newValues, () => {
      this.props.handleFilterButton();
    });
    M.toast({
      html: `Load Id# ${newValues.id} ***  updated !`
    });
  }
  handleSwitch = event => {
    this.setState({
      bol: !this.state.bol
    });
  };

  renderForms = () => {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <section className="form-containter">
        {this.props.loads.loads.map(item => {
          return (
            <form
              className="form"
              onSubmit={handleSubmit(this.onSubmit.bind(this))}
            >
              <div className="load-details">
                <div>
                  <h4>Invoice: {item.id}</h4>
                </div>
                <div>
                  <h4>Customer: {item.id}</h4>
                </div>
                <div>
                  <h4>
                    Pickup: {convertDate(item.pickups[0].pickup_date)}{" "}
                    {item.pickups[0].pickup_city},{" "}
                    {item.pickups[0].pickup_state}
                  </h4>
                </div>
                <div>
                  <h4>
                    Delivery: {convertDate(item.deliveries[0].delivery_date)}{" "}
                    {item.deliveries[0].delivery_city},{" "}
                    {item.deliveries[0].delivery_state}
                  </h4>
                </div>
              </div>

              {/*
              <div className="row col s12 load-detail-data">
                <Field
                  label="Pay Type"
                  name="driver_pay_type"
                  className="inline"
                  type="select"
                  component={this.selectField}
                  validate={required}>
                  <option value={''} disabled defaultValue>
                    Process Type{' '}
                  </option>
                  {this.processTypeFields()}
                </Field>

                <Field
                  label="Check/ACH # :"
                  name="driver_pay_reference"
                  component={this.renderField}
                  className="inline"
                  type="text"
                  validate={[required, maxLength100]}
                />

                <Field
                  label="Base Pay :"
                  name="driver_pay_amount"
                  component={this.renderField}
                  className="inline"
                  type="text"
                  validate={[required, number]}
                />

                <Field
                  label="Reimbursements :"
                  name="driver_pay_reimbursement"
                  component={this.renderField}
                  className="inline"
                  type="text"
                  validate={[required, number]}
                />

                <Field
                  label="Deductions :"
                  name="driver_pay_deduction"
                  component={this.renderField}
                  className="inline"
                  type="text"
                  validate={[required, number]}
                />
                {/*
                <Field
                  label="Notes"
                  name="driver_pay_notes"
                  component={this.renderTextArea}
                  className="col s12"
                  type="textarea"
                />
              </div> */}

              <Link
                to="/accounting/edit"
                className="btn-floating btn-large red left"
              >
                {" "}
                <i className="large material-icons">edit</i>
              </Link>

              <button
                className="btn-floating btn-large green right"
                type="submit"
                disabled={submitting}
              >
                {" "}
                <i className="large material-icons">save</i>
              </button>
            </form>
          );
        })}
      </section>
    );
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div id="modal-driverPay" className="modal">
        {!this.props.loads ||
        !this.props.loads.selectedLoad ||
        !this.props.loads.selectedLoad.customer ||
        !this.props.loads.selectedLoad.driver ||
        !this.props.loads.selectedLoad.pickups ||
        !this.props.loads.selectedLoad.deliveries ? (
          "none"
        ) : (
          <div className="modal-content">
            <div className="row">
              <form>
                <Field
                  name="load_reference"
                  type="text"
                  component={this.renderField}
                  label="Load Reference #"
                  className="col s3"
                  validate={[required, maxLength100]}
                />
                <div className="row">
                  <FieldArray
                    name="loadPayments"
                    component={this.renderDriverPaymentLoads}
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DriverPayModal = reduxForm({
  form: "DriverPayModalForm"
})(DriverPayModal);

DriverPayModal = connect(
  state => ({
    company: state.company,
    loads: state.loads,
    settings: state.settings,
    initialValues: { ...state.loads.loads },
    // initialValues: {
    //   id: state.loads.selectedLoad.id,
    //   load_processed_type:
    //     state.loads.selectedLoad &&
    //     state.loads.selectedLoad.customer &&
    //     !state.loads.selectedLoad.load_processed_type
    //       ? state.loads.selectedLoad.customer.process_type
    //       : state.loads.selectedLoad.load_processed_type,
    //   rate_confirmation_amount:
    //     state.loads.selectedLoad.rate_confirmation_amount,
    //   load_reimbursement: state.loads.selectedLoad.load_reimbursement,
    //   invoice_notes: state.loads.selectedLoad.invoice_notes,
    //   bill_of_lading: state.loads.selectedLoad.bill_of_lading,
    //   bill_of_lading_number: state.loads.selectedLoad.bill_of_lading_number
    // },
    initialized: true,
    enableReinitialize: true
  }),
  {
    updateLoad
  } // bind account loading action creator
)(DriverPayModal);

export default DriverPayModal;
