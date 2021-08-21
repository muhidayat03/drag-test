import { useRef, useState } from "react";
import "./App.css";

const fullTop = Math.floor((window.innerHeight * 10) / 100);
const defaultTop = Math.floor((window.innerHeight * 40) / 100);

function App() {
  const refTab = useRef(null);

  const [item, setItem] = useState(20);
  const [top, setTop] = useState(fullTop);
  const [dragging, setDragging] = useState(false);
  const [selisih, setSelisih] = useState(defaultTop);
  const [isFullHeight, setIsFUllHeight] = useState(false);
  const [cursorTop, setCursorTop] = useState(0);

  const listRef = useRef(null);

  const renderList = () =>
    Array.from(Array(item), (_, key) => <div className="list" key={key} />);

  const onTouchMove = (e) => {
    // const scrollPosition = Math.floor(
    //   listRef.current.getBoundingClientRect().top - 20
    // );
    // const mentok = fullTop === scrollPosition;

    // const scrollDown = cursorTop < e.changedTouches[0].pageY;

    // if (mentok && scrollDown) {
    //   return setDragging(true);
    // }
    const scrollPosition = Math.floor(
      listRef.current.getBoundingClientRect().top - 20
    );
    const mentok = fullTop === scrollPosition;
    const scrollDown = cursorTop < e.changedTouches[0].pageY;

    if (!dragging) {
      if (mentok && scrollDown) {
        console.log("mentok");
        setCursorTop(cursorTop);
        return setDragging(true);
      }
    } else {
      const top = e.changedTouches[0].pageY || 0;
      const updateTop = top + selisih;
      if (updateTop > defaultTop || updateTop < fullTop) {
        return;
      }
      setTop(updateTop);
    }
  };

  const onTouchEnd = () => {
    setDragging(false);

    if (isFullHeight) {
      if (top >= fullTop + 40) {
        return setTop(defaultTop);
      }
      return setTop(fullTop);
    }
    if (top <= defaultTop - 40) {
      return setTop(fullTop);
    }
    return setTop(defaultTop);
  };

  const onTouchStart = (e) => {
    const elementTop = refTab.current.getBoundingClientRect().top || 0;
    const modalTopRound = Math.floor(elementTop);
    const isFullHeight = modalTopRound <= fullTop;
    const cursorTop = e.changedTouches[0].pageY || 0;
    setSelisih(elementTop - cursorTop);

    setCursorTop(cursorTop);

    if (isFullHeight) {
      setIsFUllHeight(true);
    } else {
      setIsFUllHeight(false);
    }
    if (isFullHeight && e.target !== e.currentTarget) {
      return;
    }
    setDragging(true);
  };

  return (
    <div className="App">
      <div style={{ padding: 20 }} className="testing">
        <button onClick={() => setItem(4)}>4 item</button>
        <button onClick={() => setItem(20)}>20 item</button>
      </div>
      <div
        className={`wrapper ${dragging ? "aaa" : ""}`}
        ref={refTab}
        style={{
          height: window.innerHeight - top,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
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
