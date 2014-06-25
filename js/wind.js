$(document).ready(function() {
  var windCanvas = new WindGauge({
    renderTo: 'wind',
      font: {
        text: 'Didact Gothic',
        subtext: 'Mako',
        compass: 'Questrial'
      },
      color: {
        line: '#099',
        text: '#099',
        subtext: '#099',
        background: ['black', 'black']
      }
  });

  var ct  = 0,
      raa = 0,
      ras = 0,
      attempts = 1,
      heading = 95,
      boatspeed = 9.9;

  var d1 = [];
  var d2 = [];
  window.windSpeedGraph = null;
  window.windSpeedLine = null;
  window.windAngleGraph = null;
  window.windAngleLine = null;

  for(var i = 0; i < 600; i++) {
    d1.push(null);
    d2.push(null);
  }

  createWebSocket();

  function getWindSpeedGraph(id, data) {
    if(!window.windSpeedGraph) {
      window.windSpeedGraph = new RGraph.Line(id, data)
        .set('background.grid.border', false)
        .set('background.grid.color', '#222')
        .set('background.grid.hlines', true)
        .set('background.grid.vlines', true)
        .set('colors', ['#099'])
        .set('filled', true)
        .set('fillstyle', 'Gradient(rgba(0,0,0,0):#099)')
        .set('gutter.bottom', 30)
        .set('gutter.left', 100)
        .set('gutter.right', 20)
        .set('gutter.top', 30)
        .set('linewidth', 2)
        .set('text.color', '#099')
        .set('text.font', 'Mako')
        .set('title', 'Wind Vector History')
        .set('title.color', '#099')
        .set('title.xaxis', 'Last 60 Seconds')
        .set('title.xaxis.pos', .5)
        .set('xticks', 0)
        .set('ymax', 25);
    }

    return window.windSpeedGraph;
  }

  function getWindAngleGraph(id, data) {
    if(!window.windAngleGraph) {
      window.windAngleGraph = new RGraph.Line(id, data)
        .set('background.grid', false)
        .set('colors', ['red'])
        .set('filled', true)
        .set('fillstyle', 'Gradient(rgba(0,0,0,0):red)')
        .set('gutter.bottom', 30)
        .set('gutter.left', 100)
        .set('gutter.right', 20)
        .set('gutter.top', 30)
        .set('linewidth', 2)
        .set('xticks', 0)
        .set('ylabels', false)
        .set('ymax', 360)
        .set('yticks', 0);
    }

    return window.windAngleGraph;
  }

  function drawAxes(id, max) {
    if(!window.windSpeedAxis) {
      window.windSpeedAxis = new RGraph.Drawing.YAxis(id, 100)
        .set('colors', ['#099'])
        .set('gutter.bottom', 30)
        .set('gutter.top', 30)
        .set('max', 25)
        .set('numticks', 10)
        .set('text.color', '#099')
        .set('text.font', 'Mako')
        .set('title', 'Wind Speed (kts)');
    }

    if(!window.windAngleAxis) {
      window.windAngleAxis = new RGraph.Drawing.YAxis(id, 55)
        .set('colors', ['red'])
        .set('gutter.bottom', 30)
        .set('gutter.top', 30)
        .set('max', 360)
        .set('numlabels', 8)
        .set('numticks',  16)
        .set('text.font', 'Mako')
        .set('title', 'Wind Angle (deg)');
    }

    window.windSpeedAxis.set('max', max);

    window.windSpeedAxis.draw();
    window.windAngleAxis.draw();
  }

  function drawWindHistory(speed, angle) {
    var _RG = RGraph;

    _RG.clear(document.getElementById('wind-history'));

    d1.push(parseFloat(speed));
    d2.push(parseFloat(angle));

    if(d1.length > 600) {
      d1 = _RG.array_shift(d1);
    }

    if(d2.length > 600) {
      d2 = _RG.array_shift(d2);
    }

    var max = Math.ceil(Math.max.apply(null, d1));
    max += 5 - (max % 5);

    var graph = getWindSpeedGraph('wind-history', d1);
        graph.original_data[0] = d1;
        graph.set('ymax', max);
        graph.draw();

    var graph2 = getWindAngleGraph('wind-history', d2);
        graph2.original_data[0] = d2;
        graph2.draw();

    drawAxes('wind-history', max);
  }

  function createWebSocket () {
    var conn = new WebSocket("ws://pyxis.openseasproject.org/ws/v1/data");

    conn.onmessage = function(evt) {
      var d;
      try {
        d = $.parseJSON(evt.data);
      } catch(err) {
        console.log('Malformed JSON: ' + evt.data);
      }
      if(d && d.Header.Pgn == 130306) {
        ct++;
        raa = parseFloat(Math.round(d.Data[2] * 10) / 10).toFixed(1);
        ras = parseFloat(Math.round(d.Data[1] * 100) / 10).toFixed(1);
        heading = getRandomWalk(90, 100, heading, 3);
        boatspeed = getRandomWalk(90, 135, boatspeed, 10);
        var bs = parseFloat(Math.round(boatspeed * 10) / 100).toFixed(1);
        if(ct % 5 == 0) {
          windCanvas.draw(bs, 12.2, heading, 98, raa, 118.3, ras, -38.3);
        }
        drawWindHistory(ras, raa);
      }
    }

    conn.onopen = function () {
      // reset the tries back to 1 since we have a new connection opened
      attempts = 1;
    }

    conn.onclose = function () {
      var time = generateInterval(attempts);

      setTimeout(function () {
        // We've tried to reconnect so increment the attempts by 1
        attempts++;

        // Connection has closed so try to reconnect
        createWebSocket();
      }, time);
    }
  }

  function generateInterval (k) {
    var maxInterval = (Math.pow(2, k) - 1) * 1000;

    // If the generated interval is more than 30 seconds, truncate it down to 30
    // seconds.
    if (maxInterval > 30*1000) {
      maxInterval = 30*1000;
    }

    // generate the interval to a random number between 0 and the maxInterval
    // determined from above
    return Math.random() * maxInterval;
  }

});

function getRandomWalk(min, max, last, delta) {
  var x = getRandomInt(0, delta);
  var d = getRandomInt(0, 1);

  if(d == 1 && last + x < max || last - x < min) {
    return last + x;
  } else if(d == 0 && last - x > min || last + x > max) {
    return last - x;
  } else {
    return last;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

