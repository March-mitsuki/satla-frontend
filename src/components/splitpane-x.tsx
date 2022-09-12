import { createSignal, onMount } from 'solid-js';

import type { ParentComponent, JSXElement } from 'solid-js';

const PaneX: ParentComponent<{
  leftElem: JSXElement,
  rightElem: JSXElement,
  minLeftElem?: string,
  minRightElem?: string,
}> = (props) => {
  const [width, setWidth] = createSignal(0)
  let paneContainerRef: HTMLDivElement | undefined;

  let onMouseDownHandler = (e: MouseEvent) => {
    onmousemove = (e: MouseEvent) => {
      console.log('on mouse move', e.clientX);
      setWidth(e.clientX)
    }
    onmouseup = (e: MouseEvent) => {
      console.log('mouse up', e.clientX)
      onmousemove = () => null
      onmouseup = () => null
    }
    console.log('on mouse down', e.clientX);
  }

  onMount(() => {
    if (paneContainerRef) {
      setWidth(paneContainerRef.clientWidth / 2)
    }
  })

  return (
    <>
      <div
        ref={paneContainerRef}
        style={{
          'display': 'flex',
          'flex-flow': 'row',
          'height': '100%',
          'width': '100%',
        }}
      >
        <div style={{
          'width': `${paneContainerRef ? (width() / paneContainerRef.clientWidth)*100 : 50}%`,
          'background-color': 'rgba(120, 120, 230, 0.2)',
          'min-width': `${props.minLeftElem}`,
        }}>
          {props.leftElem}
        </div>
        <div
          onMouseDown={onMouseDownHandler}
          style='
            min-width: 5px;
            min-height: 5px;
            background-color: #c0c0c0;
            cursor: col-resize;
          '
        ></div>
        <div
          style={{
            'width': `${paneContainerRef ? (100 - (width() / paneContainerRef?.clientWidth)*100) : 50}%`,
            'background-color': 'rgba(120, 230, 120, 0.2)',
            'min-width': `${props.minRightElem}`
          }}
        >
          {props.rightElem}
        </div>
      </div>
    </>
  )
}

export default PaneX
