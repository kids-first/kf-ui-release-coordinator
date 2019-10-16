import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {Segment, Button, Grid, Header, Icon} from 'semantic-ui-react';
import ServiceList from '../components/ServiceList';

import {ALL_SERVICES} from '../queries';

const Services = props => {
  const {
    loading: servicesLoading,
    error: servicesError,
    data: services,
  } = useQuery(ALL_SERVICES);

  return (
    <>
      <Segment vertical>
        <Grid columns={2} doubling>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header as="h2">Kids First Release Task Services</Header>
            </Grid.Column>
            <Grid.Column width={4} textAlign="right">
              <Button
                primary
                icon
                fluid
                as={Link}
                to="/service/new"
                size="large"
                labelPosition="left"
              >
                <Icon name="settings" />
                Register a Service
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment vertical>
        <ServiceList
          services={services && services.allTaskServices.edges}
          loading={servicesLoading}
          error={servicesError}
        />
      </Segment>
    </>
  );
};

export default Services;
