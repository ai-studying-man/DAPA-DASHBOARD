import { sceneTheme } from './scene-theme.js';
import * as T from 'three';

export function makeModel(kind, color) {
  const group = new T.Group();
  const bright = new T.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.4 });
  const dark = new T.MeshStandardMaterial({ color: sceneTheme.modelBase, metalness: 0.6, roughness: 0.5 });
  function box(size, position, material = bright) {
    const mesh = new T.Mesh(new T.BoxGeometry(...size), material);
    mesh.position.set(...position);
    group.add(mesh);
    return mesh;
  }
  if (kind === 'ship') {
    const hull = new T.Shape(); hull.moveTo(0, -0.8); hull.lineTo(0.26, -0.3); hull.lineTo(0.26, 0.7); hull.lineTo(-0.26, 0.7); hull.lineTo(-0.26, -0.3);
    const mesh = new T.Mesh(new T.ExtrudeGeometry(hull, { depth: 0.16, bevelEnabled: false }), dark);
    mesh.rotation.x = -Math.PI / 2; group.add(mesh);
    box([0.3, 0.25, 0.55], [0, 0.27, 0.12]);
    box([0.06, 0.4, 0.06], [0, 0.52, 0.05]);
    box([0.35, 0.03, 0.12], [0, 0.66, 0.05]);
  } else if (kind === 'satellite') {
    box([0.24, 0.38, 0.28], [0, 0.2, 0]);
    box([1.1, 0.03, 0.32], [0, 0.2, 0], dark);
    const dish = new T.Mesh(new T.ConeGeometry(0.16, 0.12, 12), bright);
    dish.position.y = 0.43;
    group.add(dish);
  } else if (kind === 'plane' || kind === 'drone') {
    box([0.14, 0.13, 1], [0, 0.17, 0]);
    const wing = new T.Shape();
    wing.moveTo(-0.65, 0.18); wing.lineTo(0, -0.15); wing.lineTo(0.65, 0.18);
    wing.lineTo(0.55, 0.32); wing.lineTo(0, 0.18); wing.lineTo(-0.55, 0.32);
    const mesh = new T.Mesh(new T.ExtrudeGeometry(wing, { depth: 0.04, bevelEnabled: false }), bright);
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = 0.17; group.add(mesh);
    box([0.45, 0.06, 0.15], [0, 0.2, 0.4]);
    box([0.03, 0.2, 0.16], [0, 0.27, 0.4]);
    const nose = new T.Mesh(new T.ConeGeometry(0.1, 0.32, 12), bright);
    nose.rotation.x = -Math.PI / 2; nose.position.set(0, 0.17, -0.62); group.add(nose);
  } else {
    box([0.52, 0.22, 0.82], [0, 0.12, 0]);
    box([0.13, 0.18, 0.92], [-0.29, 0.07, 0], dark);
    box([0.13, 0.18, 0.92], [0.29, 0.07, 0], dark);
    if (kind === 'launcher') {
      const launcher = box([0.42, 0.28, 0.6], [0, 0.37, 0.08]);
      launcher.rotation.x = -0.25;
    } else {
      box([0.32, 0.2, 0.37], [0, 0.3, 0]);
      const barrel = box([0.05, 0.05, kind === 'amphibious' ? 0.3 : 0.7], [0, 0.31, -0.36]);
      barrel.rotation.x = -0.06;
    }
  }
  if(['tank','howitzer','amphibious','launcher'].includes(kind)) {
    for(const x of [-.37,.37])for(let i=0;i<6;i++){
      const wheel=new T.Mesh(new T.CylinderGeometry(.085,.085,.035,16),dark);
      wheel.rotation.z=Math.PI/2;wheel.position.set(x,.07,-.36+i*.145);group.add(wheel);
    }
    box([.14,.035,.15],[.12,.42,.09],dark);
    if(kind==='howitzer')box([.05,.05,.3],[0,.31,-.78]);
    if(kind==='launcher')for(let x=0;x<3;x++)for(let y=0;y<2;y++)box([.06,.06,.04],[-.12+x*.12,.33+y*.12,-.24],dark);
  }
  if(kind==='plane'||kind==='drone'){
    const canopy=new T.Mesh(new T.SphereGeometry(.1,24,12),dark);canopy.scale.set(.7,.7,1.8);canopy.position.set(0,.25,-.15);group.add(canopy);
    if(kind==='drone'){box([1.5,.045,.2],[0,.19,.1]);box([.045,.55,.035],[0,.16,.58],dark)}
  }
  if(kind==='ship'){box([.33,.01,.9],[0,.17,.15],bright);box([.08,.08,.08],[0,.24,-.44],dark);box([.035,.035,.22],[0,.24,-.53]);}
  if(kind==='satellite')for(const x of [-.43,-.27,.27,.43])box([.01,.006,.32],[x,.22,0],bright);
  group.rotation.y = -0.35;
  return group;
}
