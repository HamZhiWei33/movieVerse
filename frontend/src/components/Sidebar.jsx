// const Sidebar = () => {
//   return (
//     <aside id="sidebar">
//       <h2>Sidebar</h2>
//       <ul>
//         <li>
//           <a href="#genre_dir">Genre</a>
//         </li>
//         <li>
//           <a href="#region_dir">Region</a>
//         </li>
//         <li>
//           <a href="#year_dir">Year</a>
//         </li>
//       </ul>
//     </aside>
//   );
// };import { Link } from "react-scroll";
import { Link } from "react-scroll";
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
              {title}{" "}
              {openSections.includes(id) ? <FaAngleDown /> : <FaAngleUp />}
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
