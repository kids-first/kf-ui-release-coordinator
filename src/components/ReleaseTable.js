import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Button, Table, Icon, Popover } from 'antd';
import TimeAgo from 'react-timeago'
import { coordinatorApi } from '../globalConfig';


class ReleaseTable extends Component {

  constructor(props) {
    super(props);
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'Report',
        dataIndex: 'kf_id',
        key: 'viewButton',
        render: id => <Link to={`/releases/${id}`}><Button size='small' icon='profile' type='primary'>{id}</Button></Link>
    }, {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        render: author => {
          return(
            <div>
              {author}
            </div>
          )
        }
    }, {
        title: '# Studies',
        dataIndex: 'studies',
        key: 'studies',
        render: studies => <Popover content={studies.join(", ")} title='Studies'>{studies.length} Studies <Icon type='search' /></Popover>
    }, {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
    }, {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: time => {
          return (<div><TimeAgo date={time} /></div>)
        }
    }];

    const data = []

    this.state = { loading: true, data: data, columns: columns };
  }

  componentWillMount() {
    axios.get(`${coordinatorApi}/releases`)
      .then(resp => {
        let data = resp.data.results;
        this.setState({data: data, loading: false});
      });
  }

  render() {

    return (
      <Table
        loading={this.state.loading}
        columns={this.state.columns}
        dataSource={this.state.data}
      />
    );
  }
}

export default withRouter(ReleaseTable);
