import React, { Component } from 'react';
import { Timeline, Icon, Tag
} from 'antd';


class Events extends Component {
  whatColor(ev) {
    var color = 'green';
    switch(ev.event_type) {
      case 'info':
        color = '#19a9c4';
        break;
      case 'warning':
        color = 'red';
        break;
      case 'error':
        color = 'red';
        break;
      default:
        color = 'blue';
    }
    return color
  }

  whatIcon(ev) {
    var icon = 'info';

    return icon
  }

  render() {

    let timeline = this.props.events.map((ev, i) => (
      <Timeline.Item color={this.whatColor(ev)}
        dot={<Icon type={this.whatIcon(ev)} style={{ fontSize: '18px', color: this.whatColor(ev) }} />}
        key={i}>
        <em>{(new Date(ev.created_at)).toLocaleString("en-US")}</em>
        - {ev.message} <div></div>
        {ev.release && (
          <Tag color="blue">{ev.release.slice(1).slice(-11)}</Tag>
        )}
        {ev.task_service && (
          <Tag color="orange">{ev.task_service.slice(1).slice(-11)}</Tag>
        )}
        {ev.task && (
          <Tag color="magenta">{ev.task.slice(1).slice(-11)}</Tag>
        )}
        
      </Timeline.Item>
    ));
    return (
      <Timeline pending={this.props.events.length > 0 && !this.props.events[this.props.events.length - 1].message.includes('release published') ? '' : ''}>
        {timeline}
      </Timeline>
    );
  }
}

export default Events;
