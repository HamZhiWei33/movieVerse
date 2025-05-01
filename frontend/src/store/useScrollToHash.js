import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToHash = (offset = -80) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location, offset]);
};

export default useScrollToHash;
