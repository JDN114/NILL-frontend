import React from "react";

/**
  * Simple SVG text logo "NILL" with small "AI" — scalable and inline, editable.
  * Replace colors/path if you want a traced vector from your uploaded image.
  */
export default function Logo({ width = 130, height = 36 }) {
   return (
     <svg
       width={width}
       height={height}
       viewBox="0 0 400 120"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
       aria-label="NILL AI Logo"
     >
       <rect width="400" height="120" fill="none" />
       <g transform="translate(20,10)">
         <text
           x="0"
           y="80"
           style={{ fontFamily: "Inter, sans-serif", fontWeight: 800 }}
           fontSize="90"
           fill="#0f1724"
         >
           NILL
         </text>
         <text
           x="320"
           y="86"
           style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
           fontSize="30"
           fill="#0f1724"
         >
           AI
         </text>
       </g>
     </svg>
   ); 
}

