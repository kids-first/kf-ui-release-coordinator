import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Card, List, Avatar, Row, Button } from 'antd';


class Services extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true
    }
  }

  componentWillMount() {
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/task-services`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  render() {
    return (
      <Card title='Kids First Data Release Task Services'>
        <Row>
          <Button type="primary" size="large"
            onClick={() => this.props.history.push(`/service/new`)}
            >Register New Service</Button>
        </Row>
        <List
         itemLayout="horizontal"
         dataSource={this.state.data}
         renderItem={item => (
           <List.Item>
             <List.Item.Meta
               avatar={<Avatar icon="tool"/>}
               title={<Link to={`/services/${item.kf_id}`}>{item.name}</Link>}
               description={item.description}
             />
          </List.Item>
        )}
        />
      </Card>
    );
  }
}

export default withRouter(Services);
