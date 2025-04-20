import { useState } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { FaTh, FaList } from "react-icons/fa";
import "../../styles/directory/ViewDropdown.css";

const ViewDropdown = ({setView}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("grid");

  const views = [
    { id: "grid", icon: <FaTh /> },
    { id: "list", icon: <FaList /> },
  ];

  const handleSelect = (id) => {
    setSelected(id);
    setView(id);
    setOpen(false);
  }

  return (
    <div className="view-dropdown-wrapper">
      <div className={`view-dropdown ${open ? "active" : ""}`}>
        <button className="view-button" onClick={() => setOpen(!open)}>
          {views.find((v) => v.id === selected)?.icon}
          <span>View</span>
          {open ? <FaCaretUp /> : <FaCaretDown />}
        </button>

        {open && (
          <div className="dropdown-menu inside-border">
            {views.map((view) => (
              <div
                key={view.id}
                onClick={() => handleSelect(view.id)}
                className={`dropdown-item ${
                  selected === view.id ? "active" : ""
                }`}
              >
                {selected === view.id && <span className="indicator" />}
                {view.icon}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDropdown;