import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Comment, Icon, Segment, Popup, Accordion} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import StudyNote from './StudyNote';

const NoteItem = ({release}) => {
  const [unfolded, setUnfolded] = useState([]);

  return (
    <Comment.Text>
      {release.description ? (
        <Segment piled className="noMargin">
          <Markdown source={release.description} />
        </Segment>
      ) : (
        <Comment.Metadata>
          No release description available.{' '}
          <Link to={`/releases/${release.kfId}`}>
            Click here to add a description
          </Link>
        </Comment.Metadata>
      )}
      {release.studies.edges && (
        <Accordion>
          {release.studies.edges.map(({node}) => (
            <div key={node.id}>
              <Accordion.Title
                active={unfolded.includes(node.id)}
                index={node.id}
                onClick={() =>
                  setUnfolded(
                    unfolded.includes(node.id)
                      ? unfolded.filter(n => n !== node.id)
                      : [...unfolded, node.id],
                  )
                }
              >
                <Icon name="dropdown" />
                {release.notes.edges.length > 0 &&
                release.notes.edges.filter(
                  n => n.node && n.node.study.id === node.id,
                ).length > 0 &&
                release.notes.edges.filter(
                  n => n.node && n.node.study.id === node.id,
                )[0].node ? (
                  <Icon name="sticky note outline" color="green" />
                ) : (
                  <Popup
                    inverted
                    content="Missing release note"
                    trigger={<Icon name="sticky note outline" color="red" />}
                  />
                )}

                {node.name}
                <Comment.Metadata>{node.kfId}</Comment.Metadata>
              </Accordion.Title>
              <Accordion.Content active={unfolded.includes(node.id)}>
                <StudyNote
                  notes={release.notes.edges}
                  releaseId={release.id}
                  studyId={node.id}
                />
              </Accordion.Content>
            </div>
          ))}
        </Accordion>
      )}
    </Comment.Text>
  );
};

export default NoteItem;
