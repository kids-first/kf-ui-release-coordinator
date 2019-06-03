import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Segment, Button, Card, Label, Header, Icon} from 'semantic-ui-react';

class Profile extends Component {
  render() {
    const roles = this.props.user.roles.map((t, i) => (
      <Label basic key={i} color="blue">
        {t}
      </Label>
    ));
    const groups = this.props.user.groups.map((t, i) => (
      <Label basic key={i} color="green">
        {t}
      </Label>
    ));
    return (
      <Segment basic>
        <Card fluid>
          <Card.Content>
            <Header as="h2">User Profile</Header>
          </Card.Content>
          <Card.Content>
            <h5>Roles: {roles}</h5>
            <h5>Groups: {groups}</h5>
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
  return {user: state.auth.user};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Profile));
