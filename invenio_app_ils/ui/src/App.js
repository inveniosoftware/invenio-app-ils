import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <div className="app-content">
            <Route exact path="/" component={Home} />
            <Route path="/record/:recid" component={BookDetails} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
