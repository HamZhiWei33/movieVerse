import { useState } from "react";
import "../styles/sidebar.css";

import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa6";

const Sidebar = ({
  sections,
  selectedGenres,
  setSelectedGenres,
  selectedRegions,
  setSelectedRegions,
  selectedYears,
  setSelectedYears,
  genres,
  regions,
  years,
}) => {
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleFilter = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderFilterItems = (items, selected, setSelected) => (
    <div className="sidebar-filter-group">
      {items.map((item) => (
        <label key={item} className="sidebar-filter-item">
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggleFilter(item, selected, setSelected)}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );

  return (
    <nav className="sidebar">
      <ul>
        {sections.map(({ id, title }) => (
          <li key={id} className="sidebar-section">
            <div
              className="section-title"
              onClick={() => toggleSection(id)}
              role="button"
              tabIndex={0}
            >
              <span className="sidebar-title">{title}</span>

              {"  "}
              {openSections.includes(id) ? (
                <FaAngleUp className="sidebar-icon" />
              ) : (
                <FaAngleDown className="sidebar-icon" />
              )}
            </div>

            {openSections.includes(id) && (
              <>
                {id === "genre" &&
                  renderFilterItems(genres, selectedGenres, setSelectedGenres)}
                {id === "region" &&
                  renderFilterItems(
                    regions,
                    selectedRegions,
                    setSelectedRegions
                  )}
                {id === "year" &&
                  renderFilterItems(years, selectedYears, setSelectedYears)}
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
