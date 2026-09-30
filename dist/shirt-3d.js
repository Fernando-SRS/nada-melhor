import * as THREE from './vendor/three.module.min.js';

// Tailored surface reconstruction. The artwork is sampled directly from the
// supplied reference photographs through UV coordinates, never redrawn.
export function createViewer(dialog) {
  const host = dialog.querySelector('.viewer-canvas');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x97958c, 1.65));
  const light = new THREE.DirectionalLight(0xfff8ef, 2.0);light.position.set(-3, 4, 5);scene.add(light);
  const fill = new THREE.DirectionalLight(0xe6eef1, .85);fill.position.set(3, 1, -4);scene.add(fill);
  const shirt = new THREE.Group();scene.add(shirt);
  let distance=6.8, yaw=0, pitch=0, frame=0, running=false;
  const fabric = new THREE.MeshStandardMaterial({color:0x855027,roughness:.92,side:THREE.DoubleSide});
  const seam = new THREE.MeshStandardMaterial({color:0x704521,roughness:1});
  const geometries=[], prints=[];
  // Continuous front and back panels: no separate cylindrical sleeves.
  function surface(x,y,back=false) {
    const a=Math.abs(x), sleeve=THREE.MathUtils.smoothstep(a,.82,1.28);
    const depth=THREE.MathUtils.lerp(.18*Math.sqrt(Math.max(.04,1-(x/1.05)**2)),.072,sleeve);
    const hemInfluence=THREE.MathUtils.smoothstep(-y,-.15,1.4);
    const folds=(.014*Math.sin(x*13+y*1.8)+.008*Math.sin(x*25-y*2.3))*hemInfluence;
    const underarm=.024*Math.sin(y*23+a*12)*Math.exp(-((a-.88)**2/.035+(y-.43)**2/.11));
    const diagonal=.012*Math.sin(x*8+y*5)*Math.exp(-((y-.8)**2/.7));
    return (back?-1:1)*(depth+folds+underarm+diagonal);
  }
  function top(x,back){const a=Math.abs(x);return a<.33 ? 1.37-(back?.1:.28)*Math.sqrt(Math.max(0,1-(a/.33)**2)) : 1.37-(a-.33)*.37;}
  function bottom(x){const a=Math.abs(x);return a<=.97 ? -1.37+.018*Math.sin(x*11)+.009*Math.sin(x*23) : .43-(a-.97)*.27;}
  function grid(nx,ny,point) {
    const pos=[],uv=[],idx=[];
    for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){pos.push(...point(i/nx,j/ny));uv.push(i/nx,j/ny);}
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;idx.push(a,b,d,a,d,c);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();geometries.push(g);return g;
  }
  for(const back of [false,true]){
    const body=grid(220,110,(u,v)=>{const x=(u*2-1)*1.6;const y=bottom(x)+v*(top(x,back)-bottom(x));return [x,y,surface(x,y,back)];});
    shirt.add(new THREE.Mesh(body,fabric));
  }
  for(const side of [-1,1]){
    const shoulder=grid(70,16,(u,v)=>{const x=side*(.33+u*1.27),y=THREE.MathUtils.lerp(top(x,false),top(x,true),v);return [x,y,THREE.MathUtils.lerp(surface(x,y),surface(x,y,true),v)];});shirt.add(new THREE.Mesh(shoulder,fabric));
    // Close only the side and underarm seams; sleeve ends and hem stay open.
    const sidePanel=grid(70,10,(u,v)=>{let x,y;if(u<.65){x=side*.97;y=-1.37+u/.65*1.8;}else{x=side*(.97+(u-.65)/.35*.63);y=bottom(x);}return [x,y,THREE.MathUtils.lerp(surface(x,y),surface(x,y,true),v)];});shirt.add(new THREE.Mesh(sidePanel,fabric));
    for(const back of [false,true]){const cuff=[];for(let i=0;i<=35;i++){const x=side*1.575,y=bottom(x)+(top(x,back)-bottom(x))*i/35;cuff.push(new THREE.Vector3(x,y,surface(x,y,back)));}addSeam(cuff,.004);}
  }
  function addSeam(points,radius){const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,radius,5,false);geometries.push(geo);shirt.add(new THREE.Mesh(geo,seam));}
  const neck=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2,x=.33*Math.cos(a),front=Math.sin(a)>=0;neck.push(new THREE.Vector3(x,top(x,!front),surface(x,top(x,!front),!front)));}addSeam(neck,.015);
  for(const back of [false,true]){for(const inset of [.017,.035]){const hem=[];for(let i=0;i<=90;i++){const x=-.965+i/90*1.93,y=bottom(x)+inset;hem.push(new THREE.Vector3(x,y,surface(x,y,back)));}addSeam(hem,.0025);}}
  const grain=new Uint8Array(256*256*4);for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4;const thread=128+22*Math.sin(x*Math.PI/2)*Math.sin(y*Math.PI/2)+10*Math.sin(x*19.3+y*7.7);grain[i]=grain[i+1]=grain[i+2]=thread;grain[i+3]=255;}
  const weave=new THREE.DataTexture(grain,256,256);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(9,9);weave.needsUpdate=true;fabric.bumpMap=weave;fabric.bumpScale=.004;fabric.roughness=1;
  const textures=new Map();const loader=new THREE.TextureLoader();
  async function texture(file){if(!textures.has(file)){const t=await loader.loadAsync('assets/'+file);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.set(file,t);}return textures.get(file);}
  async function decal({file,box,back,width,height,x,y,brown,rotate=false}){
    const source=await texture(file),map=source.clone();map.needsUpdate=true;
    const [px,py,w,h]=box;map.repeat.set(w/640,h/1137);map.offset.set(px/640,1-(py+h)/1137);
    if(rotate){map.repeat.multiplyScalar(-1);map.offset.set((px+w)/640,1-py/1137);}
    const material=new THREE.MeshBasicMaterial({map,transparent:true,depthWrite:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2});
    material.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
        vec3 ink = pow(max(sampledDiffuseColor.rgb, vec3(0.0)), vec3(1.0 / 2.2));
        vec3 chroma = ink / max(0.001, ink.r + ink.g + ink.b);
        vec3 cloth = ${brown?'vec3(0.61,0.31,0.08)':'vec3(0.25,0.37,0.38)'};
        float separation = distance(chroma, cloth);
        diffuseColor.a *= ${brown ? 'smoothstep(0.53, 0.70, ink.g / max(ink.r, 0.001))' : '1.0 - smoothstep(0.78, 1.06, ink.b / max(max(ink.r, ink.g), 0.001))'};
      `);
    };
    const geo=grid(36,42,(u,v)=>{const xx=x+(back?-1:1)*(u-.5)*width,yy=y+(v-.5)*height;return [xx,yy,surface(xx,yy,back)+(back?-.008:.008)];});
    const mesh=new THREE.Mesh(geo,material);shirt.add(mesh);prints.push(mesh);
  }
  async function setColor(color){
    for(const mesh of prints){shirt.remove(mesh);mesh.geometry.dispose();mesh.material.map.dispose();mesh.material.dispose();}prints.length=0;
    const brown=color==='brown';fabric.color.set(brown?0x88502b:0xb0d5e0);seam.color.set(brown?0x764524:0x9bbfca);
    await decal({file:brown?'drop-detalhe-marrom.jpg':'drop-azul-frente.jpg',box:brown?[228,396,198,222]:[384,456,103,135],brown,rotate:brown,back:false,width:.34,height:.4,x:.44,y:.59});
    await decal({file:brown?'drop-marrom-costas.jpg':'drop-azul-costas.jpg',box:brown?[150,406,310,321]:[262,512,325,427],brown,back:true,width:1.20,height:1.40,x:0,y:.12});
    reset();
  }
  let lastWidth=0,lastHeight=0; function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h||(w===lastWidth&&h===lastHeight))return;lastWidth=w;lastHeight=h;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function render(){if(!running)return;resize();shirt.rotation.set(pitch,yaw,0);camera.position.set(0,0,distance);camera.lookAt(0,0,0);renderer.render(scene,camera);frame=requestAnimationFrame(render);}
  function reset(){yaw=0;pitch=0;distance=host.clientWidth<500?7.8:5.8;}
  function zoom(factor){distance=THREE.MathUtils.clamp(distance*factor,3.8,11);}
  const pointers=new Map();let pinch=0;
  const canvas=renderer.domElement;canvas.style.touchAction='none';
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});pinch=0;});
  canvas.addEventListener('pointermove',event=>{if(!pointers.has(event.pointerId))return;const prev=pointers.get(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.size===1){yaw+=(event.clientX-prev.x)*.009;pitch=THREE.MathUtils.clamp(pitch+(event.clientY-prev.y)*.006,-.65,.65);}else{const[a,b]=[...pointers.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch>0)zoom(pinch/d);pinch=d;}});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{pointers.delete(e.pointerId);pinch=0;});
  canvas.addEventListener('wheel',event=>{event.preventDefault();zoom(Math.exp(event.deltaY*.001));},{passive:false});
  host.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')yaw-=.25;else if(event.key==='ArrowRight')yaw+=.25;else if(event.key==='+'||event.key==='=')zoom(.86);else if(event.key==='-')zoom(1.16);else return;event.preventDefault();});
  dialog.querySelectorAll('[data-control]').forEach(button=>button.addEventListener('click',()=>{const c=button.dataset.control;if(c==='left')yaw-=.35;if(c==='right')yaw+=.35;if(c==='in')zoom(.84);if(c==='out')zoom(1.19);if(c==='reset')reset();}));
  dialog.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{yaw=button.dataset.view==='back'?Math.PI:0;pitch=0;}));
  return {setColor,resume(){running=true;cancelAnimationFrame(frame);resize();render();},suspend(){running=false;cancelAnimationFrame(frame);pointers.clear();}};
}


