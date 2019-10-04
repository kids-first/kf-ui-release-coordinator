import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Link} from 'react-router-dom';
import {Segment, Button, Card, Grid, Header, Icon} from 'semantic-ui-react';
import ServiceList from '../components/ServiceList';

import {ALL_SERVICES} from '../queries';

const Services = props => {
  const {
    loading: servicesLoading,
    error: servicesError,
    data: services,
  } = useQuery(ALL_SERVICES);

  return (
    <Segment basic>
      <Card fluid>
        <Card.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as="h2">Kids First Release Task Services</Header>
              </Grid.Column>
              <Grid.Column width={8} textAlign="right">
                <Button
                  as={Link}
                  to="/service/new"
                  primary
                  size="large"
                  icon
                  labelPosition="left"
                >
                  <Icon name="settings" />
                  Register a Service
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <ServiceList
            services={services && services.allTaskServices.edges}
            loading={servicesLoading}
            error={servicesError}
          />
        </Card.Content>
      </Card>
    </Segment>
  );
};

export default Services;
