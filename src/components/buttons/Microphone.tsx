import * as React from 'react';

interface Props {
  onClick?: () => void;
  className?: string; 
  role?: string; 
}

const Microphone = ({ onClick, className, role }: Props) => {
  return (
    <button
      role={role}
      onClick={(onClick) ? onClick : () => false}
      className={className}
    >
      <svg
        width={20}
        height={20}
      >
        <g transform='translate(10 11)'>
          <line
            x1={0}
            x2={0}
            y1={-6}
            y2={0}
            stroke='#777'
            strokeWidth={4}
            strokeLinecap="round"
          />

          <path
            d="M-5,0 a1,1 0 0,0 10,0"
            fill="transparent"
            stroke='#777'
            strokeWidth={2}
          />

          <line
            x1={0}
            x2={0}
            y1={5}
            y2={8}
            stroke='#777'
            strokeWidth={2}
            strokeLinecap="round"
          />

          <line
            x1={-3}
            x2={3}
            y1={8}
            y2={8}
            stroke='#777'
            strokeWidth={1}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </button>
  );
};

export default Microphone;
