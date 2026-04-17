import { useRef } from 'react';
import { GripHorizontal, Minus, X } from 'lucide-react';
import clsx from 'clsx';
import { renderWindowContent } from '@/components/windowContent';
import { useDesktopStore } from '@/store/desktopStore';
import type { WindowState } from '@/types';

interface DesktopWindowProps {
  window: WindowState;
  active: boolean;
  dimmed: boolean;
}

const MIN_WINDOW_WIDTH = 520;
const MIN_WINDOW_HEIGHT = 320;

function clampPosition(x: number, y: number, width: number, height: number) {
  const maxX = Math.max(20, window.innerWidth - width - 20);
  const maxY = Math.max(72, window.innerHeight - height - 20);

  return {
    x: Math.min(Math.max(20, x), maxX),
    y: Math.min(Math.max(72, y), maxY),
  };
}

export function DesktopWindow({ window, active, dimmed }: DesktopWindowProps) {
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const minimizeWindow = useDesktopStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useDesktopStore((state) => state.toggleMaximizeWindow);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const resizeWindow = useDesktopStore((state) => state.resizeWindow);
  const settings = useDesktopStore((state) => state.settings);
  const dragOffsetRef = useRef({ x: 0, y: 0 });


  if (window.minimized) {
    return null;
  }

  function handleDragStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || window.maximized) {
      return;
    }

    focusWindow(window.id);
    dragOffsetRef.current = {
      x: event.clientX - window.x,
      y: event.clientY - window.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const clamped = clampPosition(
        moveEvent.clientX - dragOffsetRef.current.x,
        moveEvent.clientY - dragOffsetRef.current.y,
        window.width,
        window.height,
      );
      moveWindow(window.id, clamped.x, clamped.y);
    };

    const handleMouseUp = () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
  }

  function handleResizeStart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    focusWindow(window.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = window.width;
    const startHeight = window.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.max(
        MIN_WINDOW_WIDTH,
        Math.min(startWidth + (moveEvent.clientX - startX), globalThis.innerWidth - window.x - 20),
      );
      const nextHeight = Math.max(
        MIN_WINDOW_HEIGHT,
        Math.min(startHeight + (moveEvent.clientY - startY), globalThis.innerHeight - window.y - 20),
      );

      resizeWindow(window.id, nextWidth, nextHeight);
    };

    const handleMouseUp = () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
  }

  function handleResizeRightStart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    focusWindow(window.id);

    const startX = event.clientX;
    const startWidth = window.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.max(
        MIN_WINDOW_WIDTH,
        Math.min(startWidth + (moveEvent.clientX - startX), globalThis.innerWidth - window.x - 20),
      );

      resizeWindow(window.id, nextWidth, window.height);
    };

    const handleMouseUp = () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
  }

  function handleResizeBottomStart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    focusWindow(window.id);

    const startY = event.clientY;
    const startHeight = window.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const nextHeight = Math.max(
        MIN_WINDOW_HEIGHT,
        Math.min(startHeight + (moveEvent.clientY - startY), globalThis.innerHeight - window.y - 20),
      );

      resizeWindow(window.id, window.width, nextHeight);
    };

    const handleMouseUp = () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      globalThis.removeEventListener('mouseup', handleMouseUp);
    };

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <section
      data-window-shell="true"
      data-active={active ? 'true' : 'false'}
      style={{
        zIndex: active ? 1300 + window.zIndex : 1200 + window.zIndex,
        top: `${window.y}px`,
        left: `${window.x}px`,
        width: `${window.width}px`,
        height: `${window.height}px`,
        backgroundColor: active ? 'rgb(var(--card) / 0.94)' : 'rgb(var(--card) / 0.82)',
        boxShadow: 'none',
        borderColor: active ? 'rgb(var(--ring))' : 'rgb(var(--border) / 0.7)',
        borderWidth: '1px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={() => focusWindow(window.id)}
      className={clsx(
        'window-shell radius-panel absolute animate-popIn border backdrop-blur-2xl transition overflow-hidden',
        dimmed ? 'scale-[0.985] blur-[1px] opacity-25 saturate-50' : '',
      )}
    >
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={() => toggleMaximizeWindow(window.id)}
        className="flex cursor-grab items-center justify-between border-b border-border/70 bg-background/60 px-4 py-3 active:cursor-grabbing flex-shrink-0"
      >
        <div>
          <div className="flex items-center gap-1.5">
            <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="font-display text-base font-semibold leading-none text-foreground">{window.title}</h2>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Web desktop app</p>
        </div>
        <div className="flex items-center gap-2" onMouseDown={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => minimizeWindow(window.id)}
            className="rounded-full border border-border/70 bg-background/70 p-1.5 text-foreground transition hover:bg-accent/70"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => closeWindow(window.id)}
            className="rounded-full border border-border/70 bg-background/70 p-1.5 text-foreground transition hover:bg-accent/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div 
        className="flex-1 overflow-y-auto p-5 pr-3 text-foreground"
      >
        {renderWindowContent(window.id)}
      </div>
      {!window.maximized ? (
        <>
          <button
            type="button"
            aria-label="Redimensionar largura"
            onMouseDown={handleResizeRightStart}
            className="absolute right-0 top-16 h-[calc(100%-68px)] w-2 cursor-e-resize bg-transparent"
          />
          <button
            type="button"
            aria-label="Redimensionar altura"
            onMouseDown={handleResizeBottomStart}
            className="absolute bottom-0 left-20 h-2 w-[calc(100%-52px)] cursor-s-resize bg-transparent"
          />
          <button
            type="button"
            aria-label="Redimensionar janela"
            onMouseDown={handleResizeStart}
            className="absolute bottom-1 right-1 flex h-4 w-4 cursor-se-resize items-end justify-end bg-transparent p-0.5 transition hover:bg-accent/40"
          >
            <span
              className="block h-2.5 w-2.5 rounded-tl-sm border-b-2 border-r-2 border-muted-foreground/60 transition-opacity"
            />
          </button>
        </>
      ) : null}
    </section>
  );
}
