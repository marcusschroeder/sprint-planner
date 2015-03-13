/*
Renders a progress bar for one member.
*/
var ConsumptionRow = React.createClass({

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
        <div className="progressBarWrapper">
          <div className="progressBar" style={progressStyle}>&nbsp;</div>
        </div>
        <div className="progressPercent">{this.props.progress}%</div>
        <div className="clear"></div>
      </div>
    )
  }
})


/*
Renders the name of a story. On click it will become editable.
On enter and blur it will be saved. Cancel is on escape.
*/
var StoryNameWidget = React.createClass({

  propTypes: {
    story: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
      }),
    saveStory: React.PropTypes.func.isRequired,
    deleteStory: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {editMode: false};
  },

  toggle: function() {
    this.setState({editMode: !this.state.editMode});
  },

  save: function(newName) {
    var story = this.props.story;
    story.name = newName;
    this.props.saveStory(story);
    this.toggle();
  },

  deleteClick: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deleteStory(this.props.story);
  },

  keyDown: function(event) {
    if(event.keyCode == 13) {
      this.save(event.target.value)
    } else if (event.keyCode == 27) {
      this.toggle();
    }
  },

  render: function() {
    var content;
    var story = this.props.story;
    if(this.state.editMode) {
      content = <input type="text" maxLength="10" defaultValue={story.name} onKeyDown={this.keyDown} onBlur={this.toggle} autoFocus />
    } else {
      content = <div className="storyNameWidget" onClick={this.toggle}>{story.name}<button className="deleteButton" onClick={this.deleteClick}>x</button></div>;
    }
    return content;
  }
})


/*

*/
var MemberNameWidget = React.createClass({

  propTypes: {
    drag: React.PropTypes.func.isRequired,
    editMember: React.PropTypes.func.isRequired,
    deleteMember: React.PropTypes.func.isRequired,
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
    })
  },

  drag: function(event) {
    this.props.drag(this.props.member, event);
  },

  editClick: function(event) {
    React.render(<MemberModal clientX={event.clientX} clientY={event.clientY} saveMember={this.props.editMember}
      member={this.props.member} />, document.getElementById('modal'))
  },

  deleteClick: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deleteMember(this.props.member);
  },

  render: function() {

    var style = {backgroundColor: this.props.member.color};

    return (
      <div className="memberNameWidget" draggable="true" onDragStart={this.drag} onClick={this.editClick} style={style}>
        {this.props.member.name}
        <button className="deleteButton" onClick={this.deleteClick}>x</button>
      </div>
    );
  }
})


/*
A small modal window to add a new programmer or edit an existing programmer quickly.
*/
var MemberModal = React.createClass({

  propTypes: {
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      acronym: React.PropTypes.string.isRequired
    }),
    clientX: React.PropTypes.number.isRequired,
    clientY: React.PropTypes.number.isRequired,

  },

  getInitialState: function() {
    if(this.props.member) {
      return this.props.member
    }
    return {name: "", color: "", acronym: ""}
  },

  changeName: function(event) {
    this.setState({name: event.target.value});
  },

  changeColor: function(event) {
    this.setState({color: event.target.value});
  },

  changeAcronym: function(event) {
    this.setState({acronym: event.target.value});
  },

  save: function() {
    this.props.saveMember(this.state);
    this.close();
  },

  cancel: function() {
    this.close();
  },

  close: function() {
    React.unmountComponentAtNode(document.getElementById("modal"));
  },

  render: function() {

    var positionStyle = {top: this.props.clientY, left: this.props.clientX, background: this.state.color}

    return (
      <div className="modalWrapper" style={positionStyle}>
        <div><input type="text" name="name" value={this.state.name} maxLength="15" placeholder="Name" onChange={this.changeName}/></div>
        <div><input type="text" name="acronym" value={this.state.acronym} maxLength="2" placeholder="XX" onChange={this.changeAcronym}/></div>
        <div><input type="text" name="color" value={this.state.color} placeholder="Color (hex)" onChange={this.changeColor} /></div>
        <div>
          <button onClick={this.save}>save</button>
          <button onClick={this.cancel}>cancel</button>
        </div>
      </div>
    );
  }
})


/*
Renders a table cell with a background color dependent on the given value.
*/
var MemberDayCell = React.createClass({

  propTypes: {
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      acronym: React.PropTypes.string.isRequired
    }),
    index: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    changePresence: React.PropTypes.func.isRequired
  },

  update: function() {
    this.props.changePresence(this.props.member.id, this.props.index);
  },
  render: function() {
    var style = {backgroundColor: "lightgreen"}
    if(this.props.value == 0.5) {
      style.backgroundColor = "lightyellow";
    } else if (this.props.value == 0) {
      style.backgroundColor = "lightpink";
    }

    return(
      (<td onClick={this.update} style={style}>{this.props.value}</td>)
    )
  }
});


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
    storyId: React.PropTypes.string.isRequired,

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


var StoryTable = React.createClass({

  propTypes: {
    sprintDays: React.PropTypes.array.isRequired,
    stories: React.PropTypes.array.isRequired,
    assigneeMap: React.PropTypes.shape().isRequired,
    addAssignee: React.PropTypes.func.isRequired,
    removeAssignee: React.PropTypes.func.isRequired,
    getMember: React.PropTypes.func.isRequired,
    deleteStory: React.PropTypes.func.isRequired,
    saveStory: React.PropTypes.func.isRequired,
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


/*
 */
var MemberTable = React.createClass({

  propTypes: {
    sprintDays: React.PropTypes.array.isRequired,
    members: React.PropTypes.array.isRequired,
    memberDays: React.PropTypes.shape().isRequired,
    deleteMember: React.PropTypes.func.isRequired,
    editMember: React.PropTypes.func.isRequired,
    drag: React.PropTypes.func.isRequired,
    changePresence: React.PropTypes.func.isRequired
  },

  render: function() {

    var self = this;

    var sprintDays = self.props.sprintDays.map(function(day){
      return (<th>{day}</th>)
    });

    var memberList = self.props.members.map(function(member){

      var rowTotal = 0;
      var days = self.props.memberDays[member.id].map(function(value, index) {
        rowTotal += value;
        return <MemberDayCell changePresence={self.props.changePresence} member={member} index={index} value={value} />;
      });

      return (
        <tr>
          <td className="firstColumn">
            <MemberNameWidget member={member} deleteMember={self.props.deleteMember} drag={self.props.drag} editMember={self.props.editMember} />
          </td>
          {days}
          <td>
          {rowTotal}
          </td>
        </tr>
      );
    });

    return(
      <table>
        <thead>
          <tr>
            <th className="firstColumn" ></th>
              {sprintDays}
          </tr>
        </thead>
        <tbody>
            {memberList}
        </tbody>
      </table>
    )
  }
})


var WorkloadWidget = React.createClass({

  propTypes: {
    members: React.PropTypes.array.isRequired,
    assigneeMap: React.PropTypes.shape().isRequired,
    memberDays: React.PropTypes.shape().isRequired,

  },

  getWorkload: function() {
    var self = this;
    var m = {};
    this.props.members.forEach(function(member) {
      m[member.id] = {count: 0};
    });

    Object.keys(self.props.assigneeMap).forEach(function(story) {
      self.props.assigneeMap[story].forEach(function(day){
        day.forEach(function(member) {
          m[member.id].count += 1;
        });
      });
    });

    return m;
  },


  render: function() {
    var self = this;
    var workload = self.getWorkload();
    var manDays = 0
    var workloadTotal = 0;
    var workloadTable = self.props.members.map(function(member){

      var rowTotal = 0;
      var memberWorkload = workload[member.id].count;
      self.props.memberDays[member.id].map(function(value) {
        rowTotal += value;
      });

      workloadTotal += memberWorkload;
      var workloadRounded = (100*memberWorkload/rowTotal).toFixed(0)

      manDays += rowTotal;

      return <ConsumptionRow name={member.name} color={member.color} progress={workloadRounded} />
    });

    var totalWorkloadRounded = (100 * workloadTotal / manDays).toFixed(0);
    workloadTable.push(<ConsumptionRow name={"Total"} color={"lightgrey"} progress={totalWorkloadRounded} />)


    return (
      <div>
        {workloadTable}
      </div>
    );
  }
})


/*
*/
var sprintDays = ["Wed","Thu","Fri","Mon","Tue","Wed","Thu","Fri"]
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
    console.log(initState)
    return initState;
  },

  componentDidUpdate: function() {
    this.saveStateToLocalStorage();
  },

  getStateFromLocalStorage: function() {
    var data = JSON.parse(localStorage.getItem("sprintPlanner"));
    console.log(data);
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


        <h2>Who is doing what?</h2>
        <StoryTable
          sprintDays={this.state.sprintDays}
          assigneeMap={this.state.assigneeMap}
          stories={this.state.stories}
          saveStory={this.saveStory}
          deleteStory={this.deleteStory}
          addAssignee={this.addAssignee}
          removeAssignee={this.removeAssignee}
          getMember={this.getMember}
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


React.render(<SprintTable />, document.getElementById('sprintTable'));
