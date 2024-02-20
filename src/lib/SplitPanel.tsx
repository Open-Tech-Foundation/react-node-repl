/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MouseEvent, useEffect, useRef, useState } from 'react';

interface Props {
  left: JSX.Element;
  right: JSX.Element;
}

export default function SplitPanel({ left, right }: Props) {
  const [state, setState] = useState({ drag: false, splitterPos: 50 });
  const splitterRef = useRef<HTMLDivElement | null>(null);

  const handleDrag = (e: MouseEvent) => {
    if (splitterRef.current !== null) {
      const container = splitterRef.current.parentElement as HTMLDivElement;
      const { left, width } = container.getBoundingClientRect();
      const offset = ((e.clientX - left) / width) * 100;
      const splitterPos = Math.min(Math.max(offset, 25), 75);
      setState((s) => ({ ...s, splitterPos }));
    }
  };

  const stopDragging = (): void => {
    splitterRef.current = null;
    setState((s) => ({ ...s, drag: false }));
  };

  useEffect(() => {
    // @ts-ignore
    document.body.addEventListener('mousemove', handleDrag);
    document.body.addEventListener('mouseup', stopDragging);

    return () => {
      // @ts-ignore
      document.body.removeEventListener('mousemove', handleDrag);
      document.body.removeEventListener('mouseup', stopDragging);
    };
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${state.splitterPos}% 1fr`,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
      }}
    >
      <div
        style={{
          height: '100%',
          overflow: 'hidden',
          pointerEvents: state.drag ? 'none' : 'initial',
        }}
      >
        {left}
      </div>
      <div
        style={{
          // marginLeft: '-2px',
          width: '6px',
          height: '100%',
          position: 'absolute',
          left: `calc(${state.splitterPos}% - 3px)`,
          zIndex: 5,
          background: 'transparent',
          cursor: 'col-resize',
        }}
        onMouseDown={(e) => {
          splitterRef.current = e.target as HTMLDivElement;
          setState({ ...state, drag: true });
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLDivElement).style.background = '#0074D9';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLDivElement).style.background = 'transparent';
        }}
      ></div>
      <div
        style={{
          height: '100%',
          overflow: 'hidden',
          pointerEvents: state.drag ? 'none' : 'initial',
        }}
      >
        {right}
      </div>
    </div>
  );
}
