// Authored exhibition loops, not flight or naval hydrodynamic models.
export function exhibitMotion(branch, seconds) {
  const angle=seconds*.15;
  switch(branch){
    case 'air':return {x:18*Math.sin(angle),y:10,z:8*Math.cos(angle)-8,yaw:Math.atan2(-18*Math.cos(angle),8*Math.sin(angle))};
    case 'navy':return {x:12*Math.sin(angle),y:0,z:0,yaw:-Math.PI/2*Math.cos(angle)};
    default:return {x:0,y:0,z:0,yaw:0};
  }
}
