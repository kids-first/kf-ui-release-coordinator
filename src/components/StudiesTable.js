import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Pagination, Table} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import 'react-table/react-table.css';
import {compareSemVer} from '../utils';

const StudiesTable = ({loading, studies, selectable, ...props}) => {
  const [sortState, setSortState] = useState({
    column: 'created_at',
    direction: 'descending',
  });

  const pageSize = 10;
  const totalPages = Math.ceil(studies.length / pageSize);
  const [pageState, setPageState] = useState({
    activePage: 1,
  });

  const onPageChange = (ev, data) => {
    setPageState({activePage: data.activePage});
  };

  const columns = [
    {
      name: 'Study',
      accessor: 'kf_id',
      Cell: value => <Link to={`/studies/${value}`}>{value}</Link>,
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
              key={col.accessor}
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
        {studies
          .sort(sortFunc)
          .slice(
            (pageState.activePage - 1) * pageSize,
            pageState.activePage * pageSize,
          )
          .map(row => (
            <Table.Row key={row.kf_id}>
              {columns.map(col => (
                <Table.Cell key={row[col.accessor]} textAlign={col.textAlign}>
                  {col.Cell ? col.Cell(row[col.accessor]) : row[col.accessor]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="4">
            <Pagination
              floated="right"
              activePage={pageState.activePage}
              onPageChange={onPageChange}
              totalPages={totalPages}
              boundaryRange={0}
              siblingRange={5}
              firstItem={null}
              lastItem={null}
              ellipsisItem={null}
            />
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default StudiesTable;
