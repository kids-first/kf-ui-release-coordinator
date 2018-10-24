import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Card, Table } from 'antd';
import { reportsApi } from '../globalConfig';
import { UserContext } from '../contexts';


class ReleaseReportSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      release: {},
      found: null,
      report: {},
      columns: [{
        title: 'Study',
        dataIndex: 'study_id',
      }, {
        title: 'Participants',
        dataIndex: 'participants',
        align: 'center',
      }, {
        title: 'Biospecimens',
        dataIndex: 'biospecimens',
        align: 'center',
      }, {
        title: 'Genomic Files',
        dataIndex: 'genomic-files',
        align: 'center',
      }],
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
        <Row gutter={16} type='flex' justify='center'>
          <Col span={6}>
            <Card>
              <center>
                <h3 className='m-0'>Studies</h3>
                <h3 className='m-0'>{this.state.report.studies}</h3>
              </center>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <center>
                <h3 className='m-0'>Participants</h3>
                <h3 className='m-0'>{this.state.report.participants}</h3>
              </center>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <center>
                <h3 className='m-0'>Biospecimens</h3>
                <h3 className='m-0'>{this.state.report.biospecimens}</h3>
              </center>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <center>
                <h3 className='m-0'>Genomic Files</h3>
                <h3 className='m-0'>{this.state.report['genomic-files']}</h3>
              </center>
            </Card>
          </Col>
        </Row>
        <Row type='flex' justify='center'>
          <hr />
          <h3 className='mt-0 mb-4'>Study Summary</h3>
        </Row>
        <Row>
          <Table
            bordered={true}
            pagination={false}
            columns={this.state.columns}
            dataSource={Object.values(this.state.report.study_summaries)}
            size='middle'
          />
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
