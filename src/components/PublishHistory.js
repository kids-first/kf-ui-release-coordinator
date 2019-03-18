import React, {Component} from 'react';
import axios from 'axios';
import {VictoryChart, VictoryAxis, VictoryScatter, VictoryArea} from 'victory';
import {coordinatorApi} from '../globalConfig';

class PublishHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publishedReleases: []
    };
  }

  componentDidMount() {
    this.getLatest();
  }

  getLatest() {
    axios
      .get(`${coordinatorApi}/releases?state=published&limit=1000`)
      .then(releases => {
        this.setState({
          publishedReleases: releases.data.results.reverse()
        });
      })
      .catch(error => console.log(error));
  }

  render() {
    const data = this.state.publishedReleases.map((r, i) => ({
      x: new Date(r.created_at),
      y: i,
      l: r.version
    }));
    return (
      <div>
        <VictoryChart
          padding={{top: 10, bottom: 20, left: 20, right: 10}}
          domainPadding={{x: [10, 10]}}
          height={100}
        >
          <VictoryArea
            data={data}
            scale="time"
            labels={() => null}
            style={{
              data: {
                fill: '#cc3399',
                fillOpacity: 0.5,
                stroke: 'none'
              },
              axis: {
                fontSize: 6
              }
            }}
          />
          <VictoryScatter
            data={data}
            scale="time"
            size={2}
            labels={x => x.l}
            style={{
              data: {
                fill: '#1890ff',
                fillOpacity: 0.75,
                strokeWidth: 2
              },
              axis: {
                fontSize: 6
              },
              labels: {
                padding: 3,
                fontSize: 6
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={x => x}
            style={{
              tickLabels: {
                fontSize: 6
              }
            }}
          />
          <VictoryAxis
            tickFormat={x =>
              new Date(x).toLocaleString('en-us', {
                month: 'short',
                day: 'numeric'
              })
            }
            style={{
              tickLabels: {
                fontSize: 6
              }
            }}
          />
        </VictoryChart>
      </div>
    );
  }
}

export default PublishHistory;
