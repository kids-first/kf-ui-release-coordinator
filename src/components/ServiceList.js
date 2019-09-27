import React, {useState} from 'react';
import axios from 'axios';
import {Loader, List, Icon, Radio} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import {coordinatorApi} from '../globalConfig';

const Service = ({item}) => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(item);

  const toggle = ev => {
    setLoading(true);
    axios
      .patch(`${coordinatorApi}/task-services/${service.kfId}`, {
        enabled: !service.enabled,
      })
      .then(resp => {
        setService(resp.data);
        setLoading(false);
      });
  };

  return (
    <List.Item>
      <List.Content floated="right">
        {loading && <Loader active inline size="tiny" />}
        <Radio
          toggle
          label={service.enabled ? 'Enabled' : 'Disabled'}
          disabled={loading}
          checked={service.enabled}
          onChange={ev => toggle()}
        />
      </List.Content>
      {service.health_status === 'ok' ? (
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
  if (loading || !services) {
    return (
      <Loader active inline="centered">
        Loading Services...
      </Loader>
    );
  }
  if (error) return <div>Error getting services</div>;

  return (
    <List>
      {services.map(service => (
        <Service item={service} key={service.kfId} />
      ))}
    </List>
  );
};

export default withRouter(ServiceList);
