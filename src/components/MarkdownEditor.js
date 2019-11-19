import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useMutation} from '@apollo/react-hooks';
import {
  UPDATE_RELEASE,
  CREATE_RELEASE_NOTE,
  UPDATE_RELEASE_NOTE,
  REMOVE_RELEASE_NOTE,
} from '../mutations';
import {ALL_NOTES} from '../queries';
import {
  Button,
  Icon,
  Segment,
  Message,
  Popup,
  Divider,
} from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
/**
 * Displays a release description or note. If there is no description or note,
 * a button prompting for one will be dislpayed, and will show a text area
 * when clicked.
 *
 * The editor may either be type `release` or `release-note`. A release will
 * always have a kfId and a description, though it may be blank. A blank
 * description will be treated the same as an absent note.
 * A note may not yet exist, but the button to add a new one will be displayed.
 * Adding a new note will POST it to /release-notes and store the newly
 * assigned kfId. Future changes to the note will PATCH the existing kfId.
 **/
const MarkdownEditor = ({releaseId, studyId, releaseNodeId, description}) => {
  const [updateRelease] = useMutation(UPDATE_RELEASE);
  const [createReleaseNote] = useMutation(CREATE_RELEASE_NOTE, {
    refetchQueries: [
      {
        query: ALL_NOTES,
        variables: {release: releaseId, study: studyId},
      },
    ],
  });
  const [updateReleaseNote] = useMutation(UPDATE_RELEASE_NOTE, {
    refetchQueries: [
      {
        query: ALL_NOTES,
        variables: {release: releaseId, study: studyId},
      },
    ],
  });
  const [removeReleaseNote] = useMutation(REMOVE_RELEASE_NOTE, {
    refetchQueries: [
      {
        query: ALL_NOTES,
        variables: {release: releaseId, study: studyId},
      },
    ],
  });

  const editorStyle = {
    cursor: 'text',
    maxWidth: '100%',
    height: 'auto',
    minHeight: '128px',
    verticalAlign: 'bottom',
    transition: 'all .3s, height 0s',
    overflow: 'auto',
    resize: 'vertical',
  };
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(description || ''),
    ),
  );

  const saveDescription = () => {
    const rawState = convertToRaw(editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    if (studyId) {
      if (releaseNodeId) {
        updateReleaseNote({
          variables: {
            releaseNote: releaseNodeId,
            input: {
              description: mdText,
            },
          },
        })
          .then(resp => {
            setError(null);
          })
          .catch(err => {
            setError(err.message);
          });
      } else {
        createReleaseNote({
          variables: {
            input: {
              study: studyId,
              release: releaseId,
              description: mdText,
            },
          },
        })
          .then(resp => {
            setError(null);
          })
          .catch(err => {
            setError(err.message);
          });
      }
    } else {
      updateRelease({
        variables: {
          release: releaseId,
          input: {
            description: mdText,
          },
        },
      })
        .then(resp => {
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        });
    }
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <div>
          <Segment>
            <Editor
              editorStyle={editorStyle}
              editorState={editorState}
              onEditorStateChange={e => setEditorState(e)}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'list',
                  'link',
                  'emoji',
                  'image',
                  'history',
                ],
                inline: {
                  inDropdown: false,
                  options: ['bold', 'italic'],
                },
                blockType: {
                  inDropdown: true,
                  options: [
                    'Normal',
                    'H1',
                    'H2',
                    'H3',
                    'H4',
                    'Blockquote',
                    'Code',
                  ],
                },
                emoji: {
                  emojis: [
                    '😀',
                    '😋',
                    '😦',
                    '👍',
                    '👎',
                    '👌',
                    '👻',
                    '🐛',
                    '🔥',
                    '🎉',
                    '🎊',
                    '🎁',
                    '📦',
                    '📊',
                    '📈',
                    '🔇',
                    '🔈',
                    '📅',
                    '✅',
                    '❎',
                    '💯',
                    '❤️',
                  ],
                },
              }}
            />
          </Segment>
          <Segment basic clearing className="noMargin noPadding">
            <Button floated="right" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button floated="right" primary onClick={() => saveDescription()}>
              Save
            </Button>
          </Segment>
        </div>
      ) : (
        <>
          {description ? (
            <>
              <Segment stacked={studyId == null} basic={studyId != null}>
                <ReactMarkdown source={description} />
              </Segment>
              <Segment basic clearing className="noMargin noPadding">
                {error && (
                  <Message warning compact size="mini" content={error} />
                )}
                {studyId && (
                  <Popup
                    trigger={
                      <Button
                        negative
                        floated="right"
                        onClick={e => e.stopPropagation()}
                      >
                        Delete
                      </Button>
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
                                releaseNote: releaseNodeId,
                              },
                            });
                          }}
                        />
                      </>
                    }
                    on="click"
                    position="top right"
                  />
                )}
                <Button
                  primary
                  floated="right"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              </Segment>
            </>
          ) : (
            <Segment basic textAlign="center" className="noMargin noPadding">
              <Button
                icon
                primary
                labelPosition="left"
                onClick={() => setEditing(true)}
              >
                <Icon name="pencil" />
                {studyId ? 'Add a release note' : 'Add a release summary'}
              </Button>
            </Segment>
          )}
        </>
      )}
    </>
  );
};
MarkdownEditor.propTypes = {
  releaseId: propTypes.string.isRequired,
  studyId: propTypes.string,
  releaseNodeId: propTypes.string,
  description: propTypes.string,
};

MarkdownEditor.defaultProps = {
  description: null,
};

export default MarkdownEditor;
