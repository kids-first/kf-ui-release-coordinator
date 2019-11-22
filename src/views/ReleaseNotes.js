import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {
  Segment,
  Header,
  Message,
  Dimmer,
  Loader,
  Image,
} from 'semantic-ui-react';
import NotesList from '../components/NotesList';
import paragraph from '../paragraph.png';

import {ALL_RELEASES} from '../queries';

const ReleaseNotes = props => {
  const {
    loading: releasesLoading,
    error: releasesError,
    data: releasesData,
  } = useQuery(ALL_RELEASES, {variables: {state: 'published'}});

  const releases = releasesData && releasesData.allReleases;

  return (
    <>
      <Segment vertical>
        <Header
          as="h2"
          icon="sticky note"
          content="Release Notes"
          subheader="A list of published release notes"
        />
      </Segment>
      <Segment vertical>
        {releasesError && (
          <Message negative header="Error" content={releasesError.message} />
        )}
        {releasesLoading ? (
          <Segment basic>
            <Dimmer active inverted>
              <Loader active inverted>
                Loading Release Notes
              </Loader>
            </Dimmer>
            <Image src={paragraph} alt="loading" />
          </Segment>
        ) : (
          <NotesList
            loading={releasesLoading}
            releases={releases && releases.edges}
          />
        )}
      </Segment>
    </>
  );
};

export default ReleaseNotes;
