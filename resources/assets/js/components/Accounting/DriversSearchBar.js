import React from "react";

const DriversSearchBar = ({ handleChange, searchTerm, searchId, drivers }) => (
  <div className="search-section">
    <div className="input-field col s12">
      <select name="searchDriverId" onChange={handleChange}>
        <option value="" disabled defaultValue>
          Choose Driver
        </option>
        <option value="">All Drivers</option>
        {drivers.length == 0 ? (
          <option>Loading..</option>
        ) : (
          drivers.map(driver => {
            return (
              <option key={driver.id} value={driver.id}>
                {driver.driver_first_name}
              </option>
            );
          })
        )}
      </select>
    </div>
    <div className="group-search left-input input-field">
      <i className="search-icon tiny material-icons">person</i>
      <input
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        name="name"
        placeholder="First or Last name"
        onChange={handleChange}
        value={searchTerm}
      />
    </div>
    <div className="group-search right-input input-field">
      <i className="search-icon tiny material-icons">confirmation_number</i>
      <input
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        name="id"
        placeholder="Invoice #"
        onChange={handleChange}
        value={searchId}
      />
    </div>
  </div>
);

export default DriversSearchBar;
