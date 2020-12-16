import React from 'react';
import './Buttons.css';

const Close = ({ onClick, className, role }: { onClick?: any; className?: string; role?: string;} ) => {
  return (
    <button
      onClick={(onClick) ? onClick : () => false}
      className={`close ${className}`}
      role={role || null}
    >
      <svg
        width={25}
        height={25}
      >
        <g transform='translate(12.5 12.5)'>
          <line
            x1={-5}
            x2={5}
            y1={-5}
            y2={5}
          />
          <line
            x1={-5}
            x2={5}
            y1={5}
            y2={-5}
          />
        </g>
      </svg>
    </button>
  );
};

export default Close;
