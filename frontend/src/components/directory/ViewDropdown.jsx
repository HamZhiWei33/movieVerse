import { useState } from "react";
import { FaCaretUp, FaCaretDown, FaTh, FaList } from "react-icons/fa";
import "../../styles/directory/ViewDropdown.css";

const ViewDropdown = ({ view, setView }) => {
  const [open, setOpen] = useState(false);

  const views = [
    { id: "grid", icon: <FaTh /> },
    { id: "list", icon: <FaList /> },
  ];

  const handleSelect = (id) => {
    setView(id);
    setOpen(false);
  };

  return (
    <div className="view-dropdown-wrapper">
      <div className={`view-dropdown ${open ? "active" : ""}`}>
        <button className="view-button" onClick={() => setOpen(!open)}>
          {views.find((v) => v.id === view)?.icon}
          <span>View</span>
          {open ? <FaCaretUp /> : <FaCaretDown />}
        </button>

        {open && (
          <div className="dropdown-menu inside-border">
            {views.map((v) => (
              <div
                key={v.id}
                onClick={() => handleSelect(v.id)}
                className={`dropdown-item ${view === v.id ? "active" : ""}`}
              >
                {view === v.id && <span className="indicator" />}
                {v.icon}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDropdown;