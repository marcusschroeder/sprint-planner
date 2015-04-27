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
