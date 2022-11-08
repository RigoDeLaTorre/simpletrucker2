import React from 'react'

const ExcelButton = ({ onClick }) => (
  <div className="excel-button" onClick={onClick}>
    <img className="excel-button__img" src="/img/icons/excel.png" />
    <h4 className="excel-button__text">Export</h4>
  </div>
)

export { ExcelButton }
