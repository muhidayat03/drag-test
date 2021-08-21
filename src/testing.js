import { useRef, useState } from "react";
import "./App.css";

const fullTop = (window.innerHeight * 10) / 100;
const fullTopLimit = (window.innerHeight * 20) / 100;
const defaultTop = (window.innerHeight * 40) / 100;

function App() {
  const refTab = useRef(null);

  const [item, setItem] = useState(20);
  const [top, setTop] = useState(defaultTop);
  const [dragging, setDragging] = useState(false);
  const [currentTop, setCurrentTop] = useState(defaultTop);

  // need tobe deleted
  const [position, setPosition] = useState(0);

  const listRef = useRef(null);

  const renderList = () =>
    Array.from(Array(item), (_, key) => <div className="list" key={key} />);

  const onTouchMove = (e) => {
    if (!dragging) return;
    const top = e.changedTouches[0].pageY || 0;

    const update = top + currentTop;
    if (update >= defaultTop || update <= fullTop) {
      return;
    }
    setTop(top + currentTop);
  };

  const onTouchEnd = () => {
    if (top <= fullTopLimit) {
      setTop(fullTop);
    } else {
      setTop(defaultTop);
    }

    setDragging(false);
  };

  const onTouchStart = (e) => {
    const positionTop = refTab.current.getBoundingClientRect().top || 0;

    const modalTopRound = Math.floor(positionTop);
    const isFullHeight = modalTopRound <= fullTop;
    if (isFullHeight && e.target !== e.currentTarget) {
      return;
    }

    const currentTop = e.changedTouches[0].pageY || 0;
    setCurrentTop(positionTop - currentTop);
    setDragging(true);
  };

  const onListTouch = (e) => {
    const currentTop = e.changedTouches[0].pageY || 0;
    setPosition(currentTop);
  };

  const onListTouchMove = (e) => {
    const scrollPosition = listRef.current.getBoundingClientRect().top;
    const currentTop = e.changedTouches[0].pageY || 0;
    if (position < currentTop && !dragging) {
      if (Math.ceil(scrollPosition - 20) === Math.ceil(fullTop)) {
        setCurrentTop(scrollPosition - currentTop);
        setDragging(true);
      }
    }
  };

  return (
    <div className="App">
      <div style={{ padding: 20 }} className="testing">
        <button onClick={() => setItem(4)}>4 item</button>
        <button onClick={() => setItem(20)}>20 item</button>
      </div>
      <div
        className="wrapper"
        ref={refTab}
        style={{
          height: window.innerHeight - top,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          onTouchStart={onListTouch}
          onTouchMove={onListTouchMove}
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
