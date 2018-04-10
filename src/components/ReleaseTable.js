import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Table, Card, Icon, Popover, Tag } from 'antd';
import TimeAgo from 'react-timeago'


class ReleaseTable extends Component {

  constructor(props) {
    super(props);
    const columns = [{
        title: 'Report',
        dataIndex: 'kf_id',
        key: 'viewButton',
        render: id => <Link to="/releases/:id" params={{id: id}}><Button icon='eye-o' type='primary'>View Report</Button></Link>
    }, {
        title: 'kf_id',
        dataIndex: 'kf_id',
        key: 'kf_id',
    }, {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        render: tags => {
          if(tags.length == 0) {
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
          let dt = Date(time);
          return (<div><TimeAgo date={time} /> - {dt}</div>)
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
        console.log(data);
        this.setState({data: data, loading: false});
      });
  }

  render() {

    return (
      <Card>
        <Table
          loading={this.state.loading}
          columns={this.state.columns}
          dataSource={this.state.data}
        />
      </Card>
    );
  }
}

export default ReleaseTable;
