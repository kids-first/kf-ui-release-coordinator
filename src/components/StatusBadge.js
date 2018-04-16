import React, { Component } from 'react';
import {
  Tag, Icon
} from 'antd';


class StatusBadge extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.healthStatus === 'ok') {
      return (
        <Tag color="#87d068"
          style={{fontSize: "22pt", padding: "10px", height: "38pt"}}
        >Status: <Icon type="check-circle" /></Tag>
      )
    } else {
      return (
        <Tag color="#f50"
          style={{fontSize: "22pt", padding: "10px", height: "38pt"}}
        >Status: <Icon type="warning" /></Tag>
      )
    }

  }
}

export default StatusBadge;
