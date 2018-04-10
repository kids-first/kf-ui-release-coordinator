import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Card, Row, Col } from 'antd';


class Releases extends Component {

  constructor(props) {
    super(props);
    const columns = [{
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
        render: id => <Link to="/releases/:id" params={{id: "BLAH"}}><Button>View</Button></Link>
    }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'Studies',
        dataIndex: 'studies',
        key: 'studies',
    }, {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
    }];

    const data = [{
        key: '1',
        ID: 'RE_00000001',
        name: 'CBTTC Release',
        studies: 'ST_00000001, ST_00000002',
        state: 'staged'
    }, {
        key: '2',
        ID: 'RE_00000002',
        name: 'Seidman FY2016',
        studies: 'ST_00000001, ST_00000002',
        state: 'published'
    }, {
        key: '3',
        ID: 'RE_00000003',
        name: 'Seidman FY2015',
        studies: 'ST_00000001, ST_00000002',
        state: 'published'
    }];


    this.state = { data: data, columns: columns };
  }

  render() {

    return (
      <Card>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
        />
      </Card>
    );
  }
}

export default Releases;
