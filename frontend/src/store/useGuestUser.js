import { useEffect } from "react";

const useGuestUser = (isUserValidated, className = "homePageWrapper") => {
  useEffect(() => {
    if (!isUserValidated) {
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("Please log in to have a better experience.");
      };

      const wrapper = document.querySelector(`.${className}`);
      if (wrapper) {
        wrapper.addEventListener("click", handleClick, true);
      }

      return () => {
        if (wrapper) {
          wrapper.removeEventListener("click", handleClick, true);
        }
      };
    }
  }, [isUserValidated, className]);
};

export default useGuestUser;
