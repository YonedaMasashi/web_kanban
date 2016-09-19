
$.jCanvas.defaults.fromCenter = false;
$.jCanvas.defaults.layer = true;

var indexRect = 0;

var MouseUpDown = function() {
    this.isPressed = false;
    var fromX = 0;
    var fromY = 0;
    var meObj = this;
    function onMouseDown(e) {
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
        var rect = new Rect(fromX, fromY, toX - fromX, toY - fromY, "rect" + indexRect);
        rect.draw(meObj);
        ++indexRect;
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
    this.taskName = "";
}
Rect.prototype.draw = function(mouseUpDown) {
    if (mouseUpDown.getPressed() == true) {
        mouseUpDown.setReleased();
        return;
    }
    var showInputDialog = function(layerName) {
        // ダイアログのメッセージを設定
        $("#show_dialog").html('<p>' + "タスク情報入力"
            + '</p><input type="text" name="inputtxt" id="inputtxt" '
            + 'value="" />');
        // ダイアログを作成
        $("#show_dialog").dialog({
            modal: true,
            title: "タスク入力",
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                    var rect = $("canvas").getLayer(layerName);
                    var taskName = $("#inputtxt").val();
                    var cav = $("canvas");
                    var textObj = $("canvas").getLayer(layerName + "Text");
                    if (textObj) {
                        textObj.text = taskName;
                    } else {
                        var textObj =
                            new Text(taskName, rect.x + 5, rect.y + 5, layerName + "Text", layerName);
                        textObj.write();
                    }
                },
                "キャンセル": function() {
                    $(this).dialog("close");
                }
            }
        });
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
              mouseUpDown.setPressed();
          },
          //dragstop: onDragStop,
          //dragcancel: onDragCancel,
          dblclick: function(layer) {
              showInputDialog(layer.name);
          },
          name: this.rectName
      });
};

//////////////////////////////////////////////////////////////////////////
var Text = function (text, x, y, name, layerName) {
    this.xPos = x;
    this.yPos = y;
    this.textStr = text;
    this.textName = name;
    this.layerName = layerName;
}
Text.prototype.write = function() {
    $("canvas").drawText({
        fillStyle: "black",
        strokeStyle: "black",
        strokeWidth: "0.5",
        x: this.xPos,
        y: this.yPos,
        fontSize: 14,
        fontFamily: "sans-serif",
        text: this.textStr,
        name: this.textName,
        draggable: true,
        groups: [this.layerName + "Layer"],
        dragGroups: [this.layerName + "Layer"],
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
