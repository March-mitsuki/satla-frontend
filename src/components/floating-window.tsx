import { createSignal, onMount } from "solid-js";

import type { ParentComponent, JSXElement } from "solid-js";

const FloatingWindow: ParentComponent<{
  controllerWarpper?: string,
  floatingControlClass?: string,
  floatingControlContent: JSXElement,
  floatingContent?: JSXElement,
  cancelControlContent: JSXElement,
  cancelControlClass?: string,
  contentsWrapperClass?: string,
  wrapperClass?: string,
  defaultWindowSize: {
    width: number,
    height: number,
  }
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
  const [windowSize, setWindowSize] = createSignal({
    width: props.defaultWindowSize.width,
    height: props.defaultWindowSize.height,
  })

  let floatingElemRef: HTMLDivElement | undefined;
  let wrapperElemRef: HTMLDivElement | undefined;

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

    onmouseup = () => {
      setFloatingElem({
        zIndex: 1000,
        position: "absolute",
      })
      onmousemove = () => null
      onmouseup = () => null
    }
  }

  const startResize = (e: MouseEvent) => {
    console.log("start resize")
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      if (wrapperElemRef) {
        console.log(e.clientY);
        
        setWindowSize({
          width: e.clientX - wrapperElemRef.offsetLeft,
          height: e.clientY - wrapperElemRef.clientHeight / 2,
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
    })
    if (floatingElemRef) {
      setMouseCoordinates({
        x: 0,
        y: 0,
      })
    }
  }

  onMount(() => {
    setFloatingElem({
      zIndex: 1000,
      position: "static",
    })
  })

  return (
    <>
      <div
        ref={wrapperElemRef}
        style={{
          "z-index": `${floatingElem().zIndex}`,
          "position": `${floatingElem().position}`,
          "left": `${floatingElemRef ? mouseCoordinates().x - floatingElemRef.offsetWidth/2 : ""}px`,
          "top": `${floatingElemRef ? mouseCoordinates().y - floatingElemRef.offsetHeight/2 : ""}px`,
          "width": floatingElem().position === "absolute" || "fixed" ? windowSize().width+"px" : "",
          "height": floatingElem().position === "absolute" || "fixed" ? windowSize().height+"px" : "",
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
        <div
          style={{
            "position": "relative",
          }}
          class={props.contentsWrapperClass}
        >
          {props.children}
          <div
            style={{
            "position": "absolute",
            "right": "0",
            "bottom": "0",
            "z-index": 1000,
            "background-color": "#e6e6fa"
            }}
            onMouseDown={startResize}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default FloatingWindow
