import * as React from 'react';
import { Link } from 'react-router-dom';
import ConditionalWrapper from '../ConditionalWrapper.jsx';
import './SidebarHeaderFacetButton.css';
import { Props } from './SidebarHeaderFacetButton.d';

const SidebarHeaderFacetButton = ({ link, label, className, disabled }: Props) => {
  if (!label && label !== '') {
    return null;
  } 

  return (
    <ConditionalWrapper
      condition={link}
      wrapper={(children: React.ReactNode) => <Link to={link}>{children}</Link>}
    >
      <button
        disabled={disabled === true}
        className={className}
      >
        {label}
        <svg
          width={30}
          height={30}
        >
          <g transform={'translate(15 15) rotate(45)'}>
            <line
              x1={0}
              x2={0}
              y1={-9}
              y2={9}
              strokeWidth={2}
              stroke='black'
            />
            <line
              x1={-9}
              x2={9}
              y1={0}
              y2={0}
              strokeWidth={2}
              stroke='black'
            />
          </g>
        </svg>
      </button>
    </ConditionalWrapper>
  );
};

export default SidebarHeaderFacetButton;

