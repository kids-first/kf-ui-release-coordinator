import {Link} from 'react-router-dom';
import React from 'react';
import {Button, Icon} from 'kf-uikit';
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
        <Link to={`/studies/${row.value}`}>
          <Button className="w-full">{row.value}</Button>
        </Link>
      ),
      width: 120,
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Public Version',
      accessor: 'last_pub_version',
      width: 70,
      className: 'text-center',
      Cell: row => (row.value === null ? '---' : row.value),
    },
    {
      Header: 'Visible',
      accessor: 'visible',
      Cell: row => (
        <Icon
          kind={row.value ? 'access-open' : 'close'}
          width={20}
          height={20}
        />
      ),
      width: 120,
      className: 'text-center',
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: row => <TimeAgo date={row.value} />,
      width: 120,
      className: 'text-right',
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
