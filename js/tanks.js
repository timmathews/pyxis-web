$(document).ready(function () {
  var t1 = $('#t1').attr('height', 400).height(400);
  var t2 = $('#t2').attr('height', 400).height(400);
  var t3 = $('#t3').attr('height', 400).height(400);
  t1 = new FuelGauge({renderTo: 't1'});
  t2 = new FuelGauge({renderTo: 't2'});
  t3 = new FuelGauge({renderTo: 't3'});
  t1.setValue(25);
  t2.setValue(35);
  t3.setValue(45);
});

