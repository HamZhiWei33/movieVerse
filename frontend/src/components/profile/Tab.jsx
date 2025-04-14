import React, { useState, useEffect, useRef } from "react";
import TabOverview from "./TabOverview";
import TabWatchlist from "./TabWatchlist";
import TabReview from "./TabReview";
import TabManage from "./TabManage";
import "../../styles/profile/tab.css";
import { ReviewList } from "./constant";

const tabList = ["Overview", "WatchList", "Review", "Manage"];
const Tab = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Overview";
  });
  const lineRef = useRef(null);
  const tabRefs = useRef({});

  // Set tabRefs dynamically
  tabList.forEach((tab) => {
    if (!tabRefs.current[tab]) {
      tabRefs.current[tab] = React.createRef();
    }
  });

  // Move underline line on tab change
  useEffect(() => {
    const activeRef = tabRefs.current[activeTab];
    if (activeRef?.current && lineRef.current) {
      const tabElement = activeRef.current;
      const padding = window.innerWidth < 768 ? 4 : 8;

      // Gets the full width of the tab's content
      // Positions the underline at the tab's start position + padding.
      lineRef.current.style.left = `${tabElement.offsetLeft + padding}px`;
      // Sets the underline width to the tab's content width minus padding on both sides.
      lineRef.current.style.width = `${tabElement.scrollWidth - padding * 2}px`;
    }

    // Save to localStorage
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Add resize observer to handle screen changes
  useEffect(() => {
    const handleResize = () => {
      const activeRef = tabRefs.current[activeTab];
      if (activeRef?.current && lineRef.current) {
        const tabElement = activeRef.current;
        const padding = window.innerWidth < 768 ? 4 : 8;

        lineRef.current.style.left = `${tabElement.offsetLeft + padding}px`;
        lineRef.current.style.width = `${
          tabElement.scrollWidth - padding * 2
        }px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Handle keyboard arrow navigation
  const handleKeyDown = (e, currentTabIndex) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentTabIndex + direction + tabList.length) % tabList.length;
      const nextTab = tabList[nextIndex];
      setActiveTab(nextTab);
      tabRefs.current[nextTab].current.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      setActiveTab(tabList[currentTabIndex]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <TabOverview />;
      case "WatchList":
        return <TabWatchlist />;
      case "Review":
        return <TabReview reviews={ReviewList} />;
      case "Manage":
        return <TabManage />;
      default:
        return null;
    }
  };
  return (
    <section className="tab-section" aria-label="profile-tab">
      <ul
        className="nav-container"
        role="tablist"
        aria-label="profile-tabs-section"
      >
        {tabList.map((tab, index) => (
          <li key={tab} className="nav-item" role="presentation">
            <button
              ref={tabRefs.current[tab]}
              className={`tab_btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {tab}
            </button>
          </li>
        ))}
        <div ref={lineRef} className="line" aria-hidden="true"></div>
      </ul>
      <div className="tab-content">{renderContent()}</div>
    </section>
  );
};

export default Tab;
