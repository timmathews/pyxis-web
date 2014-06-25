$(document).ready(function(){

  var theme = {
    plate      : '#333',
    majorTicks : '#f5f5f5',
    minorTicks : '#ddd',
    title      : '#fff',
    units      : '#ccc',
    numbers    : '#eee',
    needle     : { start : 'rgba(240, 128, 128, 1)', end : 'rgba(255, 160, 122, .9)' }
  };

  var danger = 'rgba(255, 30, 0, 0.25)';
  var warn   = 'rgba(255, 255, 0, 0.25)';
  var good   = 'rgba(0, 255, 0, 0.25)';

  window.gauge1 = new Gauge({
    renderTo  : 'gauge-1',
    minValue    : 0,
    maxValue    : 4000,
    height      : 295,
    width       : 295,
    majorTicks  : ['0','1000','2000','3000','4000'],
    minorTicks  : 5,
    strokeTicks : true,
    title: 'RPM',
    highlights  : [
      { from : 3000, to : 3500, color : warn },
      { from : 3500, to : 4000, color : danger }
    ],
    colors : theme
  });

  gauge1.draw();

  var gauge2 = new Gauge({
    renderTo  : 'gauge-2',
    height      : 145,
    width       : 145,
    minValue    : 0,
    maxValue    : 800,
    majorTicks  : ['0','100','200','300','400','500','600','700','800'],
    minorTicks  : 4,
    strokeTicks : true,
    title: 'Exhaust ºC',
    highlights  : [
      { from : 0,   to : 400, color : good },
      { from : 400, to : 650, color : warn },
      { from : 650, to : 800, color : danger }
    ],
    colors      : theme
  });

  gauge2.draw();

  var gauge3 = new Gauge({
    renderTo  : 'gauge-3',
    height      : 145,
    width       : 145,
    minValue    : 50,
    maxValue    : 150,
    majorTicks  : ['50','75','100','125','150'],
    minorTicks  : 4,
    strokeTicks : true,
    title: 'Engine ºC',
    highlights  : [
      { from :  75, to : 105, color : good },
      { from : 105, to : 110, color : warn },
      { from : 110, to : 150, color : danger }
    ],
    colors      : theme
  });

  gauge3.draw();

  var gauge4 = new Gauge({
    renderTo  : 'gauge-4',
    height      : 145,
    width       : 145,
    minValue    : 8,
    maxValue    : 16,
    majorTicks  : ['8','10','12','14','16'],
    minorTicks  : 2,
    strokeTicks : true,
    title: 'Volts',
    highlights  : [
      { from : 8,  to : 11, color : danger },
      { from : 11, to : 12, color : warn },
      { from : 12, to : 15, color : good },
      { from : 15, to : 16, color : danger }
    ],
    colors      : theme
  });

  gauge4.draw();

  var gauge5 = new Gauge({
    renderTo  : 'gauge-5',
    height      : 145,
    width       : 145,
    minValue    : 0,
    maxValue    : 5,
    majorTicks  : ['0','1','2','3','4','5'],
    minorTicks  : 4,
    strokeTicks : true,
    title: 'Oil Pressure',
    highlights  : [
      { from : 0,   to : 0.333, color : 'rgba(255, 30,  0, .25)' },
      { from : 0.333, to : 0.666, color : 'rgba(255, 255, 0, .25)' },
      { from : 0.666,   to : 3.5, color : 'rgba(0,   255, 0, .25)' },
      { from : 3.5, to : 4.25, color : 'rgba(255, 255, 0, .25)' },
      { from : 4.25, to : 5, color : 'rgba(255, 30,  0, .25)' }
    ],
    colors      : theme
  });

  gauge5.draw();

  var gauge6 = new Gauge({
    renderTo  : 'gauge-6',
    height      : 145,
    width       : 145,
    minValue    : 0,
    maxValue    : 160,
    majorTicks  : ['50','80','110','130','160'],
    minorTicks  : 4,
    strokeTicks : true,
    title: 'Oil ºC',
    highlights  : [
      { from : 110, to : 120, color : 'rgba(255, 255, 0, .25)' },
      { from : 120, to : 160, color : 'rgba(255, 30,  0, .25)' }
    ],
    colors      : theme
  });

  gauge6.draw();

  function fuelFlow() {
    //Get Current Time
    var v = Math.random() * 2 + 4;
    var i = v.toString().split('.')[0];
    var d = v.toString().split('.')[1];
    str = i + '.' + d.substr(0, 2);

    //Get the Context 2D or 3D
    context = document.getElementById('gauge-7').getContext("2d");
    context.canvas.width = context.canvas.width;
    var w = context.canvas.width / 2;
    context.textAlign = 'center';
    context.font = "30px Arial";
    context.fillText(str, w, 25);
    context.save();
    context.font = "10px Arial";
    context.fillText('Fuel Rate (l/h)', w, 40);
  }

  setInterval(fuelFlow, 1000);

  var gauge8 = new FuelGauge({
    renderTo : 'gauge-8'
  });

  var connControl = new WebSocket("ws://pyxis.openseasproject.org/ws/v1/control");

  var config = {
    "version": "1.0",
    "name": "Pyxis Web Development",
    "data_format": "json",
    "data": [
      "rpm",
      "exhaust-temp",
      "engine-temp",
      "voltage",
      "oil-pressure",
      "oil-temp",
      "fuel-rate",
      "fuel-level"
    ]
  };

  connControl.onconnect = function() {
    connControl.send(config);
  };

  var connData = new WebSocket("ws://pyxis.openseasproject.org/ws/v1/data");

  connData.onmessage = function(e) {
    var data = $.parseJSON(e.data);

    if(data.header != undefined) {
      console.log(data.header);
      return;
    }

//    data = data.data;

//    console.log(data);

//    gauge1.setValue(Number(data['rpm']));
//    gauge2.setValue(Number(data['exhaust-temp']));
//    gauge3.setValue(Number(data['engine-temp']));
//    gauge4.setValue(Number(data['voltage']));
//    gauge5.setValue(Number(data['oil-pressure']));
//    gauge6.setValue(Number(data['oil-temp']));
//    gauge7.setValue(Number(data['fuel-rate']));
//    gauge8.setValue(Number(data['fuel-level']));
    gauge8.setValue(75);
  };

});

