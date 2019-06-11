import React, {Component} from 'react';
import axios from 'axios';
import {reportsApi} from '../globalConfig';
import {Icon, Loader, Statistic} from 'semantic-ui-react';

class ReleaseReportSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      release: {},
      found: null,
      report: {},
    };
    this.getData();
    this.mounted = false;
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    axios
      .get(`${reportsApi}/reports/releases/${this.props.releaseId}`)
      .then(report => {
        this.setState({
          report: report.data,
          loading: false,
          found: true,
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          found: false,
        });
      });
  }

  render() {
    if (!this.state.found || this.state.loading) {
      return <Loader content="Loading release stats..." />;
    }
    return (
      <Statistic.Group widths={5} size="small">
        <Statistic>
          <Statistic.Value>
            <Icon name="database" />
            {this.state.report.studies}
          </Statistic.Value>
          <Statistic.Label>Studies</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon name="user" />
            {this.state.report.participants}
          </Statistic.Value>
          <Statistic.Label>Participants</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon name="users" />
            {this.state.report.families}
          </Statistic.Value>
          <Statistic.Label>Families</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon name="lab" />
            {this.state.report.biospecimens}
          </Statistic.Value>
          <Statistic.Label>Biospecimens</Statistic.Label>
        </Statistic>

        <Statistic>
          <Statistic.Value>
            <Icon name="file" />
            {this.state.report['genomic-files']}
          </Statistic.Value>
          <Statistic.Label>Files</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }
}

export default ReleaseReportSummary;
