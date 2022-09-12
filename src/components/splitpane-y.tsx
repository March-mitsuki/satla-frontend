import { createSignal, onMount } from 'solid-js';

import type { ParentComponent, JSXElement } from 'solid-js';

const PaneY: ParentComponent<{
  topElem: JSXElement,
  bottomElem: JSXElement,
  minTopELem?: string,
  minBottomElem?: string,
}> = (props) => {
  const [height, setHeight] = createSignal(0)
  let paneContainerRef: HTMLDivElement | undefined;

  let onMouseDownHandler = (e: MouseEvent) => {
    onmousemove = (e: MouseEvent) => {
      console.log('on mouse move', e.clientY);
      setHeight(e.clientY)
    }
    onmouseup = (e: MouseEvent) => {
      console.log('mouse up', e.clientY)
      onmousemove = () => null
      onmouseup = () => null
    }
    console.log('on mouse down', e.clientY);
  }

  onMount(() => {
    if (paneContainerRef) {
      setHeight(paneContainerRef.clientHeight / 2)
    }
  })

  return (
    <>
      <div
        ref={paneContainerRef}
        style={{
          'display': 'flex',
          'flex-flow': 'column',
          'height': '100%',
        }}
      >
        <div style={{
          'height': `${paneContainerRef ? (height() / paneContainerRef.clientHeight)*100 : 50}%`,
          'background-color': 'rgba(120, 120, 230, 0.2)',
          'min-height': `${props.minTopELem}`,
        }}>
          {props.topElem}
        </div>
        <div
          onMouseDown={onMouseDownHandler}
          style='
            min-width: 5px;
            min-height: 5px;
            background-color: #c0c0c0;
            cursor: row-resize;
          '
        ></div>
        <div
          style={{
            'height': `${paneContainerRef ? (100 - (height() / paneContainerRef?.clientHeight)*100) : 50}%`,
            'background-color': 'rgba(120, 230, 120, 0.2)',
            'min-height': `${props.minBottomElem}`,
          }}
        >
          {props.bottomElem}
        </div>
      </div>
    </>
  )
}

export default PaneY
