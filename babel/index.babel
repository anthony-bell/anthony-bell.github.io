const mouse = new Two.Vector();
let { clientWidth, clientHeight } = document.documentElement;
const diagonal = Math.sqrt( Math.pow((-clientWidth), 2) + Math.pow((-clientHeight), 2) );
let container;
let offsetX = 0;
let offsetY = 0;

const colors = [
  "rgb(0, 191, 168)",
  "rgb(153, 102, 255)",
  "rgb(255, 100, 100)",
  "rgb(0, 200, 255)"
];


const animationFrame$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame);

const mouse$ = Rx.Observable
  .fromEvent(document, "mousemove")
  .map(({ clientX, clientY }) => ({
    x: clientX,
    y: clientY,
}));

const resize = Rx.Observable
        .fromEvent(window, 'resize')
        .debounceTime(500)
        .subscribe((e) => {
        let { clientWidth, clientHeight } = document.documentElement;
        let count = 0;
        const rows = 4;
        const cols = 4;
        for (let i = 0; i < rows; i += 1) {
          let even = !!(i % 2);
          let vi = i / (rows - 1);
          for (let j = 0; j < cols; j++) {
            let k = j;
            if (even) {
              k += 0.5;
              if (j >= cols - 1) {
                continue;
              }
            }
            let hi = k / (cols - 1);
            if (count < container.children.length) {
              const child = container.children[count];
              child.origin.x = hi * clientWidth;
              child.origin.y = vi * clientHeight;
              child.translation.set(child.origin.x, child.origin.y);
              count += 1;
            }
          }
        }
});

function lerp(start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return {
    x: start.x + dx * 0.1,
    y: start.y + dy * 0.1,
  };
}

const smoothMouse$ = animationFrame$
.withLatestFrom(mouse$, (_, m) => m)
.scan(lerp);


Two.prototype.makeNonagon = function(width, height, sides) {
  width /= 2;
  height /= 2;
  const shape = this.makePath(
    _.map(_.range(sides), function(i) {
      const pct = i / sides;
      const theta = Math.PI * 2 * pct - Math.PI / 2;
      const x = width * Math.cos(theta);
      const y = height * Math.sin(theta);
      return new Two.Anchor(x, y);
    })
  );
  return shape;
};

const toggleFill = el => {
  if (typeof el !== "undefined") {
    el._renderer.elem.addEventListener("click", () => {
      if (el.fill === "transparent") {
        el.fill = el.stroke;
      } else {
        el.fill = "transparent";
      }
    });
  }
};




document.addEventListener("DOMContentLoaded", function() {
  const two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

  container = two.makeGroup();
  container.parent.parent.domElement.classList += 'container';
  // create elements
  const rows = 4;
  const cols = 4;
  const sides = Math.floor(Math.random() * 3) + 3;
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  for (let i = 0; i < rows; i += 1) {
    let even = !!(i % 2);
    let vi = i / (rows - 1);
    for (let j = 0; j < cols; j++) {
      let k = j;
      if (even) {
        k += 0.5;
        if (j >= cols - 1) {
          continue;
        }
      }
      let hi = k / (cols - 1);
      const size = (Math.floor(Math.random() * 50) + 10) / 100;
      const width = Math.round(two.height * size / Math.max(rows, cols));
      let shape = two.makeNonagon(
        width,
        width,
        sides
      );
      shape.rotation = Math.floor(Math.random() * 4) * Math.PI / 2 + Math.PI / 4;
      shape.origin = new Two.Vector(hi * two.width, vi * two.height);
      shape.translation.set(shape.origin.x, shape.origin.y);
      shape.stroke = color;
      shape.linewidth = 4;
      shape.fill = color;
      if ( Math.round(Math.random())) {
        shape.noFill();
      }
      shape.step = Math.floor(Math.random() * 4) / 20 * (Math.PI / 60);
      shape.step *= Math.random() > 0.5 ? -1 : 1;
      container.add(shape);
    }
  }

  two.update();

  container.children.map(child => {
      toggleFill(child);
  });

  two.bind("update", function() {
    container.children.map(child => {
      const delta =  new Two.Vector(child.origin.x, child.origin.y);
      const dist = delta.distanceTo(mouse) / diagonal;
      const d = (1 - dist) / 30;
      delta.lerp(mouse, d);
      child.translation.copy(delta);
      child.rotation += child.step;
    });
  });
  
  smoothMouse$.subscribe((e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  })

});
