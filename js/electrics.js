$(document).ready(function() {
  var h_title = new SegmentDisplay("h-title");
  h_title.pattern         = "###############";
  h_title.h_displayAngle  = 9;
  h_title.digitHeight     = 12;
  h_title.digitWidth      = 8;
  h_title.digitDistance   = 2;
  h_title.segmentWidth    = 1.25;
  h_title.segmentDistance = 0.5;
  h_title.segmentCount    = 14;
  h_title.cornerType      = 0;
  h_title.colorOn         = "rgb(255,44,15)";
  h_title.colorOff        = "rgb(50,12,5)";
  h_title.draw();

  var h_display = new SegmentDisplay("h-display");
  h_display.pattern         = "##.##";
  h_display.h_displayAngle  = 9;
  h_display.digitHeight     = 21;
  h_display.digitWidth      = 14;
  h_display.digitDistance   = 4;
  h_display.segmentWidth    = 2.25;
  h_display.segmentDistance = 1;
  h_display.segmentCount    = 7;
  h_display.cornerType      = 0;
  h_display.colorOn         = "rgb(255,44,15)";
  h_display.colorOff        = "rgb(50,12,5)";
  h_display.draw();

  var e_title = new SegmentDisplay("e-title");
  e_title.pattern         = "################";
  e_title.h_displayAngle  = 9;
  e_title.digitHeight     = 12;
  e_title.digitWidth      = 8;
  e_title.digitDistance   = 2;
  e_title.segmentWidth    = 1.25;
  e_title.segmentDistance = 0.5;
  e_title.segmentCount    = 14;
  e_title.cornerType      = 0;
  e_title.colorOn         = "rgb(255,44,15)";
  e_title.colorOff        = "rgb(50,12,5)";
  e_title.draw();

  var e_display = new SegmentDisplay("e-display");
  e_display.pattern         = "##.##";
  e_display.e_displayAngle  = 9;
  e_display.digitHeight     = 21;
  e_display.digitWidth      = 14;
  e_display.digitDistance   = 4;
  e_display.segmentWidth    = 2.25;
  e_display.segmentDistance = 1;
  e_display.segmentCount    = 7;
  e_display.cornerType      = 0;
  e_display.colorOn         = "rgb(255,44,15)";
  e_display.colorOff        = "rgb(50,12,5)";
  e_display.draw();

  var ha_title = new SegmentDisplay("ha-title");
  ha_title.pattern         = "###############";
  ha_title.h_displayAngle  = 9;
  ha_title.digitHeight     = 12;
  ha_title.digitWidth      = 8;
  ha_title.digitDistance   = 2;
  ha_title.segmentWidth    = 1.25;
  ha_title.segmentDistance = 0.5;
  ha_title.segmentCount    = 14;
  ha_title.cornerType      = 0;
  ha_title.colorOn         = "rgb(255,44,15)";
  ha_title.colorOff        = "rgb(50,12,5)";
  ha_title.draw();

  var ha_display = new SegmentDisplay("ha-display");
  ha_display.pattern         = "##.##";
  ha_display.ha_displayAngle  = 9;
  ha_display.digitHeight     = 21;
  ha_display.digitWidth      = 14;
  ha_display.digitDistance   = 4;
  ha_display.segmentWidth    = 2.25;
  ha_display.segmentDistance = 1;
  ha_display.segmentCount    = 7;
  ha_display.cornerType      = 0;
  ha_display.colorOn         = "rgb(255,44,15)";
  ha_display.colorOff        = "rgb(50,12,5)";
  ha_display.draw();

  var ea_title = new SegmentDisplay("ea-title");
  ea_title.pattern         = "################";
  ea_title.h_displayAngle  = 9;
  ea_title.digitHeight     = 12;
  ea_title.digitWidth      = 8;
  ea_title.digitDistance   = 2;
  ea_title.segmentWidth    = 1.25;
  ea_title.segmentDistance = 0.5;
  ea_title.segmentCount    = 14;
  ea_title.cornerType      = 0;
  ea_title.colorOn         = "rgb(255,44,15)";
  ea_title.colorOff        = "rgb(50,12,5)";
  ea_title.draw();

  var ea_display = new SegmentDisplay("ea-display");
  ea_display.pattern         = "##.##";
  ea_display.e_displayAngle  = 9;
  ea_display.digitHeight     = 21;
  ea_display.digitWidth      = 14;
  ea_display.digitDistance   = 4;
  ea_display.segmentWidth    = 2.25;
  ea_display.segmentDistance = 1;
  ea_display.segmentCount    = 7;
  ea_display.cornerType      = 0;
  ea_display.colorOn         = "rgb(255,44,15)";
  ea_display.colorOff        = "rgb(50,12,5)";
  ea_display.draw();

  h_title.setValue("House Battery V");
  e_title.setValue("Engine Battery V");
  ha_title.setValue("House Battery A");
  ea_title.setValue("Engine Battery A");

  animate(h_display);
  animate(e_display);
  animate(ha_display);
  animate(ea_display);

});

function animate(display) {
  var value = (14 - Math.round(Math.random() * 1000) / 100).toFixed(2);
  var d = value.toString();
  if(d.length < 5)
    d = ' ' + d;
  display.setValue(d);

  window.setTimeout(function(){animate(display)}, 500);
}

