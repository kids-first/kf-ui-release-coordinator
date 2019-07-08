import React from 'react';
import {Feed, Icon, Label} from 'semantic-ui-react';

const Events = ({events}) => (
  <Feed>
    {events.map((ev, i) => (
      <Feed.Event key={i}>
        <Feed.Content>
          <Feed.Extra text>{ev.message}</Feed.Extra>
          <Label.Group>
            {ev.release && (
              <Label basic>
                <Icon name="tag" /> {ev.release.slice(1).slice(-11)}
              </Label>
            )}
            {ev.task_service && (
              <Label basic>
                <Icon name="settings" /> {ev.task_service.slice(1).slice(-11)}
              </Label>
            )}
            {ev.task && (
              <Label basic>
                <Icon name="calendar check" /> {ev.task.slice(1).slice(-11)}
              </Label>
            )}
          </Label.Group>
          <Feed.Summary>
            <Feed.Date>
              {new Date(ev.created_at).toLocaleString('en-US')}
            </Feed.Date>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    ))}
  </Feed>
);

export default Events;
