import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {
  Grid,
  Header,
  Icon,
  Segment,
  Menu,
  Container,
  Placeholder,
  Message,
} from 'semantic-ui-react';
import MarkdownEditor from './MarkdownEditor';
import {ALL_NOTES} from '../queries';

const ReleaseNotes = ({release, studies, releaseId}) => {
  const [activeItem, setActiveItem] = useState(
    studies.edges[0].node ? studies.edges[0].node : {},
  );

  const {loading, error, data} = useQuery(ALL_NOTES, {
    variables: {release: releaseId},
  });

  const releaseNotes = data.allReleaseNotes ? data.allReleaseNotes.edges : [];
  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );
  if (error)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error.message}
          </Message.Content>
        </Message>
      </Container>
    );
  return (
    <Grid>
      <Grid.Column width={4}>
        <Menu fluid vertical tabular>
          {studies.edges.map(({node}) => (
            <Menu.Item
              key={node.kfId}
              name={node.kfId}
              active={activeItem.kfId === node.kfId}
              onClick={() => setActiveItem(node)}
            >
              {releaseNotes.filter(n => n.node && n.node.study.id === node.id)
                .length > 0 ? (
                <Icon name="checkmark" color="green" />
              ) : (
                <Icon name="x" color="red" />
              )}
              {node.name}
            </Menu.Item>
          ))}
        </Menu>
      </Grid.Column>

      <Grid.Column stretched width={12}>
        <Segment>
          <Header>
            <Link to={`/studies/${activeItem.kfId}`}>{activeItem.kfId}</Link>
            {' - ' + activeItem.name}
            {activeItem.createdAt && (
              <Header.Subheader>
                Created <TimeAgo live={false} date={activeItem.createdAt} />
              </Header.Subheader>
            )}
          </Header>
          <MarkdownEditor
            studyId={activeItem.id}
            releaseId={releaseId}
            releaseNodeId={
              releaseNotes.filter(
                n => n.node && n.node.study.id === activeItem.id,
              ).length > 0 &&
              releaseNotes.filter(
                n => n.node && n.node.study.id === activeItem.id,
              )[0].node.id
            }
            description={
              releaseNotes.filter(
                n => n.node && n.node.study.id === activeItem.id,
              ).length > 0 &&
              releaseNotes.filter(
                n => n.node && n.node.study.id === activeItem.id,
              )[0].node.description
            }
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default ReleaseNotes;
