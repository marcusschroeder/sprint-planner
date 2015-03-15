var SprintTable = React.createClass({


  changePresence: function(memberId, dayIndex) {
    var currentVal = this.state.memberDays[memberId][dayIndex];

    currentVal -= 0.5;

    if(currentVal < 0) {
      currentVal = 1
    }
    this.state.memberDays[memberId][dayIndex] = currentVal;
    this.setState({memberDays: this.state.memberDays});
  },

  getInitialState: function() {
    var data = this.getStateFromLocalStorage();
    var initState = {members: [], stories: [], sprintDays: sprintDays, memberDays: {}, assigneeMap: {}};
    if (data != null) {
      if (data.hasOwnProperty("stories")) {
        initState.stories = data.stories;
      }

      if (data.hasOwnProperty("members")) {
        initState.members = data.members;
      }

      if (data.hasOwnProperty("memberDays")) {
        initState.memberDays = data.memberDays;
      }

      if (data.hasOwnProperty("assigneeMap")) {
        initState.assigneeMap = data.assigneeMap;
      }

      if (data.hasOwnProperty("sprintDays")) {
        initState.sprintDays = data.sprintDays;
      }
    }
    return initState;
  },

  componentDidUpdate: function() {
    this.saveStateToLocalStorage();
  },

  getStateFromLocalStorage: function() {
    var data = JSON.parse(localStorage.getItem("sprintPlanner"));
    return data;
  },

  saveStateToLocalStorage: function() {
    console.log("Saving to localStorage: sprintPlanner", this.state);
    var newState = JSON.stringify(this.state);
    localStorage.setItem("sprintPlanner", newState);
  },

  drag: function(member, event) {
    event.dataTransfer.setData("member", JSON.stringify(member));
  },

  saveAssignees: function(index, storyId, assignees) {
    var self = this;
    var newAssignees = [];
    assignees.forEach(function(assigneeId) {
      newAssignees.push(self.getMember(assigneeId))
    });

    this.state.assigneeMap[storyId][index] = newAssignees;
    this.setState({assigneeMap: this.state.assigneeMap});
  },

  addAssignee: function(storyId, index, newMember) {
    var contains = false;

    this.state.assigneeMap[storyId][index].forEach(function(member) {
      if(member.id === newMember.id) {
        contains = true;
      }
    });


    if(!contains) {
      this.state.assigneeMap[storyId][index].push(newMember);
      this.setState({assigneeMap: this.state.assigneeMap})
    }
  },

  removeAssignee: function(storyId, index, deleteMember) {
    var newAssigness = [];

    this.state.assigneeMap[storyId][index].forEach(function(member) {
      if(member.id != deleteMember.id) {
        newAssigness.push(member)
      }
    });
    this.state.assigneeMap[storyId][index] = newAssigness;
    this.setState({assigneeMap: this.state.assigneeMap})
  },

  openAddMemberDialog: function(event) {
    React.render(<MemberModal clientX={event.clientX} clientY={event.clientY} saveMember={this.addMember} />, document.getElementById('modal'))
  },

  addMember: function(member) {
    var self = this;

    member.id = "m" + Math.round(Math.random() * 100000)
    this.state.members.push(member);

    // add for each sprintday to memberDays
    this.state.memberDays[member.id] = [];
    this.state.sprintDays.forEach(function() {
      self.state.memberDays[member.id].push(1);
    });
    this.setState({memberDays: this.state.memberDays, members: this.state.members})
  },

  editMember: function(member) {
    var memberIndex = this.getMemberIndex(member.id);
    this.state.members[memberIndex] = member;
    this.setState({members: this.state.members})
  },

  deleteMember: function(member) {
    var self = this;

    var index = this.getMemberIndex(member.id);

    var members = [];
    var assigneeMap = {};

    self.state.members.forEach(function(m) {
      if (m.id != member.id) {
        members.push(m);

        Object.keys(self.state.assigneeMap).forEach(function(storyId) {
          var assigneeRow = self.state.assigneeMap[storyId];

          assigneeMap[storyId] = [];
          assigneeRow.forEach(function(assigneeColumn) {

            var newAssignees = [];

            assigneeColumn.forEach(function(assignee) {
              if(assignee.id != member.id) {
                newAssignees.push(assignee);
              }
            });

            assigneeMap[storyId].push(newAssignees);
          })
        })
      }
    });

    delete this.state.memberDays[member.id]
    this.setState({members: members, memberDays: self.state.memberDays, assigneeMap: assigneeMap })
  },

  getMemberIndex: function(memberId) {
    var i = -1;
    this.state.members.some(function(member, index) {
      if(member.id === memberId) {
        i = index;
        return true;
      }
    });
    return i;
  },

  getMember: function(memberId) {
    return this.state.members[this.getMemberIndex(memberId)];
  },

  addStory: function() {
    var self = this;
    var id = "s" + Math.round( Math.random() * 100000);
    var newStory = {id: id, name: "NAME", editMode: true}

    this.state.stories.push(newStory);
    this.state.assigneeMap[id] = [];
    this.state.sprintDays.forEach(function() {
      self.state.assigneeMap[id].push([]);
    });

    this.setState({stories: this.state.stories, assigneeMap: this.state.assigneeMap});
  },

  saveStory: function(story) {
    var index = this.getStoryIndex(story.id);
    this.state.stories[index] = story;
    this.setState({stories: this.state.stories})
  },

  deleteStory: function(story) {
    var self = this;
    var index = this.getStoryIndex(story.id);

    var stories = [];
    self.state.stories.forEach(function(s) {
      if (s.id != story.id) {
        stories.push(s);
      }
    });


    delete this.state.assigneeMap[story.id];

    this.setState({stories: stories, assigneeMap: this.state.assigneeMap});
  },

  getStoryIndex: function(storyId) {
    var i = -1;
    this.state.stories.some(function(story, index) {
      if(story.id === storyId) {
        i = index;
        return true;
      }
    });
    return i;
  },

  render: function() {
    return (
      <div>

        <h2>Programmer</h2>
        <MemberTable
          members={this.state.members}
          memberDays={this.state.memberDays}
          sprintDays={this.state.sprintDays}
          changePresence={this.changePresence}
          deleteMember={this.deleteMember}
          editMember={this.editMember}
          drag={this.drag}
        />
        <button onClick={this.openAddMemberDialog}>add programmer</button>


        <h2>Who is doing what&#63;</h2>
        <StoryTable
          sprintDays={this.state.sprintDays}
          assigneeMap={this.state.assigneeMap}
          stories={this.state.stories}
          saveStory={this.saveStory}
          deleteStory={this.deleteStory}
          addAssignee={this.addAssignee}
          removeAssignee={this.removeAssignee}
          getMember={this.getMember}
          members={this.state.members}
          saveAssignees={this.saveAssignees}
        />
        <button onClick={this.addStory}>add Story</button>


        <h2>Workload</h2>
        <WorkloadWidget
          assigneeMap={this.state.assigneeMap}
          members={this.state.members}
          memberDays={this.state.memberDays}
        />
      </div>

    )
  }
});