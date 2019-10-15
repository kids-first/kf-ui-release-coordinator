import React from 'react';
import {Feed, Icon, Label} from 'semantic-ui-react';

const Events = ({events, loading, error}) => {
  if (error) return <div>Error Loading Events</div>;
  if (loading || !events) return <div>Loading Events...</div>;

  return (
    <Feed>
      {events.map(({node}, i) => (
        <Feed.Event key={i}>
          <Feed.Content>
            <Feed.Extra text>{node.message}</Feed.Extra>
            <Label.Group>
              {node.release && (
                <Label basic>
                  <Icon name="tag" /> {node.release.kfId}
                </Label>
              )}
              {node.taskService && (
                <Label basic>
                  <Icon name="settings" /> {node.taskService.kfId}
                </Label>
              )}
              {node.task && (
                <Label basic>
                  <Icon name="calendar check" /> {node.task.kfId}
                </Label>
              )}
            </Label.Group>
            <Feed.Summary>
              <Feed.Date>
                {new Date(node.createdAt).toLocaleString('en-US')}
              </Feed.Date>
            </Feed.Summary>
          </Feed.Content>
        </Feed.Event>
      ))}
    </Feed>
  );
};

export default Events;
