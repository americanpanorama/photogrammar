import React from 'react';
import PropTypes from 'prop-types';

const ConditionalWrapper = ({ condition, wrapper, children }) => (
  condition ? wrapper(children) : children
);
 
export default ConditionalWrapper;
