// dependencies lib
import { createSignal, onMount } from "solid-js";

// type
import type { Component, JSXElement } from "solid-js";

const PaneY: Component<{
  topElem: JSXElement;
  bottomElem: JSXElement;
  minTopELem: string;
  minBottomElem: string;
  topElemWrapperClass?: string;
  bottomElemWrapperClass?: string;
  dragLineClass: string;
  headHeight?: number;
}> = (props) => {
  const [height, setHeight] = createSignal(0);
  let paneContainerRef: HTMLDivElement | undefined;

  const onMouseDownHandler = () => {
    onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      if (props.headHeight) {
        setHeight(e.clientY - props.headHeight);
      } else {
        setHeight(e.clientY);
      }
    };
    onmouseup = () => {
      onmousemove = () => null;
      onmouseup = () => null;
    };
  };

  onMount(() => {
    if (paneContainerRef) {
      setHeight(paneContainerRef.clientHeight / 2);
    }
  });

  return (
    <>
      <div
        ref={paneContainerRef}
        style={{
          display: "flex",
          "flex-flow": "column",
          height: "100%",
        }}
      >
        <div
          style={{
            height: `${paneContainerRef ? (height() / paneContainerRef.clientHeight) * 100 : 50}%`,
            "min-height": `${props.minTopELem}`,
          }}
          class={props.topElemWrapperClass}
        >
          {props.topElem}
        </div>
        <div
          onMouseDown={onMouseDownHandler}
          style={
            props.dragLineClass === ""
              ? "min-width:5px; min-height:5px; background-color:#c0c0c0; cursor:row-resize;"
              : "min-width:5px; min-height:5px; cursor:row-resize;"
          }
          class={props.dragLineClass}
         />
        <div
          style={{
            height: `${
              paneContainerRef ? 100 - (height() / paneContainerRef?.clientHeight) * 100 : 50
            }%`,
            "min-height": `${props.minBottomElem}`,
          }}
          class={props.bottomElemWrapperClass}
        >
          {props.bottomElem}
        </div>
      </div>
    </>
  );
};

export default PaneY;
