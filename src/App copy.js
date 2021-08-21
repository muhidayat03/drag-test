import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const refTab = useRef(null);

  const [full, setFull] = useState(false);
  const [item, setItem] = useState(20);
  const [isScrolling, setIsScrolling] = useState(false);
  const [height, setHeight] = useState(0);
  const [lastTop, setLastTop] = useState();

  const renderList = () =>
    Array.from(Array(item), (_, key) => <div className="list" key={key} />);

  const handleScroll = (e) => {
    console.log("e", e.target.scrollTop);
    const scrollTop = refTab.current?.getBoundingClientRect().top;
    const value = window.innerHeight - scrollTop;

    console.log(window.innerHeight);
    console.log({ scrollTop });
    console.log({ value });

    // console.log({ lastTop });
    // console.log(window.innerHeight - scrollTop + 20 + 20);

    // if (scrollTop > lastTop) return;
    // console.log((window.innerHeight * 10) / 100);
    // if (height >= window.innerHeight * 0.9) {
    //   return;
    // }
    setHeight(value);
    setLastTop(scrollTop);

    // if (
    //   !isScrolling &&
    //   !full &&
    //   refTab.current?.getBoundingClientRect().top <
    //     (window.innerHeight * 40) / 100
    // ) {
    //   setFull(true);
    //   return setIsScrolling(true);
    // }

    // if (
    //   !isScrolling &&
    //   full &&
    //   refTab.current?.getBoundingClientRect().top + 1 >
    //     (window.innerHeight * 10) / 100
    // ) {
    //   setFull(false);
    //   return setIsScrolling(true);
    // }
  };

  // useEffect(() => {
  //   if (isScrolling) {
  //     setTimeout(() => setIsScrolling(false), 500);
  //   }
  // }, [isScrolling]);

  useEffect(() => {
    setHeight(window.innerHeight * 0.6);
    setLastTop(window.innerHeight * 0.6);
  }, []);

  return (
    <div className="App">
      <div style={{ padding: 20 }}>
        <button onClick={() => setItem(4)}>4 item</button>
        <button onClick={() => setItem(20)}>20 item</button>
      </div>
      <div
        onScroll={handleScroll}
        className="wrapper"
        style={{
          height: `${height}px`,
          // overflow: isScrolling ? "hidden" : "auto",
        }}
      >
        <div ref={refTab}>{renderList()}</div>
      </div>
    </div>
  );
}

export default App;
