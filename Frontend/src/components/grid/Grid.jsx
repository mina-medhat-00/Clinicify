import React, { Children, useEffect, useState } from "react";
import "./grid.css";
import { useMediaQuery } from "react-responsive";

const Grid = ({ children, itemClassName, defaultCol, smCol, lgCol, xlCol }) => {
  const sm = useMediaQuery({
    query: "(min-width:640px)",
  });
  const lg = useMediaQuery({
    query: "(min-width:768px)",
  });
  const xl = useMediaQuery({
    query: "(min-width:1024px)",
  });
  const [nCol, setNCol] = useState(1);
  const [len, setLen] = useState(0);
  const [resizeTrigger, setResizeTrigger] = useState(false);
  // useEffect(() => {
  //   const handleResize = () => setResizeTrigger((val) => !val);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // });
  useEffect(() => {
    setNCol(
      xl
        ? xlCol || lgCol || smCol || defaultCol || 1
        : lg
        ? lgCol || smCol || defaultCol || 1
        : sm
        ? smCol || defaultCol || 1
        : defaultCol || 1
    );
  }, [sm, lg, xl]);
  // useEffect(() => {
  //   document.querySelectorAll(".grid--item")?.forEach((item) => {
  //     const obs = new ResizeObserver(() => {
  //       setResizeTrigger((val) => !val);
  //     });
  //     obs.observe(item);
  //   });
  // }, [children]);
  useEffect(() => {
    const items = [];
    document
      .querySelectorAll(".grid--item")
      ?.forEach((item) => items.push(item));
    setLen(items?.length);
    if (items) {
      // const nCol =
      //   items.findIndex(
      //     (ele, i, arr) =>
      //       ele?.getBoundingClientRect().y !=
      //       arr[i + 1]?.getBoundingClientRect().y
      //   ) + 1;
      const nRow = Math.ceil(items?.length / nCol);
      for (let c = 0; c < items?.length; c++) {
        items[c].style.top = 0;
      }
      for (let r = 0; r < nRow - 1; r++) {
        for (let c = 0; c < nCol; c++) {
          const item1 = items[r * nCol + c];
          const item2 = items[(r + 1) * nCol + c];
          if (item1 && item2) {
            const h =
              item2.getBoundingClientRect().y -
              item1.getBoundingClientRect().y -
              item1.getBoundingClientRect().height;
            item2.style.top = `-${h - 10}px`;
          }
        }
      }
    }
  }, [children, nCol]);
  return (
    <div className="flex items-start gap-1 flex-wrap">
      {Children?.map(children, (val, i, arr) => (
        <div
          key={i + 1}
          style={{
            width: `${(1 / (nCol + 1)) * 100}%`,
          }}
          className={`h-fit grow grid--item relative`}
        >
          {val}
        </div>
      ))}
      {Array.from({ length: len && nCol ? nCol - (len % nCol) : 0 }).map(
        (_, i) => (
          <div
            key={i + 1}
            style={{
              width: `${(1 / (nCol + 1)) * 100}%`,
            }}
            className={`h-fit grow relative`}
          ></div>
        )
      )}
    </div>
  );
};

export default Grid;
