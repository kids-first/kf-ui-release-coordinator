import {Link} from 'react-router-dom';
import React from 'react';
import {Button} from 'kf-uikit';
import TimeAgo from 'react-timeago';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {compareSemVer} from '../utils';

const ReleaseList = ({loading, releases}) => {
  const columns = [
    {
      Header: 'Release',
      accessor: 'kf_id',
      Cell: row => (
        <Link to={`/releases/${row.value}`}>
          <Button className="w-full">{row.value}</Button>
        </Link>
      ),
      width: 120,
      filterable: true
    },
    {
      Header: 'Name',
      accessor: 'name',
      filterable: true
    },
    {
      Header: 'Author',
      accessor: 'author',
      width: 150,
      className: 'text-center',
      Cell: row => row.value.split('@')[0],
      filterable: true
    },
    {
      Header: 'Version',
      accessor: 'version',
      width: 70,
      className: 'text-center',
      filterable: true
    },
    {
      Header: 'State',
      accessor: 'state',
      width: 100,
      className: 'text-center',
      filterable: true
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: row => <TimeAgo date={row.value} />,
      width: 120,
      className: 'text-right'
    }
  ];
  return (
    <ReactTable
      className="-striped -highlight"
      loading={loading}
      columns={columns}
      data={releases}
      pageSizeOptions={[10, 20]}
      defaultPageSize={20}
      defaultSorted={[
        {
          id: 'version',
          desc: true
        }
      ]}
      defaultSortMethod={(a, b, desc) => compareSemVer(a, b, desc)}
    />
  );
};

export default ReleaseList;
