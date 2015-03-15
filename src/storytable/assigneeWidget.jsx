/*
 */
var AssigneeWidget = React.createClass({

  propTypes: {
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      acronym: React.PropTypes.string.isRequired
    }),
    index: React.PropTypes.number.isRequired,
    storyId: React.PropTypes.string.isRequired,
    removeAssignee: React.PropTypes.func.isRequired
  },

  deleteClick: function() {
    this.props.removeAssignee(this.props.storyId, this.props.index, this.props.member);
  },

  render: function() {
    var style= {backgroundColor: this.props.member.color}

    return (
      <div className="member" style={style}><button className="deleteButton" onClick={this.deleteClick}>x</button><div>{this.props.member.acronym}</div></div>
    )
  }
})
