import React, {Component} from 'react';
import {Icon} from 'kf-uikit';
import Tag from './Tag';

class StatusBadge extends Component {
  render() {
    if (this.props.healthStatus === 'ok') {
      return (
        <Tag state="published">
          Status: <Icon kind="star" width={18} />
        </Tag>
      );
    } else {
      return (
        <Tag state="failed">
          Status: <Icon type="close" width={18} />
        </Tag>
      );
    }
  }
}

export default StatusBadge;
