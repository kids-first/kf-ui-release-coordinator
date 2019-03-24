import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Steps = ({current, children}) => {
  console.log(children);
  return (
    <ul className="flex justify-around max-w-full w-full list-reset">
      {children.map((step, i) =>
        Step({
          num: i + 1,
          isCurrent: current === step.props.title,
          ...step.props,
        }),
      )}
    </ul>
  );
};

Steps.propTypes = {
  current: PropTypes.string,
  children: PropTypes.array.isRequired,
};

const stepCircle = classNames(
  'w-6',
  'h-6',
  'mr-2',
  'text-center',
  'inline-block',
  'border',
  'border-2',
  'border-grey',
  'rounded-full',
);

export const Step = ({num, isCurrent, title, description}) => (
  <li key={title} className="inline-block w-full whitespace-no-wrap">
    <div className={classNames(stepCircle, {'border-pink': isCurrent})}>
      <span>{num}</span>
    </div>
    <div className="inline-block align-top whitespace-normal">
      <h4 className="font-bold m-0">{title}</h4>
      {description && <span className="text-sm pr-8">{description}</span>}
    </div>
  </li>
);

Step.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Steps;
