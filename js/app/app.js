
$.jCanvas.defaults.fromCenter = false;
$.jCanvas.defaults.layer = true;

var MouseUpDown = function() {
    this.isPressed = false;
    var fromX = 0;
    var fromY = 0;
    var index = 0;
    var meObj = this;
    function onMouseDown(e) {
        console.log("onMouseDown");
        drawOn(e.offsetX, e.offsetY);
    }
    function onMouseUp(e) {
        drawOff(e.offsetX, e.offsetY);
    }
    function drawOn(x, y) {
        // マウスが押された時の描画処理
        //$('canvas').clearCanvas();
        fromX = x;
        fromY = y;
    }
    function drawOff(toX, toY) {
        // デフォルトもしくはマウスが離れた時の描画処理
        //$('canvas').clearCanvas(0,0,500,500);
        var rect = new Rect(fromX, fromY, toX - fromX, toY - fromY, "rect" + index);
        rect.draw(meObj);
        ++index;
    }

    $('canvas').on('mousedown', onMouseDown);
    $('canvas').on('mouseup', onMouseUp);
}
MouseUpDown.prototype.setPressed = function() {
    this.isPressed = true;
}
MouseUpDown.prototype.setReleased = function() {
    this.isPressed = false;
}
MouseUpDown.prototype.getPressed = function() {
    return this.isPressed;
}
var m_up_down = new MouseUpDown();

var Rect = function (xPos, yPos, wid, hei, name) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = wid;
    this.h = hei;
    this.rectName = name;
}
Rect.prototype.draw = function(m_up_down) {
    if (m_up_down.getPressed() == true) {
        m_up_down.setReleased();
        return;
    }
    $("canvas").drawRect({
          strokeStyle: "black",
          strokeWidth: 1,
          x: this.xPos,
          y: this.yPos,
          width: this.w,
          height: this.h,
          draggable: true,
          groups: [this.rectName + "Layer"],
          dragGroups: [this.rectName + "Layer"],
          drag: function(layer) {
              console.log("drag");
              m_up_down.setPressed();
          },
          //drag: onDrag,
          //dragstop: onDragStop,
          //dragcancel: onDragCancel,
          name: this.rectName
      });
};

//////////////////////////////////////////////////////////////////////////
var Text = function (text, x, y, name) {
    this.xPos = x;
    this.yPos = y;
    this.text = text;
    this.textName = name;
}
Text.prototype.write = function() {
    $("canvas").drawText({
        fillStyle: "black",
        strokeStyle: "black",
        strokeWidth: "0.5",
        x: x,
        y: y,
        fontSize: 14,
        fontFamily: "sans-serif",
        text: text,
        name: name + "-text",
        groups: [this.textName + "Layer"],
        dragGroups: [this.textName + "Layer"],
        //drag: onDrag,
        //dragstop: onDragStop,
        //dragcancel: onDragCancel
    });
}

var Line = function (x1, y1, x2, y2, name) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.lineName = name;
}
Line.prototype.draw = function() {
    $("canvas").drawLine({
        strokeStyle: "black",
        strokeWidth: 1,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        draggable: true,
        groups: [this.lineName + "Layer"],
        dragGroups: [this.lineName + "Layer"],
        //drag: onDrag,
        //dragstop: onDragStop,
        //dragcancel: onDragCancel
    });
}


/*
var textNames = ["categories", "categories-category_id", "categories-name"];
drawText("categories", 50, 50, textNames[0]);
drawText("category_id", 50, 80, textNames[1]);
drawText("name", 50, 100, textNames[2]);

var borderWidth = 0;
for (var i = 0; i < textNames.length; i++) {
    borderWidth = Math.max(
        borderWidth,
        $("canvas").getLayer(textNames[i] + "-text").width);
}

function drawLink() {
    var border = $("canvas").getLayer("categories-border");
    $("canvas").drawLine({
        strokeStyle: "black",
        strokeWidth: 1,
        x1: border.x + border.width,
        y1: border.y + 50,
        x2: 260,
        y2: 110,
        draggable: false,
        name: "link"
    });
}
drawLink();

function onDrag(layer) {
  $("canvas").removeLayer("link");
  drawLink();
}
function onDragStop(layer) {
  // Do something...
}
function onDragCancel(layer) {
  // Do something...
}
*/
