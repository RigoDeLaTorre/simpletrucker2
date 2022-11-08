import React from 'react'
import { Link } from 'react-router-dom'

const FixedActionButton = ({ link }) => (
  <div className="fixed-action-btn">
    <Link to={link}>
      <button className="btn-floating btn-large blue lighten-2" type="submit">
        <i className="large material-icons">add_circle</i>
      </button>
      <h4 className="fixed-action-btn__title add">Add Load</h4>
    </Link>
  </div>
)

export { FixedActionButton }
