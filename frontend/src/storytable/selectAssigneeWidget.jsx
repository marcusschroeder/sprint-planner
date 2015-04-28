/*

 */
var SelectAssigneeWidget = React.createClass({

  propTypes: {
    saveAssignees: React.PropTypes.func.isRequired,
    members: React.PropTypes.array.isRequired,
    assignees: React.PropTypes.array.isRequired,
    clientX: React.PropTypes.number.isRequired,
    clientY: React.PropTypes.number.isRequired

  },

  change: function(event) {
    var options = event.target.options;
    var values = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    this.props.saveAssignees(values);
  },

  close: function() {
    React.unmountComponentAtNode(document.getElementById("modal"));
  },

  render: function() {
    var positionStyle = {top: this.props.clientY, left: this.props.clientX}
    var options = this.props.members.map(function (member) {
      var selected = this.props.assignees.some(function(assignee) {
        return member.id == assignee.id;
      });

      if(selected) {
        return <option value={member.id} selected>{member.name}</option>
      } else {
        return <option value={member.id} >{member.name}</option>
      }
    }, this);

    return (
      <div  className="modalWrapper assignees" style={positionStyle}>
        <select ref="selectBox" multiple={true} onChange={this.change} size={this.props.members.length}>
          {options}
        </select>
        <div>
          <button onClick={this.close}>close</button>
        </div>
      </div>
    );
  }
})