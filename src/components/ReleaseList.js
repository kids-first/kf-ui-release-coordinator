import {Link} from 'react-router-dom';
import React from 'react';
import {Button, Icon, Label} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {compareSemVer} from '../utils';

const ReleaseList = ({loading, releases}) => {
  const stateColors = {
    initialized: 'blue',
    running: 'teal',
    staged: 'purple',
    publishing: 'teal',
    published: 'green',
    canceled: 'grey',
    failed: 'red',
  };

  const columns = [
    {
      Header: 'Release',
      accessor: 'kf_id',
      Cell: row => (
        <Button
          as={Link}
          to={`/releases/${row.value}`}
          labelPosition="left"
          size="tiny"
          icon
          fluid
        >
          <Icon name="tag" /> {row.value}
        </Button>
      ),
      width: 160,
      filterable: true,
    },
    {
      Header: 'Name',
      accessor: 'name',
      filterable: true,
    },
    {
      Header: 'Author',
      accessor: 'author',
      width: 150,
      Cell: row => (
        <Label basic>
          <Icon name="user" />
          {row.value.split('@')[0]}
        </Label>
      ),
      filterable: true,
    },
    {
      Header: 'Version',
      accessor: 'version',
      Cell: row => (
        <Label basic>
          <Icon name="tag" />
          {row.value}
        </Label>
      ),
      width: 100,
      filterable: true,
    },
    {
      Header: 'State',
      accessor: 'state',
      Cell: row => (
        <Label basic color={stateColors[row.value]}>
          {row.value}
        </Label>
      ),
      width: 100,
      filterable: true,
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: row => <TimeAgo date={row.value} />,
      width: 120,
    },
  ];
  return (
    <ReactTable
      loading={loading}
      columns={columns}
      data={releases}
      pageSizeOptions={[10, 20]}
      defaultPageSize={20}
      defaultSorted={[
        {
          id: 'version',
          desc: true,
        },
      ]}
      defaultSortMethod={(a, b, desc) => compareSemVer(a, b, desc)}
    />
  );
};

export default ReleaseList;
