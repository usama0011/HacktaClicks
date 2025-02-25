// AnimatedCount.js
import React, { useEffect, useRef } from "react";
import { useCountUp } from "react-countup";

const AnimatedCount = React.memo(({ value }) => {
  const countUpRef = useRef(null);
  const { update } = useCountUp({
    ref: countUpRef,
    start: value,
    end: value,
    duration: 1,
    preserveValue: true,
  });

  useEffect(() => {
    // When value changes, update the animated count imperatively.
    update(value);
  }, [value, update]);

  return <span ref={countUpRef} />;
});

export default AnimatedCount;
