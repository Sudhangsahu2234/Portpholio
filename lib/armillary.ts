import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function turned(points: number[][], material: T.Material) {
  return new T.Mesh(new T.LatheGeometry(points.map(([r, y]) => new T.Vector2(r, y)), 96), material);
}

function engravedRing(radius: number, width: number, brass: T.Material, rim: T.Material, graduated: boolean) {
  const ring = new T.Group();
  const half = width / 2, inner = radius - .038;
  ring.add(turned([[inner, -half], [radius-.009, -half], [radius, -half+.009],
    [radius, half-.009], [radius-.009, half], [inner, half], [inner, -half]], brass));
  for (const y of [-half, half]) {
    const edge = new T.Mesh(new T.TorusGeometry(radius - .009, .009, 8, 112), rim);
    edge.rotation.x = Math.PI / 2; edge.position.y = y; ring.add(edge);
  }
  if (graduated) {
    const count = 120;
    const ticks = new T.InstancedMesh(new T.BoxGeometry(1,1,1), rim, count);
    const marker = new T.Object3D();
    for (let i = 0; i < count; i++) {
      const angle = i * 2 * Math.PI / count, major = i % 5 === 0;
      const height = width * (major ? .76 : .34);
      marker.position.set(Math.sin(angle)*(radius+.001), half - height/2 - .011, Math.cos(angle)*(radius+.001));
      marker.rotation.y = angle; marker.scale.set(major ? .014 : .006, height, .004);
      marker.updateMatrix(); ticks.setMatrixAt(i,marker.matrix);
    }
    ring.add(ticks);
  }
  return ring;
}

function sphere(radius: number, material: T.Material) {
  return new T.Mesh(new T.SphereGeometry(radius, 40, 24), material);
}

export function makeArmillary(canvas: HTMLCanvasElement) {
  const renderer = new T.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: "low-power"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.17;
  const scene = new T.Scene();
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .035);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  const brass = new T.MeshStandardMaterial({color:0xc08e42, roughness:.31, metalness:.9});
  const gold = new T.MeshStandardMaterial({color:0xffdc94, roughness:.22, metalness:.87});
  const antique = new T.MeshStandardMaterial({color:0x735032, roughness:.38, metalness:.82});
  const navy = new T.MeshStandardMaterial({color:0x143f65, roughness:.28, metalness:.66});
  const wood = new T.MeshStandardMaterial({color:0x321c17, roughness:.4, metalness:.17});
  const stand = new T.Group(); scene.add(stand);
  stand.add(turned([[0,-2.03],[.75,-2.03],[.81,-2],[.81,-1.96],[.74,-1.92],[.69,-1.88],[.66,-1.84],[0,-1.84]],wood));
  stand.add(turned([[.7,-1.91],[.74,-1.9],[.74,-1.88],[.69,-1.87]],gold));
  stand.add(turned([[0,-1.85],[.62,-1.85],[.64,-1.82],[.62,-1.78],[.45,-1.76],[.3,-1.69],[.23,-1.64],[.26,-1.61],[.24,-1.57],[.17,-1.55],[.12,-1.48],[.14,-1.43],[.2,-1.39],[.18,-1.33],[0,-1.32]],brass));
  const rig = new T.Group(); rig.position.y = .23; scene.add(rig);
  const meridian = engravedRing(1.52,.15,brass,gold,true);
  meridian.rotation.set(Math.PI/2,.12,-.18); rig.add(meridian);
  const equator = engravedRing(1.46,.17,antique,gold,true);
  equator.rotation.z = -.06; rig.add(equator);
  const spindle = new T.Group(); spindle.rotation.z = -.36; rig.add(spindle);
  spindle.add(new T.Mesh(new T.CylinderGeometry(.027,.027,3.28,16),gold));
  for (const sign of [-1,1]) {
    const cap = sphere(.075,gold); cap.position.y = sign*1.54; spindle.add(cap);
  }
  const innerAssembly = new T.Group(); spindle.add(innerAssembly);
  const zodiac = engravedRing(1.32,.185,brass,gold,true);
  zodiac.rotation.set(.62,0,.32); innerAssembly.add(zodiac);
  const colure = engravedRing(1.22,.074,brass,gold,false);
  colure.rotation.set(Math.PI/2,0,.88); innerAssembly.add(colure);
  const crossing = engravedRing(1.17,.06,antique,gold,false);
  crossing.rotation.set(Math.PI/2,0,-.69); innerAssembly.add(crossing);
  for (const y of [-.63,.63]) {
    const circle = engravedRing(.97,.042,brass,gold,false);
    circle.position.y = y; innerAssembly.add(circle);
  }
  const globe = sphere(.425,navy); spindle.add(globe);
  for (const y of [-.22,0,.22]) {
    const latitude = engravedRing(Math.sqrt(.425**2-y*y)+.006,.022,gold,brass,false);
    latitude.position.y = y; spindle.add(latitude);
  }
  for (const z of [0,Math.PI/2]) {
    const longitude = engravedRing(.433,.019,gold,brass,false);
    longitude.rotation.set(Math.PI/2,0,z); spindle.add(longitude);
  }
  const cap=sphere(.085,gold); cap.position.y=1.65; spindle.add(cap);
  scene.add(new T.HemisphereLight(0xfff4d9,0x455879,1.35));
  for (const [color,intensity,x,y,z] of [[0xffe7b5,3,-3,5,4],[0xc3dffe,2,4,2,-3],[0xffdeb6,1.3,0,-1,4]]) {
    const light=new T.DirectionalLight(color,intensity); light.position.set(x,y,z); scene.add(light);
  }
  const camera=new T.OrthographicCamera(-2.5,2.5,2.15,-2.15,.1,30);
  let width=0,height=0;
  function draw(yaw:number,pitch:number,mechanism:number) {
    const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
    if(w!==width||h!==height) {
      width=w;height=h;renderer.setSize(w,h,false);
      const half=Math.max(2.14,1.85*h/w);
      camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
    }
    const elevation=.18+pitch, angle=.34+yaw;
    camera.position.set(8*Math.sin(angle)*Math.cos(elevation),8*Math.sin(elevation),8*Math.cos(angle)*Math.cos(elevation));
    camera.lookAt(0,-.04,0);
    innerAssembly.rotation.y=.24+mechanism*.84;
    zodiac.rotation.x=.6+Math.sin(mechanism*1.55)*.45;
    renderer.render(scene,camera);
  }
  function dispose() {
    scene.traverse(object=>{if(object instanceof T.Mesh){object.geometry.dispose();if(object instanceof T.InstancedMesh)object.dispose();}});
    [brass,gold,antique,navy,wood].forEach(material=>material.dispose());
    environment.dispose();renderer.dispose();
  }
  return {draw,dispose};
}
