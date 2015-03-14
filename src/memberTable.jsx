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