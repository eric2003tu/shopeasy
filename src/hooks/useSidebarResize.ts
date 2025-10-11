import { useEffect } from 'react';

export function useSidebarResize() {
  useEffect(() => {
    const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]') as HTMLElement | null;
    if (!wrapper) return;

    const gap = wrapper.querySelector('[data-slot="sidebar-gap"]') as HTMLElement | null;
    const container = wrapper.querySelector('[data-slot="sidebar-container"]') as HTMLElement | null;
    
    if (!gap || !container) return;

    gap.style.cursor = 'ew-resize';

    const _wrapper = wrapper as HTMLElement;
    const _container = container as HTMLElement;

    let startX = 0;
    let startWidth = 0;
    const minPx = 160;
    const maxPx = 640;

    function onPointerMove(e: PointerEvent) {
      const delta = e.clientX - startX;
      let newWidth = startWidth + delta;
      
      // Clamp width between min and max
      newWidth = Math.max(minPx, Math.min(maxPx, newWidth));
      
      _wrapper.style.setProperty('--sidebar-width', `${newWidth}px`);
    }

    function onPointerUp() {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    function onPointerDown(e: PointerEvent) {
      e.preventDefault();
      startX = e.clientX;
      const rect = _container.getBoundingClientRect();
      startWidth = rect.width;
      
      // Improve UX during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
      
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    gap.addEventListener('pointerdown', onPointerDown);

    return () => {
      gap.removeEventListener('pointerdown', onPointerDown);
      gap.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);
}