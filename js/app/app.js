$.jCanvas.defaults.fromCenter = false;
$.jCanvas.defaults.layer = true;

function drawText(text, x, y, name) {
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
        groups: ["categories"],
        dragGroups: ["categories"],
        drag: onDrag,
        dragstop: onDragStop,
        dragcancel: onDragCancel
    });
}

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

$("canvas").drawRect({
  strokeStyle: "black",
  strokeWidth: 1,
  x: 45,
  y: 45,
  width: borderWidth + 10,
  height: 75,
  draggable: true,
  groups: ["categories"],
  dragGroups: ["categories"],
  drag: onDrag,
  dragstop: onDragStop,
  dragcancel: onDragCancel,
  name: "categories-border"
});

$("canvas").drawLine({
    strokeStyle: "black",
    strokeWidth: 1,
    x1: 45,
    y1: 70,
    x2: 45 + borderWidth + 10,
    y2: 70,
    draggable: true,
    groups: ["categories"],
    dragGroups: ["categories"],
    drag: onDrag,
    dragstop: onDragStop,
    dragcancel: onDragCancel
});

// 接続先の楕円
$("canvas").drawEllipse({
    fillStyle: 'black',
    x: 250,
    y: 100,
    width: 20,
    height: 20,
    draggable: false
});

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
