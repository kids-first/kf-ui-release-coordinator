import React, {useState, useEffect} from 'react';
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
      .patch(`${coordinatorApi}/task-services/${service.kf_id}`, {
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
          <Link to={`/services/${service.kf_id}`}>{service.name}</Link>
        </List.Header>
        <List.Description>{service.description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

const ServiceList = ({filters}) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  const fetchData = async () => {
    const result = await axios(`${coordinatorApi}/task-services?${filters}`);
    setServices(result.data.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Loader active inline="centered">
        Loading Services...
      </Loader>
    );
  } else {
    return (
      <List>
        {services.map(item => (
          <Service item={item} />
        ))}
      </List>
    );
  }
};

export default withRouter(ServiceList);
