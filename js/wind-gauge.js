function WindGauge(config) {

  this.config = {
    renderTo: null,
    font: {
      text:    'Century Gothic',
      subtext: 'Century Gothic',
      compass: 'Century Gothic'
    },
    color:  {
      text:    '#099',
      subtext: '#888',
      line:    '#006363',
      shadow:  '#1d7373',
      background: ['#022f2c', '#479791']
    }
  }

  // From canv-gauge
  function applyRecursive( dst, src) {
    for (var i in src) {
      // modification by Chris Poile, Oct 08, 2012. More correct check of an Array instance
      if (typeof src[i] == "object" && !(Object.prototype.toString.call( src[i]) === '[object Array]') && i != 'renderTo') {
        if (typeof dst[i] != "object") {
          dst[i] = {};
        }

        applyRecursive( dst[i], src[i]);
      } else {
        dst[i] = src[i];
      }
    }
  };

  applyRecursive(this.config, config);

  var config = this.config;
  var canvas = document.getElementById(config.renderTo);
  var ctx = canvas.getContext('2d');

  this.draw = function(boatSpeed, targetBoatSpeed, heading, targetHeading, apparentWindAngle, targetApparentWindAngle, apparentWindSpeed, trueWindAngle) {
    drawBackground();

    var boxHeight = canvas.height / 3;
    var boxWidth  = 0.35 * canvas.width;
    var mBoxWidth = 0.30 * canvas.width;
    var boxLeft   = 0.65 * canvas.width;
    var mBoxLeft  = 0.70 * canvas.width;

    drawDataBox(boxLeft, 0, 0.35 * canvas.width, boxHeight, boatSpeed, targetBoatSpeed, 'KTS', 'BSPD');
    drawDataBox(mBoxLeft, canvas.height / 3, mBoxWidth, boxHeight, apparentWindAngle, targetApparentWindAngle, '\u00B0', 'AWA');
    drawDataBox(boxLeft, 2 * canvas.height / 3, boxWidth, boxHeight, apparentWindSpeed, undefined, 'KTS', 'AWS');
    drawCircle(heading, targetHeading, trueWindAngle, apparentWindAngle);
  }

  function drawBackground() {
    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, config.color.background[0]);
    grd.addColorStop(1, config.color.background[1]);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 4;
    ctx.strokeStyle = config.color.line;

    ctx.beginPath();
    ctx.moveTo(0.6 * canvas.width, 0 * canvas.height / 3);
    ctx.lineTo(0.7 * canvas.width, 1 * canvas.height / 3);
    ctx.lineTo(0.7 * canvas.width, 2 * canvas.height / 3);
    ctx.lineTo(0.6 * canvas.width, 3 * canvas.height / 3);
    ctx.moveTo(0.7 * canvas.width, 1 * canvas.height / 3);
    ctx.lineTo(1.0 * canvas.width, 1 * canvas.height / 3);
    ctx.moveTo(0.7 * canvas.width, 2 * canvas.height / 3);
    ctx.lineTo(1.0 * canvas.width, 2 * canvas.height / 3);
    ctx.stroke();
  }

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} radius The corner radius. Defaults to 5;
   * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
   * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
   */
  function roundRect(x, y, width, height, radius, fill, stroke)
  {
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }
  }

  function drawDataBox(x, y, w, h, val, tgt, units, measure)
  {
    //TODO: These need to scale for different size screens
    var valSize = 75;
    var subSize = 24;
    var padding = 20;

    ctx.save();

    ctx.font = 'normal ' + subSize + 'px ' + config.font.subtext;
    ctx.fillStyle = config.color.subtext;

    ctx.textAlign = 'center';
    var start = (h - measure.length * subSize) / 2;
    for(var i = 0; i < measure.length; i++) {
      ctx.fillText(measure[i], x + w - padding, y + start + ((i + 1) * subSize));
    }

    ctx.textAlign = 'right';
    var w1 = ctx.measureText(units).width;
    ctx.fillText(units, x + w - 2 * padding, y + padding + subSize);

    if(tgt != undefined) {
      var w2 = ctx.measureText(tgt).width;
      var tgtBase = y + h - padding / 2;

      ctx.fillText(tgt, x + w - 2 * padding, tgtBase);
      ctx.fillText('Target:', x + w - w2 - 25 - 2* padding, tgtBase);

      if(tgt > val) {
        triangle(x + w - w2 - 20 - 2 * padding, tgtBase, 18, 18, 'up');
      } else if(tgt < val) {
        triangle(x + w - w2 - 20 - 2 * padding, tgtBase, 18, 18, 'dn');
      }
    }

    ctx.font = 'normal ' + valSize + 'px ' + config.font.text;

    ctx.fillStyle = config.color.text;
    ctx.fillText(val, x + w - w1 - 2 * padding, y + padding + valSize);

    ctx.restore();
  }

  function triangle(x, y, w, h, dir)
  {
    //var color = '#6C071E'; // something red
    var color = config.color.line;
//    if(dir === 'up') {
//      color = '#03451C'; // something green
//    }

    ctx.lineWidth = 1;
    ctx.lineJoin = 'miter';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    var tx, ty, rx;
    tx = x + w / 2;

    if(dir === 'up') {
      ty = y - h;
    } else {
      ty = y;
      y -= h;
    }

    rx = x + w;

    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(x, y);
    ctx.lineTo(rx, y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fill();
  }

  function drawBoat(ox, oy, radius) {
    ctx.beginPath();
    ctx.arc(ox, oy, 6, 0, 2 * Math.PI, false);
    ctx.fillStyle = config.color.line;
    ctx.fill();

    // calculated from: r = 190
    var starty = radius / 1.52; // 125
    var cpx = radius / 2.5333;  // 70
    var cpy = radius / 9.5;     // 20
    var endx = radius / 6.3333; // 30
    var endy = radius / 1.52;   // 125

    ctx.beginPath();
    ctx.moveTo(ox, oy - radius);
    ctx.lineTo(ox, oy - starty);
    ctx.quadraticCurveTo(ox - cpx, oy - cpy, ox - endx, oy + endy);
    ctx.moveTo(ox, oy - starty);
    ctx.quadraticCurveTo(ox + cpx, oy - cpy, ox + endx, oy + endy);
    ctx.lineTo(ox - endx, oy + endy);
    ctx.strokeStyle = config.color.line;
    ctx.stroke();
  }

  function drawCircle(heading, targetHeading, trueWindAngle, apparentWindAngle) {
    var originX, originY;

    originY = canvas.height / 2;

    originX = canvas.width / 3;

    var radius = Math.min(originX, originY) - 35;

    drawBoat(originX, originY, radius);

    ctx.beginPath();
    ctx.arc(originX, originY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = config.color.line;
    ctx.stroke();

    for(var i = 0; i < 64; i++) {
      ctx.lineWidth = 1;
      var length = 10;

      if(i % 2 == 0) {
        length = 15;
      }

      if(i % 4 == 0) {
        ctx.lineWidth = 2;
        length = 20;
      }

      if(i % 8 == 0) {
        length = 25;
      }

      if(i % 16 == 0) {
        length = 30;
      }

      var tickAngle = i * Math.PI / 32;
      var rHeading = heading * Math.PI / 180;
      tickAngle -= rHeading;

      var fromX = originX - (Math.cos(tickAngle) * radius);
      var fromY = originY - (Math.sin(tickAngle) * radius);

      var toX = originX - (Math.cos(tickAngle) * (radius - length));
      var toY = originY - (Math.sin(tickAngle) * (radius - length));

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    }

    ctx.font = 'normal 20pt ' + config.font.compass;
    ctx.textAlign = 'center';
    ctx.fillStyle = config.color.text;
    ctx.fillText(heading, originX, originY + 90);
    drawTextAlongArc('N', originX, originY, radius, -rHeading);
    drawTextAlongArc('E', originX, originY, radius, -rHeading + Math.PI / 2);
    drawTextAlongArc('S', originX, originY, radius, -rHeading + Math.PI);
    drawTextAlongArc('W', originX, originY, radius, -rHeading + 3 * Math.PI / 2);

    drawWindicator(originX, originY, radius, trueWindAngle * Math.PI / 180);
    drawWindicator(originX, originY, radius, apparentWindAngle * Math.PI / 180);
    drawWindicator(originX, originY, radius, targetHeading * Math.PI / 180);
  }

  function drawTextAlongArc(str, centerX, centerY, radius, angle) {
    var len = str.length, s;
    ctx.save();
    ctx.translate(centerX, centerY);

    for(var n = 0; n < len; n++) {
      ctx.rotate(angle / len);
      ctx.save();
      ctx.translate(0, -1 * (radius + 5));
      s = str[n];
      ctx.fillText(s, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawWindicator(oX, oY, radius, angle) {
    ctx.save();
    ctx.translate(oX, oY);
    ctx.rotate(angle);
    ctx.translate(0, -1 * radius);
    triangle(0, 0, 18, 18, 'dn');
    ctx.restore();
  }

}

