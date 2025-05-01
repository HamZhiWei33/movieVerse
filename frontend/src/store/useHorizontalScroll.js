import { useEffect } from "react";

const useHorizontalScroll = (containerRef) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isOverflowing = container.scrollWidth > container.clientWidth;

    const onWheel = (e) => {
      if (isOverflowing && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    if (isOverflowing) {
      container.addEventListener("wheel", onWheel, { passive: false });
    }

    return () => {
      if (isOverflowing) {
        container.removeEventListener("wheel", onWheel);
      }
    };
  }, [containerRef]);
};

export default useHorizontalScroll;
