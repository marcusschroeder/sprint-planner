/*
 */
var StoryDayCell = React.createClass({

  propTypes: {
    addAssignee: React.PropTypes.func.isRequired,
    removeAssignee: React.PropTypes.func.isRequired,
    assignees: React.PropTypes.array.isRequired,
    getMember: React.PropTypes.func.isRequired,
    members: React.PropTypes.array.isRequired,
    index: React.PropTypes.number.isRequired,
    storyId: React.PropTypes.string.isRequired,
    saveAssignees: React.PropTypes.func.isRequired
  },

  allowDrop: function(event) {
    event.preventDefault();
  },

  saveAssignees: function(assignees) {
    this.props.saveAssignees(this.props.index, this.props.storyId, assignees);
  },

  showSelectBox: function(event) {
    React.unmountComponentAtNode(document.getElementById("modal"));
    React.render(
      <SelectAssigneeWidget
        members={this.props.members}
        assignees={this.props.assignees}
        clientX={event.clientX}
        clientY={event.clientY}
        saveAssignees={this.saveAssignees}
      />, document.getElementById("modal"));
  },

  drop: function(event) {
    event.preventDefault();
    var member = JSON.parse(event.dataTransfer.getData("member"));
    this.props.addAssignee(this.props.storyId, this.props.index, member);
  },

  render: function() {
    var assignees = this.props.assignees.map(function(assignee) {

      var member = this.props.getMember(assignee.id);
      return (
        <AssigneeWidget
          member={member}
          storyId={this.props.storyId}
          index={this.props.index}
          removeAssignee={this.props.removeAssignee} />
      );
    }, this);

    return (
      <td onDrop={this.drop} onDragOver={this.allowDrop} onClick={this.showSelectBox}>
      {assignees}
      </td>
    )
  }
})