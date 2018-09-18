import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import './Statistics.css';

class Statistics extends Component {
  render() {
    return (
      <div className="home-stats">
        <div className="home-stats-item">
          <Icon name="book" size="big" />
          <span>1.000.000 Books in the library</span>
        </div>
        <div className="home-stats-item">
          <Icon name="suitcase" size="big" />
          <span>100.230 Books on loan</span>
        </div>
        <div className="home-stats-item">
          <Icon name="users" size="big" />
          <span>150.230 Users</span>
        </div>
      </div>
    );
  }
}

export default Statistics;
