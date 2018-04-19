import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Button, Table, Icon, Popover, Tag } from 'antd';
import TimeAgo from 'react-timeago'


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
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        render: tags => {
          if(tags.length === 0) {
            return
          }
          return(
            <div>
              {tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
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
    let api = process.env.REACT_APP_COORDINATOR_API;
    axios.get(`${api}/releases`)
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
