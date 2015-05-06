import React from 'react';

import SprintTable from './planer/sprintTable.js'

let sprintDays = ["Wed","Thu","Fri","Mon","Tue","Wed","Thu","Fri"];

let SprintPlaner = React.createClass({
  render() {
    return (
      <div>
        <h1>SprintPlaner</h1>
        <SprintTable sprintDays={sprintDays}></SprintTable>
      </div>
    )
  }
});

export default SprintPlaner;
