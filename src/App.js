import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const fullTop = (window.innerHeight * 10) / 100;
const fullTopLimit = (window.innerHeight * 20) / 100;
const defaultTop = (window.innerHeight * 40) / 100;

function App() {
  const refTab = useRef(null);

  const [item, setItem] = useState(20);

  const [top, setTop] = useState(defaultTop);
  const [dragging, setDragging] = useState(false);

  const draggingRef = useRef(null);
  const setDraggingpRef = (data) => {
    draggingRef.current = data;
    setDragging(data);
  };
  const topRef = useRef(null);
  const setTopRef = (data) => {
    topRef.current = data;
    setTop(data);
  };

  const renderList = () =>
    Array.from(Array(item), (_, key) => <div className="list" key={key} />);

  const onMouseMove = useCallback((e) => {
    if (!draggingRef?.current) return;
    if (e.pageY - 10 >= 100) {
      setTopRef(e.pageY - 10);
    }
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!draggingRef?.current) return;
    const top = e.changedTouches[0].pageY || 0;
    if (top - 10 >= 100) {
      setTopRef(top - 10 - 10);
    }
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onMouseUp = useCallback((e) => {
    const currnetTop = topRef.current || 0;
    if (currnetTop <= fullTopLimit) {
      setTopRef(fullTop);
    } else {
      setTopRef(defaultTop);
    }
    setDraggingpRef(false);
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onMouseDown = useCallback((e) => {
    // only left mouse button
    if (e.button !== 0) return;
    setDraggingpRef(true);
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const onTouchStart = () => {
    setDraggingpRef(true);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onMouseUp);
      document.addEventListener("mouseup", onMouseUp);
    } else {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onMouseUp);
      document.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      // document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp, onTouchMove]);

  return (
    <div className="App">
      <div style={{ padding: 20 }}>
        <button onClick={() => setItem(4)}>4 item</button>
        <button onClick={() => setItem(20)}>20 item</button>
      </div>
      <div
        className="wrapper"
        ref={refTab}
        style={{
          height: window.innerHeight - top,
        }}
      >
        <div
          className="touch-item"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        />
        <div className="list-container">{renderList()}</div>
      </div>
    </div>
  );
}

export default App;
