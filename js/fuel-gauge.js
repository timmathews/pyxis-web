var FuelGauge = function(options) {

  /**
   * Default fuel gauge configuration
   * @struct
   */
  this.options = {
    renderTo  : null,
    title     : false,
    maxValue  : 100,
    minValue  : 0,
    theme     : {
      textColor : '#000',
      tickColor : '#fff',
      boxColor  : '#000',
      backColor : '#333',
      backGradient : {
        good   : 'rgba(0,   255,  0, 0.65)',
        warn   : 'rgba(255, 255,  0, 0.65)',
        danger : 'rgba(255,  30,  0, 0.65)'
      },
      addDepth : true
    }
  };

  /**
   * Copied from https://github.com/Mikhus/canv-gauge
   */
  function applyRecursive(dst, src) {
    for (var i in src) {
      if(typeof src[i] == 'object'
          && !(Object.prototype.toString.call(src[i] === '[object Array]'))
          && i != 'renderTo') {
        if(typeof dst[i] != 'object') {
          dst[i] = {};
        }

        applyRecursive(dst[i], src[i]);
      } else {
        dst[i] = src[i];
      }
    }
  };

  applyRecursive(this.options, options);
  this.options.minValue = parseFloat(this.options.minValue);
  this.options.maxValue = parseFloat(this.options.maxValue);
  options = this.options;

  if(!options.renderTo) {
    throw Error("Canvas element was not specified when creating the FuelGauge object.");
  }

  var
    canvas    = document.getElementById(options.renderTo),
    ctx       = canvas.getContext('2d'),
    value     = 0,
    w         = canvas.width,
    h         = canvas.height
  ;

  var grdColor = ctx.createLinearGradient(0,0,0,h);
  grdColor.addColorStop(0.00, 'green');
  grdColor.addColorStop(0.80, 'yellow');
  grdColor.addColorStop(0.85, 'orange');
  grdColor.addColorStop(1.00, 'red');

  var grdOverlay = ctx.createLinearGradient(0,0,w,0);
  grdOverlay.addColorStop(0.00, 'rgba(255, 255, 255, 0.10)');
  grdOverlay.addColorStop(0.50, 'rgba(255, 255, 255, 0.45)');
  grdOverlay.addColorStop(1.00, 'rgba(255, 255, 255, 0.10)');

  var grdBg = grdColor;
  var grdOv = grdOverlay;

  this.draw = function() {
    // Clear the canvas
    canvas.width = canvas.width;

    var v = (value - 0) / (100 - 0) * 100;
    if(v < 0) v = 0;
    if(v > 100) v = 100;

    var numBars = 25;
    var barVal = 100 / numBars;

    var space = 2;
    var barHeight = h / numBars;

    var wholeBars = Math.floor(v / barVal);
    var partialBar = (v % barVal) * (barHeight / barVal) - space;
    var topOfBars = h - (barHeight * wholeBars + partialBar);
    var x = 0, y = 0;

    if(options.theme.boxColor) {
      ctx.strokeStyle = options.theme.boxColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, w, h);
    }

    if(options.theme.backColor) {
      ctx.fillStyle = options.theme.backColor;
      ctx.fillRect(x, y, w, h);
    }

    ctx.fillStyle = grdBg;
    for(var i = h - space; wholeBars > 0; i -= barHeight, wholeBars--)
      ctx.fillRect(x, i, w, -(barHeight - space));

    if(partialBar > 0)
      ctx.fillRect(x, i, w, -partialBar);

    ctx.fillStyle = grdOv;
    ctx.fillRect(x, y, w, h);

    var fontSize = w * 0.34;
    var fontY = Math.min(topOfBars + fontSize, h - space);

    ctx.font = fontSize + "pt Arial";
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(value, w / 2, fontY);
  };

  /**
   * Sets a new value to gauge and updates the gauge view
   *
   * @param {number} val  - the new value to set for the gauge
   * @return {Gauge} this - returns self
   */
  this.setValue = function(val) {
    value = val;

    this.draw();

    return this;
  };

  /**
   * Returns the current value of the gauge view
   *
   * @return {number} value - current gauge's value
   */
  this.getValue = function() {
    return value;
  };

  var self = this;

  /**
   * Creates onready event
   */
  this.onready = function() { };


  this.onready && this.onready();
}

