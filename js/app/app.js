
$.jCanvas.defaults.fromCenter = false;
$.jCanvas.defaults.layer = true;

var indexRect = 0;

//////////////////////////////////////////////////////////////////////////
// MouseUpDown Object
//////////////////////////////////////////////////////////////////////////
var MouseUpDown = function() {
    this.mousePressed = false;
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
        fromX = x;
        fromY = y;
    }
    function drawOff(toX, toY) {
        // デフォルトもしくはマウスが離れた時の描画処理
        var rect = new Rect(fromX, fromY, toX - fromX, toY - fromY, "rect" + indexRect);
        rect.draw(meObj);
        ++indexRect;
    }
    $('canvas').on('mousedown', onMouseDown);
    $('canvas').on('mouseup', onMouseUp);
}
MouseUpDown.prototype.setPressed = function() {
    this.mousePressed = true;
}
MouseUpDown.prototype.setReleased = function() {
    this.mousePressed = false;
}
MouseUpDown.prototype.isPressed = function() {
    return this.mousePressed;
}
var m_up_down = new MouseUpDown();

//////////////////////////////////////////////////////////////////////////
// Rect Object
//////////////////////////////////////////////////////////////////////////
var Rect = function (xPos, yPos, wid, hei, name) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.w = wid;
    this.h = hei;
    this.rectName = name;
    this.taskName = "";
}
function drawCorner(xC, yC, name) {
    var size = 6;
    var layerName = name.replace(/(TL|TR|LL|LR)/g, "");
    $("canvas").drawRect({
        strokeStyle: "black",
        strokeWidth: 0.5,
        x: xC - (size/2),
        y: yC - (size/2),
        width: size,
        height: size,
        align: 'left',
        draggable: true,
        name: name,
        groups: [layerName + "Layer"],
        dragGroups: [layerName + "Layer"]
    });
}
function clearCorner(name) {
    $("canvas").removeLayer(name + "TL");
    $("canvas").removeLayer(name + "TR");
    $("canvas").removeLayer(name + "LL");
    $("canvas").removeLayer(name + "LR");
}
Rect.prototype.draw = function(mouseUpDown) {
    if (mouseUpDown.isPressed() == true) {
        mouseUpDown.setReleased();
        return;
    }
    $("canvas").drawRect({
          strokeStyle: "black",
          strokeWidth: 1,
          x: this.xPos,
          y: this.yPos,
          width: this.w,
          height: this.h,
          align: 'left',
          draggable: true,
          groups: [this.rectName + "Layer"],
          dragGroups: [this.rectName + "Layer"],
          drag: function(layer) {
              mouseUpDown.setPressed();
          },
          dblclick: function(layer) {
              showInputDialog(layer.name, mouseUpDown);
          },
          click: function(layer) {
              drawCorner(layer.x              , layer.y               , layer.name + "TL");
              drawCorner(layer.x + layer.width, layer.y               , layer.name + "TR");
              drawCorner(layer.x              , layer.y + layer.height, layer.name + "LL");
              drawCorner(layer.x + layer.width, layer.y + layer.height, layer.name + "LR");
          },
          name: this.rectName
      });
};

//////////////////////////////////////////////////////////////////////////
// Text Object
//////////////////////////////////////////////////////////////////////////
var Text = function (text, x, y, name, layerName) {
    this.xPos = x;
    this.yPos = y;
    this.textStr = text;
    this.textName = name;
    this.layerName = layerName;
    this.fontSize = 14;
}
Text.prototype.write = function(mouseUpDown) {
    $("canvas").drawText({
        fillStyle: "black",
        strokeStyle: "black",
        strokeWidth: "0.5",
        x: this.xPos,
        y: this.yPos,
        fontSize: this.fontSize,
        fontFamily: "sans-serif",
        text: this.textStr,
        name: this.textName,
        draggable: true,
        groups: [this.layerName + "Layer"],
        dragGroups: [this.layerName + "Layer"],
        drag: function(layer) {
            mouseUpDown.setPressed();
        },
        dblclick: function(layer) {
            showInputDialog(layer.name, mouseUpDown);
        },
    });
}

//////////////////////////////////////////////////////////////////////////
// Line Object
//////////////////////////////////////////////////////////////////////////
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
        dragGroups: [this.lineName + "Layer"]
    });
}

//////////////////////////////////////////////////////////////////////////
// Dialog
//////////////////////////////////////////////////////////////////////////
function showInputDialog(layerName, mouseUpDown) {
    // ダイアログのメッセージを設定
    $("#show_dialog").html(
          '<p>' + "タスク情報入力"
        + '</p><textarea cols="30" rows="3" name="inputtxt" id="inputtxt" '
        + 'value="" />'
    );
    // ダイアログを作成
    $("#show_dialog").dialog({
        modal: true,
        title: "タスク入力",
        buttons: {
            "OK": function() {
                $(this).dialog("close");
                var taskName = $("#inputtxt").val();

                var splitLine = taskName.match(/\n/g);
                var lineNum = 0;
                if (splitLine) {
                    lineNum = splitLine.length + 1;
                } else {
                    lineNum = 1;
                }

                var strWidth = 0;
                var arrayOfStrings = taskName.split("\n");
                for (var i = 0; i < arrayOfStrings.length; i++) {
                    strWidth = Math.max(arrayOfStrings[i].length, strWidth);
                }
                layerName = layerName.replace(/Text/g, "");
                var rect = $("canvas").getLayer(layerName);
                var textObj = $("canvas").getLayer(layerName + "Text");
                var fontSize = 0;
                if (textObj) {
                    textObj.text = taskName;
                    fontSize = Number(textObj.fontSize.replace(/px/g, ""));
                } else {
                    var textObj =
                        new Text(taskName, rect.x + 5, rect.y + 5, layerName + "Text", layerName);
                    textObj.write(mouseUpDown);
                    fontSize = textObj.fontSize;
                }

                rect.width = Math.max(rect.width, strWidth * fontSize);
                rect.height = Math.max(rect.height, lineNum * fontSize);
            },
            "キャンセル": function() {
                $(this).dialog("close");
            }
        }
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
