import { useEffect } from 'react';

/**
 * Custom hook to prevent image theft and browser inspection
 */
export const useAntiTheft = () => {
  useEffect(() => {
    // Prevent default behaviors
    const preventDefaultBehavior = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent context menu (right click)
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent keyboard shortcuts that might open dev tools
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }
    };
    
    // Apply anti-theft measures to all images
    const protectImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.addEventListener('dragstart', preventDefaultBehavior, { passive: false });
        img.addEventListener('contextmenu', preventContextMenu, { passive: false });
      });
    };
    
    // Detect DevTools
    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > 200 ||
        window.outerWidth - window.innerWidth > 200
      ) {
        document.body.innerHTML = 'Developer tools detected. Please close them to view this page.';
      }
    };
    
    // Apply all protections
    protectImages();
    
    // Add global event listeners
    document.addEventListener('dragstart', preventDefaultBehavior, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu, { passive: false });
    document.addEventListener('keydown', preventKeyboardShortcuts as EventListener, { passive: false });
    document.addEventListener('selectstart', preventDefaultBehavior, { passive: false });
    document.addEventListener('copy', preventDefaultBehavior, { passive: false });
    
    // Monitor for DevTools
    window.addEventListener('resize', detectDevTools);
    const devToolsInterval = setInterval(detectDevTools, 1000);
    
    // Run protection again when DOM changes
    const observer = new MutationObserver(protectImages);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup function
    return () => {
      document.removeEventListener('dragstart', preventDefaultBehavior);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts as EventListener);
      document.removeEventListener('selectstart', preventDefaultBehavior);
      document.removeEventListener('copy', preventDefaultBehavior);
      window.removeEventListener('resize', detectDevTools);
      clearInterval(devToolsInterval);
      observer.disconnect();
    };
  }, []);
};