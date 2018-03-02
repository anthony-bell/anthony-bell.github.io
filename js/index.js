var mouse = new Two.Vector();
var _document$documentEle = document.documentElement,
    clientWidth = _document$documentEle.clientWidth,
    clientHeight = _document$documentEle.clientHeight;

var diagonal = Math.sqrt(Math.pow(-clientWidth, 2) + Math.pow(-clientHeight, 2));
var container = void 0;
var offsetX = 0;
var offsetY = 0;

var colors = ["rgb(0, 191, 168)", "rgb(153, 102, 255)", "rgb(255, 100, 100)", "rgb(0, 200, 255)"];

var animationFrame$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame);

var mouse$ = Rx.Observable.fromEvent(document, "mousemove").map(function (_ref) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY;
  return {
    x: clientX,
    y: clientY
  };
});

var resize = Rx.Observable.fromEvent(window, 'resize').debounceTime(500).subscribe(function (e) {
  var _document$documentEle2 = document.documentElement,
      clientWidth = _document$documentEle2.clientWidth,
      clientHeight = _document$documentEle2.clientHeight;

  var count = 0;
  var rows = 4;
  var cols = 4;
  for (var i = 0; i < rows; i += 1) {
    var even = !!(i % 2);
    var vi = i / (rows - 1);
    for (var j = 0; j < cols; j++) {
      var k = j;
      if (even) {
        k += 0.5;
        if (j >= cols - 1) {
          continue;
        }
      }
      var hi = k / (cols - 1);
      if (count < container.children.length) {
        var child = container.children[count];
        child.origin.x = hi * clientWidth;
        child.origin.y = vi * clientHeight;
        child.translation.set(child.origin.x, child.origin.y);
        count += 1;
      }
    }
  }
});

function lerp(start, end) {
  var dx = end.x - start.x;
  var dy = end.y - start.y;

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1
  };
}

var smoothMouse$ = animationFrame$.withLatestFrom(mouse$, function (_, m) {
  return m;
}).scan(lerp);

Two.prototype.makeNonagon = function (width, height, sides) {
  width /= 2;
  height /= 2;
  var shape = this.makePath(_.map(_.range(sides), function (i) {
    var pct = i / sides;
    var theta = Math.PI * 2 * pct - Math.PI / 2;
    var x = width * Math.cos(theta);
    var y = height * Math.sin(theta);
    return new Two.Anchor(x, y);
  }));
  return shape;
};

var toggleFill = function toggleFill(el) {
  if (typeof el !== "undefined") {
    el._renderer.elem.addEventListener("click", function () {
      if (el.fill === "transparent") {
        el.fill = el.stroke;
      } else {
        el.fill = "transparent";
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

  container = two.makeGroup();
  container.parent.parent.domElement.classList += 'container';
  // create elements
  var rows = 4;
  var cols = 4;
  var sides = Math.floor(Math.random() * 3) + 3;
  var color = colors[Math.floor(Math.random() * colors.length)];

  for (var i = 0; i < rows; i += 1) {
    var even = !!(i % 2);
    var vi = i / (rows - 1);
    for (var j = 0; j < cols; j++) {
      var k = j;
      if (even) {
        k += 0.5;
        if (j >= cols - 1) {
          continue;
        }
      }
      var hi = k / (cols - 1);
      var size = (Math.floor(Math.random() * 50) + 10) / 100;
      var width = Math.round(two.height * size / Math.max(rows, cols));
      var shape = two.makeNonagon(width, width, sides);
      shape.rotation = Math.floor(Math.random() * 4) * Math.PI / 2 + Math.PI / 4;
      shape.origin = new Two.Vector(hi * two.width, vi * two.height);
      shape.translation.set(shape.origin.x, shape.origin.y);
      shape.stroke = color;
      shape.linewidth = 4;
      shape.fill = color;
      if (Math.round(Math.random())) {
        shape.noFill();
      }
      shape.step = Math.floor(Math.random() * 4) / 20 * (Math.PI / 60);
      shape.step *= Math.random() > 0.5 ? -1 : 1;
      container.add(shape);
    }
  }

  two.update();

  container.children.map(function (child) {
    toggleFill(child);
  });

  two.bind("update", function () {
    container.children.map(function (child) {
      var delta = new Two.Vector(child.origin.x, child.origin.y);
      var dist = delta.distanceTo(mouse) / diagonal;
      var d = (1 - dist) / 30;
      delta.lerp(mouse, d);
      child.translation.copy(delta);
      child.rotation += child.step;
    });
  });

  smoothMouse$.subscribe(function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
});