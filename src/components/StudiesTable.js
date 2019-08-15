import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Icon, Label, Table} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import 'react-table/react-table.css';
import {compareSemVer} from '../utils';

const StudiesTable = ({loading, studies, selectable, ...props}) => {
  const [sortState, setSortState] = useState({
    column: 'created_at',
    direction: 'descending',
  });

  const columns = [
    {
      name: 'Study',
      accessor: 'kf_id',
      Cell: value => (
        <Link as={Link} to={`/studies/${value}`}>
          {value}
        </Link>
      ),
    },
    {
      name: 'Name',
      accessor: 'name',
      textAlign: 'left',
    },
    {
      name: 'Public Version',
      accessor: 'last_pub_version',
      Cell: value =>
        value === null ? (
          '---'
        ) : (
          <span>
            <Icon name="tag" />
            {value}
          </span>
        ),
      textAlign: 'center',
    },
    {
      name: 'Created',
      accessor: 'created_at',
      Cell: value => <TimeAgo date={value} />,
      width: 2,
      textAlign: 'right',
    },
  ];

  const sortFunc = (row1, row2) => {
    const col = sortState.column;
    if (sortState.column === 'last_pub_version') {
      return sortState.direction === 'ascending'
        ? compareSemVer(row1[col], row2[col])
        : compareSemVer(row2[col], row1[col]);
    }
    return sortState.direction === 'ascending'
      ? row1[col] < row2[col]
      : row1[col] > row2[col];
  };

  const handleSort = selectedCol => {
    if (selectedCol === sortState.column) {
      setSortState({
        column: selectedCol,
        direction:
          sortState.direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      setSortState({column: selectedCol, direction: 'ascending'});
    }
  };

  return (
    <Table sortable>
      <Table.Header>
        <Table.Row>
          {columns.map(col => (
            <Table.HeaderCell
              textAlign={col.textAlign}
              width={col.width}
              sorted={
                sortState.column === col.accessor ? sortState.direction : null
              }
              onClick={() => handleSort(col.accessor)}
            >
              {col.name}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {studies.sort(sortFunc).map(row => (
          <Table.Row>
            {columns.map(col => (
              <Table.Cell textAlign={col.textAlign}>
                {col.Cell ? col.Cell(row[col.accessor]) : row[col.accessor]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default StudiesTable;
