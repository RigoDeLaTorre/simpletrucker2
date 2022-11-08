import React from "react";
import { NavLink } from "react-router-dom";

const TopSectionNav = ({
  title,
  linkAdd,
  linkExact,
  linkAddTitle,
  linkExactTitle
}) => (
  <div className="top-section">
    <h1>{title}</h1>
    <div className="search-container">
      <NavLink to={linkAdd} activeClassName="selected">
        {linkAddTitle}
      </NavLink>
      <NavLink exact to={linkExact} activeClassName="selected">
        {linkExactTitle}
      </NavLink>
    </div>
  </div>
);

export default TopSectionNav;
