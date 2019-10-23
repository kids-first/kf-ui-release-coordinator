import React, {Fragment, useState} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {Link, withRouter} from 'react-router-dom';
import {Button, Loader, List, Message, Icon, Radio} from 'semantic-ui-react';

import {UPDATE_SERVICE} from '../mutations';

const Service = ({item}) => {
  const [service, setService] = useState(item);

  const [
    updateService,
    {loading: updateServiceLoading, error: updateServiceError},
  ] = useMutation(UPDATE_SERVICE);

  const toggle = ev => {
    updateService({
      variables: {
        taskService: service.id,
        input: {
          name: service.name,
          url: service.url,
          enabled: !service.enabled,
        },
      },
    }).then(resp => {
      setService(resp.data.updateTaskService.taskService);
    });
  };

  return (
    <List.Item>
      <List.Content floated="right">
        {updateServiceLoading && <Loader active inline size="tiny" />}
        {updateServiceError && (
          <Message header="Error" content={updateServiceError.message} />
        )}
        <Radio
          toggle
          label={service.enabled ? 'Enabled' : 'Disabled'}
          disabled={updateServiceLoading}
          checked={service.enabled}
          onChange={ev => toggle()}
        />
      </List.Content>
      {service.healthStatus === 'ok' ? (
        <Icon name="check" size="large" color="green" />
      ) : (
        <Icon name="close" size="large" color="red" />
      )}
      <List.Content>
        <List.Header>
          <Link to={`/services/${service.kfId}`}>{service.name}</Link>
        </List.Header>
        <List.Description>{service.description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

const ServiceList = ({services, loading, error}) => {
  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Services...
      </Loader>
    );
  }
  if (error) return <div>Error getting services</div>;
  if (!services) {
    return (
      <Fragment>
        No Services have been registered yet.
        <br />
        <Button as={Link} to="/service/new">
          Register a Service
        </Button>
      </Fragment>
    );
  }

  return (
    <List>
      {services.map(({node}) => (
        <Service item={node} key={node.kfId} />
      ))}
    </List>
  );
};

export default withRouter(ServiceList);
