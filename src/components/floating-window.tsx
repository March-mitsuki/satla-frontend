import { createSignal } from "solid-js";

import type { ParentComponent, JSXElement } from "solid-js";

const FloatingWindow: ParentComponent<{
  controllerWrapperClass?: string,
  floatingControlClass?: string,
  floatingControlContent: JSXElement,
  floatingContent?: JSXElement,
  cancelControlContent: JSXElement,
  cancelControlClass?: string,
  contentsWrapperClass?: string,
  wrapperClass?: string,
  defaultWindowSize: {
    width: number | "",
    height: number | "",
  }
}> = (props) => {
  const [mouseCoordinates, setMouseCoordinates] = createSignal({
    x: 0,
    y: 0,
  })
  const [floatingElem, setFloatingElem] = createSignal<{
    zIndex: number | "auto" | "",
    position: "static" | "relative" | "absolute" | "sticky" | "fixed",
    isFloating: boolean,
  }>({
    zIndex: "auto",
    position: "static",
    isFloating: false,
  })
  const [windowSize, setWindowSize] = createSignal({
    width: props.defaultWindowSize.width,
    height: props.defaultWindowSize.height,
  })

  let floatingElemRef: HTMLDivElement | undefined;
  let wrapperElemRef: HTMLDivElement | undefined;
  let contentsWrapperElemRef: HTMLDivElement | undefined;
  let resizeElemRef: HTMLDivElement | undefined;;

  let startDragHandler = (e: MouseEvent) => {
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()

      setFloatingElem({
        zIndex: 1000,
        position: "fixed",
        isFloating: true,
      })
      setMouseCoordinates({
        x: e.clientX,
        y: e.clientY,
      })
    }

    onmouseup = () => {
      setFloatingElem({
        zIndex: 1000,
        position: "absolute",
        isFloating: true,
      })
      onmousemove = () => null
      onmouseup = () => null
    }
  }

  const startResize = (e: MouseEvent) => {
    console.log("wrapper offset height", wrapperElemRef?.offsetHeight)
    console.log("mouse client y height", e.clientY)

    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      if (wrapperElemRef && contentsWrapperElemRef && floatingElemRef && resizeElemRef) {
        console.log(e.clientY);
        setWindowSize({
          width: e.clientX - (wrapperElemRef.offsetLeft - resizeElemRef.offsetWidth),
          height: e.clientY - (wrapperElemRef.offsetTop + floatingElemRef.offsetHeight),
        })
      }
    }
    onmouseup = () => {
      console.log("stop resize");
      onmousemove = () => null
      onmouseup = () => null
    }
  }

  const cancelFloating = () => {
    setFloatingElem({
      zIndex: "auto",
      position: "static",
      isFloating: false,
    })
    if (floatingElemRef) {
      setMouseCoordinates({
        x: 0,
        y: 0,
      })
    }
  }

  return (
    <div
      ref={wrapperElemRef}
      style={{
        "z-index": floatingElem().zIndex,
        "position": `${floatingElem().position}`,
        "left": `${floatingElemRef ? mouseCoordinates().x - floatingElemRef.offsetWidth/2 : ""}px`,
        "top": `${floatingElemRef ? mouseCoordinates().y - floatingElemRef.offsetHeight/2 : ""}px`,
      }}
      class={props.wrapperClass}
    >
      <div
        style={{
          "width": floatingElem().isFloating ? windowSize().width +"px" : "",
        }}
        class={props.controllerWrapperClass}
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
      <div
        ref={contentsWrapperElemRef}
        style={{
          "position": "relative",
          "width": floatingElem().isFloating ? windowSize().width+"px" : "",
          "height": floatingElem().isFloating ? windowSize().height+"px" : "",  
        }}
        class={props.contentsWrapperClass}
      >
        {props.children}
        {floatingElem().isFloating
          && <div
          ref={resizeElemRef}
          style={{
          "position": "absolute",
          "right": "0",
          "bottom": "0",
          "z-index": floatingElem().zIndex,
          "background-color": "#e6e6fa",
          "cursor": "nwse-resize",
          }}
          onMouseDown={startResize}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
          </svg>
        </div>}
      </div>
    </div>
  )
}

export default FloatingWindow
