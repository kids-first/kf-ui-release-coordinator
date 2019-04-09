import React from 'react';
import PropTypes from 'prop-types';

/* The Tag component maps colors to different types of ids
 * to keep the styling consistent throughout the app
 */
const Tag = ({type, state, children}) => {
  const style =
    {
      release: 'border-purple',
      task: 'border-orange',
      service: 'border-teal',
      study: 'border-lightBlue',
    }[type] ||
    {
      running: 'border-orange',
      publishing: 'border-orange',
      canceled: 'border-pink',
      failed: 'border-red',
      published: 'border-teal',
    }[state] ||
    'border-mediumGrey bg-lightGrey';
  return (
    <span
      className={`px-2 py-1 m-2 font-medium text-sm cursor-default border-2 rounded-lg ${style}`}
    >
      {children}
    </span>
  );
};

Tag.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Tag;