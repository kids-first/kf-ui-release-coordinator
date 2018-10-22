import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Icon, Spin } from 'antd';
import { Button } from 'kf-uikit';
import ReactMarkdown from 'react-markdown';
import { coordinatorApi } from '../globalConfig';
import { UserContext } from '../contexts';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw  } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


class MarkdownEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: this.props.description,
      loading: false,
      updating: false,
      toggling: false,
      saving: false,
      editorState: EditorState.createEmpty(),
    };
  }

  /* Saves or creates the description or note */
  save() {
    // PATCH description
    const rawState = convertToRaw(this.state.editorState.getCurrentContent());
    const mdText = draftToMarkdown(rawState);

    this.editToggle();

    this.setState({saving: true, description: mdText});

    const url = `${coordinatorApi}/${this.props.type}s/${this.props.kfId}`

    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    axios.patch(url, {description: mdText}, header)
      .then(resp => {
        this.setState({saving: false});
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
    const token = this.props.egoToken;
    const header = {headers: {Authorization: 'Bearer '+token}};
    axios.patch(`${coordinatorApi}/task-services/${this.state.service.kf_id}`,
                {enabled: enabled}, header)
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
            ><Icon type='form' /> Add a release summary</Button>
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
  kfId: propTypes.string,
  type: propTypes.oneOf(['release', 'release-note']),
  description: propTypes.string,
}

MarkdownEditor.defaultProps = {
  kfId: null,
  type: 'release',
  description: null,
}


function EditorProps(props) {
  return (
    <UserContext.Consumer>
      {user => <MarkdownEditor{...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

export default EditorProps;
