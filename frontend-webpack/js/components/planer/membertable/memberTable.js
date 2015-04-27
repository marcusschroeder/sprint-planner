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

    var sprintDays = this.props.sprintDays.map(function(day){
      return (<th>{day}</th>)
    });

    var memberList = this.props.members.map(function(member){

      var rowTotal = 0;
      var days = this.props.memberDays[member.id].map(function(value, index) {
        rowTotal += value;
        return <MemberDayCell changePresence={this.props.changePresence} member={member} index={index} value={value} />;
      }, this);

      var style = {backgroundColor: member.color};

      return (
        <tr>
          <td className="firstColumn" style={style}>
            <MemberNameWidget member={member} deleteMember={this.props.deleteMember} drag={this.props.drag}
              editMember={this.props.editMember}/>
          </td>
          {days}
          <td style={style}>
          {rowTotal}
          </td>
        </tr>
      );
    }, this);

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