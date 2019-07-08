import {Link} from 'react-router-dom';
import React from 'react';
import {Button, Icon, Label} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import 'react-table/react-table.css';
import {compareSemVer} from '../utils';

const StudiesTable = ({loading, studies, selectable, ...props}) => {
  const columns = [
    {
      Header: 'Study',
      accessor: 'kf_id',
      Cell: row => (
        <Button
          as={Link}
          to={`/studies/${row.value}`}
          labelPosition="left"
          size="tiny"
          icon
          fluid
        >
          <Icon name="database" />
          {row.value}
        </Button>
      ),
      width: 160,
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Public Version',
      accessor: 'last_pub_version',
      width: 100,
      Cell: row =>
        row.value === null ? (
          '---'
        ) : (
          <Label basic>
            <Icon name="tag" />
            {row.value}
          </Label>
        ),
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: row => <TimeAgo date={row.value} />,
      width: 120,
    },
  ];

  var Table = ReactTable;
  if (selectable) {
    Table = checkboxHOC(Table);
  }

  return (
    <Table
      keyField="kf_id"
      className="-striped -highlight"
      loading={loading}
      columns={columns}
      data={studies}
      pageSizeOptions={[10, 20]}
      defaultPageSize={20}
      defaultSorted={[
        {
          id: 'last_pub_version',
          desc: true,
        },
      ]}
      defaultSortMethod={(a, b, desc) => compareSemVer(a, b, desc)}
      {...props}
    />
  );
};

export default StudiesTable;
