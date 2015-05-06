import React from 'react';

let StoryTable = React.createClass({

  propTypes: {
    sprintDays: React.PropTypes.array.isRequired,
    stories: React.PropTypes.array.isRequired,
    assigneeMap: React.PropTypes.shape().isRequired,
    addAssignee: React.PropTypes.func.isRequired,
    removeAssignee: React.PropTypes.func.isRequired,
    getMember: React.PropTypes.func.isRequired,
    deleteStory: React.PropTypes.func.isRequired,
    saveStory: React.PropTypes.func.isRequired,
    saveAssignees: React.PropTypes.func.isRequired
  },

  render: function () {

    var sprintDays = this.props.sprintDays.map(function (day) {
      return (<th>{day}</th>)
    });

    var storyList = this.props.stories.map(function (story) {
      var rowTotal = 0;
      var storyCells = this.props.sprintDays.map(function (value, index) {
        var assignees = [];
        if (typeof this.props.assigneeMap[story.id] !== "undefined") {
          var assignees = this.props.assigneeMap[story.id][index];
          rowTotal += assignees.length;
        }
        return (
          <StoryDayCell
            index={index}
            storyId={story.id}
            addAssignee={this.props.addAssignee}
            assignees={assignees}
            removeAssignee={this.props.removeAssignee}
            saveAssignees={this.props.saveAssignees}
            getMember={this.props.getMember}
            members={this.props.members}
          />
        )

      }, this);

      var storyNameWidget = <StoryNameWidget story={story} saveStory={this.props.saveStory} deleteStory={this.props.deleteStory} />;

      return (
        <tr className="border-thin">
          <td className="story firstColumn">{storyNameWidget}</td>
        {storyCells}
          <td className="story" >{rowTotal}</td>
        </tr>);
    }, this);

    return (
      <table>
        <thead>
          <tr>
            <th className="firstColumn" ></th>
            {sprintDays}
          </tr>
        </thead>
        <tbody>
          {storyList}
        </tbody>
      </table>
    );
  }
})

export default StoryTable;
