import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Button, Divider, Table, Icon, Row } from 'antd';
import { coordinatorApi } from '../globalConfig';
import { compareSemVer } from '../utils';


class StudyTable extends Component {

  constructor(props) {
    super(props);
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
    }, {
        title: 'Report',
        dataIndex: 'kf_id',
        key: 'viewButton',
        align: 'center',
        render: id => <Link to={`/studies/${id}`}><Button size='small' icon='profile' type='primary'>{id}</Button></Link>
    }, {
        title: 'Visible',
        dataIndex: 'visible',
        key: 'visible',
        align: 'center',
        width: '100px',
        render: visible=> {
          return(
            <div>
              {visible ? <Icon type='check-circle'/> : <Icon type='close-circle'/>}
            </div>
          )
        }
    }, {
        title: 'Latest Version',
        dataIndex: 'version',
        key: 'version',
        align: 'center',
        sorter: (a, b) => compareSemVer(a.version, b.version),
        width: '150px',
        render: version => {
          return(
            <div>
              {version ? version : 'not released yet'}
            </div>
          )
        }
    }];

    const data = []

    this.state = { loading: true, data: data, columns: columns };
  }

  sync() {
    this.setState({loading: true});
    axios.post(`${coordinatorApi}/studies/sync`)
      .then(resp => {
        this.fetchStudies();
      });
  }

  componentWillMount() {
    this.fetchStudies();
  }

  fetchStudies() {
    axios.get(`${coordinatorApi}/studies?limit=100`)
      .then(resp => {
        let data = resp.data.results;
        console.log(data);
        this.setState({data: data, loading: false});
      });
  }

  render() {

    return (
      <div>
        <Row>
          <Button
            loading={this.state.loading}
            onClick={() => this.sync()}
            size='large'
            type='primary'
            icon='sync'
          >
            Sync
          </Button>
        </Row>
        <Divider />
        <Row>
          <Table
            pagination={{pageSize: 30}}
            loading={this.state.loading}
            columns={this.state.columns}
            dataSource={this.state.data}
          />
        </Row>
      </div>
    );
  }
}

export default withRouter(StudyTable);
