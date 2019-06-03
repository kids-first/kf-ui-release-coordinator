import React from 'react';
import {Feed, Icon, Label} from 'semantic-ui-react';

const Events = ({events}) => (
  <Feed>
    {events.map((ev, i) => (
      <Feed.Event key={i}>
        <Feed.Content>
          <Feed.Summary>
            <Feed.Date>
              {new Date(ev.created_at).toLocaleString('en-US')}
            </Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>{ev.message}</Feed.Extra>
          <Feed.Meta>
            <Label.Group size="tiny">
              {ev.release && (
                <Label color="orange">
                  <Icon name="tag" />
                  {ev.release.slice(1).slice(-11)}
                </Label>
              )}
              {ev.task_service && (
                <Label color="purple">
                  <Icon name="settings" />
                  {ev.task_service.slice(1).slice(-11)}
                </Label>
              )}
              {ev.task && (
                <Label color="teal">
                  <Icon name="calendar check" />
                  {ev.task.slice(1).slice(-11)}
                </Label>
              )}
            </Label.Group>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    ))}
  </Feed>
);

export default Events;
