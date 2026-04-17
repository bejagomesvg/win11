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
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const moveWindow = useDesktopStore((state) => state.moveWindow);
  const resizeWindow = useDesktopStore((state) => state.resizeWindow);
  const settings = useDesktopStore((state) => state.settings);
  const dragOffsetRef = useRef({ x: 0, y: 0 });


  if (window.minimized) {
    return null;
  }

  function handleDragStart(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) {
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
      style={{
        zIndex: active ? 1300 + window.zIndex : 1200 + window.zIndex,
        top: `${window.y}px`,
        left: `${window.x}px`,
        width: `${window.width}px`,
        height: `${window.height}px`,
        backgroundColor: active
          ? settings.theme === 'dark'
            ? 'rgba(2, 6, 23, 0.82)'
            : 'rgba(240, 249, 255, 0.85)'
          : settings.theme === 'dark'
            ? 'rgba(15, 23, 42, 0.55)'
            : 'rgba(219, 234, 254, 0.6)',
        boxShadow: active
          ? settings.theme === 'dark'
            ? '0 40px 120px rgba(2, 6, 23, 0.65)'
            : '0 40px 120px rgba(30, 58, 138, 0.35)'
          : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseDown={() => focusWindow(window.id)}
      className={clsx(
        'absolute animate-popIn rounded-[28px] border backdrop-blur-2xl transition overflow-hidden',
        settings.theme === 'dark' ? 'border-white/10' : 'border-slate-300/30',
        dimmed ? 'scale-[0.985] blur-[1px] opacity-25 saturate-50' : '',
      )}
    >
      <div
        onMouseDown={handleDragStart}
        className={clsx(
          'flex cursor-grab items-center justify-between border-b px-5 py-4 active:cursor-grabbing flex-shrink-0',
          settings.theme === 'dark'
            ? 'border-white/10 bg-black/20'
            : 'border-slate-300/30 bg-white/20'
        )}
      >
        <div>
          <div className="flex items-center gap-2">
            <GripHorizontal className={clsx(
              'h-4 w-4',
              settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            )} />
            <h2 className={clsx(
              'font-display text-lg font-semibold',
              settings.theme === 'dark' ? 'text-white' : 'text-slate-900'
            )}>{window.title}</h2>
          </div>
          <p className={clsx(
            'text-xs uppercase tracking-[0.24em]',
            settings.theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}>Web desktop app</p>
        </div>
        <div className="flex items-center gap-2" onMouseDown={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => minimizeWindow(window.id)}
            className={clsx(
              'rounded-full border p-2 transition',
              settings.theme === 'dark'
                ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                : 'border-slate-300/50 bg-slate-100/40 text-slate-700 hover:bg-slate-100/60'
            )}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => closeWindow(window.id)}
            className="rounded-full border p-2 transition"
            style={{
              borderColor: 'rgba(var(--color-primary), 0.25)',
              backgroundColor: 'rgba(var(--color-primary), 0.18)',
              color: settings.theme === 'dark' ? 'white' : 'rgba(var(--color-primary), 1)',
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div 
        className={clsx(
          'flex-1 overflow-y-scroll p-5 pr-3',
          settings.theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        )}
      >
        {renderWindowContent(window.id)}
      </div>
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
        className="absolute bottom-1 right-1 h-5 w-5 cursor-se-resize rounded-full bg-white/5 text-transparent transition hover:bg-white/10"
      />
    </section>
  );
}
