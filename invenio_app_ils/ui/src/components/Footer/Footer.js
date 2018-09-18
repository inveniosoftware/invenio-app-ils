import React, { Component } from 'react';

import './Footer.css';

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-list">
          <div>CERN Library</div>
          <div>Building 1234</div>
          <div>cds.support@cern.ch</div>
        </div>
        <div className="footer-list">
          <a>About</a>
          <a>Contact</a>
          <a>FAQ</a>
          <a>Feedback</a>
          <a>Help</a>
          <a>Terms of Use</a>
        </div>
        <div>CERN Logo</div>
      </footer>
    );
  }
}
