// dependencies lib
import { createSignal } from "solid-js";

const Dragpage = () => {
  const [mouseCoordinates, setMouseCoordinates] = createSignal({
    x: 0,
    y: 0,
  });
  const [dragElem, setDragElem] = createSignal<{
    zIndex: number | "auto";
    position: "static" | "relative" | "absolute" | "sticky" | "fixed";
    hidden: boolean;
  }>({
    zIndex: "auto",
    position: "static",
    hidden: false,
  });

  let dragElemRef: HTMLDivElement | undefined;
  let dropElemRef: HTMLDivElement | undefined;

  const startDragHandler = () => {
    let belowElem: Element | null;

    onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      setDragElem({
        zIndex: 1000,
        position: "absolute",
        hidden: true,
      });
      belowElem = document.elementFromPoint(mouseCoordinates().x, mouseCoordinates().y);
      setDragElem({
        zIndex: 1000,
        position: "absolute",
        hidden: false,
      });
      setMouseCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      if (belowElem) {
        if (belowElem === dropElemRef) {
          console.log("drag enter");
        }
      }
    };

    onmouseup = () => {
      setDragElem({
        zIndex: "auto",
        position: "static",
        hidden: false,
      });
      if (belowElem) {
        if (belowElem === dropElemRef) {
          console.log("drop in");
        }
      }
      onmousemove = () => null;
      onmouseup = () => null;
    };
  };

  return (
    <>
      <div
        ref={dragElemRef}
        style={{
          "z-index": `${dragElem().zIndex}`,
          position: `${dragElem().position}`,
          left: `${dragElemRef ? mouseCoordinates().x - dragElemRef.offsetWidth / 2 : ""}px`,
          top: `${dragElemRef ? mouseCoordinates().y - dragElemRef.offsetHeight / 2 : ""}px`,
        }}
        onMouseDown={startDragHandler}
        hidden={dragElem().hidden}
      >
        Drag me
      </div>
      <div
        ref={dropElemRef}
        style={{
          height: "300px",
          "background-color": "rgba(120, 230, 60, 0.2)",
        }}
      >
        drop here
      </div>
    </>
  );
};

export default Dragpage;
