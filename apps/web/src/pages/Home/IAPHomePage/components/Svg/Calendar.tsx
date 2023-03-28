import React from "react";

const Calendar = (props: React.HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 128 128"
    {...props}
  >
    <path
      fill="#E9568A"
      fillRule="evenodd"
      d="M34 12a7.46 7.46 0 00-5.303 2.217A7.606 7.606 0 0026.5 19.57v7.57H19a14.93 14.93 0 00-10.607 4.434A15.211 15.211 0 004 42.279v59.581c0 4.016 1.58 7.867 4.393 10.706A14.93 14.93 0 0019 117h90c3.978 0 7.794-1.595 10.607-4.434A15.211 15.211 0 00124 101.86V42.28c0-4.016-1.58-7.867-4.393-10.706A14.932 14.932 0 00109 27.14h-7.5v-7.57c0-2.008-.79-3.933-2.197-5.353A7.465 7.465 0 0094 12a7.46 7.46 0 00-5.303 2.217A7.606 7.606 0 0086.5 19.57v7.57h-45v-7.57c0-2.008-.79-3.933-2.197-5.353A7.465 7.465 0 0034 12zm0 37.849a7.46 7.46 0 00-5.303 2.217 7.606 7.606 0 00-2.197 5.353c0 2.007.79 3.933 2.197 5.352A7.465 7.465 0 0034 64.988h60a7.46 7.46 0 005.303-2.217 7.605 7.605 0 002.197-5.352c0-2.008-.79-3.933-2.197-5.353A7.465 7.465 0 0094 49.849H34z"
      clipRule="evenodd"
    />
  </svg>
);

export default Calendar;
