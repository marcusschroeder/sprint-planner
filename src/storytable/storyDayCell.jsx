/*
 */
var StoryDayCell = React.createClass({

  propTypes: {
    addAssignee: React.PropTypes.func.isRequired,
    removeAssignee: React.PropTypes.func.isRequired,
    getMember: React.PropTypes.func.isRequired,
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      acronym: React.PropTypes.string.isRequired
    }),
    index: React.PropTypes.number.isRequired,
    storyId: React.PropTypes.string.isRequired
  },

  allowDrop: function(event) {
    event.preventDefault();
  },

  drop: function(event) {
    event.preventDefault();
    var member = JSON.parse(event.dataTransfer.getData("member"));
    this.props.addAssignee(this.props.storyId, this.props.index, member);
  },

  render: function() {
    var self = this;
    var assignees = this.props.assignees.map(function(assignee) {

      var member = self.props.getMember(assignee.id);
      return (
        <AssigneeWidget
          member={member}
          storyId={self.props.storyId}
          index={self.props.index}
          removeAssignee={self.props.removeAssignee} />
      );
    });

    return (
      <td onDrop={this.drop} onDragOver={this.allowDrop}>
      {assignees}
      </td>
    )
  }
})