import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Checkbox, Icon, Pagination, Table} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {compareSemVer} from '../utils';

const StudiesTable = ({
  studies,
  selectable,
  isSelected,
  toggleSelection,
  toggleAll,
}) => {
  const [sortState, setSortState] = useState({
    column: 'createdAt',
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
      accessor: 'kfId',
      Cell: value => <Link to={`/studies/${value}`}>{value}</Link>,
      collapsing: true,
    },
    {
      name: 'Name',
      accessor: 'name',
      textAlign: 'left',
    },
    {
      name: 'Public Version',
      accessor: 'lastPublishedVersion',
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
      accessor: 'createdAt',
      Cell: value => <TimeAgo date={value} />,
      width: 2,
      textAlign: 'right',
    },
  ];

  const sortFunc = (row1, row2) => {
    const col = sortState.column;
    if (sortState.column === 'lastPubVersion') {
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
          {selectable && (
            <Table.HeaderCell>
              <Checkbox checked={false} onChange={toggleAll} />
            </Table.HeaderCell>
          )}
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
        {studies
          .sort(sortFunc)
          .slice(
            (pageState.activePage - 1) * pageSize,
            pageState.activePage * pageSize,
          )
          .map(({node}) => (
            <Table.Row key={node.kfId}>
              {selectable && (
                <Table.Cell collapsing>
                  <Checkbox
                    checked={isSelected(node.kfId)}
                    onChange={() => toggleSelection(node.kfId)}
                  />
                </Table.Cell>
              )}
              {columns.map(col => (
                <Table.Cell
                  key={node[col.accessor]}
                  textAlign={col.textAlign}
                  collapsing={col.collapsing}
                >
                  {col.Cell ? col.Cell(node[col.accessor]) : node[col.accessor]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={columns.length + (selectable ? 1 : 0)}>
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
