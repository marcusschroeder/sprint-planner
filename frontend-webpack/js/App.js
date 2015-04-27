import '../css/style.less'

import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import LoginHandler from './components/Login.js';
import SprintPlannerHandler from './components/SprintPlaner.js';

let App = React.createClass({
  render() {
    return (
      <div className="page">
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="app">Home</Link>
            </li>
            <li>
              <Link to="login">Login</Link>
            </li>
            <li>
              <Link to="planner">SprintPlanner</Link>
            </li>
          </ul>
        </nav>
        {/* this is the important part */}
        <section className="content">
          <RouteHandler/>
        </section>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="login" path="/login" handler={LoginHandler}/>
      <Route name="planner" path="/planner" handler={SprintPlannerHandler}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
