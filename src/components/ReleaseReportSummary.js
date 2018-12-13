import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Row } from 'antd';
import { reportsApi } from '../globalConfig';
import { UserContext } from '../contexts';
import { Stats } from 'kf-uikit';


class ReleaseReportSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      release: {},
      found: null,
      report: {},
    };
    this.getData();
    this.mounted = false
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    axios.get(`${reportsApi}/reports/${this.props.releaseId}`)
         .then((report) => {
            this.setState({
              report: report.data,
              loading: false,
              found: true,
            });
         })
         .catch(error => {
           console.log(error)
             this.setState({
               found: false
             });
         });
  }

  render() {

    if (!this.state.found || this.state.loading) {
      return null
    }
    return (
      <div>
        <Row type='flex' justify='center'>
          <h3 className='mt-0 mb-4'>Release Summary</h3>
        </Row>
        <Stats
          stats={[
            {icon: 'study', label: 'Studies', metric: this.state.report.studies},
            {icon: 'participant', label: 'Partiicpants', metric: this.state.report.participants},
            {icon: 'family', label: 'Families', metric: this.state.report.families},
            {icon: 'biospecimen', label: 'Biospecimens', metric: this.state.report.biospecimens},
            {icon: 'file', label: 'Files', metric: this.state.report['genomic-files']},
          ]}
        />
        <Row type='flex' justify='center'>
          <hr />
          <h3 className='mt-0 mb-4'>Study Summaries</h3>
        </Row>
        <Row>
        {Object.values(this.state.report.study_summaries).map((study, i) => (
          <Fragment>
            <Row type='flex' justify='center'>
              <h4 className='mt-0 mb-4'>{Object.keys(this.state.report.study_summaries)[i]}</h4>
            </Row>
            <Stats
              stats={[
                {icon: 'participant', label: 'Partiicpants', metric: study.participants},
                {icon: 'family', label: 'Families', metric: study.families},
                {icon: 'biospecimen', label: 'Biospecimens', metric: study.biospecimens},
                {icon: 'file', label: 'Files', metric: study['genomic-files']},
              ]}
            />
          </Fragment>
        ))}
        </Row>
      </div>
    );
  }
}

function ReleaseReportSummaryProps(props) {
  return (
    <UserContext.Consumer>
      {user => <ReleaseReportSummary{...props}
        user={user.user} egoToken={user.egoToken}/>}
    </UserContext.Consumer>
  )
};

export default ReleaseReportSummaryProps;
