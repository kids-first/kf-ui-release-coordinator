import React from 'react';
import className from 'classnames';
import Tag from './Tag';

const Events = ({events}) => (
  <ul className="list-reset">
    {events.map((ev, i) => (
      <li
        key={i}
        className={className('p-2 border border-lightGrey', {
          'bg-lightGrey': i % 2,
        })}
      >
        <ul className="m-0 p-1 list-reset inline-block">
          {ev.release && (
            <li key={ev.release.kf_id} className="inline-block">
              <Tag type="release">{ev.release.slice(1).slice(-11)}</Tag>
            </li>
          )}
          {ev.task_service && (
            <li key={ev.task_service.kf_id} className="inline-block">
              <Tag type="service">{ev.task_service.slice(1).slice(-11)}</Tag>
            </li>
          )}
          {ev.task && (
            <li key={ev.task.kf_id} className="inline-block">
              <Tag type="task">{ev.task.slice(1).slice(-11)}</Tag>
            </li>
          )}
        </ul>
        <br />
        <span className="font-semibold">
          {new Date(ev.created_at).toLocaleString('en-US')}
        </span>
        <br />
        <span className="font-mono">{ev.message}</span>
      </li>
    ))}
  </ul>
);

export default Events;
