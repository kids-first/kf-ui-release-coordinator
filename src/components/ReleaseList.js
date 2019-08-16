import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Icon, Label, Pagination, Table} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
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

  const [sortState, setSortState] = useState({
    column: 'created_at',
    direction: 'ascending',
  });

  const pageSize = 15;
  const totalPages = Math.ceil(releases.length / pageSize);
  const [pageState, setPageState] = useState({
    activePage: 1,
  });

  const onPageChange = (ev, data) => {
    setPageState({activePage: data.activePage});
  };

  const sortFunc = (row1, row2) => {
    const col = sortState.column;
    if (sortState.column === 'version') {
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

  const columns = [
    {
      name: 'Release',
      accessor: 'kf_id',
      Cell: value => <Link to={`/releases/${value}`}>{value}</Link>,
      collapsing: true,
    },
    {
      name: 'Name',
      accessor: 'name',
    },
    {
      name: 'Author',
      accessor: 'author',
      Cell: value => (
        <Label basic>
          <Icon name="user" />
          {value.split('@')[0]}
        </Label>
      ),
      textAlign: 'center',
      collapsing: true,
    },
    {
      name: 'Version',
      accessor: 'version',
      Cell: value => (
        <span>
          <Icon name="tag" />
          {value}
        </span>
      ),
      textAlign: 'center',
      collapsing: true,
    },
    {
      name: 'State',
      accessor: 'state',
      Cell: value => (
        <Label basic color={stateColors[value]}>
          {value}
        </Label>
      ),
      textAlign: 'center',
      collapsing: true,
    },
    {
      name: 'Created',
      accessor: 'created_at',
      Cell: value => <TimeAgo date={value} />,
      textAlign: 'center',
      collapsing: true,
    },
  ];

  return (
    <Table sortable>
      <Table.Header>
        <Table.Row>
          {columns.map(col => (
            <Table.HeaderCell
              key={col.accessor || col.name}
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
        {releases
          .sort(sortFunc)
          .slice(
            (pageState.activePage - 1) * pageSize,
            pageState.activePage * pageSize,
          )
          .map(row => (
            <Table.Row key={row.kf_id}>
              {columns.map(col => (
                <Table.Cell
                  key={row[col.accessor]}
                  textAlign={col.textAlign}
                  collapsing={col.collapsing}
                >
                  {col.Cell ? col.Cell(row[col.accessor]) : row[col.accessor]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={columns.length}>
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

export default ReleaseList;
