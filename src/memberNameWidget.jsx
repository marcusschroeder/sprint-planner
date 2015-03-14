/*

 */
var MemberNameWidget = React.createClass({

  propTypes: {
    drag: React.PropTypes.func.isRequired,
    editMember: React.PropTypes.func.isRequired,
    deleteMember: React.PropTypes.func.isRequired,
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired
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