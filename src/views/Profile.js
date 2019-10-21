import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {withRouter} from 'react-router-dom';
import {
  Grid,
  Segment,
  Image,
  Label,
  Form,
  Loader,
  Header,
  Message,
} from 'semantic-ui-react';

import {MY_PROFILE} from '../queries';
import defaultAvatar from '../assets/defaultAvatar.png';

const Profile = () => {
  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useQuery(MY_PROFILE);

  const profile = profileData && profileData.myProfile;

  if (profileError) {
    return <Message negative header="Error" content={profileError.message} />;
  }

  if (!profile || profileLoading) {
    return (
      <Segment basic>
        <Loader />
      </Segment>
    );
  }

  const fields = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
  };

  return (
    <Segment basic>
      <Header as="h2">Your Profile</Header>
      <Grid doubling stackable>
        <Grid.Row as={Segment} basic secondary>
          <Grid.Column
            mobile={16}
            tablet={4}
            computer={2}
            verticalAlign="middle"
          >
            <Image
              centered
              circular
              size="small"
              bordered
              src={profile.picture || defaultAvatar}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={14}>
            <Form size="mini">
              <Form.Group widths={2}>
                <Form.Field
                  label={fields.username}
                  control="input"
                  disabled
                  value={profile.username}
                />
                <Form.Field
                  label={fields.email}
                  control="input"
                  disabled
                  value={profile.email}
                />
              </Form.Group>
              <Form.Group widths={2}>
                <Form.Field
                  label={fields.firstName}
                  control="input"
                  disabled
                  value={profile.firstName}
                />
                <Form.Field
                  label={fields.lastName}
                  control="input"
                  disabled
                  value={profile.lastName}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <h5>Roles</h5>
      {profile.roles.map((t, i) => (
        <Label basic key={i} color="blue">
          {t}
        </Label>
      ))}
      <h5>Groups</h5>
      {profile.groups.map((t, i) => (
        <Label basic key={i} color="green">
          {t}
        </Label>
      ))}
    </Segment>
  );
};

export default withRouter(Profile);
