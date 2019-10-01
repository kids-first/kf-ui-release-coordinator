import React from 'react';
import {
  VictoryLegend,
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
} from 'victory';

const ReleaseTimeline = ({events}) => {
  const stateColors = {
    initializing: '#fce220',
    initialized: '#fce220',
    running: '#fa8c16',
    staged: '#66fc25',
    publishing: '#91d5ff',
    published: '#1890ff',
    canceled: '#dbdbdb',
    failed: '#fc4a3a',
  };

  const data = events.map(({node}, i) => ({
    x: new Date(node.createdAt),
    y: i,
    task: node.task ? node.task.kfId : '',
    service: node.taskService ? node.taskService.kfId : '',
    release: node.release.kfId,
    name: node.task ? node.task.kfId : node.release.kfId,
    state: node.message.split(' ').splice(-1),
  }));

  const services = data
    .map(r => r.name)
    .filter((x, i, a) => a.indexOf(x) === i);

  return (
    <div style={{width: '100%'}}>
      <VictoryChart
        padding={{top: 10, bottom: 20, left: 50, right: 10}}
        domainPadding={{x: [20, 20], y: [10, 10]}}
        height={20 * services.length + 20}
      >
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fontSize: 6,
              padding: 3,
            },
            axis: {stroke: 'none'},
            grid: {stroke: '#cc3399'},
            ticks: {stroke: '#cc3399', size: 5},
          }}
        />
        <VictoryScatter
          data={data}
          scale="time"
          size={4}
          y={r => r.name}
          sortKey="name"
          sortOrder="descending"
          style={{
            data: {
              fill: ev => stateColors[ev.state],
              fillOpacity: 1.0,
              strokeWidth: 2,
            },
            axis: {
              fontSize: 6,
            },
            labels: {
              padding: 3,
              fontSize: 6,
            },
          }}
        />
        <VictoryAxis
          tickFormat={x =>
            new Date(x).toLocaleString('en-us', {
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })
          }
          style={{
            tickLabels: {
              fontSize: 6,
              padding: 2,
            },
            grid: {stroke: 'grey'},
            ticks: {stroke: 'grey', size: 5},
          }}
        />
        <VictoryLegend
          orientation="horizontal"
          centerTitle
          x={0}
          y={0}
          gutter={0}
          style={{
            border: {stroke: 'none'},
            title: {fontSize: 8},
            labels: {fontSize: 6},
          }}
          borderPadding={0}
          padding={{top: 0, bottom: 0}}
          data={Object.keys(stateColors).map(v => ({
            name: v,
            symbol: {fill: stateColors[v]},
          }))}
        />
      </VictoryChart>
    </div>
  );
};

export default ReleaseTimeline;
