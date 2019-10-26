import React from 'react';
import TimeAgo from 'react-timeago';
import {Link} from 'react-router-dom';
import {Table, Icon, Popup} from 'semantic-ui-react';

const Events = ({events, loading, error}) => {
  if (error) return <div>Error Loading Events</div>;
  if (loading || !events) return <div>Loading Events...</div>;

  return (
    <Table striped compact basic="very">
      <Table.Body>
        {events.map(({node}, i) => (
          <Table.Row key={i}>
            <Table.Cell>
              {node.release && (
                <Popup
                  content={node.release.name}
                  trigger={
                    <Link to={`/releases/${node.release.kfId}`}>
                      <Icon name="tag" />
                    </Link>
                  }
                  position="top center"
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {node.taskService && (
                <Popup
                  content={node.taskService.name}
                  trigger={
                    <Link to={`/services/${node.taskService.kfId}`}>
                      <Icon name="settings" />
                    </Link>
                  }
                  position="top center"
                />
              )}
            </Table.Cell>
            <Table.Cell>
              {node.task && (
                <Popup
                  content={node.task.kfId}
                  trigger={<Icon name="calendar outline" />}
                  position="top center"
                />
              )}
            </Table.Cell>
            <Table.Cell>
              <TimeAgo
                date={new Date(node.createdAt).toLocaleString('en-US')}
              />
            </Table.Cell>
            <Table.Cell>{node.message}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default Events;
