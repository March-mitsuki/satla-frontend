import { createSignal, onMount } from 'solid-js';

import type { ParentComponent, JSXElement } from 'solid-js';

const PaneX: ParentComponent<{
  leftElem: JSXElement,
  rightElem: JSXElement,
  minLeftElem?: string,
  minRightElem?: string,
  leftElemWrapperClass?: string,
  rightElemWrapperClass?: string,
  dragLineClass: string | "",
}> = (props) => {
  const [width, setWidth] = createSignal(0)
  let paneContainerRef: HTMLDivElement | undefined;

  let onMouseDownHandler = (e: MouseEvent) => {
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      setWidth(e.clientX)
    }
    onmouseup = (e: MouseEvent) => {
      onmousemove = () => null
      onmouseup = () => null
    }
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
        <div
          style={{
          'width': `${paneContainerRef ? (width() / paneContainerRef.clientWidth)*100 : 50}%`,
          'min-width': `${props.minLeftElem}`,
          }}
          class={props.leftElemWrapperClass}
        >
          {props.leftElem}
        </div>
        <div
          onMouseDown={onMouseDownHandler}
          style={
            props.dragLineClass === ""
            ? "min-width:5px; min-height:5px; background-color:#c0c0c0; cursor:col-resize;"
            : "min-width:5px; min-height:5px; cursor:col-resize;"
          }
          class={props.dragLineClass}
        ></div>
        <div
          style={{
            'width': `${paneContainerRef ? (100 - (width() / paneContainerRef?.clientWidth)*100) : 50}%`,
            'min-width': `${props.minRightElem}`
          }}
          class={props.rightElemWrapperClass}
        >
          {props.rightElem}
        </div>
      </div>
    </>
  )
}

export default PaneX
