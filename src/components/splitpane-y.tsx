import { createSignal, onMount } from 'solid-js';

import type { ParentComponent, JSXElement } from 'solid-js';

const PaneY: ParentComponent<{
  topElem: JSXElement,
  bottomElem: JSXElement,
  minTopELem?: string,
  minBottomElem?: string,
  topElemWrapperClass?: string,
  bottomElemWrapperClass?: string,
  dragLineClass?: string,
}> = (props) => {
  const [height, setHeight] = createSignal(0)
  let paneContainerRef: HTMLDivElement | undefined;

  let onMouseDownHandler = (e: MouseEvent) => {
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      setHeight(e.clientY)
    }
    onmouseup = (e: MouseEvent) => {
      onmousemove = () => null
      onmouseup = () => null
    }
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
        <div
          style={{
          'height': `${paneContainerRef ? (height() / paneContainerRef.clientHeight)*100 : 50}%`,
          'min-height': `${props.minTopELem}`,
          }}
          class={props.topElemWrapperClass}
        >
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
          class={props.dragLineClass}
        ></div>
        <div
          style={{
            'height': `${paneContainerRef ? (100 - (height() / paneContainerRef?.clientHeight)*100) : 50}%`,
            'min-height': `${props.minBottomElem}`,
          }}
          class={props.bottomElemWrapperClass}
        >
          {props.bottomElem}
        </div>
      </div>
    </>
  )
}

export default PaneY
