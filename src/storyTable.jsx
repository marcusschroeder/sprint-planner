var StoryTable = React.createClass({

  propTypes: {
    sprintDays: React.PropTypes.array.isRequired,
    stories: React.PropTypes.array.isRequired,
    assigneeMap: React.PropTypes.shape().isRequired,
    addAssignee: React.PropTypes.func.isRequired,
    removeAssignee: React.PropTypes.func.isRequired,
    getMember: React.PropTypes.func.isRequired,
    deleteStory: React.PropTypes.func.isRequired,
    saveStory: React.PropTypes.func.isRequired
  },

  render: function() {
    var self = this;

    var sprintDays = self.props.sprintDays.map(function(day){
      return (<th>{day}</th>)
    });

    var storyList = self.props.stories.map(function(story){
      var rowTotal = 0;
      var storyCells = self.props.sprintDays.map(function(value, index){
        var assignees = [];
        if(typeof self.props.assigneeMap[story.id] !== "undefined") {
          var assignees = self.props.assigneeMap[story.id][index];
          rowTotal += assignees.length;
        }
        return (
          <StoryDayCell
            index={index}
            storyId={story.id}
            addAssignee={self.props.addAssignee}
            assignees={assignees}
            removeAssignee={self.props.removeAssignee}
            getMember={self.props.getMember}
          />
        )

      });

      var storyNameWidget = <StoryNameWidget story={story} saveStory={self.props.saveStory} deleteStory={self.props.deleteStory} />;

      return (
        <tr className="border-thin">
          <td className="story firstColumn">{storyNameWidget}</td>
        {storyCells}
          <td>{rowTotal}</td>
        </tr>);
    });

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