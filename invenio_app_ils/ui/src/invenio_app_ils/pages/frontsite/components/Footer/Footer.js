import React, { Component } from 'react';

import './Footer.scss';

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-list">
          <div>Library</div>
          <div>Building 1234</div>
          <div>contactemail@domain.com</div>
        </div>
        <div className="footer-list">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
          <a href="/feedback">Feedback</a>
          <a href="/help">Help</a>
          <a href="/terms">Terms of Use</a>
        </div>
        <div>Logo</div>
      </footer>
    );
  }
}
