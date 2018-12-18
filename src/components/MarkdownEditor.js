import React, { Component } from 'react';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import axios from 'axios';
import { Icon, Spin } from 'antd';
import { Button } from 'kf-uikit';
import ReactMarkdown from 'react-markdown';
import { coordinatorApi } from '../globalConfig';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
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
class MarkdownEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      releaseId: this.props.releaseId,
      studyId: this.props.studyId,
      noteId: this.props.noteId,
      description: this.props.description,
      loading: false,
      updating: false,
      toggling: false,
      saving: false,
      editorState: EditorState.createWithContent(
          ContentState.createFromText(this.props.description || '')),
    };
  }

  /* Saves or creates the description or note */
  save() {
    this.setState({saving: true});

    // PATCH the release description
    if (this.props.type === 'release') {
      this.updateRelease();
    } else if (this.props.type === 'release-note') {
      if (this.state.noteId === null) {
        this.newNote();
      } else {
        this.updateNote();
      }
    }

    this.editToggle();

  }

  /* POSTs a new note for a given study and release */
  newNote() {
    const rawState = convertToRaw(this.state.editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    const url = `${coordinatorApi}/release-notes`;
    axios.post(url,
        {
          release: `${coordinatorApi}/releases/${this.state.releaseId}`,
          study: `${coordinatorApi}/studies/${this.state.studyId}`,
          description: mdText,
          author: this.props.user.name
        })
      .then(resp => {
        console.log(resp);
        this.setState({saving: false, description: mdText});
      })
      .catch(error => console.log(error));
  }

  /* PATCHes an existing note's description */
  updateNote() {
    const rawState = convertToRaw(this.state.editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    const url = `${coordinatorApi}/release-notes/${this.state.noteId}`
    axios.patch(url, {description: mdText})
      .then(resp => {
        this.setState({saving: false, description: mdText});
      })
      .catch(error => console.log(error));
  }

  /* PATCHes an existing release's description */
  updateRelease() {
    const rawState = convertToRaw(this.state.editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);
    const url = `${coordinatorApi}/releases/${this.state.releaseId}`
    axios.patch(url, {description: mdText})
      .then(resp => {
        this.setState({saving: false, description: mdText});
      })
      .catch(error => console.log(error));
  }

  /* Switches between viewing description and editor */
  editToggle() {
    if (this.state.editing) {
      this.setState({editing: false});
    } else {
      this.setState({editing: true});
    }
  }

  updateDescription(ev) {
    this.setState({description: ev.target.value})
  }

  toggle(enabled) {
    this.setState({toggling: true});
    axios.patch(`${coordinatorApi}/task-services/${this.state.service.kf_id}`,
                {enabled: enabled})
      .then(resp => {
        let service = this.state.service;
        service.enabled = enabled
        this.setState({service: service, toggling: false});
      });
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {

    // Saving or loading state
    if (this.state.loading || this.state.saving) {
      return (
        <Spin
          tip={this.state.loading ? ' loading...' : ' saving...'}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '100px',
            marginBottom: '100px',
          }}
        />
      )
    }

    // Show markdown description or button if no description is available
    if (!this.state.editing) {
      if (this.state.description) {
        return (
          <div>
            <ReactMarkdown source={this.state.description} />
            <div className='p-4 w-full flex justify-end'>
              <Button
                onClick={() => this.editToggle()}
                className='mx-2'
              >
                <Icon type='form' /> Edit
              </Button>
            </div>
          </div>
        )
      } else {
        return (
          <center>
            <Button
              onClick={() => this.editToggle()}
            ><Icon type='form' />
            {this.props.type === 'release' ? (
                ' Add a release summary'
            ) : ( 
              ` Add a new note for ${this.state.studyId}`
            )}
            </Button>
          </center>
        )
      }
    }

    const editorStyle = {
        cursor: 'text',
        maxWidth: '100%',
        height: 'auto',
        minHeight: '128px',
        verticalAlign: 'bottom',
        transition: 'all .3s, height 0s',
        overflow: 'auto',
        resize: 'vertical',
    }

    const { editorState } = this.state;

    return (
      <div>
        <Editor
          wrapperClassName="wrapper-class"
          editorClassName="ant-input"
          editorStyle={editorStyle}
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ['inline', 'blockType', 'list', 'link', 'emoji', 'image', 'history'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic']
            },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote', 'Code'],
            },
            emoji: {
              emojis: [
                '😀','😋', '😦', '👍', '👎', '👌','👻', '🐛','🔥', '🎉', '🎊', '🎁',
                '📦', '📊', '📈', '🔇', '🔈', '📅', '✅', '❎', '💯', '❤️'
              ],
            },
          }}
        />
        <div className='p-4 w-full flex justify-end'>
          <Button
            color='secondary'
            outline
            onClick={() => this.editToggle()}
            className='mx-2'
          >
            <Icon type='cancel' /> Cancel
          </Button>
          <Button
            onClick={() => this.save()}
            className='mx-2'
          >
            <Icon type='save' /> Save
          </Button>
        </div>
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  releaseId: propTypes.string,
  studyId: propTypes.string,
  noteId: propTypes.string,
  type: propTypes.oneOf(['release', 'release-note']),
  description: propTypes.string,
}

MarkdownEditor.defaultProps = {
  releaseId: null,
  studyId: null,
  noteId: null,
  type: 'release',
  description: null,
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkdownEditor);
