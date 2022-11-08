import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reactSelectStylesPagination } from './reactSelectStylesPagination'
import { reactSelectStylesPaginationThemeLight } from './reactSelectStylesPaginationThemeLight'
import Select from 'react-select'
import { ExcelButton } from './ExcelButton'

class Pagination extends Component {
  renderPagination = () => {
    const {
      loadStatus,
      currentPage,
      resultsPerPage,
      totalPages,
      activeLength,
      deliveredLength,
      cancelledLength,
      allLength,
      readyLength,
      processedTodayLength,
      paidLength,
      factorUnpaidLength,
      factorUnpaidReservesLength,
      customerUnpaidLength,
      unpaidLength,
      handleResultsPerPage,
      totalResults
    } = this.props

    let getLength = loadStatus => {
      switch (loadStatus) {
        case 'active':
          return activeLength
        case 'delivered':
          return deliveredLength
        case 'cancelled':
          return cancelledLength
        case 'all':
          return allLength
        case 'ready':
          return readyLength
        case 'customer-unpaid':
          return customerUnpaidLength
        case 'factor-unpaid':
          return factorUnpaidLength
        case 'factor-unpaid-reserves':
          return factorUnpaidReservesLength
        case 'processedToday':
          return processedTodayLength
        case 'paid':
          return paidLength
        case 'unpaid':
          return unpaidLength
      }
    }
    let len = getLength(loadStatus)
    return (
      <div className="paginationSection__resultGroup">
        <Select
          label="Pagination"
          name="pagination"
          className="form__field form__field--minWidth85"
          onChange={handleResultsPerPage}
          defaultValue={{ value: 25, label: 25 }}
          placeholder="Results/pg"
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 75, label: '75' },
            { value: 100, label: '100' }
          ]}
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

            // borderStyle:"none !important",

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
    )
  }

  //   if (loadStatus === 'active') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h4 className="form__field__topText">
  //           Page {currentPage} /{' '}
  //           {Math.ceil(activeLength / resultsPerPage)}
  //         </h4>
  //         <Select
  //           label="Customer"
  //           name="customer_id"
  //           className="formSelectFields col s12 form__field form__field--column form__field--minWidth85"
  //           type="select"
  //           onChange={handleResultsPerPage}
  //           defaultValue={{value:50, label:50}}
  //           placeholder="Results/pg"
  //           options={[
  //             {value:5, label:"5"},
  //             {value:10, label:"10"},
  //             {value:25, label:"25"},
  //             {value:50, label:"50"},
  //             {value:75, label:"75"},
  //             {value:100, label:"100"}
  //           ]}
  //           styles={customStyles}
  //           theme={theme => ({
  //             ...theme,
  //             borderRadius: 0,
  //             colors: {
  //               ...theme.colors,
  //               //background
  //               // neutral0:"white",
  //
  //               //border and divider of arrow - initial
  //               neutral20: '#2f3c63',
  //
  //               //arrow down - after its not pristine
  //               neutral60: '#7f64e3',
  //
  //               // no options text when user searching
  //               neutral40: 'orange',
  //               //chosen field on dropdown from previous
  //               primary: '#7f64e3',
  //
  //               //highlight at hover
  //               primary25: '#e0d8fe',
  //               //Placeholder
  //               neutral50: '#8c8bcc',
  //
  //               //selectd value text color
  //               neutral80: 'rgba(0,0,0,0.87)',
  //               //hover over container
  //               neutral30: '#7f64e3'
  //
  //               // neutral5:"#dd4c4c",
  //               // neutral10:"#dd4c4c",
  //               //
  //               // primay50:"#dd4c4c",
  //               // neutral70:"#dd4c4c",
  //               // neutral90:"#dd4c4c"
  //             }
  //           })}
  //         />
  //         <h4 className="form__field__bottomText">Results per page</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'delivered') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(deliveredLength / resultsPerPage)}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'cancelled') {
  //     return (
  //       <div className="pagination__resultGroup">
  //       <h1>
  //         Page {currentPage} /{' '}
  //         {Math.ceil(cancelledLength / resultsPerPage)}
  //       </h1>
  //       <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //         </div>
  //     )
  //   } else if (loadStatus === 'all') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(allLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'ready') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(readyLength / resultsPerPage)}{' '}
  //         </h1>
  //         <Select
  //           label="Customer"
  //           name="customer_id"
  //           className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
  //           type="select"
  //           onChange={handleResultsPerPage}
  //           defaultValue={options[0]}
  //           placeholder="Choose Customer"
  //           options={options}
  //           styles={customStyles}
  //           theme={theme => ({
  //             ...theme,
  //             borderRadius: 0,
  //             colors: {
  //               ...theme.colors,
  //               //background
  //               // neutral0:"white",
  //
  //               //border and divider of arrow - initial
  //               neutral20: '#2f3c63',
  //
  //               //arrow down - after its not pristine
  //               neutral60: '#7f64e3',
  //
  //               // no options text when user searching
  //               neutral40: 'orange',
  //               //chosen field on dropdown from previous
  //               primary: '#7f64e3',
  //
  //               //highlight at hover
  //               primary25: '#e0d8fe',
  //               //Placeholder
  //               neutral50: '#8c8bcc',
  //
  //               //selectd value text color
  //               neutral80: 'rgba(0,0,0,0.87)',
  //               //hover over container
  //               neutral30: '#7f64e3'
  //
  //               // neutral5:"#dd4c4c",
  //               // neutral10:"#dd4c4c",
  //               //
  //               // primay50:"#dd4c4c",
  //               // neutral70:"#dd4c4c",
  //               // neutral90:"#dd4c4c"
  //             }
  //           })}
  //         />
  //       </div>
  //     )
  //   } else if (loadStatus === 'customer-unpaid') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(customerUnpaidLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'factor-unpaid') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(factorUnpaidLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'factor-unpaid-reserves') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(factorUnpaidReservesLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'processedToday') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(processedTodayLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   } else if (loadStatus === 'paid') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(paidLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   }else if (loadStatus === 'unpaid') {
  //     return (
  //       <div className="pagination__resultGroup">
  //         <h1>
  //           Page {currentPage} /{' '}
  //           {Math.ceil(unpaidLength / resultsPerPage)}{' '}
  //         </h1>
  //         <h4 className="pagination__subText">( {resultsPerPage} results/page )</h4>
  //       </div>
  //     )
  //   }

  render() {
    return (
      <div className="paginationSection">
        <div
          className={`paginationSection__groupContainer ${
            this.props.positionAbsolute
          }`}>
          <div className="paginationSection__group">
            <i
              className="material-icons paginationSection__button"
              onClick={this.props.renderPrevPage}>
              keyboard_arrow_left
            </i>
            {/*  <div onClick={this.props.renderPrevPage}
              className="pagination__button">
              Prev
          </div>
          */}
            {this.renderPagination()}
            <i
              className="material-icons paginationSection__button"
              onClick={this.props.renderNextPage}>
              keyboard_arrow_right
            </i>

            {/*
          <div
            onClick={this.props.renderNextPage}
            className="pagination__button">
            Next
          </div>
          */}
          </div>
          <h4 className="paginationSection__bottomText">
            Page{' '}
            <span className="paginationSection__bottomText--span">
              {this.props.currentPage}
            </span>{' '}
            /{Math.ceil(this.props.totalResults / this.props.resultsPerPage)} -
            ({this.props.totalResults} results)
          </h4>
        </div>

        <ExcelButton onClick={this.props.renderCsv} />
      </div>
    )
  }
}

function mapStatetoProps(state) {
  return {
    settings: state.settings
  }
}

export default connect(mapStatetoProps)(Pagination)
