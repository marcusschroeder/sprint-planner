var ws = new WebSocket('ws://' + window.location.hostname + ':8001');

ws.onopen = function () {
  ws.send('Ping'); // Send the message 'Ping' to the server
};

ws.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

ws.onmessage = function (e) {
  console.log('Server: ' + e.data);
};

var SprintTable = React.createClass({

  changePresence: function (memberId, dayIndex) {
    var currentVal = this.state.memberDays[memberId][dayIndex];

    currentVal -= 0.5;

    if (currentVal < 0) {
      currentVal = 1
    }
    this.state.memberDays[memberId][dayIndex] = currentVal;
    this.setState({memberDays: this.state.memberDays});
  },

  getInitialState: function() {
    return {members: [], stories: [], sprintDays: sprintDays, memberDays: {}, assigneeMap: {}, sprintName: ""};
  },

  componentDidMount: function() {
    this.loadData(function (data) {
      this.setState(data)
    }.bind(this));
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    console.log("here", nextProps, nextState);
    return true;
  },

  componentDidUpdate: function() {
    //this.saveStateToLocalStorage();
    this.saveData();
  },

  getStateFromLocalStorage: function () {
    var data = JSON.parse(localStorage.getItem("sprintPlanner"));
    return data;
  },

  saveStateToLocalStorage: function () {
    console.log("Saving to localStorage: sprintPlanner", this.state);
    var newState = JSON.stringify(this.state);
    localStorage.setItem("sprintPlanner", newState);
  },

  createGuid: function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },

  getGuidFromUrl: function(){
    var key = "sprint";
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
  },

  saveData: function() {

    var guid = this.getGuidFromUrl();

    if (guid == "") {
      guid = this.createGuid();
      window.history.pushState('', 'Sprint Planner: ' + guid, '/?sprint=' + guid);
    }

    var data = JSON.stringify(this.state);
    console.log(data)
    $.ajax({
      type: "POST",
      url: "/sprint/" + guid,
      contentType: "application/json; charset=utf-8",
      data: data,
      success: function() {
        console.log("saved")
      },
      dataType: "json"
    });
  },

  loadData: function(callback) {

    var guid = this.getGuidFromUrl();

    if (guid != "") {
      $.ajax({
        type: "GET",
        url: "/sprint/" + guid,
        success: function(data) {
          callback(data)
        },
        dataType: "json"
      });
    }
  },

  drag: function (member, event) {
    event.dataTransfer.setData("member", JSON.stringify(member));
  },

  saveAssignees: function (index, storyId, assignees) {

    var newAssignees = assignees.map(function (assigneeId) {
      return this.getMember(assigneeId);
    }, this);

    this.state.assigneeMap[storyId][index] = newAssignees;
    this.setState({assigneeMap: this.state.assigneeMap});
  },

  addAssignee: function (storyId, index, newMember) {
    var contains = false;

    this.state.assigneeMap[storyId][index].forEach(function (member) {
      if (member.id === newMember.id) {
        contains = true;
      }
    });


    if (!contains) {
      this.state.assigneeMap[storyId][index].push(newMember);
      this.setState({assigneeMap: this.state.assigneeMap})
    }
  },

  removeAssignee: function (storyId, index, deleteMember) {
    var newAssigness = [];

    this.state.assigneeMap[storyId][index].forEach(function (member) {
      if (member.id != deleteMember.id) {
        newAssigness.push(member)
      }
    });
    this.state.assigneeMap[storyId][index] = newAssigness;
    this.setState({assigneeMap: this.state.assigneeMap})
  },

  openAddMemberDialog: function (event) {
    React.render(<MemberModal clientX={event.clientX} clientY={event.clientY} saveMember={this.addMember} />, document.getElementById('modal'))
  },

  addMember: function (member) {
    member.id = "m" + Math.round(Math.random() * 100000)
    this.state.members.push(member);

    this.state.memberDays[member.id] = [];
    this.state.sprintDays.forEach(function () {
      this.state.memberDays[member.id].push(1);
    }, this);

    this.setState({memberDays: this.state.memberDays, members: this.state.members})
  },

  editMember: function (member) {
    var memberIndex = this.getMemberIndex(member.id);
    this.state.members[memberIndex] = member;
    this.setState({members: this.state.members})
  },

  deleteMember: function (member) {

    var members = [];
    var assigneeMap = {};

    this.state.members.forEach(function (m) {
      if (m.id != member.id) {
        members.push(m);

        Object.keys(this.state.assigneeMap).forEach(function (storyId) {
          var assigneeRow = this.state.assigneeMap[storyId];

          assigneeMap[storyId] = [];
          assigneeRow.forEach(function (assigneeColumn) {

            var newAssignees = [];

            assigneeColumn.forEach(function (assignee) {
              if (assignee.id != member.id) {
                newAssignees.push(assignee);
              }
            });

            assigneeMap[storyId].push(newAssignees);
          })
        }, this)
      }
    }, this);

    delete this.state.memberDays[member.id]
    this.setState({members: members, memberDays: this.state.memberDays, assigneeMap: assigneeMap})
  },

  getMemberIndex: function (memberId) {
    var i = -1;
    this.state.members.some(function (member, index) {
      if (member.id === memberId) {
        i = index;
        return true;
      }
    });
    return i;
  },

  getMember: function (memberId) {
    return this.state.members[this.getMemberIndex(memberId)];
  },

  addStory: function () {
    var id = "s" + Math.round(Math.random() * 100000);
    var newStory = {id: id, name: "NAME", editMode: true}

    this.state.stories.push(newStory);
    this.state.assigneeMap[id] = [];
    this.state.sprintDays.forEach(function () {
      this.state.assigneeMap[id].push([]);
    }, this);

    this.setState({stories: this.state.stories, assigneeMap: this.state.assigneeMap});
  },

  saveStory: function (story) {
    var index = this.getStoryIndex(story.id);
    this.state.stories[index] = story;
    this.setState({stories: this.state.stories})
  },

  deleteStory: function (story) {
    var stories = [];
    this.state.stories.forEach(function (s) {
      if (s.id != story.id) {
        stories.push(s);
      }
    });


    delete this.state.assigneeMap[story.id];

    this.setState({stories: stories, assigneeMap: this.state.assigneeMap});
  },

  getStoryIndex: function (storyId) {
    var i = -1;
    this.state.stories.some(function (story, index) {
      if (story.id === storyId) {
        i = index;
        return true;
      }
    });
    return i;
  },

  render: function () {
    return (
      <div>
        <UsersOnline />
        <h1 id="sprintHeader">Sprint {this.state.sprintName}</h1>
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
