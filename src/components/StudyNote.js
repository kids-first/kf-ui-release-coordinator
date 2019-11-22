import React, {useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {
  Header,
  Comment,
  Icon,
  Modal,
  Button,
  Popup,
  Divider,
} from 'semantic-ui-react';
import Markdown from 'react-markdown';
import MarkdownEditor from './MarkdownEditor';
import {REMOVE_RELEASE_NOTE} from '../mutations';
import {ALL_RELEASES} from '../queries';

const StudyNote = ({notes, releaseId, studyId}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [removeReleaseNote] = useMutation(REMOVE_RELEASE_NOTE, {
    refetchQueries: [
      {
        query: ALL_RELEASES,
        variables: {state: 'published'},
        fetchPolicy: 'cache-only',
      },
    ],
  });

  const note =
    notes.length > 0 &&
    notes.filter(n => n.node && n.node.study.id === studyId).length > 0 &&
    notes.filter(n => n.node && n.node.study.id === studyId)[0].node;
  return (
    <>
      <Modal open={isEditing} onClose={() => setIsEditing(false)} closeIcon>
        <Header icon="edit" content="Edit release note" />
        <Modal.Content>
          <MarkdownEditor
            studyId={studyId}
            releaseId={releaseId}
            releaseNodeId={note && note.id ? note.id : null}
            description={note && note.description ? note.description : null}
            onSave={() => setIsEditing(false)}
          />
        </Modal.Content>
      </Modal>
      {note ? (
        <div className="pl-25">
          <Comment.Text>
            <Markdown source={note.description} />
          </Comment.Text>
          <Comment.Actions>
            <Comment.Action onClick={() => setIsEditing(true)}>
              <Icon name="edit" />
              Edit
            </Comment.Action>
            <Popup
              trigger={
                <Comment.Action onClick={e => e.stopPropagation()}>
                  <Icon name="trash alternate" />
                  Delete
                </Comment.Action>
              }
              header="Are you sure?"
              content={
                <>
                  This note will be removed from the study and release
                  <Divider />
                  <Button
                    data-testid="delete-confirm"
                    negative
                    fluid
                    icon={<Icon name="trash alternate" />}
                    content="Delete"
                    onClick={e => {
                      e.stopPropagation();
                      removeReleaseNote({
                        variables: {
                          releaseNote: note.id,
                        },
                      });
                    }}
                  />
                </>
              }
              on="click"
              position="top left"
            />
          </Comment.Actions>
        </div>
      ) : (
        <div className="pl-25">
          <Comment.Actions>
            <Comment.Action onClick={() => setIsEditing(true)}>
              <Icon name="add" />
              Add a note
            </Comment.Action>
          </Comment.Actions>
        </div>
      )}
    </>
  );
};

export default StudyNote;
