import { createSignal } from "solid-js";

import type { ParentComponent, JSXElement } from "solid-js";

const FloatingWindow: ParentComponent<{
  controllerWarpper?: string,
  floatingControlClass?: string,
  floatingControlContent: JSXElement,
  floatingContent?: JSXElement,
  cancelControlContent: JSXElement,
  cancelControlClass?: string,
  wrapperClass?: string,
}> = (props) => {
  const [mouseCoordinates, setMouseCoordinates] = createSignal({
    x: 0,
    y: 0,
  })
  const [floatingElem, setFloatingElem] = createSignal<{
    zIndex: number | "auto" | "",
    position: "static" | "relative" | "absolute" | "sticky" | "fixed",
  }>({
    zIndex: "auto",
    position: "static",
  })

  let floatingElemRef: HTMLDivElement | undefined;

  let startDragHandler = (e: MouseEvent) => {

    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      setFloatingElem({
        zIndex: 1000,
        position: "fixed",
      })
      setFloatingElem({
        zIndex: 1000,
        position: "fixed",
      })
      setMouseCoordinates({
        x: e.clientX,
        y: e.clientY,
      })
    }

    onmouseup = (e: MouseEvent) => {
      setFloatingElem({
        zIndex: 1000,
        position: "absolute",
      })
      onmousemove = () => null
      onmouseup = () => null
    }
  }

  const cancelFloating = () => {
    setFloatingElem({
      zIndex: "auto",
      position: "static",
    })
    if (floatingElemRef) {
      setMouseCoordinates({
        x: 0,
        y: 0,
      })
    }
  }

  return (
    <>
      <div
        style={{
          "z-index": `${floatingElem().zIndex}`,
          "position": `${floatingElem().position}`,
          "left": `${floatingElemRef ? mouseCoordinates().x - floatingElemRef.offsetWidth/2 : ""}px`,
          "top": `${floatingElemRef ? mouseCoordinates().y - floatingElemRef.offsetHeight/2 : ""}px`,
        }}
        class={props.wrapperClass}
      >
        <div
          class={props.controllerWarpper}
        >
          <div
            ref={floatingElemRef}
            style={{
              "cursor": "move",
            }}
            onMouseDown={startDragHandler}
            class={props.floatingControlClass}
          >
            {props.floatingControlContent}
          </div>
          {props.floatingContent}
          <div
            onClick={cancelFloating}
            class={props.cancelControlClass}
          >
            {props.cancelControlContent}
          </div>
        </div>
        {props.children}
      </div>
    </>
  )
}

export default FloatingWindow
