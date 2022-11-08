import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Field,
  FieldArray,
  reduxForm,
  formValues,
  formValueSelector,
  getFormSyncErrors
} from 'redux-form'
import { Link } from 'react-router-dom'

import { renderSelectFieldReactSelect } from '../forms'
import { customStyles } from '../common'
import { fetchThemes } from '../../actions/user/fetchThemes.js'
import { updateUserSettings } from '../../actions/user/updateUserSettings.js'

import LoadingComponent from '../LoadingComponent'
import Select from 'react-select'

class UserSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.fetchThemes()
    setTimeout(() => {
      let materialBox = document.querySelectorAll('.materialboxed')
      let materialBoxInstance = M.Materialbox.init(materialBox)
    }, 0)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings.themes !== this.props.settings.themes) {
      let materialBox = document.querySelectorAll('.materialboxed')
      let materialBoxInstance = M.Materialbox.init(materialBox)
    }
  }
  onSubmit = values => {
    let newValues = { ...values }
    delete newValues.theme
    newValues.theme_option_id = newValues.theme_option_id.value

    this.props.updateUserSettings(newValues)
    // delete newValues.theme
  }

  renderThemes = () => {
    let themes = [
      { id: 2, img: 'themes/themeDark.png', label: 'Dark Theme' },
      { id: 12, img: 'themes/themeLight.png', label: 'Light Theme' },
      {
        id: 22,
        img: 'themes/themeLightDarkTop.png',
        label: 'Light Theme-DarkTop'
      }
    ]
    // let themes = this.props.settings.themes
    return themes.map((item, index) => {
      return (
        <div key={item.id || index} className="theme__item">
          <img className="materialboxed" width="650" src={item.img} />
          <h4
            className="theme__label"
            onClick={() => this.props.updateUserSettings(item.id)}>
            {item.label}
            <i className="small material-icons material-icons__checkbox">
              {this.props.settings.settings.theme_option_id === item.id
                ? 'check_box'
                : 'check_box_outline_blank'}
            </i>
          </h4>
        </div>
      )
    })
  }
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props
    const themeOptions = this.props.settings.themes.map(item => ({
      value: item.id,
      label: item.label
    }))

    return (
      <section id="customer-search" className="app-container">
        <LoadingComponent loadingText={'Settings'} />
        <div className="theme">{this.renderThemes()}</div>
        {/*
        <form
          className="form"
          onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <Field
                label="Theme"
                requiredStar="*"
                name="theme_option_id"
                iconDisplayNone={'label-group__addItemIcon--displayNone'}
                className="col s12 form__field form__field--column form__field--flex1"
                type="select"
                onBlur={() => input.onBlur(input.value)}
                component={renderSelectFieldReactSelect}
                placeholder="Theme"
                options={themeOptions}
              />
              <button type="submit">Submit </button>
          </form>
          */}
      </section>
    )
  }
}

UserSettings = reduxForm({
  form: 'UserSettings'
})(UserSettings)

UserSettings = connect(
  state => ({
    settings: state.settings,
    initialValues: {
      ...state.settings.settings,
      theme_option_id:
        state.settings &&
        state.settings.settings &&
        state.settings.settings.theme
          ? {
              value: state.settings.settings.theme.id,
              label: state.settings.settings.theme.label
            }
          : null
    },
    initialized: true,
    enableReinitialize: true
  }),
  {
    fetchThemes,
    updateUserSettings
  }
)(UserSettings)

export default UserSettings
