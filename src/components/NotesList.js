import React from 'react';
import {Header, Loader, Comment, Icon} from 'semantic-ui-react';
import NoteItem from './NoteItem';
import {numDate} from './utils';

const NotesList = ({loading, releases}) => {
  if (loading) {
    return <Loader>Loading...</Loader>;
  }

  if (!loading && releases.length === 0) {
    return (
      <Header disabled textAlign="center" as="h4">
        No releases data available for current study.
      </Header>
    );
  }

  return (
    <>
      {releases.length > 0 ? (
        <Comment.Group size="large">
          {releases.map(r => (
            <Comment key={r.node.id}>
              <Comment.Avatar as={Icon} name="tag" />
              <Comment.Content>
                <Comment.Author
                  className="text-blue"
                  as="a"
                  href={`/releases/${r.node.kfId}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {r.node.version +
                    ' - ' +
                    r.node.name +
                    ' - ' +
                    numDate(r.node.createdAt)}
                </Comment.Author>
                <Comment.Metadata>{r.node.kfId}</Comment.Metadata>
                <NoteItem release={r.node} />
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      ) : (
        <Header
          disabled
          textAlign="center"
          content="You don't have any published releases yet."
        />
      )}
    </>
  );
};

export default NotesList;
