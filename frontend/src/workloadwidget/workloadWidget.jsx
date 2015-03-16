var WorkloadWidget = React.createClass({

  propTypes: {
    members: React.PropTypes.array.isRequired,
    assigneeMap: React.PropTypes.shape().isRequired,
    memberDays: React.PropTypes.shape().isRequired
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