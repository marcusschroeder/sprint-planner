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