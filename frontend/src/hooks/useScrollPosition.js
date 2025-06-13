import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollPositions = {}; // Global scroll cache

export const useScrollPosition = () => {
    const location = useLocation();
    const currentPath = location.pathname + location.search;

    // Save scroll position before route changes
    useEffect(() => {
        const handleBeforeUnload = () => {
            scrollPositions[currentPath] = window.scrollY;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            scrollPositions[currentPath] = window.scrollY;
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentPath]);

    // Restore scroll position after route changes
    useEffect(() => {
        const savedY = scrollPositions[currentPath];
        if (savedY !== undefined) {
            requestAnimationFrame(() => {
                window.scrollTo(0, savedY);
            });
        } else {
            window.scrollTo(0, 0);
        }
    }, [currentPath]);
};
