import{j as t,c as Pt}from"./client-DOSV_kvz.js";import{r as D}from"./index-DzXGc9LX.js";import{J as S,a5 as U,a6 as Z,a7 as We,a8 as Ye,O as xe,V as T,a9 as ve,aa as kt,ab as at,R as Ct,u as W,b as ze,i as Nt,B as nt,C as be,c as Mt,D as Et,j as St,ac as At,ad as Lt,ae as Tt,af as Ot,a4 as Kt}from"./react-three-fiber.esm-BhsJZxfV.js";import{_ as Ie,s as Rt}from"./shaderMaterial-BZp1GUYb.js";var Bt=Object.defineProperty,Ft=(o,n,i)=>n in o?Bt(o,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[n]=i,Gt=(o,n,i)=>(Ft(o,n+"",i),i);class Wt{constructor(){Gt(this,"_listeners")}addEventListener(n,i){this._listeners===void 0&&(this._listeners={});const e=this._listeners;e[n]===void 0&&(e[n]=[]),e[n].indexOf(i)===-1&&e[n].push(i)}hasEventListener(n,i){if(this._listeners===void 0)return!1;const e=this._listeners;return e[n]!==void 0&&e[n].indexOf(i)!==-1}removeEventListener(n,i){if(this._listeners===void 0)return;const m=this._listeners[n];if(m!==void 0){const f=m.indexOf(i);f!==-1&&m.splice(f,1)}}dispatchEvent(n){if(this._listeners===void 0)return;const e=this._listeners[n.type];if(e!==void 0){n.target=this;const m=e.slice(0);for(let f=0,d=m.length;f<d;f++)m[f].call(this,n);n.target=null}}}var Yt=Object.defineProperty,Ht=(o,n,i)=>n in o?Yt(o,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[n]=i,h=(o,n,i)=>(Ht(o,typeof n!="symbol"?n+"":n,i),i);const re=new kt,He=new at,Vt=Math.cos(70*(Math.PI/180)),Ve=(o,n)=>(o%n+n)%n;let $t=class extends Wt{constructor(n,i){super(),h(this,"object"),h(this,"domElement"),h(this,"enabled",!0),h(this,"target",new S),h(this,"minDistance",0),h(this,"maxDistance",1/0),h(this,"minZoom",0),h(this,"maxZoom",1/0),h(this,"minPolarAngle",0),h(this,"maxPolarAngle",Math.PI),h(this,"minAzimuthAngle",-1/0),h(this,"maxAzimuthAngle",1/0),h(this,"enableDamping",!1),h(this,"dampingFactor",.05),h(this,"enableZoom",!0),h(this,"zoomSpeed",1),h(this,"enableRotate",!0),h(this,"rotateSpeed",1),h(this,"enablePan",!0),h(this,"panSpeed",1),h(this,"screenSpacePanning",!0),h(this,"keyPanSpeed",7),h(this,"zoomToCursor",!1),h(this,"autoRotate",!1),h(this,"autoRotateSpeed",2),h(this,"reverseOrbit",!1),h(this,"reverseHorizontalOrbit",!1),h(this,"reverseVerticalOrbit",!1),h(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),h(this,"mouseButtons",{LEFT:U.ROTATE,MIDDLE:U.DOLLY,RIGHT:U.PAN}),h(this,"touches",{ONE:Z.ROTATE,TWO:Z.DOLLY_PAN}),h(this,"target0"),h(this,"position0"),h(this,"zoom0"),h(this,"_domElementKeyEvents",null),h(this,"getPolarAngle"),h(this,"getAzimuthalAngle"),h(this,"setPolarAngle"),h(this,"setAzimuthalAngle"),h(this,"getDistance"),h(this,"getZoomScale"),h(this,"listenToKeyEvents"),h(this,"stopListenToKeyEvents"),h(this,"saveState"),h(this,"reset"),h(this,"update"),h(this,"connect"),h(this,"dispose"),h(this,"dollyIn"),h(this,"dollyOut"),h(this,"getScale"),h(this,"setScale"),this.object=n,this.domElement=i,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>u.phi,this.getAzimuthalAngle=()=>u.theta,this.setPolarAngle=a=>{let r=Ve(a,2*Math.PI),y=u.phi;y<0&&(y+=2*Math.PI),r<0&&(r+=2*Math.PI);let P=Math.abs(r-y);2*Math.PI-P<P&&(r<y?r+=2*Math.PI:y+=2*Math.PI),g.phi=r-y,e.update()},this.setAzimuthalAngle=a=>{let r=Ve(a,2*Math.PI),y=u.theta;y<0&&(y+=2*Math.PI),r<0&&(r+=2*Math.PI);let P=Math.abs(r-y);2*Math.PI-P<P&&(r<y?r+=2*Math.PI:y+=2*Math.PI),g.theta=r-y,e.update()},this.getDistance=()=>e.object.position.distanceTo(e.target),this.listenToKeyEvents=a=>{a.addEventListener("keydown",he),this._domElementKeyEvents=a},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",he),this._domElementKeyEvents=null},this.saveState=()=>{e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=()=>{e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(m),e.update(),c=s.NONE},this.update=(()=>{const a=new S,r=new S(0,1,0),y=new Ye().setFromUnitVectors(n.up,r),P=y.clone().invert(),E=new S,R=new Ye,G=2*Math.PI;return function(){const Ge=e.object.position;y.setFromUnitVectors(n.up,r),P.copy(y).invert(),a.copy(Ge).sub(e.target),a.applyQuaternion(y),u.setFromVector3(a),e.autoRotate&&c===s.NONE&&fe(_t()),e.enableDamping?(u.theta+=g.theta*e.dampingFactor,u.phi+=g.phi*e.dampingFactor):(u.theta+=g.theta,u.phi+=g.phi);let B=e.minAzimuthAngle,F=e.maxAzimuthAngle;isFinite(B)&&isFinite(F)&&(B<-Math.PI?B+=G:B>Math.PI&&(B-=G),F<-Math.PI?F+=G:F>Math.PI&&(F-=G),B<=F?u.theta=Math.max(B,Math.min(F,u.theta)):u.theta=u.theta>(B+F)/2?Math.max(B,u.theta):Math.min(F,u.theta)),u.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,u.phi)),u.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(p,e.dampingFactor):e.target.add(p),e.zoomToCursor&&O||e.object.isOrthographicCamera?u.radius=pe(u.radius):u.radius=pe(u.radius*C),a.setFromSpherical(u),a.applyQuaternion(P),Ge.copy(e.target).add(a),e.object.matrixAutoUpdate||e.object.updateMatrix(),e.object.lookAt(e.target),e.enableDamping===!0?(g.theta*=1-e.dampingFactor,g.phi*=1-e.dampingFactor,p.multiplyScalar(1-e.dampingFactor)):(g.set(0,0,0),p.set(0,0,0));let q=!1;if(e.zoomToCursor&&O){let Q=null;if(e.object instanceof ve&&e.object.isPerspectiveCamera){const J=a.length();Q=pe(J*C);const se=J-Q;e.object.position.addScaledVector(K,se),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const J=new S(A.x,A.y,0);J.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/C)),e.object.updateProjectionMatrix(),q=!0;const se=new S(A.x,A.y,0);se.unproject(e.object),e.object.position.sub(se).add(J),e.object.updateMatrixWorld(),Q=a.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;Q!==null&&(e.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(Q).add(e.object.position):(re.origin.copy(e.object.position),re.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(re.direction))<Vt?n.lookAt(e.target):(He.setFromNormalAndCoplanarPoint(e.object.up,e.target),re.intersectPlane(He,e.target))))}else e.object instanceof xe&&e.object.isOrthographicCamera&&(q=C!==1,q&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/C)),e.object.updateProjectionMatrix()));return C=1,O=!1,q||E.distanceToSquared(e.object.position)>I||8*(1-R.dot(e.object.quaternion))>I?(e.dispatchEvent(m),E.copy(e.object.position),R.copy(e.object.quaternion),q=!1,!0):!1}})(),this.connect=a=>{e.domElement=a,e.domElement.style.touchAction="none",e.domElement.addEventListener("contextmenu",Be),e.domElement.addEventListener("pointerdown",Ke),e.domElement.addEventListener("pointercancel",X),e.domElement.addEventListener("wheel",Re)},this.dispose=()=>{var a,r,y,P,E,R;e.domElement&&(e.domElement.style.touchAction="auto"),(a=e.domElement)==null||a.removeEventListener("contextmenu",Be),(r=e.domElement)==null||r.removeEventListener("pointerdown",Ke),(y=e.domElement)==null||y.removeEventListener("pointercancel",X),(P=e.domElement)==null||P.removeEventListener("wheel",Re),(E=e.domElement)==null||E.ownerDocument.removeEventListener("pointermove",ue),(R=e.domElement)==null||R.ownerDocument.removeEventListener("pointerup",X),e._domElementKeyEvents!==null&&e._domElementKeyEvents.removeEventListener("keydown",he)};const e=this,m={type:"change"},f={type:"start"},d={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let c=s.NONE;const I=1e-6,u=new We,g=new We;let C=1;const p=new S,x=new T,v=new T,b=new T,l=new T,j=new T,M=new T,N=new T,_=new T,w=new T,K=new S,A=new T;let O=!1;const k=[],ie={};function _t(){return 2*Math.PI/60/60*e.autoRotateSpeed}function H(){return Math.pow(.95,e.zoomSpeed)}function fe(a){e.reverseOrbit||e.reverseHorizontalOrbit?g.theta+=a:g.theta-=a}function we(a){e.reverseOrbit||e.reverseVerticalOrbit?g.phi+=a:g.phi-=a}const Pe=(()=>{const a=new S;return function(y,P){a.setFromMatrixColumn(P,0),a.multiplyScalar(-y),p.add(a)}})(),ke=(()=>{const a=new S;return function(y,P){e.screenSpacePanning===!0?a.setFromMatrixColumn(P,1):(a.setFromMatrixColumn(P,0),a.crossVectors(e.object.up,a)),a.multiplyScalar(y),p.add(a)}})(),$=(()=>{const a=new S;return function(y,P){const E=e.domElement;if(E&&e.object instanceof ve&&e.object.isPerspectiveCamera){const R=e.object.position;a.copy(R).sub(e.target);let G=a.length();G*=Math.tan(e.object.fov/2*Math.PI/180),Pe(2*y*G/E.clientHeight,e.object.matrix),ke(2*P*G/E.clientHeight,e.object.matrix)}else E&&e.object instanceof xe&&e.object.isOrthographicCamera?(Pe(y*(e.object.right-e.object.left)/e.object.zoom/E.clientWidth,e.object.matrix),ke(P*(e.object.top-e.object.bottom)/e.object.zoom/E.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}})();function de(a){e.object instanceof ve&&e.object.isPerspectiveCamera||e.object instanceof xe&&e.object.isOrthographicCamera?C=a:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function le(a){de(C/a)}function me(a){de(C*a)}function Ce(a){if(!e.zoomToCursor||!e.domElement)return;O=!0;const r=e.domElement.getBoundingClientRect(),y=a.clientX-r.left,P=a.clientY-r.top,E=r.width,R=r.height;A.x=y/E*2-1,A.y=-(P/R)*2+1,K.set(A.x,A.y,1).unproject(e.object).sub(e.object.position).normalize()}function pe(a){return Math.max(e.minDistance,Math.min(e.maxDistance,a))}function Ne(a){x.set(a.clientX,a.clientY)}function ft(a){Ce(a),N.set(a.clientX,a.clientY)}function Me(a){l.set(a.clientX,a.clientY)}function dt(a){v.set(a.clientX,a.clientY),b.subVectors(v,x).multiplyScalar(e.rotateSpeed);const r=e.domElement;r&&(fe(2*Math.PI*b.x/r.clientHeight),we(2*Math.PI*b.y/r.clientHeight)),x.copy(v),e.update()}function mt(a){_.set(a.clientX,a.clientY),w.subVectors(_,N),w.y>0?le(H()):w.y<0&&me(H()),N.copy(_),e.update()}function pt(a){j.set(a.clientX,a.clientY),M.subVectors(j,l).multiplyScalar(e.panSpeed),$(M.x,M.y),l.copy(j),e.update()}function ut(a){Ce(a),a.deltaY<0?me(H()):a.deltaY>0&&le(H()),e.update()}function ht(a){let r=!1;switch(a.code){case e.keys.UP:$(0,e.keyPanSpeed),r=!0;break;case e.keys.BOTTOM:$(0,-e.keyPanSpeed),r=!0;break;case e.keys.LEFT:$(e.keyPanSpeed,0),r=!0;break;case e.keys.RIGHT:$(-e.keyPanSpeed,0),r=!0;break}r&&(a.preventDefault(),e.update())}function Ee(){if(k.length==1)x.set(k[0].pageX,k[0].pageY);else{const a=.5*(k[0].pageX+k[1].pageX),r=.5*(k[0].pageY+k[1].pageY);x.set(a,r)}}function Se(){if(k.length==1)l.set(k[0].pageX,k[0].pageY);else{const a=.5*(k[0].pageX+k[1].pageX),r=.5*(k[0].pageY+k[1].pageY);l.set(a,r)}}function Ae(){const a=k[0].pageX-k[1].pageX,r=k[0].pageY-k[1].pageY,y=Math.sqrt(a*a+r*r);N.set(0,y)}function yt(){e.enableZoom&&Ae(),e.enablePan&&Se()}function xt(){e.enableZoom&&Ae(),e.enableRotate&&Ee()}function Le(a){if(k.length==1)v.set(a.pageX,a.pageY);else{const y=ye(a),P=.5*(a.pageX+y.x),E=.5*(a.pageY+y.y);v.set(P,E)}b.subVectors(v,x).multiplyScalar(e.rotateSpeed);const r=e.domElement;r&&(fe(2*Math.PI*b.x/r.clientHeight),we(2*Math.PI*b.y/r.clientHeight)),x.copy(v)}function Te(a){if(k.length==1)j.set(a.pageX,a.pageY);else{const r=ye(a),y=.5*(a.pageX+r.x),P=.5*(a.pageY+r.y);j.set(y,P)}M.subVectors(j,l).multiplyScalar(e.panSpeed),$(M.x,M.y),l.copy(j)}function Oe(a){const r=ye(a),y=a.pageX-r.x,P=a.pageY-r.y,E=Math.sqrt(y*y+P*P);_.set(0,E),w.set(0,Math.pow(_.y/N.y,e.zoomSpeed)),le(w.y),N.copy(_)}function vt(a){e.enableZoom&&Oe(a),e.enablePan&&Te(a)}function gt(a){e.enableZoom&&Oe(a),e.enableRotate&&Le(a)}function Ke(a){var r,y;e.enabled!==!1&&(k.length===0&&((r=e.domElement)==null||r.ownerDocument.addEventListener("pointermove",ue),(y=e.domElement)==null||y.ownerDocument.addEventListener("pointerup",X)),zt(a),a.pointerType==="touch"?Dt(a):bt(a))}function ue(a){e.enabled!==!1&&(a.pointerType==="touch"?jt(a):It(a))}function X(a){var r,y,P;wt(a),k.length===0&&((r=e.domElement)==null||r.releasePointerCapture(a.pointerId),(y=e.domElement)==null||y.ownerDocument.removeEventListener("pointermove",ue),(P=e.domElement)==null||P.ownerDocument.removeEventListener("pointerup",X)),e.dispatchEvent(d),c=s.NONE}function bt(a){let r;switch(a.button){case 0:r=e.mouseButtons.LEFT;break;case 1:r=e.mouseButtons.MIDDLE;break;case 2:r=e.mouseButtons.RIGHT;break;default:r=-1}switch(r){case U.DOLLY:if(e.enableZoom===!1)return;ft(a),c=s.DOLLY;break;case U.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(e.enablePan===!1)return;Me(a),c=s.PAN}else{if(e.enableRotate===!1)return;Ne(a),c=s.ROTATE}break;case U.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(e.enableRotate===!1)return;Ne(a),c=s.ROTATE}else{if(e.enablePan===!1)return;Me(a),c=s.PAN}break;default:c=s.NONE}c!==s.NONE&&e.dispatchEvent(f)}function It(a){if(e.enabled!==!1)switch(c){case s.ROTATE:if(e.enableRotate===!1)return;dt(a);break;case s.DOLLY:if(e.enableZoom===!1)return;mt(a);break;case s.PAN:if(e.enablePan===!1)return;pt(a);break}}function Re(a){e.enabled===!1||e.enableZoom===!1||c!==s.NONE&&c!==s.ROTATE||(a.preventDefault(),e.dispatchEvent(f),ut(a),e.dispatchEvent(d))}function he(a){e.enabled===!1||e.enablePan===!1||ht(a)}function Dt(a){switch(Fe(a),k.length){case 1:switch(e.touches.ONE){case Z.ROTATE:if(e.enableRotate===!1)return;Ee(),c=s.TOUCH_ROTATE;break;case Z.PAN:if(e.enablePan===!1)return;Se(),c=s.TOUCH_PAN;break;default:c=s.NONE}break;case 2:switch(e.touches.TWO){case Z.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;yt(),c=s.TOUCH_DOLLY_PAN;break;case Z.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;xt(),c=s.TOUCH_DOLLY_ROTATE;break;default:c=s.NONE}break;default:c=s.NONE}c!==s.NONE&&e.dispatchEvent(f)}function jt(a){switch(Fe(a),c){case s.TOUCH_ROTATE:if(e.enableRotate===!1)return;Le(a),e.update();break;case s.TOUCH_PAN:if(e.enablePan===!1)return;Te(a),e.update();break;case s.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;vt(a),e.update();break;case s.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;gt(a),e.update();break;default:c=s.NONE}}function Be(a){e.enabled!==!1&&a.preventDefault()}function zt(a){k.push(a)}function wt(a){delete ie[a.pointerId];for(let r=0;r<k.length;r++)if(k[r].pointerId==a.pointerId){k.splice(r,1);return}}function Fe(a){let r=ie[a.pointerId];r===void 0&&(r=new T,ie[a.pointerId]=r),r.set(a.pageX,a.pageY)}function ye(a){const r=a.pointerId===k[0].pointerId?k[1]:k[0];return ie[r.pointerId]}this.dollyIn=(a=H())=>{me(a),e.update()},this.dollyOut=(a=H())=>{le(a),e.update()},this.getScale=()=>C,this.setScale=a=>{de(a),e.update()},this.getZoomScale=()=>H(),i!==void 0&&this.connect(i),this.update()}};const Ut=()=>parseInt(Ct.replace(/\D+/g,"")),Zt=Ut(),Xt=D.forwardRef(({makeDefault:o,camera:n,regress:i,domElement:e,enableDamping:m=!0,keyEvents:f=!1,onChange:d,onStart:s,onEnd:c,...I},u)=>{const g=W(w=>w.invalidate),C=W(w=>w.camera),p=W(w=>w.gl),x=W(w=>w.events),v=W(w=>w.setEvents),b=W(w=>w.set),l=W(w=>w.get),j=W(w=>w.performance),M=n||C,N=e||x.connected||p.domElement,_=D.useMemo(()=>new $t(M),[M]);return ze(()=>{_.enabled&&_.update()},-1),D.useEffect(()=>(f&&_.connect(f===!0?N:f),_.connect(N),()=>void _.dispose()),[f,N,i,_,g]),D.useEffect(()=>{const w=O=>{g(),i&&j.regress(),d&&d(O)},K=O=>{s&&s(O)},A=O=>{c&&c(O)};return _.addEventListener("change",w),_.addEventListener("start",K),_.addEventListener("end",A),()=>{_.removeEventListener("start",K),_.removeEventListener("end",A),_.removeEventListener("change",w)}},[d,s,c,_,g,v]),D.useEffect(()=>{if(o){const w=l().controls;return b({controls:_}),()=>b({controls:w})}},[o,_]),D.createElement("primitive",Ie({ref:u,object:_,enableDamping:m},I))}),qt=Rt({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new be,sectionColor:new be,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new S,worldPlanePosition:new S},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${Zt>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),Qt=D.forwardRef(({args:o,cellColor:n="#000000",sectionColor:i="#2080ff",cellSize:e=.5,sectionSize:m=1,followCamera:f=!1,infiniteGrid:d=!1,fadeDistance:s=100,fadeStrength:c=1,fadeFrom:I=1,cellThickness:u=.5,sectionThickness:g=1,side:C=nt,...p},x)=>{Nt({GridMaterial:qt});const v=D.useRef(null);D.useImperativeHandle(x,()=>v.current,[]);const b=new at,l=new S(0,1,0),j=new S(0,0,0);ze(_=>{b.setFromNormalAndCoplanarPoint(l,j).applyMatrix4(v.current.matrixWorld);const w=v.current.material,K=w.uniforms.worldCamProjPosition,A=w.uniforms.worldPlanePosition;b.projectPoint(_.camera.position,K.value),A.value.set(0,0,0).applyMatrix4(v.current.matrixWorld)});const M={cellSize:e,sectionSize:m,cellColor:n,sectionColor:i,cellThickness:u,sectionThickness:g},N={fadeDistance:s,fadeStrength:c,fadeFrom:I,infiniteGrid:d,followCamera:f};return D.createElement("mesh",Ie({ref:v,frustumCulled:!1},p),D.createElement("gridMaterial",Ie({transparent:!0,"extensions-derivatives":!0,side:C},M,N)),D.createElement("planeGeometry",{args:o}))}),z=({size:o=18,children:n,...i})=>t.jsx("svg",{width:o,height:o,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...i,children:n}),$e=o=>t.jsxs(z,{...o,children:[t.jsx("path",{d:"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("circle",{cx:"12",cy:"12",r:"2.6",stroke:"currentColor",strokeWidth:"1.7"})]}),Ue=o=>t.jsxs(z,{...o,children:[t.jsx("path",{d:"M4 4l16 16",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"}),t.jsx("path",{d:"M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.3 4M6.2 6.9A15 15 0 0 0 2.5 12S6 19 12 19a9 9 0 0 0 4-1",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),it=o=>t.jsx(z,{...o,children:t.jsx("path",{d:"M6 6l12 12M18 6L6 18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),_e=o=>t.jsx(z,{...o,children:t.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),lt=o=>t.jsx(z,{...o,children:t.jsx("path",{d:"M7 10l5 5 5-5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),st=o=>t.jsx(z,{...o,children:t.jsx("path",{d:"M5 12.5l4.2 4L19 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),Jt=o=>t.jsx(z,{...o,children:[8,12,16].map(n=>t.jsxs("g",{children:[t.jsx("circle",{cx:"9.4",cy:n,r:"1.15",fill:"currentColor"}),t.jsx("circle",{cx:"14.6",cy:n,r:"1.15",fill:"currentColor"})]},n))}),eo=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"11",cy:"11",r:"6.5",stroke:"currentColor",strokeWidth:"1.8"}),t.jsx("path",{d:"M15.8 15.8L20.5 20.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),to=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"6",y:"10.5",width:"12",height:"8.5",rx:"2",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",stroke:"currentColor",strokeWidth:"1.7"})]}),oo=o=>t.jsx(z,{...o,children:t.jsx("path",{d:"M13 2.5L5.5 13.5h5L10 21.5l8-11.5h-5.2L13 2.5Z",fill:"currentColor"})}),ao=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"3.5",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("rect",{x:"13.1",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("rect",{x:"3.5",y:"13.1",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("rect",{x:"13.1",y:"13.1",width:"7.4",height:"7.4",rx:"3.7",stroke:"currentColor",strokeWidth:"1.7"})]}),Ze=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"12",cy:"12",r:"6.2",stroke:"currentColor",strokeWidth:"1.6",opacity:"0.9"}),t.jsx("circle",{cx:"12",cy:"12",r:"2.2",fill:"currentColor",opacity:"0.9"})]}),ae=({id:o,from:n,to:i,vertical:e=!1})=>t.jsxs("linearGradient",{id:o,x1:"0",y1:"0",x2:e?"0":"1",y2:e?"1":"0",children:[t.jsx("stop",{offset:"0",stopColor:n}),t.jsx("stop",{offset:"1",stopColor:i})]}),no=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsxs("linearGradient",{id:"sm-rainbow",x1:"0",y1:"0",x2:"1",y2:"1",children:[t.jsx("stop",{offset:"0",stopColor:"#ff5f6d"}),t.jsx("stop",{offset:"0.35",stopColor:"#ffc371"}),t.jsx("stop",{offset:"0.65",stopColor:"#7ee8a2"}),t.jsx("stop",{offset:"1",stopColor:"#7aa8ff"})]})}),t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-rainbow)"})]}),io=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsx(ae,{id:"sm-normal",from:"#b48cff",to:"#4d7cff",vertical:!0})}),t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-normal)"}),t.jsx("circle",{cx:"9.4",cy:"9",r:"2.6",fill:"#ffffff",opacity:"0.35"})]}),lo=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsx(ae,{id:"sm-depth",from:"#8f9bb3",to:"#39415a",vertical:!0})}),t.jsx("path",{d:"M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z",fill:"url(#sm-depth)"})]}),so=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsx(ae,{id:"sm-gradient",from:"#f2f2f2",to:"#4a4a4a",vertical:!0})}),t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-gradient)"})]}),ro=o=>t.jsx(z,{...o,children:[7.5,12,16.5].map(n=>t.jsx("path",{d:`M4 ${n}c2.4-2.6 4.8 2.6 7.2 0s4.8 2.6 8.8 0`,stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",fill:"none"},n))}),co=o=>t.jsx(z,{...o,children:t.jsx("circle",{cx:"12",cy:"12",r:"8",stroke:"currentColor",strokeWidth:"4.4",opacity:"0.85"})}),_o=o=>t.jsxs(z,{...o,children:[t.jsx("path",{d:"M12 3.5l7.4 4.3v8.4L12 20.5l-7.4-4.3V7.8L12 3.5Z",fill:"currentColor",opacity:"0.35"}),t.jsx("path",{d:"M12 7l4.3 2.5v5L12 17l-4.3-2.5v-5L12 7Z",fill:"currentColor",opacity:"0.9"})]}),fo=o=>t.jsx(z,{...o,children:[7,12,17].map((n,i)=>t.jsx("g",{fill:"currentColor",opacity:.9-i*.18,children:[5,9.5,14,18.5].map((e,m)=>t.jsx("circle",{cx:e+i%2*1.4,cy:n+m%2*1.2-.6,r:"1.05"},e))},n))}),mo=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"12",cy:"13.5",r:"7.5",stroke:"#ff6b6b",strokeWidth:"1.9",fill:"none"}),t.jsx("circle",{cx:"12",cy:"15",r:"5",stroke:"#ffc94d",strokeWidth:"1.9",fill:"none"}),t.jsx("circle",{cx:"12",cy:"16.5",r:"2.6",stroke:"#5fd08a",strokeWidth:"1.9",fill:"none"})]}),po=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.28"}),t.jsx("path",{d:"M12 3.6a8.4 8.4 0 0 1 0 16.8V3.6Z",fill:"currentColor",opacity:"0.95"})]}),uo=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"12",cy:"12",r:"8.2",stroke:"currentColor",strokeWidth:"1.8"}),t.jsx("circle",{cx:"12",cy:"12",r:"4.6",stroke:"currentColor",strokeWidth:"1.8"})]}),ho=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsx(ae,{id:"sm-glass",from:"#eef7fb",to:"#9fc4d8",vertical:!0})}),t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-glass)",opacity:"0.9"}),t.jsx("path",{d:"M7.5 9.5c1-2 3.4-3.2 5.6-3",stroke:"#ffffff",strokeWidth:"1.8",strokeLinecap:"round",fill:"none"})]}),yo=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsx(ae,{id:"sm-reflect",from:"#f5f9ff",to:"#5b7ea8",vertical:!0})}),t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-reflect)"}),t.jsx("path",{d:"M6.5 13.5c3.5-1.2 7.5-1.2 11 0",stroke:"#ffffff",strokeWidth:"1.6",opacity:"0.7",fill:"none"})]}),xo=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsxs("radialGradient",{id:"sm-matcap",cx:"0.35",cy:"0.3",r:"0.95",children:[t.jsx("stop",{offset:"0",stopColor:"#ffffff"}),t.jsx("stop",{offset:"0.55",stopColor:"#b9b9b9"}),t.jsx("stop",{offset:"1",stopColor:"#5c5c5c"})]})}),t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-matcap)"})]}),vo=o=>t.jsxs(z,{...o,children:[t.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.3"}),[[8.5,8.5],[13.5,7.5],[16.5,11.5],[10.5,13],[14.5,16],[8,15.5]].map(([n,i])=>t.jsx("circle",{cx:n,cy:i,r:"1.5",fill:"currentColor"},`${n}-${i}`))]}),go=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("path",{d:"M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16",stroke:"currentColor",strokeWidth:"1.5",opacity:"0.85"})]}),bo=o=>t.jsxs(z,{...o,children:[t.jsx("defs",{children:t.jsxs("linearGradient",{id:"sm-vertex",x1:"0",y1:"0",x2:"1",y2:"1",children:[t.jsx("stop",{offset:"0",stopColor:"#ff8f6b"}),t.jsx("stop",{offset:"0.5",stopColor:"#ffd36b"}),t.jsx("stop",{offset:"1",stopColor:"#6bc9ff"})]})}),t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-vertex)"})]}),Io=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("rect",{x:"8",y:"8",width:"8",height:"8",rx:"2",fill:"currentColor",opacity:"0.55"})]}),Do=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),t.jsx("path",{d:"M10.2 8.8l5 3.2-5 3.2V8.8Z",fill:"currentColor",opacity:"0.85"})]}),jo=o=>t.jsxs(z,{...o,children:[t.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7",opacity:"0.7"}),t.jsx("path",{d:"M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3L12 7Z",fill:"currentColor"})]}),De={aiTexture:jo,image:Io,video:Do,color:no,depth:lo,normal:io,gradient:so,noise:ro,fresnel:co,cavity:_o,dust:fo,rainbow:mo,toon:po,outline:uo,glass:ho,reflection:yo,matcap:xo,displace:vo,pattern:go,vertexColor:bo};function ne(o){const n=D.useRef(null);return D.useEffect(()=>{const i=e=>{n.current&&!n.current.contains(e.target)&&o()};return window.addEventListener("mousedown",i),()=>window.removeEventListener("mousedown",i)},[o]),n}const V=o=>{if(!o)return{top:120,left:window.innerWidth-340};const n=o.getBoundingClientRect();return{top:n.top,left:n.left}},ee=({value:o,prefix:n,step:i=.1,width:e,onChange:m,className:f})=>{const[d,s]=D.useState(String(o)),[c,I]=D.useState(!1);D.useEffect(()=>{c||s(String(o))},[o,c]);const u=g=>{const C=parseFloat(g);Number.isFinite(C)?m(C):s(String(o))};return t.jsxs("span",{className:`ninput ${f??""}`,style:e?{width:e}:void 0,children:[n?t.jsx("span",{className:"ninput-prefix",children:n}):null,t.jsx("input",{value:d,step:i,onChange:g=>{s(g.target.value),u(g.target.value)},onFocus:()=>I(!0),onBlur:()=>{I(!1),u(d)},onKeyDown:g=>{g.key==="Enter"&&g.target.blur()}})]})},Xe=({value:o,prefixes:n,step:i,onChange:e})=>t.jsx("span",{className:"vec",children:n.map((m,f)=>t.jsx(ee,{value:o[f]??0,prefix:m,step:i,onChange:d=>{const s=[...o];s[f]=d,e(s)}},m+f))}),zo=({value:o,onChange:n,percent:i})=>t.jsxs("span",{className:"colorfield",children:[t.jsxs("label",{className:"swatch",children:[t.jsx("span",{style:{background:o}}),t.jsx("input",{type:"color",value:o,onChange:e=>n(e.target.value)})]}),t.jsx("span",{className:"hexbox",children:t.jsx("input",{value:o.replace("#","").toUpperCase(),onChange:e=>n(`#${e.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}),i?t.jsx("span",{className:"ninput pct",children:t.jsx("input",{value:"100",readOnly:!0})}):null]}),ce=({value:o,options:n,onChange:i})=>t.jsx("span",{className:"segmented",children:n.map(e=>t.jsx("button",{className:e===o?"on":"",onClick:()=>i(e),children:e[0].toUpperCase()+e.slice(1)},e))}),te=({value:o,options:n,onChange:i,placeholder:e,style:m})=>{const[f,d]=D.useState(!1),s=ne(()=>d(!1)),c=n.find(I=>I.value===o);return t.jsxs("div",{className:"dropdown",style:m,ref:s,children:[t.jsxs("button",{className:"dropdown-btn",onClick:()=>d(I=>!I),children:[t.jsx("span",{children:(c==null?void 0:c.label)??e??o}),t.jsx(lt,{size:14})]}),f?t.jsx("div",{className:"dropdown-menu",children:n.map(I=>t.jsx("button",{className:I.value===o?"on":"",onClick:()=>{i(I.value),d(!1)},children:I.label},I.value))}):null]})},wo=({title:o,anchor:n,width:i=440,onClose:e,children:m})=>{const f=ne(e),d={left:Math.max(12,n.left-i-14),top:Math.min(Math.max(12,n.top-8),Math.max(window.innerHeight-360,12)),width:i};return t.jsxs("div",{className:"popup",style:d,ref:f,children:[t.jsxs("header",{children:[t.jsx("h3",{children:o}),t.jsx("button",{className:"iconbtn",onClick:e,children:t.jsx(it,{size:16})})]}),t.jsx("div",{className:"popup-body",children:m})]})},Po=["normal","add","subtract","multiply","screen","overlay","softlight","lighten","darken","divide","reflect","negation"],rt={normal:"Normal",add:"Add",subtract:"Subtract",multiply:"Multiply",screen:"Screen",overlay:"Overlay",softlight:"Soft Light",lighten:"Lighten",darken:"Darken",divide:"Divide",reflect:"Reflect",negation:"Negation"},ko=[{key:"mode",label:"Mode",type:"segment",options:["mask","color"],group:0},{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:1},{key:"size",label:"Size",type:"vec3",prefix:"XYZ",group:1},{key:"scale",label:"Scale",type:"number",prefix:"S",step:.1,group:1},{key:"movement",label:"Movement",type:"number",prefix:"M",step:.1,group:1},{key:"colorA",label:"Color",type:"color",group:1},{key:"colorB",label:"Color",type:"color",group:1},{key:"colorC",label:"Color",type:"color",group:1},{key:"colorD",label:"Color",type:"color",group:1},{key:"distortion",label:"Distortion",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorA",label:"FactorA",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorB",label:"FactorB",type:"vec2",prefix:"XY",step:.1,group:2}],Y={aiTexture:{label:"AI Texture",icon:"aiTexture",defaults:{tint:"#9aa0a6"},fields:[{key:"tint",label:"Tint",type:"color",group:0}]},image:{label:"Image",icon:"image",defaults:{tint:"#8f8f8f"},fields:[{key:"tint",label:"Tint",type:"color",group:0}]},video:{label:"Video",icon:"video",defaults:{tint:"#8f8f8f"},fields:[{key:"tint",label:"Tint",type:"color",group:0}]},color:{label:"Color",icon:"color",hexKey:"color",defaults:{color:"#54545e"},fields:[{key:"color",label:"Color",type:"color",group:0}]},depth:{label:"Depth",icon:"depth",defaults:{colorA:"#ffffff",colorB:"#1c1c1c",near:2,far:10},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"near",label:"Near",type:"number",step:.1,group:0},{key:"far",label:"Far",type:"number",step:.5,group:0}]},normal:{label:"Normal",icon:"normal",defaults:{direction:[1,1,1],tint:"#ffffff"},fields:[{key:"direction",label:"Direction",type:"vec3",prefix:"XYZ",step:.1,group:0},{key:"tint",label:"Tint",type:"color",group:0}]},gradient:{label:"Gradient",icon:"gradient",defaults:{colorA:"#ffffff",colorB:"#232323",axes:"y",start:-1,end:1,contrast:1},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"axes",label:"Axes",type:"select",options:["x","y","z"],group:0},{key:"start",label:"Start",type:"number",step:.1,group:1},{key:"end",label:"End",type:"number",step:.1,group:1},{key:"contrast",label:"Contrast",type:"number",step:.1,group:1}]},noise:{label:"Noise",icon:"noise",defaults:{mode:"color",type:"simplex",size:[100,100,100],scale:1,movement:1,colorA:"#666666",colorB:"#666666",colorC:"#ffffff",colorD:"#ffffff",distortion:[1,1],factorA:[1.7,9.2],factorB:[8.3,2.8]},fields:ko},fresnel:{label:"Fresnel",icon:"fresnel",defaults:{color:"#ffffff",power:3,intensity:1,bias:0},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0},{key:"intensity",label:"Intensity",type:"number",step:.1,group:0},{key:"bias",label:"Bias",type:"number",step:.05,group:0}]},cavity:{label:"Cavity",icon:"cavity",defaults:{scale:2.5,threshold:.55,strength:.8},fields:[{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"threshold",label:"Threshold",type:"number",step:.05,group:0},{key:"strength",label:"Strength",type:"number",step:.05,group:0}]},dust:{label:"Dust",icon:"dust",defaults:{color:"#ffffff",scale:14,coverage:.18},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0},{key:"coverage",label:"Coverage",type:"number",step:.02,group:0}]},rainbow:{label:"Rainbow",icon:"rainbow",defaults:{hueShift:0,saturation:.75},fields:[{key:"hueShift",label:"Hue Shift",type:"number",step:.05,group:0},{key:"saturation",label:"Saturation",type:"number",step:.05,group:0}]},toon:{label:"Toon",icon:"toon",defaults:{color:"#ff9060",steps:3},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"steps",label:"Steps",type:"number",step:1,group:0}]},outline:{label:"Outline",icon:"outline",defaults:{color:"#101010",width:.08,threshold:.32},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"width",label:"Width",type:"number",step:.01,group:0},{key:"threshold",label:"Threshold",type:"number",step:.02,group:0}]},glass:{label:"Glass",icon:"glass",defaults:{color:"#bfe3ef",edge:.9},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"edge",label:"Edge",type:"number",step:.05,group:0}]},reflection:{label:"Reflection",icon:"reflection",defaults:{sky:"#bcd6ff",ground:"#3a2f2a",power:1.2},fields:[{key:"sky",label:"Sky",type:"color",group:0},{key:"ground",label:"Ground",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0}]},matcap:{label:"Matcap",icon:"matcap",defaults:{light:"#f2f2f2",dark:"#3c3c3c",rim:.6},fields:[{key:"light",label:"Light",type:"color",group:0},{key:"dark",label:"Dark",type:"color",group:0},{key:"rim",label:"Rim",type:"number",step:.05,group:0}]},displace:{label:"Displace",icon:"displace",defaults:{strength:.22,scale:2.4,offset:[0,0,0],type:"simplex"},fields:[{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:0},{key:"strength",label:"Strength",type:"number",step:.01,group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"offset",label:"Offset",type:"vec3",prefix:"XYZ",step:.1,group:0}]},pattern:{label:"Pattern",icon:"pattern",defaults:{colorA:"#e8e8e8",colorB:"#3a3a3a",scale:8,pattern:"checker"},fields:[{key:"pattern",label:"Type",type:"select",options:["checker","stripes"],group:0},{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0}]},vertexColor:{label:"Vertex Color",icon:"vertexColor",defaults:{colorA:"#7fe0c3",colorB:"#7f9fe0"},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0}]}},Co=["aiTexture","image","video","color","depth","normal","gradient","noise","fresnel","cavity","dust","rainbow","toon","outline","glass","reflection","matcap","displace","pattern","vertexColor"],No={enabled:!0,strength:100,type:"phong",color:"#ffffff",shining:48,bumpMap:"none",occlusion:!0},Mo=[{key:"type",label:"Type",type:"select",options:["lambert","phong","physical","toon"],group:0},{key:"color",label:"Color",type:"color",group:0},{key:"shining",label:"Shining",type:"number",step:1,group:0},{key:"bumpMap",label:"Bump Map",type:"select",options:["none","noise"],group:1},{key:"occlusion",label:"Occlusion",type:"segment",options:["on","off"],group:2}];let Eo=0;const So=()=>`l${++Eo}`,oe=(o,n={})=>{const i=Y[o];return{id:So(),kind:o,name:i.label,mode:"normal",visible:!0,opacity:100,params:{...i.defaults,...n.params??{}},...n}},Ao=()=>({opacity:100,layers:[oe("color"),oe("noise")],lighting:{...No},wireframe:!1,shading:"normal",sides:"front",shadows:"castreceive",collision:"visibility"}),L=(o,n,i,e,m,f=!0)=>({id:o,name:n,library:"spline",category:i,swatch:e,locked:f,build:()=>({opacity:m.opacity??100,layers:m.layers.map(([d,s])=>oe(d,s)),lighting:{enabled:!0,strength:100,type:"phong",color:"#ffffff",shining:48,bumpMap:"none",occlusion:!0,...m.lighting??{}}})}),je=[L("gradient-pastel-shiny-01","Gradient Pastel Shiny 01","Gradient",["#ffb199","#ff8177"],{layers:[["gradient",{params:{colorA:"#ffb199",colorB:"#ff8177",axes:"y",start:-1.1,end:.9}}],["fresnel",{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}]],lighting:{type:"physical",shining:160}}),L("gradient-pastel-shiny-03","Gradient Pastel Shiny 03","Gradient",["#96fbc4","#f9f586"],{layers:[["gradient",{params:{colorA:"#96fbc4",colorB:"#f9f586",axes:"y",start:-1.1,end:.9}}],["fresnel",{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}]],lighting:{type:"physical",shining:160}}),L("gradient-pastel-shiny-04","Gradient Pastel Shiny 04","Gradient",["#a1c4fd","#c2e9fb"],{layers:[["gradient",{params:{colorA:"#a1c4fd",colorB:"#c2e9fb",axes:"y",start:-1.1,end:.9}}],["fresnel",{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}]],lighting:{type:"physical",shining:160}}),L("gradient-contrast-01","Gradient Contrast 01","Gradient",["#ff9a5a","#7d2ae8"],{layers:[["gradient",{params:{colorA:"#ff9a5a",colorB:"#7d2ae8",axes:"y",start:-1,end:1}}],["fresnel",{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}]],lighting:{type:"phong",shining:96}}),L("gradient-contrast-02","Gradient Contrast 02","Gradient",["#11998e","#38ef7d"],{layers:[["gradient",{params:{colorA:"#11998e",colorB:"#38ef7d",axes:"y",start:-1,end:1}}],["fresnel",{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}]],lighting:{type:"phong",shining:96}}),L("gradient-contrast-03","Gradient Contrast 03","Gradient",["#43cea2","#f9d423"],{layers:[["gradient",{params:{colorA:"#43cea2",colorB:"#f9d423",axes:"y",start:-1,end:1}}],["fresnel",{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}]],lighting:{type:"phong",shining:96}}),L("gradient-contrast-04","Gradient Contrast 04","Gradient",["#6a11cb","#2575fc"],{layers:[["gradient",{params:{colorA:"#6a11cb",colorB:"#2575fc",axes:"y",start:-1,end:1}}],["fresnel",{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}]],lighting:{type:"phong",shining:96}}),L("glass-frosted","Frosted Glass","Glass",["#cfe8f2","#8fb8c9"],{opacity:45,layers:[["glass",{params:{color:"#cfe8f2",edge:.75}}],["fresnel",{opacity:70,params:{color:"#ffffff",power:2.2,intensity:.9,bias:0}}]],lighting:{type:"physical",shining:200}}),L("chrome-metal","Chrome Metal","Metal",["#f4f4f4","#4a4a4a"],{layers:[["matcap",{params:{light:"#ffffff",dark:"#4a4a4a",rim:.85}}],["reflection",{opacity:45,params:{sky:"#e8f1ff",ground:"#2c2c2c",power:1.4}}]],lighting:{type:"phong",shining:220}}),L("soft-clay","Soft Clay","Matte",["#e3c8b8","#c9a18c"],{layers:[["color",{params:{color:"#e3c8b8"}}],["cavity",{opacity:45,params:{scale:2.2,threshold:.5,strength:.7}}]],lighting:{type:"lambert"}}),L("toon-shade","Toon Shade","Toon",["#ff9060","#c14a33"],{layers:[["toon",{params:{color:"#ff9060",steps:3}}],["outline",{params:{color:"#1a0f0a",width:.07,threshold:.3}}]],lighting:{type:"toon"}}),L("iridescent-pearl","Iridescent Pearl","Special",["#d9c8ff","#9fe8ff"],{layers:[["noise",{params:{mode:"color",type:"simplex",scale:1.4,movement:.4,colorA:"#d9c8ff",colorB:"#9fe8ff",colorC:"#ffd9ec",colorD:"#ffffff",distortion:[1.4,2.2],factorA:[1.7,9.2],factorB:[8.3,2.8]}}],["fresnel",{opacity:60,params:{color:"#ffffff",power:2.4,intensity:.9,bias:0}}]],lighting:{type:"physical",shining:140}}),L("grainy-matte","Grainy Matte","Special",["#b8b2a8","#6e6a62"],{layers:[["color",{params:{color:"#b8b2a8"}}],["noise",{mode:"multiply",params:{mode:"color",type:"perlin",scale:6,movement:0,colorA:"#8f8a82",colorB:"#b8b2a8",colorC:"#d8d3ca",colorD:"#e8e4dc",distortion:[.4,1],factorA:[1,1],factorB:[1,1]}}]],lighting:{type:"lambert"}})],Lo=(o,n,i)=>{var m,f;const e=n[o.key];switch(o.type){case"color":return t.jsx(zo,{value:String(e??"#ffffff"),onChange:d=>i(o.key,d),percent:!0});case"number":return t.jsx(ee,{value:typeof e=="number"?e:0,prefix:o.prefix,step:o.step,onChange:d=>i(o.key,d)});case"vec2":return t.jsx(Xe,{value:Array.isArray(e)?e:[0,0],prefixes:(o.prefix??"XY").split(""),step:o.step,onChange:d=>i(o.key,d)});case"vec3":return t.jsx(Xe,{value:Array.isArray(e)?e:[0,0,0],prefixes:(o.prefix??"XYZ").split(""),step:o.step,onChange:d=>i(o.key,d)});case"select":return t.jsx(te,{value:String(e??((m=o.options)==null?void 0:m[0])),options:(o.options??[]).map(d=>({value:d,label:d[0].toUpperCase()+d.slice(1)})),onChange:d=>i(o.key,d),style:{width:168}});case"segment":return t.jsx(ce,{value:String(e??((f=o.options)==null?void 0:f[0])),options:o.options??[],onChange:d=>i(o.key,d)});default:return null}},qe=({title:o,fields:n,params:i,anchor:e,onChange:m,onClose:f})=>{var s;let d=((s=n[0])==null?void 0:s.group)??0;return t.jsx(wo,{title:o,anchor:e,width:452,onClose:f,children:n.map(c=>{const I=c.group!==d;return d=c.group??0,t.jsxs("div",{children:[I?t.jsx("hr",{}):null,t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:c.label}),t.jsx("span",{className:"prow-control",children:Lo(c,i,m)})]})]},c.key)})})},To=({current:o,anchor:n,onPick:i,onClose:e})=>{const m=ne(e);return t.jsxs("div",{className:"tmenu",style:{left:Math.max(12,n.left-232-14),top:Math.min(Math.max(12,n.top-12),Math.max(window.innerHeight-640,12))},ref:m,children:[t.jsxs("button",{className:`tmenu-item ai ${o==="aiTexture"?"on":""}`,onClick:()=>i("aiTexture"),children:[t.jsx("span",{className:"tmenu-icon",children:t.jsx(De.aiTexture,{})}),t.jsx("span",{className:"tmenu-label",children:"AI Texture"}),t.jsx(oo,{size:15,className:"tmenu-bolt"})]}),t.jsx("hr",{}),Co.slice(1).map(f=>{const d=De[f];return t.jsxs("button",{className:`tmenu-item ${o===f?"on":""}`,onClick:()=>i(f),children:[t.jsx("span",{className:"tmenu-icon",children:t.jsx(d,{})}),t.jsx("span",{className:"tmenu-label",children:Y[f].label}),o===f?t.jsx(st,{size:15,className:"tmenu-check"}):null]},f)})]})},Oo=({current:o,anchor:n,onPick:i,onClose:e})=>{const m=ne(e);return t.jsx("div",{className:"tmenu blend",style:{left:Math.max(12,n.left-190),top:Math.min(n.top+20,window.innerHeight-320)},ref:m,children:Po.map(f=>t.jsxs("button",{className:`tmenu-item ${o===f?"on":""}`,onClick:()=>i(f),children:[t.jsx("span",{className:"tmenu-label",children:rt[f]}),o===f?t.jsx(st,{size:15,className:"tmenu-check"}):null]},f))})},Ko=({colors:o})=>t.jsx("span",{className:"swatch-ball",style:{background:`radial-gradient(circle at 32% 28%, ${o[0]} 0%, ${o[1]} 78%)`}}),Ro=({myMaterials:o,appliedId:n,anchor:i,onApply:e,onSaveCurrent:m,onDeleteMine:f,onClose:d})=>{const s=ne(d),[c,I]=D.useState(""),[u,g]=D.useState("all"),[C,p]=D.useState("all"),x=D.useMemo(()=>["all",...Array.from(new Set(je.map(_=>_.category)))],[]),v=c.trim().toLowerCase(),b=u==="all"||u==="mine",l=u==="all"||u==="spline",j=o.filter(_=>!v||_.name.toLowerCase().includes(v)),M=je.filter(_=>l&&(C==="all"||_.category===C)&&(!v||_.name.toLowerCase().includes(v))),N=(_,w=!1)=>t.jsxs("div",{className:`asset-row ${n===_.id?"applied":""}`,onClick:()=>e(_),children:[t.jsx(Ko,{colors:_.swatch}),t.jsx("span",{className:"asset-name",children:_.name}),w?t.jsx("button",{className:"iconbtn dim",title:"Delete",onClick:K=>{K.stopPropagation(),f(_.id)},children:t.jsx(_e,{size:14,style:{transform:"rotate(45deg)"}})}):t.jsx("span",{className:"asset-lock",children:_.locked?t.jsx(to,{size:14}):null})]},_.id);return t.jsxs("div",{className:"assets",style:{left:Math.max(12,i.left-384-14),top:Math.min(Math.max(12,i.top-60),Math.max(window.innerHeight-620,12))},ref:s,children:[t.jsxs("header",{children:[t.jsx("h3",{children:"Material Assets"}),t.jsx("button",{className:"iconbtn",onClick:d,children:"×"})]}),t.jsxs("div",{className:"assets-toolbar",children:[t.jsx("button",{className:"assets-add",title:"Save current material",onClick:m,children:t.jsx(_e,{size:17})}),t.jsxs("label",{className:"assets-search",children:[t.jsx(eo,{size:15}),t.jsx("input",{placeholder:"Search",value:c,onChange:_=>I(_.target.value)})]})]}),t.jsx(te,{value:u,options:[{value:"all",label:"All Libraries"},{value:"mine",label:"My Materials"},{value:"spline",label:"Spline Library"}],onChange:g,style:{width:"100%"}}),b?t.jsxs("section",{children:[t.jsx("h4",{children:"My Materials"}),j.length?j.map(_=>N(_,!0)):t.jsx("p",{className:"assets-empty",children:"点击左侧 + 保存当前材质"})]}):null,l?t.jsxs("section",{children:[t.jsxs("div",{className:"assets-section-head",children:[t.jsx("h4",{children:"Spline Library"}),t.jsx(te,{value:C,options:x.map(_=>({value:_,label:_==="all"?"All":_})),onChange:p,style:{width:132}})]}),t.jsx("div",{className:"asset-list",children:M.map(_=>N(_))})]}):null]})},Bo=({material:o,actions:n,myMaterials:i,appliedPresetId:e,onApplyPreset:m,onSavePreset:f,onDeletePreset:d})=>{var C,p,x,v,b;const[s,c]=D.useState({kind:"none"}),I=()=>c({kind:"none"}),u=l=>{const j=Y[l.kind],M=De[l.kind],N=j.hexKey;return t.jsxs("div",{className:`layer-row ${l.visible?"":"hidden"}`,children:[t.jsxs("button",{className:"row-main",onClick:_=>c({kind:"settings",layerId:l.id,anchor:V(_.currentTarget)}),children:[t.jsx(lt,{size:13,className:"row-chevron"}),t.jsx("span",{className:"row-name",children:l.name})]}),t.jsx("button",{className:"row-swatch",title:"Switch layer type",onClick:_=>{_.stopPropagation(),c({kind:"type",layerId:l.id,anchor:V(_.currentTarget)})},children:N?t.jsx("span",{className:"swatch-color",style:{background:String(l.params[N]??"#888")}}):t.jsx(M,{size:17})}),N?t.jsx("span",{className:"ninput hex",children:t.jsx("input",{value:String(l.params[N]??"").replace("#","").toUpperCase(),onChange:_=>n.updateLayerParam(l.id,N,`#${_.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}):null,t.jsxs("span",{className:"ninput opa",children:[t.jsx(ee,{value:l.opacity,onChange:_=>n.updateLayer(l.id,{opacity:Math.min(Math.max(_,0),100)})}),t.jsx("button",{className:"blend-dot",title:`Blend: ${rt[l.mode]}`,onClick:_=>{_.stopPropagation(),c({kind:"blend",layerId:l.id,anchor:V(_.currentTarget)})},children:t.jsx(Ze,{size:13})})]}),t.jsx("button",{className:"iconbtn",onClick:()=>n.updateLayer(l.id,{visible:!l.visible}),children:l.visible?t.jsx($e,{size:16}):t.jsx(Ue,{size:16})}),t.jsx("button",{className:"iconbtn remove",onClick:()=>n.removeLayer(l.id),children:t.jsx(it,{size:14})})]},l.id)},g=()=>t.jsxs("div",{className:`layer-row ${o.lighting.enabled?"":"hidden"}`,children:[t.jsxs("button",{className:"row-main",onClick:l=>c({kind:"lighting",anchor:V(l.currentTarget)}),children:[t.jsx("span",{className:"row-chevron"}),t.jsx("span",{className:"row-name",children:"Lighting"})]}),t.jsx("button",{className:"row-swatch",onClick:l=>c({kind:"lighting",anchor:V(l.currentTarget)}),children:t.jsx("span",{className:"swatch-sphere",style:{background:"radial-gradient(circle at 34% 30%, #ffffff 0%, #c9c9c9 55%, #7c7c7c 100%)"}})}),t.jsxs("span",{className:"ninput opa",children:[t.jsx(ee,{value:o.lighting.strength,onChange:l=>n.updateLighting({strength:Math.min(Math.max(l,0),100)})}),t.jsx("span",{className:"blend-dot static",children:t.jsx(Ze,{size:13})})]}),t.jsx("button",{className:"iconbtn",onClick:()=>n.updateLighting({enabled:!o.lighting.enabled}),children:o.lighting.enabled?t.jsx($e,{size:16}):t.jsx(Ue,{size:16})}),t.jsx("span",{className:"iconbtn placeholder"})]});return t.jsxs("aside",{className:"spanel",children:[t.jsxs("div",{className:"spanel-scroll",children:[t.jsxs("section",{className:"spanel-section",children:[t.jsxs("header",{className:"section-head",children:[t.jsxs("h2",{children:["Material ",t.jsx(Jt,{size:15,className:"drag"})]}),t.jsxs("span",{className:"section-tools",children:[t.jsx(ee,{value:o.opacity,width:64,onChange:l=>n.updateMaterial({opacity:Math.min(Math.max(l,0),100)})}),t.jsx("button",{className:"iconbtn",title:"Material Assets",onClick:l=>c({kind:"assets",anchor:V(l.currentTarget)}),children:t.jsx(ao,{size:16})}),t.jsx("button",{className:"iconbtn",title:"Add layer",onClick:l=>c({kind:"type",layerId:null,anchor:V(l.currentTarget)}),children:t.jsx(_e,{size:17})})]})]}),t.jsxs("div",{className:"layer-list",children:[o.layers.map(u),g()]})]}),t.jsx("section",{className:"spanel-section",children:t.jsxs("header",{className:"section-head",children:[t.jsx("h2",{children:"Modifiers"}),t.jsx("button",{className:"iconbtn",title:"Add modifier (decorative)",children:t.jsx(_e,{size:17})})]})}),t.jsxs("section",{className:"spanel-section",children:[t.jsx("h2",{className:"section-title",children:"Visibility"}),t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:"Wireframe"}),t.jsx("span",{className:"prow-control",children:t.jsx(ce,{value:o.wireframe?"show":"hide",options:["show","hide"],onChange:l=>n.updateMaterial({wireframe:l==="show"})})})]}),t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:"Shading"}),t.jsx("span",{className:"prow-control",children:t.jsx(ce,{value:o.shading,options:["normal","flat"],onChange:l=>n.updateMaterial({shading:l})})})]}),t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:"Sides"}),t.jsx("span",{className:"prow-control",children:t.jsx(ce,{value:o.sides,options:["both","front","back"],onChange:l=>n.updateMaterial({sides:l})})})]}),t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:"Shadows"}),t.jsx("span",{className:"prow-control",children:t.jsx(te,{value:o.shadows,options:[{value:"castreceive",label:"Cast & Receive"},{value:"cast",label:"Cast"},{value:"receive",label:"Receive"},{value:"off",label:"Off"}],onChange:l=>n.updateMaterial({shadows:l}),style:{width:172}})})]})]}),t.jsxs("section",{className:"spanel-section",children:[t.jsx("h2",{className:"section-title",children:"Collision"}),t.jsxs("div",{className:"prow",children:[t.jsx("span",{className:"prow-label",children:"Enabled"}),t.jsx("span",{className:"prow-control",children:t.jsx(te,{value:o.collision,options:[{value:"visibility",label:"Based on Visibility"},{value:"on",label:"On"},{value:"off",label:"Off"}],onChange:l=>n.updateMaterial({collision:l}),style:{width:172}})})]})]})]}),s.kind==="settings"?t.jsx(qe,{title:Y[((C=o.layers.find(l=>l.id===s.layerId))==null?void 0:C.kind)??"color"].label,fields:Y[((p=o.layers.find(l=>l.id===s.layerId))==null?void 0:p.kind)??"color"].fields,params:((x=o.layers.find(l=>l.id===s.layerId))==null?void 0:x.params)??{},anchor:s.anchor,onChange:(l,j)=>n.updateLayerParam(s.layerId,l,j),onClose:I}):null,s.kind==="lighting"?t.jsx(qe,{title:"Lighting",fields:Mo,params:{type:o.lighting.type,color:o.lighting.color,shining:o.lighting.shining,bumpMap:o.lighting.bumpMap,occlusion:o.lighting.occlusion?"on":"off"},anchor:s.anchor,onChange:(l,j)=>{l==="occlusion"?n.updateLighting({occlusion:j==="on"}):l==="type"?n.updateLighting({type:j}):l==="bumpMap"?n.updateLighting({bumpMap:j}):n.updateLighting({[l]:j})},onClose:I}):null,s.kind==="type"?t.jsx(To,{current:s.layerId?(v=o.layers.find(l=>l.id===s.layerId))==null?void 0:v.kind:void 0,anchor:s.anchor,onPick:l=>{s.layerId?n.setLayerKind(s.layerId,l):n.addLayer(l),I()},onClose:I}):null,s.kind==="blend"?t.jsx(Oo,{current:((b=o.layers.find(l=>l.id===s.layerId))==null?void 0:b.mode)??"normal",anchor:s.anchor,onPick:l=>{n.updateLayer(s.layerId,{mode:l}),I()},onClose:I}):null,s.kind==="assets"?t.jsx(Ro,{myMaterials:i,appliedId:e,anchor:s.anchor,onApply:l=>{m(l),I()},onSaveCurrent:f,onDeleteMine:d,onClose:I}):null]})},Qe=`
float lamina_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float lamina_normalize(float v) { return lamina_map(v, -1.0, 1.0, 0.0, 1.0); }
vec3 lamina_hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}
`,Je=`
float lamina_noise_mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 lamina_noise_mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 lamina_noise_perm(vec4 x){return lamina_noise_mod289(((x * 34.0) + 1.0) * x);}
vec4 lamina_noise_permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 lamina_noise_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float lamina_noise_white(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}
float lamina_noise_white(vec3 p) {
  return lamina_noise_white(p.xy);
}

vec3 lamina_noise_fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float lamina_noise_perlin(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = lamina_noise_permute(lamina_noise_permute(ix) + iy);
  vec4 ixy0 = lamina_noise_permute(ixy + iz0);
  vec4 ixy1 = lamina_noise_permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = lamina_noise_taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = lamina_noise_taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = lamina_noise_fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return lamina_normalize(2.2 * n_xyz);
}

float lamina_noise_simplex(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = lamina_noise_permute(lamina_noise_permute(lamina_noise_permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = lamina_noise_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return lamina_normalize(42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))));
}

vec3 lamina_noise_simplex3(vec3 x) {
  float s = lamina_noise_simplex(vec3(x));
  float s1 = lamina_noise_simplex(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = lamina_noise_simplex(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  return vec3(s, s1, s2);
}

vec3 lamina_noise_curl(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = lamina_noise_simplex3(p - dx);
  vec3 p_x1 = lamina_noise_simplex3(p + dx);
  vec3 p_y0 = lamina_noise_simplex3(p - dy);
  vec3 p_y1 = lamina_noise_simplex3(p + dy);
  vec3 p_z0 = lamina_noise_simplex3(p - dz);
  vec3 p_z1 = lamina_noise_simplex3(p + dz);

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / (2.0 * e);
  return normalize(vec3(x, y, z) * divisor);
}

vec3 lamina_permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec3 lamina_dist(vec3 x, vec3 y, vec3 z, bool manhattanDistance) {
  return manhattanDistance ? abs(x) + abs(y) + abs(z) : (x * x + y * y + z * z);
}

float lamina_noise_worley(vec3 P) {
  float jitter = 1.0;
  bool manhattanDistance = false;

  float K = 0.142857142857;
  float Ko = 0.428571428571;
  float K2 = 0.020408163265306;
  float Kz = 0.166666666667;
  float Kzo = 0.416666666667;

  vec3 Pi = mod(floor(P), 289.0);
  vec3 Pf = fract(P) - 0.5;

  vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
  vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
  vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

  vec3 p = lamina_permute(Pi.x + vec3(-1.0, 0.0, 1.0));
  vec3 p1 = lamina_permute(p + Pi.y - 1.0);
  vec3 p2 = lamina_permute(p + Pi.y);
  vec3 p3 = lamina_permute(p + Pi.y + 1.0);

  vec3 p11 = lamina_permute(p1 + Pi.z - 1.0);
  vec3 p12 = lamina_permute(p1 + Pi.z);
  vec3 p13 = lamina_permute(p1 + Pi.z + 1.0);
  vec3 p21 = lamina_permute(p2 + Pi.z - 1.0);
  vec3 p22 = lamina_permute(p2 + Pi.z);
  vec3 p23 = lamina_permute(p2 + Pi.z + 1.0);
  vec3 p31 = lamina_permute(p3 + Pi.z - 1.0);
  vec3 p32 = lamina_permute(p3 + Pi.z);
  vec3 p33 = lamina_permute(p3 + Pi.z + 1.0);

  vec3 ox11 = fract(p11 * K) - Ko;
  vec3 oy11 = mod(floor(p11 * K), 7.0) * K - Ko;
  vec3 oz11 = floor(p11 * K2) * Kz - Kzo;
  vec3 ox12 = fract(p12 * K) - Ko;
  vec3 oy12 = mod(floor(p12 * K), 7.0) * K - Ko;
  vec3 oz12 = floor(p12 * K2) * Kz - Kzo;
  vec3 ox13 = fract(p13 * K) - Ko;
  vec3 oy13 = mod(floor(p13 * K), 7.0) * K - Ko;
  vec3 oz13 = floor(p13 * K2) * Kz - Kzo;
  vec3 ox21 = fract(p21 * K) - Ko;
  vec3 oy21 = mod(floor(p21 * K), 7.0) * K - Ko;
  vec3 oz21 = floor(p21 * K2) * Kz - Kzo;
  vec3 ox22 = fract(p22 * K) - Ko;
  vec3 oy22 = mod(floor(p22 * K), 7.0) * K - Ko;
  vec3 oz22 = floor(p22 * K2) * Kz - Kzo;
  vec3 ox23 = fract(p23 * K) - Ko;
  vec3 oy23 = mod(floor(p23 * K), 7.0) * K - Ko;
  vec3 oz23 = floor(p23 * K2) * Kz - Kzo;
  vec3 ox31 = fract(p31 * K) - Ko;
  vec3 oy31 = mod(floor(p31 * K), 7.0) * K - Ko;
  vec3 oz31 = floor(p31 * K2) * Kz - Kzo;
  vec3 ox32 = fract(p32 * K) - Ko;
  vec3 oy32 = mod(floor(p32 * K), 7.0) * K - Ko;
  vec3 oz32 = floor(p32 * K2) * Kz - Kzo;
  vec3 ox33 = fract(p33 * K) - Ko;
  vec3 oy33 = mod(floor(p33 * K), 7.0) * K - Ko;
  vec3 oz33 = floor(p33 * K2) * Kz - Kzo;

  vec3 dx11 = Pfx + jitter * ox11;
  vec3 dy11 = Pfy.x + jitter * oy11;
  vec3 dz11 = Pfz.x + jitter * oz11;
  vec3 dx12 = Pfx + jitter * ox12;
  vec3 dy12 = Pfy.x + jitter * oy12;
  vec3 dz12 = Pfz.y + jitter * oz12;
  vec3 dx13 = Pfx + jitter * ox13;
  vec3 dy13 = Pfy.x + jitter * oy13;
  vec3 dz13 = Pfz.z + jitter * oz13;
  vec3 dx21 = Pfx + jitter * ox21;
  vec3 dy21 = Pfy.y + jitter * oy21;
  vec3 dz21 = Pfz.x + jitter * oz21;
  vec3 dx22 = Pfx + jitter * ox22;
  vec3 dy22 = Pfy.y + jitter * oy22;
  vec3 dz22 = Pfz.y + jitter * oz22;
  vec3 dx23 = Pfx + jitter * ox23;
  vec3 dy23 = Pfy.y + jitter * oy23;
  vec3 dz23 = Pfz.z + jitter * oz23;
  vec3 dx31 = Pfx + jitter * ox31;
  vec3 dy31 = Pfy.z + jitter * oy31;
  vec3 dz31 = Pfz.x + jitter * oz31;
  vec3 dx32 = Pfx + jitter * ox32;
  vec3 dy32 = Pfy.z + jitter * oz32;
  vec3 dz32 = Pfz.y + jitter * oz32;
  vec3 dx33 = Pfx + jitter * ox33;
  vec3 dy33 = Pfy.z + jitter * oy33;
  vec3 dz33 = Pfz.z + jitter * oz33;

  vec3 d11 = lamina_dist(dx11, dy11, dz11, manhattanDistance);
  vec3 d12 = lamina_dist(dx12, dy12, dz12, manhattanDistance);
  vec3 d13 = lamina_dist(dx13, dy13, dz13, manhattanDistance);
  vec3 d21 = lamina_dist(dx21, dy21, dz21, manhattanDistance);
  vec3 d22 = lamina_dist(dx22, dy22, dz22, manhattanDistance);
  vec3 d23 = lamina_dist(dx23, dy23, dz23, manhattanDistance);
  vec3 d31 = lamina_dist(dx31, dy31, dz31, manhattanDistance);
  vec3 d32 = lamina_dist(dx32, dy32, dz32, manhattanDistance);
  vec3 d33 = lamina_dist(dx33, dy33, dz33, manhattanDistance);

  vec3 d1a = min(d11, d12);
  d12 = max(d11, d12);
  d11 = min(d1a, d13);
  d13 = max(d1a, d13);
  d12 = min(d12, d13);
  vec3 d2a = min(d21, d22);
  d22 = max(d21, d22);
  d21 = min(d2a, d23);
  d23 = max(d2a, d23);
  d22 = min(d22, d23);
  vec3 d3a = min(d31, d32);
  d32 = max(d31, d32);
  d31 = min(d3a, d33);
  d33 = max(d3a, d33);
  d32 = min(d32, d33);
  vec3 da = min(d11, d21);
  d21 = max(d11, d21);
  d11 = min(da, d31);
  d31 = max(da, d31);
  d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
  d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx;
  d12 = min(d12, d21);
  d12 = min(d12, d22);
  d12 = min(d12, d31);
  d12 = min(d12, d32);
  d11.yz = min(d11.yz, d12.xy);
  d11.y = min(d11.y, d12.z);
  d11.y = min(d11.y, d11.z);

  vec2 F = sqrt(d11.xy);
  return F.x;
}

float lamina_noise_swirl(vec3 position) {
  float scale = 0.1;
  float freq = 4.0 * scale;
  float t = 1.0;

  vec3 pos = (position * scale) + lamina_noise_curl(position * 7.0 * scale);

  float worley1 = 1.0 - lamina_noise_worley((pos * (freq * 2.0)) + (t * 2.0));
  float worley2 = 1.0 - lamina_noise_worley((pos * (freq * 4.0)) + (t * 4.0));
  float worley3 = 1.0 - lamina_noise_worley((pos * (freq * 8.0)) + (t * 8.0));
  float worley4 = 1.0 - lamina_noise_worley((pos * (freq * 16.0)) + (t * 16.0));

  float fbm1 = worley1 * 0.625 + worley2 * 0.25 + worley3 * 0.125;
  float fbm2 = worley2 * 0.625 + worley3 * 0.25 + worley4 * 0.125;
  float fbm3 = worley3 * 0.75 + worley4 * 0.25;

  vec3 curlWorleyFbm = vec3(fbm1, fbm2, fbm3);
  return curlWorleyFbm.r * 0.625 + curlWorleyFbm.g * 0.25 + curlWorleyFbm.b * 0.125;
}
`,Fo=`
vec4 lamina_blend_alpha(const in vec4 x, const in vec4 y, const in float opacity) {
  float a = min(y.a, opacity);
  return vec4(y.rgb * a + x.rgb * (1.0 - a), x.a);
}
vec4 lamina_blend_normal(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(y.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_add(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(min(x.xyz + y.xyz, 1.0) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_subtract(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(max(x.xyz + y.xyz - 1.0, 0.0) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_multiply(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(x.xyz * y.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_screen(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4((1.0 - (1.0 - x.xyz) * (1.0 - y.xyz)) * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_overlay_f(const in float x, const in float y) {
  return (x < 0.5) ? (2.0 * x * y) : (1.0 - 2.0 * (1.0 - x) * (1.0 - y));
}
vec4 lamina_blend_overlay(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_overlay_f(x.r, y.r), lamina_blend_overlay_f(x.g, y.g), lamina_blend_overlay_f(x.b, y.b), lamina_blend_overlay_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_softlight_f(const in float x, const in float y) {
  return (y < 0.5) ? (2.0 * x * y + x * x * (1.0 - 2.0 * y)) : (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
}
vec4 lamina_blend_softlight(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_softlight_f(x.r, y.r), lamina_blend_softlight_f(x.g, y.g), lamina_blend_softlight_f(x.b, y.b), lamina_blend_softlight_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_lighten(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(max(x.xyz, y.xyz) * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_darken(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4(min(x.xyz, y.xyz) * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_divide_f(const in float x, const in float y) {
  return (y > 0.0) ? min(x / y, 1.0) : 1.0;
}
vec4 lamina_blend_divide(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_divide_f(x.r, y.r), lamina_blend_divide_f(x.g, y.g), lamina_blend_divide_f(x.b, y.b), lamina_blend_divide_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
float lamina_blend_reflect_f(const in float x, const in float y) {
  return (y == 1.0) ? y : min(x * x / (1.0 - y), 1.0);
}
vec4 lamina_blend_reflect(const in vec4 x, const in vec4 y, const in float opacity) {
  vec4 z = vec4(lamina_blend_reflect_f(x.r, y.r), lamina_blend_reflect_f(x.g, y.g), lamina_blend_reflect_f(x.b, y.b), lamina_blend_reflect_f(x.a, y.a));
  return vec4(z.xyz * opacity + x.xyz * (1.0 - opacity), x.a);
}
vec4 lamina_blend_negation(const in vec4 x, const in vec4 y, const in float opacity) {
  return vec4((1.0 - abs(1.0 - x.xyz - y.xyz)) * opacity + x.xyz * (1.0 - opacity), x.a);
}
`,Go=`
uniform float u_lamina_time;
uniform float u_lamina_opacity;
uniform float u_lamina_lighting;
uniform float u_lamina_lightStrength;
uniform vec3 u_lamina_lightColor;
uniform float u_lamina_shininess;
uniform float u_lamina_bump;
uniform float u_lamina_occlusion;
uniform float u_lamina_flat;
uniform vec3 u_lamina_base;

const vec3 LAMINA_KEY = vec3(0.44462, 0.60634, 0.52599);
const vec3 LAMINA_FILL = vec3(-0.66248, -0.14210, 0.47368);

vec3 lamina_shade(vec3 albedo, vec3 N, vec3 V) {
  if (u_lamina_lighting < 0.5) return albedo;
  float ndl = max(dot(N, LAMINA_KEY), 0.0);
  float ndlF = max(dot(N, LAMINA_FILL), 0.0);
  float ndv = max(dot(N, V), 0.0);
  vec3 lit = albedo;
  if (u_lamina_lighting < 1.5) {
    lit = albedo * (0.34 + 0.78 * ndl + 0.22 * ndlF);
  } else if (u_lamina_lighting < 2.5) {
    vec3 R = reflect(-LAMINA_KEY, N);
    float spec = pow(max(dot(R, V), 0.0), max(u_lamina_shininess, 1.0)) * 0.85;
    lit = albedo * (0.3 + 0.78 * ndl + 0.2 * ndlF) + u_lamina_lightColor * spec;
  } else if (u_lamina_lighting < 3.5) {
    float rough = clamp(1.0 - u_lamina_shininess / 256.0, 0.04, 1.0);
    vec3 H = normalize(LAMINA_KEY + V);
    float spec = pow(max(dot(N, H), 0.0), mix(512.0, 16.0, rough)) * (1.0 - rough) * 1.15;
    float fres = pow(1.0 - ndv, 3.0) * 0.3;
    lit = albedo * (0.26 + 0.82 * ndl + 0.22 * ndlF) + u_lamina_lightColor * spec + albedo * fres;
  } else {
    float cel = floor(ndl * 3.0) / 3.0;
    lit = albedo * (0.34 + 0.66 * cel);
  }
  return mix(albedo, lit, clamp(u_lamina_lightStrength, 0.0, 1.0));
}
`,et={perlin:"lamina_noise_perlin",simplex:"lamina_noise_simplex",cell:"lamina_noise_worley",white:"lamina_noise_white",curl:"lamina_noise_swirl"},Wo={normal:"lamina_blend_normal",add:"lamina_blend_add",subtract:"lamina_blend_subtract",multiply:"lamina_blend_multiply",screen:"lamina_blend_screen",overlay:"lamina_blend_overlay",softlight:"lamina_blend_softlight",lighten:"lamina_blend_lighten",darken:"lamina_blend_darken",divide:"lamina_blend_divide",reflect:"lamina_blend_reflect",negation:"lamina_blend_negation"},Yo={basic:0,lambert:1,phong:2,physical:3,toon:4},tt={aiTexture:{uniforms:"uniform vec3 u___ID___tint;",body:`{
  vec2 f_g___ID__ = floor(v_lamina_uv * 12.0);
  float f_c___ID__ = mod(f_g___ID__.x + f_g___ID__.y, 2.0) * 0.12 + 0.55;
  f_lc___ID__ = vec4(u___ID___tint * f_c___ID__, u___ID___alpha);
}`},image:{uniforms:"uniform vec3 u___ID___tint;",body:`{
  vec2 f_g___ID__ = floor(v_lamina_uv * 12.0);
  float f_c___ID__ = mod(f_g___ID__.x + f_g___ID__.y, 2.0) * 0.12 + 0.55;
  f_lc___ID__ = vec4(u___ID___tint * f_c___ID__, u___ID___alpha);
}`},video:{uniforms:"uniform vec3 u___ID___tint;",body:`{
  vec2 f_g___ID__ = floor(v_lamina_uv * 12.0);
  float f_c___ID__ = mod(f_g___ID__.x + f_g___ID__.y, 2.0) * 0.12 + 0.55;
  f_lc___ID__ = vec4(u___ID___tint * f_c___ID__, u___ID___alpha);
}`},color:{uniforms:"uniform vec3 u___ID___color;",body:`{
  f_lc___ID__ = vec4(u___ID___color, u___ID___alpha);
}`},depth:{uniforms:`uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___near;
uniform float u___ID___far;`,body:`{
  float f_d___ID__ = clamp((length(v_lamina_worldPosition - cameraPosition) - u___ID___near) / max(u___ID___far - u___ID___near, 0.001), 0.0, 1.0);
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_d___ID__), u___ID___alpha);
}`},normal:{uniforms:`uniform vec3 u___ID___direction;
uniform vec3 u___ID___tint;`,body:`{
  vec3 f_n___ID__ = normalize(v_lamina_normal) * 0.5 + 0.5;
  f_lc___ID__ = vec4(u___ID___tint * f_n___ID__ * u___ID___direction, u___ID___alpha);
}`},gradient:{uniforms:`uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___start;
uniform float u___ID___end;
uniform float u___ID___contrast;`,body:`{
  float f_c___ID__ = v_lamina_position%AXIS% * u___ID___contrast;
  float f_s___ID__ = smoothstep(u___ID___start, u___ID___end, f_c___ID__);
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_s___ID__), u___ID___alpha);
}`},noise:{uniforms:`uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform vec3 u___ID___colorC;
uniform vec3 u___ID___colorD;
uniform vec3 u___ID___size;
uniform float u___ID___scale;
uniform float u___ID___movement;
uniform vec2 u___ID___distortion;
uniform vec2 u___ID___factorA;
uniform vec2 u___ID___factorB;`,body:`{
  vec3 f_p___ID__ = v_lamina_position * (u___ID___size / 100.0) * max(u___ID___scale, 0.001);
  float f_t___ID__ = u_lamina_time * 0.2 * u___ID___movement;
  float f_nb___ID__ = %NOISE%(f_p___ID__ * max(u___ID___factorB.y, 0.001) + f_t___ID__) * u___ID___factorB.x * 0.1;
  vec3 f_w___ID__ = vec3(
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 31.7 + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 74.3 + f_t___ID__)) * u___ID___distortion.x * 0.35;
  float f_n___ID__ = lamina_normalize(%NOISE%(f_p___ID__ + f_w___ID__ + vec3(f_nb___ID__) + f_t___ID__));
  vec3 f_c___ID__ = mix(u___ID___colorA, u___ID___colorB, smoothstep(0.0, 0.25, f_n___ID__));
  f_c___ID__ = mix(f_c___ID__, u___ID___colorC, smoothstep(0.25, 0.65, f_n___ID__));
  f_c___ID__ = mix(f_c___ID__, u___ID___colorD, smoothstep(0.65, 1.0, f_n___ID__));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`,maskBody:`{
  vec3 f_p___ID__ = v_lamina_position * (u___ID___size / 100.0) * max(u___ID___scale, 0.001);
  float f_t___ID__ = u_lamina_time * 0.2 * u___ID___movement;
  float f_nb___ID__ = %NOISE%(f_p___ID__ * max(u___ID___factorB.y, 0.001) + f_t___ID__) * u___ID___factorB.x * 0.1;
  vec3 f_w___ID__ = vec3(
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 31.7 + f_t___ID__),
    %NOISE%(f_p___ID__ * max(u___ID___distortion.y, 0.001) + 74.3 + f_t___ID__)) * u___ID___distortion.x * 0.35;
  float f_n___ID__ = lamina_normalize(%NOISE%(f_p___ID__ + f_w___ID__ + vec3(f_nb___ID__) + f_t___ID__));
  lamina_finalColor.a *= mix(1.0, clamp(f_n___ID__, 0.0, 1.0), u___ID___alpha);
}`},fresnel:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___power;
uniform float u___ID___intensity;
uniform float u___ID___bias;`,body:`{
  float f_f___ID__ = pow(1.0 - abs(dot(normalize(v_lamina_viewDir), normalize(v_lamina_normal))), max(u___ID___power, 0.001));
  float f_fv___ID__ = clamp(u___ID___bias + u___ID___intensity * f_f___ID__, 0.0, 1.0);
  f_lc___ID__ = vec4(u___ID___color * f_fv___ID__, u___ID___alpha);
}`},cavity:{uniforms:`uniform float u___ID___scale;
uniform float u___ID___threshold;
uniform float u___ID___strength;`,body:`{
  float f_n___ID__ = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u___ID___scale, 0.001)));
  float f_c___ID__ = 1.0 - smoothstep(u___ID___threshold, u___ID___threshold + 0.18, f_n___ID__);
  f_lc___ID__ = vec4(vec3(0.0), f_c___ID__ * u___ID___strength * u___ID___alpha);
}`},dust:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___scale;
uniform float u___ID___coverage;`,body:`{
  float f_n___ID__ = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u___ID___scale, 0.001)));
  float f_d___ID__ = smoothstep(1.0 - u___ID___coverage, 1.0 - u___ID___coverage * 0.6, f_n___ID__);
  f_lc___ID__ = vec4(u___ID___color, f_d___ID__ * u___ID___alpha);
}`},rainbow:{uniforms:`uniform float u___ID___hueShift;
uniform float u___ID___saturation;`,body:`{
  float f_h___ID__ = fract(v_lamina_position.x * 0.18 + v_lamina_position.y * 0.22 + u___ID___hueShift);
  vec3 f_c___ID__ = lamina_hsl2rgb(vec3(f_h___ID__, clamp(u___ID___saturation, 0.0, 1.0), 0.6));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`},toon:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___steps;`,body:`{
  float f_ndl___ID__ = max(dot(normalize(v_lamina_normal), LAMINA_KEY), 0.0);
  float f_cel___ID__ = floor(f_ndl___ID__ * max(u___ID___steps, 1.0)) / max(u___ID___steps, 1.0);
  f_lc___ID__ = vec4(u___ID___color * (0.35 + 0.65 * f_cel___ID__), u___ID___alpha);
}`},outline:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___width;
uniform float u___ID___threshold;`,body:`{
  float f_rim___ID__ = 1.0 - abs(dot(normalize(v_lamina_viewDir), normalize(v_lamina_normal)));
  float f_o___ID__ = 1.0 - smoothstep(u___ID___threshold - u___ID___width, u___ID___threshold + 0.001, f_rim___ID__);
  f_lc___ID__ = vec4(u___ID___color, (1.0 - f_o___ID__) * u___ID___alpha);
}`},glass:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___edge;`,body:`{
  float f_f___ID__ = pow(1.0 - abs(dot(normalize(v_lamina_viewDir), normalize(v_lamina_normal))), 2.0);
  vec3 f_c___ID__ = mix(u___ID___color, vec3(1.0), f_f___ID__ * u___ID___edge);
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`},reflection:{uniforms:`uniform vec3 u___ID___sky;
uniform vec3 u___ID___ground;
uniform float u___ID___power;`,body:`{
  vec3 f_r___ID__ = reflect(-normalize(v_lamina_viewDir), normalize(v_lamina_normal));
  float f_m___ID__ = pow(clamp(f_r___ID__.y * 0.5 + 0.5, 0.0, 1.0), max(u___ID___power, 0.001));
  f_lc___ID__ = vec4(mix(u___ID___ground, u___ID___sky, f_m___ID__), u___ID___alpha);
}`},matcap:{uniforms:`uniform vec3 u___ID___light;
uniform vec3 u___ID___dark;
uniform float u___ID___rim;`,body:`{
  vec3 f_n___ID__ = normalize(v_lamina_normal);
  vec2 f_m___ID__ = f_n___ID__.xy * 0.5 + 0.5;
  vec3 f_c___ID__ = mix(u___ID___dark, u___ID___light, clamp(f_m___ID__.y * 0.85 + 0.15, 0.0, 1.0));
  f_c___ID__ += vec3(1.0) * smoothstep(0.16, 0.0, distance(f_m___ID__, vec2(0.64, 0.74))) * u___ID___rim;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`},pattern:{uniforms:`uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;
uniform float u___ID___scale;`,body:`{
  vec2 f_g___ID__ = v_lamina_uv * max(u___ID___scale, 0.001);
  float f_m___ID__ = %PAT%;
  f_lc___ID__ = vec4(mix(u___ID___colorA, u___ID___colorB, f_m___ID__), u___ID___alpha);
}`},vertexColor:{uniforms:`uniform vec3 u___ID___colorA;
uniform vec3 u___ID___colorB;`,body:`{
  vec3 f_n___ID__ = normalize(v_lamina_normal);
  vec3 f_c___ID__ = mix(u___ID___colorA, u___ID___colorB, f_n___ID__.y * 0.5 + 0.5) * (0.75 + 0.25 * length(f_n___ID__.xz));
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`}},ot={uniforms:`uniform float u___ID___strength;
uniform float u___ID___scale;
uniform vec3 u___ID___offset;
vec3 lamina_displace___ID__(vec3 p) {
  float f_n = %NOISE%((p + u___ID___offset) * max(u___ID___scale, 0.001)) * u___ID___strength;
  return p + (f_n * normal);
}
vec3 lamina_orthogonal___ID__(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}`,body:`{
  vec3 f_newPos___ID__ = lamina_displace___ID__(lamina_finalPosition);
  float f_off___ID__ = 0.001;
  vec3 f_tan___ID__ = lamina_orthogonal___ID__(normal);
  vec3 f_bitan___ID__ = normalize(cross(normal, f_tan___ID__));
  vec3 f_n1___ID__ = lamina_displace___ID__(lamina_finalPosition + f_tan___ID__ * f_off___ID__);
  vec3 f_n2___ID__ = lamina_displace___ID__(lamina_finalPosition + f_bitan___ID__ * f_off___ID__);
  lamina_finalNormal = normalize(cross(f_n1___ID__ - f_newPos___ID__, f_n2___ID__ - f_newPos___ID__));
  lamina_finalPosition = f_newPos___ID__;
}`},ge=o=>new be(o).convertSRGBToLinear(),Ho=(o,n)=>{const i=Array.isArray(o)&&o.length>=2?o:n;return new T(i[0],i[1])},Vo=(o,n)=>{const i=Array.isArray(o)&&o.length>=3?o:n;return new S(i[0],i[1],i[2])},$o=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
uniform float u_lamina_time;
`,Uo=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
`;function Zo(o){var I;const n={u_lamina_time:{value:0},u_lamina_opacity:{value:o.opacity/100},u_lamina_lighting:{value:o.lighting.enabled?Yo[o.lighting.type]:0},u_lamina_lightStrength:{value:o.lighting.strength/100},u_lamina_lightColor:{value:ge(o.lighting.color)},u_lamina_shininess:{value:o.lighting.shining},u_lamina_bump:{value:o.lighting.bumpMap==="noise"?1:0},u_lamina_occlusion:{value:o.lighting.occlusion?1:0},u_lamina_flat:{value:o.shading==="flat"?1:0},u_lamina_base:{value:ge("#ffffff")}},i=[],e=[],m=[],f=[];for(const u of o.layers){if(!u.visible)continue;const g=u.id,C=Y[u.kind],p=tt[u.kind];if(!p||!C)continue;n[`u_${g}_alpha`]={value:u.opacity/100};for(const j of C.fields){const M=u.params[j.key],N=`u_${g}_${j.key}`;switch(j.type){case"color":n[N]={value:ge(typeof M=="string"?M:"#ffffff")};break;case"vec2":n[N]={value:Ho(M,[1,1])};break;case"vec3":n[N]={value:Vo(M,[0,0,0])};break;case"select":case"segment":n[N]={value:Math.max(((I=j.options)==null?void 0:I.indexOf(String(M)))??0,0)};break;default:n[N]={value:typeof M=="number"?M:0}}}const x=et[String(u.params.type)]??et.simplex,v=j=>j.replaceAll("__ID__",g).replaceAll("%NOISE%",x).replaceAll("%AXIS%",`.${u.params.axes??"y"}`).replaceAll("%PAT%",u.params.pattern==="stripes"?"step(0.5, fract(f_g___ID__.x * 0.5))".replaceAll("__ID__",g):"mod(floor(f_g___ID__.x) + floor(f_g___ID__.y), 2.0)".replaceAll("__ID__",g));i.push(v(p.uniforms));const b=u.kind==="noise"&&u.params.mode==="mask",l=b?tt.noise.maskBody:p.body;if(b)e.push(v(l));else{const j=Wo[u.mode];e.push(`{
  vec4 f_lc___ID__;
${v(l)}
  lamina_finalColor = ${j}(lamina_finalColor, f_lc___ID__, u___ID___alpha);
}`.replaceAll("__ID__",g))}u.kind==="displace"&&p!==void 0&&(m.push(v(ot.uniforms)),f.push(v(ot.body)))}const d=`
${Qe}
${Je}
${$o}
${m.join(`
`)}
void main() {
  vec3 lamina_finalPosition = position;
  vec3 lamina_finalNormal = normal;
${f.join(`
`)}
  vec4 lamina_world = modelMatrix * vec4(lamina_finalPosition, 1.0);
  v_lamina_worldPosition = lamina_world.xyz;
  v_lamina_position = lamina_finalPosition;
  v_lamina_uv = uv;
  v_lamina_normal = normalize(mat3(modelMatrix) * lamina_finalNormal);
  v_lamina_viewDir = cameraPosition - lamina_world.xyz;
  gl_Position = projectionMatrix * viewMatrix * lamina_world;
}
`,s=`
${Qe}
${Je}
${Fo}
${Uo}
${i.join(`
`)}
${Go}
void main() {
  vec3 N = normalize(v_lamina_normal);
  vec3 V = normalize(v_lamina_viewDir);
  if (u_lamina_flat > 0.5) {
    vec3 lamina_face = normalize(cross(dFdx(v_lamina_worldPosition), dFdy(v_lamina_worldPosition)));
    N = dot(lamina_face, N) < 0.0 ? -lamina_face : lamina_face;
  }
  if (u_lamina_bump > 0.5) {
    vec3 lamina_T = normalize(cross(N, vec3(0.0, 1.0, 0.0)) + vec3(0.001));
    vec3 lamina_B = cross(N, lamina_T);
    vec3 lamina_bp = v_lamina_position * 6.0;
    float lamina_e = 0.05;
    float lamina_h0 = lamina_noise_simplex(lamina_bp);
    N = normalize(N - (lamina_T * (lamina_noise_simplex(lamina_bp + vec3(lamina_e, 0.0, 0.0)) - lamina_h0) + lamina_B * (lamina_noise_simplex(lamina_bp + vec3(0.0, lamina_e, 0.0)) - lamina_h0)) * 2.2);
  }
  vec4 lamina_finalColor = vec4(u_lamina_base, u_lamina_opacity);
${e.join(`
`)}
  vec3 lamina_lit = lamina_shade(lamina_finalColor.rgb, N, V);
  float lamina_ndv = max(dot(N, V), 0.0);
  lamina_lit *= mix(1.0, 0.5 + 0.5 * smoothstep(0.0, 1.0, lamina_ndv), u_lamina_occlusion);
  gl_FragColor = vec4(pow(max(lamina_lit, vec3(0.0)), vec3(0.4545)), lamina_finalColor.a);
}
`,c=o.sides==="both"?Et:o.sides==="back"?nt:St;return{vertexShader:d,fragmentShader:s,uniforms:n,side:c}}function Xo(o){const n=Zo(o);return new Mt({vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,uniforms:n.uniforms,side:n.side,transparent:!0,depthWrite:!0})}const qo={knot:()=>new Ot(.82,.3,256,40),sphere:()=>new Tt(1.12,128,72),torus:()=>new Lt(1.02,.44,64,128),capsule:()=>new At(.72,1.1,24,64)},Qo=({geometry:o,material:n})=>{const i=D.useMemo(()=>Xo(n),[n]);return D.useEffect(()=>()=>i.dispose(),[i]),ze(({clock:e})=>{i.uniforms.u_lamina_time.value=e.elapsedTime}),t.jsx("mesh",{geometry:o,children:t.jsx("primitive",{object:i,attach:"material"})})},Jo=({geometry:o})=>t.jsx("mesh",{geometry:o,scale:1.002,children:t.jsx("meshBasicMaterial",{color:"#565656",transparent:!0,opacity:.35,wireframe:!0})}),ea=({geometry:o,material:n})=>{const i=qo[o],e=D.useMemo(()=>i(),[i]);return D.useEffect(()=>()=>e.dispose(),[e]),t.jsxs(Kt,{camera:{fov:42,position:[3.4,1.7,4.4]},dpr:[1,2],gl:{antialias:!0},children:[t.jsx("color",{attach:"background",args:["#141414"]}),t.jsx(Qt,{position:[0,-1.55,0],args:[40,40],cellSize:.6,cellThickness:.6,cellColor:"#262626",sectionSize:3,sectionThickness:1,sectionColor:"#3a3a3a",fadeDistance:26,fadeStrength:1.4,infiniteGrid:!0}),t.jsxs("group",{rotation:[.08,-.5,0],children:[t.jsx(Qo,{geometry:e,material:n}),n.wireframe?t.jsx(Jo,{geometry:e}):null]}),t.jsx(Xt,{enablePan:!1,minDistance:2.6,maxDistance:9})]})},ct="spline-material-lab.my-materials",ta=()=>{try{const o=localStorage.getItem(ct);return o?JSON.parse(o):[]}catch{return[]}},oa=o=>{var n;for(const i of o){const e=Y[i.kind],m=e.hexKey??((n=e.fields.find(f=>f.type==="color"))==null?void 0:n.key);if(m&&typeof i.params[m]=="string"){const f=i.params[m],d=e.fields.filter(c=>c.type==="color")[1],s=d&&typeof i.params[d.key]=="string"?i.params[d.key]:f;return[f,s]}}return["#9aa0a6","#3c3c3c"]},aa=()=>{const[o,n]=D.useState(Ao),[i,e]=D.useState("knot"),[m,f]=D.useState(ta),[d,s]=D.useState(null),c=D.useCallback(p=>{f(p);try{localStorage.setItem(ct,JSON.stringify(p))}catch{}},[]),I=D.useMemo(()=>({updateMaterial:p=>n(x=>({...x,...p})),updateLayer:(p,x)=>n(v=>({...v,layers:v.layers.map(b=>b.id===p?{...b,...x}:b)})),updateLayerParam:(p,x,v)=>n(b=>({...b,layers:b.layers.map(l=>l.id===p?{...l,params:{...l.params,[x]:v}}:l)})),addLayer:p=>n(x=>({...x,layers:[...x.layers,oe(p)]})),setLayerKind:(p,x)=>n(v=>({...v,layers:v.layers.map(b=>{if(b.id!==p)return b;const l=Y[x];return{...b,kind:x,name:l.label,params:{...l.defaults}}})})),removeLayer:p=>n(x=>({...x,layers:x.layers.filter(v=>v.id!==p)})),updateLighting:p=>n(x=>({...x,lighting:{...x.lighting,...p}}))}),[]),u=D.useCallback(p=>{const x=p.build();n(v=>({...v,opacity:x.opacity,layers:x.layers,lighting:x.lighting})),s(p.id)},[]),g=D.useCallback(()=>{n(p=>{const x=`My Material ${m.length+1}`,v={id:`mine-${Date.now()}`,name:x,library:"mine",category:"Custom",swatch:oa(p.layers),build:()=>({opacity:p.opacity,layers:p.layers.map(b=>oe(b.kind,{mode:b.mode,opacity:b.opacity,visible:b.visible,params:{...b.params}})),lighting:{...p.lighting}})};return c([...m,v]),p})},[m,c]),C=D.useCallback(p=>{c(m.filter(x=>x.id!==p)),d===p&&s(null)},[d,m,c]);return t.jsxs("div",{className:"lab",children:[t.jsxs("div",{className:"viewport",children:[t.jsx(ea,{geometry:i,material:o}),t.jsx("div",{className:"viewport-toolbar",children:["knot","sphere","torus","capsule"].map(p=>t.jsx("button",{className:i===p?"on":"",onClick:()=>e(p),children:p[0].toUpperCase()+p.slice(1)},p))}),t.jsxs("div",{className:"viewport-hint",children:["Spline Library ",je.length," presets · 拖拽旋转视角"]})]}),t.jsx(Bo,{material:o,actions:I,myMaterials:m,appliedPresetId:d,onApplyPreset:u,onSavePreset:g,onDeletePreset:C})]})};Pt.createRoot(document.getElementById("root")).render(t.jsx(aa,{}));
