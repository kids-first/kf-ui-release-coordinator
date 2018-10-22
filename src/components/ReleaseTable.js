import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { Table, Icon, Popover } from 'antd';
import { Button } from 'kf-uikit';
import TimeAgo from 'react-timeago'
import { coordinatorApi } from '../globalConfig';
import { compareSemVer } from '../utils';


class ReleaseTable extends Component {

  constructor(props) {
    super(props);

    const data = [];
    const columns = [];

    this.state = { loading: true, data: data, columns: columns };
  }

  componentWillMount() {
    axios.get(`${coordinatorApi}/releases?limit=100`)
      .then(resp => {
        let data = resp.data.results;

        const states = data.map((v) => v.state).filter((v, i, a) => a.indexOf(v) === i)

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
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            align: 'center',
            sorter: (a, b) => compareSemVer(a.version, b.version),
        }, {
            title: '# Studies',
            dataIndex: 'studies',
            key: 'studies',
            align: 'center',
            render: studies => <Popover content={studies.join(", ")} title='Studies'>{studies.length} Studies <Icon type='search' /></Popover>
        }, {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            align: 'center',
            filters: states.map((v) => ({text: v, value: v})),
            onFilter: (value, record) => record.state.indexOf(value) === 0,
        }, {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: time => {
              return (<div><TimeAgo date={time} /></div>)
            }
        }];

        this.setState({data: data, loading: false, columns: columns});
      });
  }

  render() {

    return (
      <Table
				pagination={{pageSize: 30}}
        loading={this.state.loading}
        columns={this.state.columns}
        dataSource={this.state.data}
      />
    );
  }
}

export default withRouter(ReleaseTable);
