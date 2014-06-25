$(document).ready(function(){
  var ctx = document.getElementById('refrigeration').getContext('2d');
  ctx.font = '48pt Bank Gothic';
  ctx.fillStyle = '#099';
  ctx.textAlign = 'center';
  ctx.fillText('32.5\u2109', 200, 100);
  ctx.fillText('12.1\u2109', 600, 100);
  var reefer = getReeferLine('refrigeration',
    [33, 34, 33, 35, 33, 32, 33, 33, 34, 35, 33, 38, 40, 40, 38, 37, 36, 35, 33, 32]);
  reefer.draw();

  var freezer = getFreezerLine('refrigeration',
    [15, 17, 12, 14, 14, 16, 15, 13, 18, 17, 14, 13, 11, 14, 15, 15, 17, 16, 12, 12]);
  freezer.draw();
});


var freezerLine = null,
    reeferLine  = null;

function getFreezerLine(id, data) {
  if(freezerLine == null) {
    freezerLine = new RGraph.Line(id, data)
      .set('background.grid.boarder', false)
      .set('background.grid.color', '#222')
      .set('background.grid.hlines', true)
      .set('background.grid.vlines', true)
      .set('colors', ['#099'])
      .set('filled', true)
      .set('fillstyle', 'Gradient(rgba(0,0,0,0):#099)')
      .set('gutter.left', 440)
      .set('gutter.right', 15)
      .set('gutter.top', 200)
      .set('spline', true)
      .set('text.color', '#099')
      .set('text.font', 'Bank Gothic')
      .set('title', 'Freezer')
      .set('title.color', '#099')
      .set('title.xaxis', 'Last 12h')
      .set('title.xaxis.pos', .5)
      .set('units.post', '\u2109')
      .set('xticks', 25)
      .set('ymax', 30)
      .set('ymin', 10);
  }

  var min = Math.min.apply(null, data);
  min = Math.floor(min / 10) * 10;
  var max = Math.max.apply(null, data);
  max = Math.ceil(max / 10) * 10;
  freezerLine.set('ymax', max).set('ymin', min);

  return freezerLine;
}

function getReeferLine(id, data) {
  if(reeferLine == null) {
    reeferLine = new RGraph.Line(id, data)
      .set('background.grid.boarder', false)
      .set('background.grid.color', '#222')
      .set('background.grid.hlines', true)
      .set('background.grid.vlines', true)
      .set('colors', ['#099'])
      .set('filled', true)
      .set('fillstyle', 'Gradient(rgba(0,0,0,0):#099)')
      .set('gutter.left', 45)
      .set('gutter.right', 410)
      .set('gutter.top', 200)
      .set('spline', true)
      .set('text.color', '#099')
      .set('text.font', 'Bank Gothic')
      .set('title', 'Refrigerator')
      .set('title.color', '#099')
      .set('title.xaxis', 'Last 12h')
      .set('title.xaxis.pos', .5)
      .set('units.post', '\u2109')
      .set('xticks', 25)
      .set('ymax', 50);
  }

  var min = Math.min.apply(null, data);
  min = Math.floor(min / 10) * 10;
  var max = Math.max.apply(null, data);
  max = Math.ceil(max / 10) * 10;
  reeferLine.set('ymax', max).set('ymin', min);

  return reeferLine;
}

