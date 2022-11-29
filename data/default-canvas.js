const defaultCanvasJSON = JSON.stringify({
  version: '5.2.4',
  background: '#DDDDDD',
  objects: [
    {
      type: 'rect',
      version: '5.2.4',
      originX: 'left',
      originY: 'top',
      left: 584,
      top: 159,
      width: 648,
      height: 360,
      fill: '#ffffff',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      rx: 0,
      ry: 0,
      id: 'background',
      selectable: false,
      evented: false,
    },
  ],
});

let frontDefaultCanvasJSON = defaultCanvasJSON;
frontDefaultCanvasJSON['id'] = 'front';
let backDefaultCanvasJSON = defaultCanvasJSON;
backDefaultCanvasJSON['id'] = 'back';
module.exports = { frontDefaultCanvasJSON, backDefaultCanvasJSON };
