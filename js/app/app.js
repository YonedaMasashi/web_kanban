
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
        console.log("onMouseDown")
        drawOn(e.offsetX, e.offsetY);
    }
    function onMouseUp(e) {
        console.log("onMouseUp")
        drawOff(e.offsetX, e.offsetY);
    }
    function drawOn(x, y) {
        // マウスが押された時の描画処理
        fromX = x;
        fromY = y;
    }
    function drawOff(toX, toY) {
        // デフォルトもしくはマウスが離れた時の描画処理
        if (Math.abs(toX - fromX) < 10 || Math.abs(toY - fromY) < 10 ) {
            return;
        }
        var rect = new Rect(fromX, fromY, toX - fromX, toY - fromY, "rect" + indexRect);
        if (rect.draw(meObj) == true) {
            ++indexRect;
        }
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
// Edge Object
//////////////////////////////////////////////////////////////////////////
function drawCornerEdge(xC, yC, name, mouseUpDown) {
    var size = 6;
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
        groups: [name + "Layer"],
        dragGroups: [name + "Layer"],
        drag: function(layer) {
            console.log(layer.name + ": corner drag");
            var layerName = name.replace(/(TL|TR|LL|LR)/g, "");
            var rect = $("canvas").getLayer(layerName);
            var place = "";
            var newWidth = 0;
            var newHeight = 0;
            var newX = 0;
            var newY = 0;
            if (/TL/.test(name) == true) {
                place = "TL";
                var xBaseEdge = rect.x;
                var yBaseEdge = rect.y;
                newWidth = rect.width - (layer.x + (size/2) - xBaseEdge);
                newHeight = rect.height - (layer.y + (size/2) - yBaseEdge);
                newX = layer.x + (size/2);
                newY = layer.y + (size/2);
            } else if (/TR/.test(name) == true) {
                place = "TR";
                var xBaseEdge = rect.x + rect.width;
                var yBaseEdge = rect.y;
                newWidth = rect.width + (layer.x + (size/2) - xBaseEdge);
                newHeight = rect.height - (layer.y + (size/2) - yBaseEdge);
                newX = rect.x;
                newY = layer.y + (size/2);
            } else if (/LL/.test(name) == true) {
                place = "LL";
                var xBaseEdge = rect.x;
                var yBaseEdge = rect.y + rect.height;
                newWidth = rect.width - (layer.x + (size/2) - xBaseEdge);
                newHeight = rect.height + (layer.y + (size/2) - yBaseEdge);
                newX = layer.x + (size/2);
                newY = rect.y;
            } else if (/LR/.test(name) == true) {
                place = "LR";
                //OK
                var xBaseEdge = rect.x + rect.width;
                var yBaseEdge = rect.y + rect.height;
                newWidth = rect.width + (layer.x + (size/2) - xBaseEdge);
                newHeight = rect.height + (layer.y + (size/2) - yBaseEdge);
                newX = rect.x;
                newY = rect.y;
            }
            if (newWidth > 10) {
                rect.width = newWidth;
                rect.x = newX;
            }
            if (newHeight > 10) {
                rect.height = newHeight;
                rect.y = newY;
            }
            clearCorner(layerName, place);
            drawCorner(rect.x, rect.y, rect.width, rect.height, layerName, mouseUpDown, place);
            mouseUpDown.setPressed();
        },
    });
}
function drawCorner(x, y, width, height, name, mouseUpDown, exclusion) {
    if (exclusion != "TL") drawCornerEdge(x        , y         , name + "TL", mouseUpDown);
    if (exclusion != "TR") drawCornerEdge(x + width, y         , name + "TR", mouseUpDown);
    if (exclusion != "LL") drawCornerEdge(x        , y + height, name + "LL", mouseUpDown);
    if (exclusion != "LR") drawCornerEdge(x + width, y + height, name + "LR", mouseUpDown);
}
function clearCorner(name, exclusion) {
    if (exclusion != "TL") $("canvas").removeLayer(name + "TL");
    if (exclusion != "TR") $("canvas").removeLayer(name + "TR");
    if (exclusion != "LL") $("canvas").removeLayer(name + "LL");
    if (exclusion != "LR") $("canvas").removeLayer(name + "LR");
}
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
Rect.prototype.draw = function(mouseUpDown) {
    if (mouseUpDown.isPressed() == true) {
        mouseUpDown.setReleased();
        return false;
    }
    var isInit = true;
    var isClicked = false;
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
              console.log(layer.name + ": drag");
              mouseUpDown.setPressed();
              if (isClicked == true) {
                  clearCorner(layer.name);
                  isClicked = false;
              }
          },
          dblclick: function(layer) {
              console.log(layer.name + ": dblclick");
              showInputDialog(layer.name, mouseUpDown);
          },
          click: function(layer) {
              console.log(layer.name + ": click");
              if (isInit == true) {
                  isInit = false;
                  return;
              }
              if (isClicked == true) {
                  clearCorner(layer.name);
                  isClicked = false;
                  return;
              }
              drawCorner(layer.x, layer.y, layer.width, layer.height, layer.name, mouseUpDown);
              isClicked = true;
          },
          name: this.rectName
      });
      return true;
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
