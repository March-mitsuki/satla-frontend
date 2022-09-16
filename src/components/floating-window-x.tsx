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
  wrapperClass: string,
  risizerClass?: string,
  defaultWindowSize: {
    width: number | "",
  },
  minWindowSize?: {
    width: number | "",
  }
}> = (props) => {
  const [elemMovement, setElemMovement] = createSignal({
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
  })

  let floatingElemRef: HTMLDivElement | undefined;
  let wrapperElemRef: HTMLDivElement | undefined;
  let contentsWrapperElemRef: HTMLDivElement | undefined;
  let resizeElemRef: HTMLDivElement | undefined;;

  let startDragHandler = (e: MouseEvent) => {
    let shiftX: number;
    let shiftY: number;
    if (floatingElemRef) {
      shiftX = e.clientX - floatingElemRef.getBoundingClientRect().left;
      shiftY = e.clientY - floatingElemRef.getBoundingClientRect().top; 
    }
    const docHeight = document.documentElement.clientHeight;
    const docWidth = document.documentElement.clientWidth;
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()

      setFloatingElem({
        zIndex: 1000,
        position: "fixed",
        isFloating: true,
      })
      if (wrapperElemRef) {
        const moveX = e.pageX - shiftX
        const moveY = e.pageY - shiftY
        if (
          moveX + wrapperElemRef.offsetWidth <= docWidth
          && moveY + wrapperElemRef.offsetHeight <= docHeight
          && moveX >= 0
          && moveY >= 0
        ) {
          setElemMovement({
            x: moveX,
            y: moveY,
          })
        }

      }
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
    onmousemove = (e: MouseEvent) => {
      e.preventDefault()
      if (wrapperElemRef && contentsWrapperElemRef && floatingElemRef && resizeElemRef) {
        setWindowSize({
          width: e.pageX - (wrapperElemRef.offsetLeft - resizeElemRef.offsetWidth),
        })
      }
    }
    onmouseup = () => {
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
      setElemMovement({
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
        "left": `${elemMovement().x}px`,
        "top": `${elemMovement().y}px`,
      }}
      classList={{[props.wrapperClass]: floatingElem().isFloating === false}}
    >
      <div
        style={{
          "min-width": props.minWindowSize?.width+"px",
          "width": floatingElem().isFloating ? windowSize().width+"px" : "",
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
          style={{
            "cursor": "pointer"
          }}
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
          "min-width": props.minWindowSize?.width+"px",
          "width": floatingElem().isFloating ? windowSize().width+"px" : "",
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
          "cursor": "nwse-resize",
          }}
          onMouseDown={startResize}
          class={props.risizerClass}
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
