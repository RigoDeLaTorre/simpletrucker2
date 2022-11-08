import React from 'react'
import Select from 'react-select'
import { reactSelectStylesPagination} from './reactSelectStylesPagination'
import { reactSelectStylesPaginationThemeLight} from './reactSelectStylesPaginationThemeLight'

const SearchBarNew = ({
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
  themeStyle
}) => (
  <div
    className={`search-container-navTop ${positionAbsolute} ${positionAbsoulteMinTablet}`}>
    <div className="group-search group-search--leftSide">
      <h4 className="group-search__label">{labelText}</h4>
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
        styles={themeStyle}
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            //background
            // neutral0:"white",

            //border and divider of arrow - initial
            neutral20: '#2f3c63',

            //arrow down - after its not pristine
            neutral60: '#7f64e3',

            // no options text when user searching
            neutral40: 'orange',
            //chosen field on dropdown from previous
            primary: '#7f64e3',

            //highlight at hover
            primary25: '#e0d8fe',
            //Placeholder
            neutral50: '#8c8bcc',

            //selectd value text color
            neutral80: 'rgba(0,0,0,0.87)',
            //hover over container
            neutral30: '#7f64e3'

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
    <div className="group-search input-field top-section__customer-search-field">
      <h4 className="group-search__label">{labelNumber}</h4>
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
        styles={themeStyle}
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            //background
            // neutral0:"white",

            //border and divider of arrow - initial
            neutral20: '#2f3c63',

            //arrow down - after its not pristine
            neutral60: '#7f64e3',

            // no options text when user searching
            neutral40: 'orange',
            //chosen field on dropdown from previous
            primary: '#7f64e3',

            //highlight at hover
            primary25: '#e0d8fe',
            //Placeholder
            neutral50: '#8c8bcc',

            //selectd value text color
            neutral80: 'rgba(0,0,0,0.87)',
            //hover over container
            neutral30: '#7f64e3'

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
  </div>
)
export { SearchBarNew }
