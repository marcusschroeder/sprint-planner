import React from 'react';
/*
 A small modal window to add a new programmer or edit an existing programmer quickly.
 */
let MemberModal = React.createClass({

  propTypes: {
    member: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      color: React.PropTypes.string.isRequired,
      id: React.PropTypes.string.isRequired,
      acronym: React.PropTypes.string.isRequired
    }),
    clientX: React.PropTypes.number.isRequired,
    clientY: React.PropTypes.number.isRequired
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
});

export default MemberModal;
