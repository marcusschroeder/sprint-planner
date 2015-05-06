import React from 'react';

/*
 Renders a progress bar for one member.
 */
let ConsumptionRow = React.createClass({

  propTypes: {
    color: React.PropTypes.string.isRequired,
    progress: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },

  render: function() {
    var progressStyle = {backgroundColor: this.props.color, width: this.props.progress + "%"};
    return (
      <div className="consumptionRow">
        <div className="progressName">{this.props.name}</div>
        <div className="progressPercent">{this.props.progress}%</div>
        <div className="progressBarWrapper">
          <div className="progressBar" style={progressStyle}>&nbsp;</div>
        </div>
        <div className="clear"></div>
      </div>
    )
  }
})

export default ConsumptionRow;
