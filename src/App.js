import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const fullTop = (window.innerHeight * 10) / 100;
const fullTopLimit = (window.innerHeight * 20) / 100;
const defaultTop = (window.innerHeight * 40) / 100;

function App() {
  const refTab = useRef(null);

  const [item, setItem] = useState(20);

  const [top, setTop] = useState(defaultTop);
  // const [_, setCurrentTop] = useState(0);
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

  const currentTopRef = useRef(null);
  const setCurrentTopRef = (data) => {
    currentTopRef.current = data;
    // setCurrentTop(data);
  };

  const listRef = useRef(null);

  const checkTop = () => {
    console.log(listRef?.current?.getBoundingClientRect()?.top);
    console.log(fullTop - 20);
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
    const currentTop = currentTopRef.current;

    const update = top + currentTop;
    if (update >= defaultTop) {
      return;
    }
    setTopRef(top + currentTop);
    e.stopPropagation();
    e.preventDefault();
  }, []);

  // const onScroll = (e) => {
  //   console.log(e.target.scrollTop);
  //   console.log(listRef.current.getBoundingClientRect().top);
  //   listRef.current.scrollTop = 100;
  // };
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

  const onMouseDown = (e) => {
    if (e.button !== 0) return;

    const positionTop = refTab.current.getBoundingClientRect().top || 0;
    setCurrentTopRef(positionTop - e.pageY);
    setDraggingpRef(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const onTouchStart = (e) => {
    const positionTop = refTab.current.getBoundingClientRect().top || 0;

    // const modalTopRound = Math.floor(positionTop);
    // const isFullHeight = modalTopRound <= fullTop;
    // if (isFullHeight && e.target !== e.currentTarget) {
    //   return;
    // }

    const currentTop = e.changedTouches[0].pageY || 0;
    setCurrentTopRef(positionTop - currentTop);
    setDraggingpRef(true);
  };

  useEffect(() => {
    console.log(dragging);
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
        <button onClick={checkTop}>check top</button>
      </div>
      <div
        className="wrapper"
        ref={refTab}
        style={{
          height: window.innerHeight - top,
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div
          // onScroll={onScroll}
          className={`list-container ${
            (dragging || top >= defaultTop) && "dragging"
          }`}
        >
          <div ref={listRef}>{renderList()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
