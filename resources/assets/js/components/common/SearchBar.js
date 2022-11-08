import React from 'react'

const SearchBar = ({
  handleSearchPhone,
  searchTerm,
  searchPhone,
  searchTermPlaceholder,
  searchIdPlaceholder
}) => (
  <div className="search-container-navTop">
    <div className="group-search input-field left-side top-section____customer-search-field">
      <i className="search-icon tiny material-icons">person</i>
      <input
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        name="name"
        placeholder={searchTermPlaceholder}
        onChange={handleSearchPhone}
        value={searchTerm}
      />
    </div>
    <div className="group-search input-field top-section____customer-search-field">
      <i className="search-icon tiny material-icons">phone</i>
      <input
        autoComplete="new-password"
        autoCorrect="false"
        spellCheck="false"
        type="text"
        name="phone"
        placeholder={searchIdPlaceholder}
        onChange={handleSearchPhone}
        value={searchPhone}
      />
    </div>
  </div>
)
export { SearchBar }
