import {
  BoxBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderBufferGeometry,
  Group, LineBasicMaterial, LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  private brick: Group;

  constructor() {
    this.brick = createAxis([[1, 0, 0], [0, 1, 0], [0, 0, 1]], 2, 2);

    this.scene.add(this.brick);

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    this.render();
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    this.brick.rotateY(0.03);
  }
}

export const createAxis = (
                             allAxesVectors: [number,number, number][],
                             axisIndex: number,
                             size: number,
                             opacity = 1,
                             alwaysOnTop = true,
                           ) => {
  const arrowGeometry = new CylinderBufferGeometry(0, 0.1 * size, size * 0.3, 12, 1, false);

  arrowGeometry.rotateX(Math.PI / 2)
  const group = new Group();
  const mesh = new Mesh(
    arrowGeometry,
    new MeshBasicMaterial({
      depthTest: false,
      depthWrite: !alwaysOnTop,
      transparent: true,
      opacity,
      color: new Color(255,0,0),
    }),
  );
  const axisVector = allAxesVectors[axisIndex];

  mesh.up.set(0, 1, 0);

  var geometry = new BoxBufferGeometry( 0.1, 0.1, 0.1 );
  var material = new MeshBasicMaterial( {color: 0x00ff00} );
  var cube = new Mesh( geometry, material );

  const point = new Vector3(0, 1, 1)
  cube.position.set(point.x,point.y,point.z)
  group.add(cube)
  mesh.lookAt(new Vector3(...axisVector));

  cube.position.add(new Vector3(...axisVector));
  mesh.position.set(...axisVector).multiplyScalar(size * 0.85);
  mesh.updateMatrix();
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute(
    'position',
    new BufferAttribute(
      Float32Array.from([0, 0, 0, ...new Vector3(...axisVector).multiplyScalar(size * 0.7).toArray()]),
      3,
    ),
  );
  const line = new LineSegments(
    lineGeometry,
    new LineBasicMaterial({
      color: new Color(255,0,0),
      linewidth: 2,
      transparent: true,
      depthTest: false,
      depthWrite: !alwaysOnTop,
      opacity,
    }),
  );

  group.add(line);
  group.add(mesh);
  return group;
};
