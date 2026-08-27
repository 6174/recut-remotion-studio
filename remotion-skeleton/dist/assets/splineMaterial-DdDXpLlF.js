import{j as e,c as En}from"./client-DOSV_kvz.js";import{r as y}from"./index-DzXGc9LX.js";import{a5 as We,a6 as Nn,J as P,a7 as An,a8 as rn,a9 as ae,C as be,r as ln,D as Ct,aa as Tn,ab as me,ac as ke,ad as pt,ae as ft,M as A,af as Z,P as xe,ag as Ee,ah as cn,ai as Qe,aj as Re,ak as Ye,al as Gt,O as ot,V as ie,am as ht,an as On,ao as _n,R as Ln,u as ee,b as Xe,i as Rn,B as un,W as It,ap as Yn,c as rt,L as Qt,m as Fn,aq as Bn,T as dn,S as Pe,ar as lt,a as Pt,p as Xn,j as Vn,a4 as Zn,as as Kn,at as Un}from"./react-three-fiber.esm-VQIokl-U.js";import{_ as $e,s as Gn}from"./shaderMaterial-DzyXPYjF.js";var Qn=Object.defineProperty,Wn=(t,a,o)=>a in t?Qn(t,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[a]=o,$n=(t,a,o)=>(Wn(t,a+"",o),o);class Hn{constructor(){$n(this,"_listeners")}addEventListener(a,o){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[a]===void 0&&(n[a]=[]),n[a].indexOf(o)===-1&&n[a].push(o)}hasEventListener(a,o){if(this._listeners===void 0)return!1;const n=this._listeners;return n[a]!==void 0&&n[a].indexOf(o)!==-1}removeEventListener(a,o){if(this._listeners===void 0)return;const r=this._listeners[a];if(r!==void 0){const s=r.indexOf(o);s!==-1&&r.splice(s,1)}}dispatchEvent(a){if(this._listeners===void 0)return;const n=this._listeners[a.type];if(n!==void 0){a.target=this;const r=n.slice(0);for(let s=0,_=r.length;s<_;s++)r[s].call(this,a);a.target=null}}}var qn=Object.defineProperty,Jn=(t,a,o)=>a in t?qn(t,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[a]=o,p=(t,a,o)=>(Jn(t,typeof a!="symbol"?a+"":a,o),o);let ea=class extends We{constructor(a,o){super(),p(this,"isTransformControls",!0),p(this,"visible",!1),p(this,"domElement"),p(this,"raycaster",new Nn),p(this,"gizmo"),p(this,"plane"),p(this,"tempVector",new P),p(this,"tempVector2",new P),p(this,"tempQuaternion",new ae),p(this,"unit",{X:new P(1,0,0),Y:new P(0,1,0),Z:new P(0,0,1)}),p(this,"pointStart",new P),p(this,"pointEnd",new P),p(this,"offset",new P),p(this,"rotationAxis",new P),p(this,"startNorm",new P),p(this,"endNorm",new P),p(this,"rotationAngle",0),p(this,"cameraPosition",new P),p(this,"cameraQuaternion",new ae),p(this,"cameraScale",new P),p(this,"parentPosition",new P),p(this,"parentQuaternion",new ae),p(this,"parentQuaternionInv",new ae),p(this,"parentScale",new P),p(this,"worldPositionStart",new P),p(this,"worldQuaternionStart",new ae),p(this,"worldScaleStart",new P),p(this,"worldPosition",new P),p(this,"worldQuaternion",new ae),p(this,"worldQuaternionInv",new ae),p(this,"worldScale",new P),p(this,"eye",new P),p(this,"positionStart",new P),p(this,"quaternionStart",new ae),p(this,"scaleStart",new P),p(this,"camera"),p(this,"object"),p(this,"enabled",!0),p(this,"axis",null),p(this,"mode","translate"),p(this,"translationSnap",null),p(this,"rotationSnap",null),p(this,"scaleSnap",null),p(this,"space","world"),p(this,"size",1),p(this,"dragging",!1),p(this,"showX",!0),p(this,"showY",!0),p(this,"showZ",!0),p(this,"changeEvent",{type:"change"}),p(this,"mouseDownEvent",{type:"mouseDown",mode:this.mode}),p(this,"mouseUpEvent",{type:"mouseUp",mode:this.mode}),p(this,"objectChangeEvent",{type:"objectChange"}),p(this,"intersectObjectWithRay",(r,s,_)=>{const i=s.intersectObject(r,!0);for(let u=0;u<i.length;u++)if(i[u].object.visible||_)return i[u];return!1}),p(this,"attach",r=>(this.object=r,this.visible=!0,this)),p(this,"detach",()=>(this.object=void 0,this.visible=!1,this.axis=null,this)),p(this,"reset",()=>this.enabled?(this.dragging&&this.object!==void 0&&(this.object.position.copy(this.positionStart),this.object.quaternion.copy(this.quaternionStart),this.object.scale.copy(this.scaleStart),this.dispatchEvent(this.changeEvent),this.dispatchEvent(this.objectChangeEvent),this.pointStart.copy(this.pointEnd)),this):this),p(this,"updateMatrixWorld",()=>{this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this.parentPosition,this.parentQuaternion,this.parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this.worldScale),this.parentQuaternionInv.copy(this.parentQuaternion).invert(),this.worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this.cameraScale),this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld()}),p(this,"pointerHover",r=>{if(this.object===void 0||this.dragging===!0)return;this.raycaster.setFromCamera(r,this.camera);const s=this.intersectObjectWithRay(this.gizmo.picker[this.mode],this.raycaster);s?this.axis=s.object.name:this.axis=null}),p(this,"pointerDown",r=>{if(!(this.object===void 0||this.dragging===!0||r.button!==0)&&this.axis!==null){this.raycaster.setFromCamera(r,this.camera);const s=this.intersectObjectWithRay(this.plane,this.raycaster,!0);if(s){let _=this.space;if(this.mode==="scale"?_="local":(this.axis==="E"||this.axis==="XYZE"||this.axis==="XYZ")&&(_="world"),_==="local"&&this.mode==="rotate"){const i=this.rotationSnap;this.axis==="X"&&i&&(this.object.rotation.x=Math.round(this.object.rotation.x/i)*i),this.axis==="Y"&&i&&(this.object.rotation.y=Math.round(this.object.rotation.y/i)*i),this.axis==="Z"&&i&&(this.object.rotation.z=Math.round(this.object.rotation.z/i)*i)}this.object.updateMatrixWorld(),this.object.parent&&this.object.parent.updateMatrixWorld(),this.positionStart.copy(this.object.position),this.quaternionStart.copy(this.object.quaternion),this.scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this.worldScaleStart),this.pointStart.copy(s.point).sub(this.worldPositionStart)}this.dragging=!0,this.mouseDownEvent.mode=this.mode,this.dispatchEvent(this.mouseDownEvent)}}),p(this,"pointerMove",r=>{const s=this.axis,_=this.mode,i=this.object;let u=this.space;if(_==="scale"?u="local":(s==="E"||s==="XYZE"||s==="XYZ")&&(u="world"),i===void 0||s===null||this.dragging===!1||r.button!==-1)return;this.raycaster.setFromCamera(r,this.camera);const v=this.intersectObjectWithRay(this.plane,this.raycaster,!0);if(v){if(this.pointEnd.copy(v.point).sub(this.worldPositionStart),_==="translate")this.offset.copy(this.pointEnd).sub(this.pointStart),u==="local"&&s!=="XYZ"&&this.offset.applyQuaternion(this.worldQuaternionInv),s.indexOf("X")===-1&&(this.offset.x=0),s.indexOf("Y")===-1&&(this.offset.y=0),s.indexOf("Z")===-1&&(this.offset.z=0),u==="local"&&s!=="XYZ"?this.offset.applyQuaternion(this.quaternionStart).divide(this.parentScale):this.offset.applyQuaternion(this.parentQuaternionInv).divide(this.parentScale),i.position.copy(this.offset).add(this.positionStart),this.translationSnap&&(u==="local"&&(i.position.applyQuaternion(this.tempQuaternion.copy(this.quaternionStart).invert()),s.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),s.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),s.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.position.applyQuaternion(this.quaternionStart)),u==="world"&&(i.parent&&i.position.add(this.tempVector.setFromMatrixPosition(i.parent.matrixWorld)),s.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),s.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),s.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.parent&&i.position.sub(this.tempVector.setFromMatrixPosition(i.parent.matrixWorld))));else if(_==="scale"){if(s.search("XYZ")!==-1){let h=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(h*=-1),this.tempVector2.set(h,h,h)}else this.tempVector.copy(this.pointStart),this.tempVector2.copy(this.pointEnd),this.tempVector.applyQuaternion(this.worldQuaternionInv),this.tempVector2.applyQuaternion(this.worldQuaternionInv),this.tempVector2.divide(this.tempVector),s.search("X")===-1&&(this.tempVector2.x=1),s.search("Y")===-1&&(this.tempVector2.y=1),s.search("Z")===-1&&(this.tempVector2.z=1);i.scale.copy(this.scaleStart).multiply(this.tempVector2),this.scaleSnap&&this.object&&(s.search("X")!==-1&&(this.object.scale.x=Math.round(i.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),s.search("Y")!==-1&&(i.scale.y=Math.round(i.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),s.search("Z")!==-1&&(i.scale.z=Math.round(i.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(_==="rotate"){this.offset.copy(this.pointEnd).sub(this.pointStart);const h=20/this.worldPosition.distanceTo(this.tempVector.setFromMatrixPosition(this.camera.matrixWorld));s==="E"?(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this.startNorm.copy(this.pointStart).normalize(),this.endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this.endNorm.cross(this.startNorm).dot(this.eye)<0?1:-1):s==="XYZE"?(this.rotationAxis.copy(this.offset).cross(this.eye).normalize(),this.rotationAngle=this.offset.dot(this.tempVector.copy(this.rotationAxis).cross(this.eye))*h):(s==="X"||s==="Y"||s==="Z")&&(this.rotationAxis.copy(this.unit[s]),this.tempVector.copy(this.unit[s]),u==="local"&&this.tempVector.applyQuaternion(this.worldQuaternion),this.rotationAngle=this.offset.dot(this.tempVector.cross(this.eye).normalize())*h),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),u==="local"&&s!=="E"&&s!=="XYZE"?(i.quaternion.copy(this.quaternionStart),i.quaternion.multiply(this.tempQuaternion.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this.parentQuaternionInv),i.quaternion.copy(this.tempQuaternion.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),i.quaternion.multiply(this.quaternionStart).normalize())}this.dispatchEvent(this.changeEvent),this.dispatchEvent(this.objectChangeEvent)}}),p(this,"pointerUp",r=>{r.button===0&&(this.dragging&&this.axis!==null&&(this.mouseUpEvent.mode=this.mode,this.dispatchEvent(this.mouseUpEvent)),this.dragging=!1,this.axis=null)}),p(this,"getPointer",r=>{var s;if(this.domElement&&((s=this.domElement.ownerDocument)!=null&&s.pointerLockElement))return{x:0,y:0,button:r.button};{const _=r.changedTouches?r.changedTouches[0]:r,i=this.domElement.getBoundingClientRect();return{x:(_.clientX-i.left)/i.width*2-1,y:-(_.clientY-i.top)/i.height*2+1,button:r.button}}}),p(this,"onPointerHover",r=>{if(this.enabled)switch(r.pointerType){case"mouse":case"pen":this.pointerHover(this.getPointer(r));break}}),p(this,"onPointerDown",r=>{!this.enabled||!this.domElement||(this.domElement.style.touchAction="none",this.domElement.ownerDocument.addEventListener("pointermove",this.onPointerMove),this.pointerHover(this.getPointer(r)),this.pointerDown(this.getPointer(r)))}),p(this,"onPointerMove",r=>{this.enabled&&this.pointerMove(this.getPointer(r))}),p(this,"onPointerUp",r=>{!this.enabled||!this.domElement||(this.domElement.style.touchAction="",this.domElement.ownerDocument.removeEventListener("pointermove",this.onPointerMove),this.pointerUp(this.getPointer(r)))}),p(this,"getMode",()=>this.mode),p(this,"setMode",r=>{this.mode=r}),p(this,"setTranslationSnap",r=>{this.translationSnap=r}),p(this,"setRotationSnap",r=>{this.rotationSnap=r}),p(this,"setScaleSnap",r=>{this.scaleSnap=r}),p(this,"setSize",r=>{this.size=r}),p(this,"setSpace",r=>{this.space=r}),p(this,"update",()=>{console.warn("THREE.TransformControls: update function has no more functionality and therefore has been deprecated.")}),p(this,"connect",r=>{r===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.domElement=r,this.domElement.addEventListener("pointerdown",this.onPointerDown),this.domElement.addEventListener("pointermove",this.onPointerHover),this.domElement.ownerDocument.addEventListener("pointerup",this.onPointerUp)}),p(this,"dispose",()=>{var r,s,_,i,u,v;(r=this.domElement)==null||r.removeEventListener("pointerdown",this.onPointerDown),(s=this.domElement)==null||s.removeEventListener("pointermove",this.onPointerHover),(i=(_=this.domElement)==null?void 0:_.ownerDocument)==null||i.removeEventListener("pointermove",this.onPointerMove),(v=(u=this.domElement)==null?void 0:u.ownerDocument)==null||v.removeEventListener("pointerup",this.onPointerUp),this.traverse(h=>{const f=h;f.geometry&&f.geometry.dispose(),f.material&&f.material.dispose()})}),this.domElement=o,this.camera=a,this.gizmo=new ta,this.add(this.gizmo),this.plane=new na,this.add(this.plane);const n=(r,s)=>{let _=s;Object.defineProperty(this,r,{get:function(){return _!==void 0?_:s},set:function(i){_!==i&&(_=i,this.plane[r]=i,this.gizmo[r]=i,this.dispatchEvent({type:r+"-changed",value:i}),this.dispatchEvent(this.changeEvent))}}),this[r]=s,this.plane[r]=s,this.gizmo[r]=s};n("camera",this.camera),n("object",this.object),n("enabled",this.enabled),n("axis",this.axis),n("mode",this.mode),n("translationSnap",this.translationSnap),n("rotationSnap",this.rotationSnap),n("scaleSnap",this.scaleSnap),n("space",this.space),n("size",this.size),n("dragging",this.dragging),n("showX",this.showX),n("showY",this.showY),n("showZ",this.showZ),n("worldPosition",this.worldPosition),n("worldPositionStart",this.worldPositionStart),n("worldQuaternion",this.worldQuaternion),n("worldQuaternionStart",this.worldQuaternionStart),n("cameraPosition",this.cameraPosition),n("cameraQuaternion",this.cameraQuaternion),n("pointStart",this.pointStart),n("pointEnd",this.pointEnd),n("rotationAxis",this.rotationAxis),n("rotationAngle",this.rotationAngle),n("eye",this.eye),o!==void 0&&this.connect(o)}};class ta extends We{constructor(){super(),p(this,"isTransformControlsGizmo",!0),p(this,"type","TransformControlsGizmo"),p(this,"tempVector",new P(0,0,0)),p(this,"tempEuler",new An),p(this,"alignVector",new P(0,1,0)),p(this,"zeroVector",new P(0,0,0)),p(this,"lookAtMatrix",new rn),p(this,"tempQuaternion",new ae),p(this,"tempQuaternion2",new ae),p(this,"identityQuaternion",new ae),p(this,"unitX",new P(1,0,0)),p(this,"unitY",new P(0,1,0)),p(this,"unitZ",new P(0,0,1)),p(this,"gizmo"),p(this,"picker"),p(this,"helper"),p(this,"rotationAxis",new P),p(this,"cameraPosition",new P),p(this,"worldPositionStart",new P),p(this,"worldQuaternionStart",new ae),p(this,"worldPosition",new P),p(this,"worldQuaternion",new ae),p(this,"eye",new P),p(this,"camera",null),p(this,"enabled",!0),p(this,"axis",null),p(this,"mode","translate"),p(this,"space","world"),p(this,"size",1),p(this,"dragging",!1),p(this,"showX",!0),p(this,"showY",!0),p(this,"showZ",!0),p(this,"updateMatrixWorld",()=>{let K=this.space;this.mode==="scale"&&(K="local");const M=K==="local"?this.worldQuaternion:this.identityQuaternion;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let G=[];G=G.concat(this.picker[this.mode].children),G=G.concat(this.gizmo[this.mode].children),G=G.concat(this.helper[this.mode].children);for(let H=0;H<G.length;H++){const d=G[H];d.visible=!0,d.rotation.set(0,0,0),d.position.copy(this.worldPosition);let b;if(this.camera.isOrthographicCamera?b=(this.camera.top-this.camera.bottom)/this.camera.zoom:b=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),d.scale.set(1,1,1).multiplyScalar(b*this.size/7),d.tag==="helper"){d.visible=!1,d.name==="AXIS"?(d.position.copy(this.worldPositionStart),d.visible=!!this.axis,this.axis==="X"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,0,0)),d.quaternion.copy(M).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(M).dot(this.eye))>.9&&(d.visible=!1)),this.axis==="Y"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,0,Math.PI/2)),d.quaternion.copy(M).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(M).dot(this.eye))>.9&&(d.visible=!1)),this.axis==="Z"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,Math.PI/2,0)),d.quaternion.copy(M).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(M).dot(this.eye))>.9&&(d.visible=!1)),this.axis==="XYZE"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,Math.PI/2,0)),this.alignVector.copy(this.rotationAxis),d.quaternion.setFromRotationMatrix(this.lookAtMatrix.lookAt(this.zeroVector,this.alignVector,this.unitY)),d.quaternion.multiply(this.tempQuaternion),d.visible=this.dragging),this.axis==="E"&&(d.visible=!1)):d.name==="START"?(d.position.copy(this.worldPositionStart),d.visible=this.dragging):d.name==="END"?(d.position.copy(this.worldPosition),d.visible=this.dragging):d.name==="DELTA"?(d.position.copy(this.worldPositionStart),d.quaternion.copy(this.worldQuaternionStart),this.tempVector.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),this.tempVector.applyQuaternion(this.worldQuaternionStart.clone().invert()),d.scale.copy(this.tempVector),d.visible=this.dragging):(d.quaternion.copy(M),this.dragging?d.position.copy(this.worldPositionStart):d.position.copy(this.worldPosition),this.axis&&(d.visible=this.axis.search(d.name)!==-1));continue}d.quaternion.copy(M),this.mode==="translate"||this.mode==="scale"?((d.name==="X"||d.name==="XYZX")&&Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(M).dot(this.eye))>.99&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),(d.name==="Y"||d.name==="XYZY")&&Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(M).dot(this.eye))>.99&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),(d.name==="Z"||d.name==="XYZZ")&&Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(M).dot(this.eye))>.99&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),d.name==="XY"&&Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(M).dot(this.eye))<.2&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),d.name==="YZ"&&Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(M).dot(this.eye))<.2&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),d.name==="XZ"&&Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(M).dot(this.eye))<.2&&(d.scale.set(1e-10,1e-10,1e-10),d.visible=!1),d.name.search("X")!==-1&&(this.alignVector.copy(this.unitX).applyQuaternion(M).dot(this.eye)<0?d.tag==="fwd"?d.visible=!1:d.scale.x*=-1:d.tag==="bwd"&&(d.visible=!1)),d.name.search("Y")!==-1&&(this.alignVector.copy(this.unitY).applyQuaternion(M).dot(this.eye)<0?d.tag==="fwd"?d.visible=!1:d.scale.y*=-1:d.tag==="bwd"&&(d.visible=!1)),d.name.search("Z")!==-1&&(this.alignVector.copy(this.unitZ).applyQuaternion(M).dot(this.eye)<0?d.tag==="fwd"?d.visible=!1:d.scale.z*=-1:d.tag==="bwd"&&(d.visible=!1))):this.mode==="rotate"&&(this.tempQuaternion2.copy(M),this.alignVector.copy(this.eye).applyQuaternion(this.tempQuaternion.copy(M).invert()),d.name.search("E")!==-1&&d.quaternion.setFromRotationMatrix(this.lookAtMatrix.lookAt(this.eye,this.zeroVector,this.unitY)),d.name==="X"&&(this.tempQuaternion.setFromAxisAngle(this.unitX,Math.atan2(-this.alignVector.y,this.alignVector.z)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),d.quaternion.copy(this.tempQuaternion)),d.name==="Y"&&(this.tempQuaternion.setFromAxisAngle(this.unitY,Math.atan2(this.alignVector.x,this.alignVector.z)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),d.quaternion.copy(this.tempQuaternion)),d.name==="Z"&&(this.tempQuaternion.setFromAxisAngle(this.unitZ,Math.atan2(this.alignVector.y,this.alignVector.x)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),d.quaternion.copy(this.tempQuaternion))),d.visible=d.visible&&(d.name.indexOf("X")===-1||this.showX),d.visible=d.visible&&(d.name.indexOf("Y")===-1||this.showY),d.visible=d.visible&&(d.name.indexOf("Z")===-1||this.showZ),d.visible=d.visible&&(d.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),d.material.tempOpacity=d.material.tempOpacity||d.material.opacity,d.material.tempColor=d.material.tempColor||d.material.color.clone(),d.material.color.copy(d.material.tempColor),d.material.opacity=d.material.tempOpacity,this.enabled?this.axis&&(d.name===this.axis?(d.material.opacity=1,d.material.color.lerp(new be(1,1,1),.5)):this.axis.split("").some(function(S){return d.name===S})?(d.material.opacity=1,d.material.color.lerp(new be(1,1,1),.5)):(d.material.opacity*=.25,d.material.color.lerp(new be(1,1,1),.5))):(d.material.opacity*=.5,d.material.color.lerp(new be(1,1,1),.5))}super.updateMatrixWorld()});const a=new ln({depthTest:!1,depthWrite:!1,transparent:!0,side:Ct,fog:!1,toneMapped:!1}),o=new Tn({depthTest:!1,depthWrite:!1,transparent:!0,linewidth:1,fog:!1,toneMapped:!1}),n=a.clone();n.opacity=.15;const r=a.clone();r.opacity=.33;const s=a.clone();s.color.set(16711680);const _=a.clone();_.color.set(65280);const i=a.clone();i.color.set(255);const u=a.clone();u.opacity=.25;const v=u.clone();v.color.set(16776960);const h=u.clone();h.color.set(65535);const f=u.clone();f.color.set(16711935),a.clone().color.set(16776960);const g=o.clone();g.color.set(16711680);const m=o.clone();m.color.set(65280);const w=o.clone();w.color.set(255);const k=o.clone();k.color.set(65535);const C=o.clone();C.color.set(16711935);const E=o.clone();E.color.set(16776960);const Y=o.clone();Y.color.set(7895160);const z=E.clone();z.opacity=.25;const j=new me(0,.05,.2,12,1,!1),I=new ke(.125,.125,.125),c=new pt;c.setAttribute("position",new ft([0,0,0,1,0,0],3));const R=(K,M)=>{const G=new pt,H=[];for(let d=0;d<=64*M;++d)H.push(0,Math.cos(d/32*Math.PI)*K,Math.sin(d/32*Math.PI)*K);return G.setAttribute("position",new ft(H,3)),G},W=()=>{const K=new pt;return K.setAttribute("position",new ft([0,0,0,1,1,1],3)),K},O={X:[[new A(j,s),[1,0,0],[0,0,-Math.PI/2],null,"fwd"],[new A(j,s),[1,0,0],[0,0,Math.PI/2],null,"bwd"],[new Z(c,g)]],Y:[[new A(j,_),[0,1,0],null,null,"fwd"],[new A(j,_),[0,1,0],[Math.PI,0,0],null,"bwd"],[new Z(c,m),null,[0,0,Math.PI/2]]],Z:[[new A(j,i),[0,0,1],[Math.PI/2,0,0],null,"fwd"],[new A(j,i),[0,0,1],[-Math.PI/2,0,0],null,"bwd"],[new Z(c,w),null,[0,-Math.PI/2,0]]],XYZ:[[new A(new Ee(.1,0),u.clone()),[0,0,0],[0,0,0]]],XY:[[new A(new xe(.295,.295),v.clone()),[.15,.15,0]],[new Z(c,E),[.18,.3,0],null,[.125,1,1]],[new Z(c,E),[.3,.18,0],[0,0,Math.PI/2],[.125,1,1]]],YZ:[[new A(new xe(.295,.295),h.clone()),[0,.15,.15],[0,Math.PI/2,0]],[new Z(c,k),[0,.18,.3],[0,0,Math.PI/2],[.125,1,1]],[new Z(c,k),[0,.3,.18],[0,-Math.PI/2,0],[.125,1,1]]],XZ:[[new A(new xe(.295,.295),f.clone()),[.15,0,.15],[-Math.PI/2,0,0]],[new Z(c,C),[.18,0,.3],null,[.125,1,1]],[new Z(c,C),[.3,0,.18],[0,-Math.PI/2,0],[.125,1,1]]]},oe={X:[[new A(new me(.2,0,1,4,1,!1),n),[.6,0,0],[0,0,-Math.PI/2]]],Y:[[new A(new me(.2,0,1,4,1,!1),n),[0,.6,0]]],Z:[[new A(new me(.2,0,1,4,1,!1),n),[0,0,.6],[Math.PI/2,0,0]]],XYZ:[[new A(new Ee(.2,0),n)]],XY:[[new A(new xe(.4,.4),n),[.2,.2,0]]],YZ:[[new A(new xe(.4,.4),n),[0,.2,.2],[0,Math.PI/2,0]]],XZ:[[new A(new xe(.4,.4),n),[.2,0,.2],[-Math.PI/2,0,0]]]},se={START:[[new A(new Ee(.01,2),r),null,null,null,"helper"]],END:[[new A(new Ee(.01,2),r),null,null,null,"helper"]],DELTA:[[new Z(W(),r),null,null,null,"helper"]],X:[[new Z(c,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Z(c,r.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Z(c,r.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},J={X:[[new Z(R(1,.5),g)],[new A(new Ee(.04,0),s),[0,0,.99],null,[1,3,1]]],Y:[[new Z(R(1,.5),m),null,[0,0,-Math.PI/2]],[new A(new Ee(.04,0),_),[0,0,.99],null,[3,1,1]]],Z:[[new Z(R(1,.5),w),null,[0,Math.PI/2,0]],[new A(new Ee(.04,0),i),[.99,0,0],null,[1,3,1]]],E:[[new Z(R(1.25,1),z),null,[0,Math.PI/2,0]],[new A(new me(.03,0,.15,4,1,!1),z),[1.17,0,0],[0,0,-Math.PI/2],[1,1,.001]],[new A(new me(.03,0,.15,4,1,!1),z),[-1.17,0,0],[0,0,Math.PI/2],[1,1,.001]],[new A(new me(.03,0,.15,4,1,!1),z),[0,-1.17,0],[Math.PI,0,0],[1,1,.001]],[new A(new me(.03,0,.15,4,1,!1),z),[0,1.17,0],[0,0,0],[1,1,.001]]],XYZE:[[new Z(R(1,1),Y),null,[0,Math.PI/2,0]]]},X={AXIS:[[new Z(c,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},U={X:[[new A(new Qe(1,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new A(new Qe(1,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new A(new Qe(1,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new A(new Qe(1.25,.1,2,24),n)]],XYZE:[[new A(new cn(.7,10,8),n)]]},le={X:[[new A(I,s),[.8,0,0],[0,0,-Math.PI/2]],[new Z(c,g),null,null,[.8,1,1]]],Y:[[new A(I,_),[0,.8,0]],[new Z(c,m),null,[0,0,Math.PI/2],[.8,1,1]]],Z:[[new A(I,i),[0,0,.8],[Math.PI/2,0,0]],[new Z(c,w),null,[0,-Math.PI/2,0],[.8,1,1]]],XY:[[new A(I,v),[.85,.85,0],null,[2,2,.2]],[new Z(c,E),[.855,.98,0],null,[.125,1,1]],[new Z(c,E),[.98,.855,0],[0,0,Math.PI/2],[.125,1,1]]],YZ:[[new A(I,h),[0,.85,.85],null,[.2,2,2]],[new Z(c,k),[0,.855,.98],[0,0,Math.PI/2],[.125,1,1]],[new Z(c,k),[0,.98,.855],[0,-Math.PI/2,0],[.125,1,1]]],XZ:[[new A(I,f),[.85,0,.85],null,[2,.2,2]],[new Z(c,C),[.855,0,.98],null,[.125,1,1]],[new Z(c,C),[.98,0,.855],[0,-Math.PI/2,0],[.125,1,1]]],XYZX:[[new A(new ke(.125,.125,.125),u.clone()),[1.1,0,0]]],XYZY:[[new A(new ke(.125,.125,.125),u.clone()),[0,1.1,0]]],XYZZ:[[new A(new ke(.125,.125,.125),u.clone()),[0,0,1.1]]]},_e={X:[[new A(new me(.2,0,.8,4,1,!1),n),[.5,0,0],[0,0,-Math.PI/2]]],Y:[[new A(new me(.2,0,.8,4,1,!1),n),[0,.5,0]]],Z:[[new A(new me(.2,0,.8,4,1,!1),n),[0,0,.5],[Math.PI/2,0,0]]],XY:[[new A(I,n),[.85,.85,0],null,[3,3,.2]]],YZ:[[new A(I,n),[0,.85,.85],null,[.2,3,3]]],XZ:[[new A(I,n),[.85,0,.85],null,[3,.2,3]]],XYZX:[[new A(new ke(.2,.2,.2),n),[1.1,0,0]]],XYZY:[[new A(new ke(.2,.2,.2),n),[0,1.1,0]]],XYZZ:[[new A(new ke(.2,.2,.2),n),[0,0,1.1]]]},te={X:[[new Z(c,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Z(c,r.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Z(c,r.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},$=K=>{const M=new We;for(let G in K)for(let H=K[G].length;H--;){const d=K[G][H][0].clone(),b=K[G][H][1],S=K[G][H][2],T=K[G][H][3],F=K[G][H][4];d.name=G,d.tag=F,b&&d.position.set(b[0],b[1],b[2]),S&&d.rotation.set(S[0],S[1],S[2]),T&&d.scale.set(T[0],T[1],T[2]),d.updateMatrix();const Q=d.geometry.clone();Q.applyMatrix4(d.matrix),d.geometry=Q,d.renderOrder=1/0,d.position.set(0,0,0),d.rotation.set(0,0,0),d.scale.set(1,1,1),M.add(d)}return M};this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=$(O)),this.add(this.gizmo.rotate=$(J)),this.add(this.gizmo.scale=$(le)),this.add(this.picker.translate=$(oe)),this.add(this.picker.rotate=$(U)),this.add(this.picker.scale=$(_e)),this.add(this.helper.translate=$(se)),this.add(this.helper.rotate=$(X)),this.add(this.helper.scale=$(te)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}}class na extends A{constructor(){super(new xe(1e5,1e5,2,2),new ln({visible:!1,wireframe:!0,side:Ct,transparent:!0,opacity:.1,toneMapped:!1})),p(this,"isTransformControlsPlane",!0),p(this,"type","TransformControlsPlane"),p(this,"unitX",new P(1,0,0)),p(this,"unitY",new P(0,1,0)),p(this,"unitZ",new P(0,0,1)),p(this,"tempVector",new P),p(this,"dirVector",new P),p(this,"alignVector",new P),p(this,"tempMatrix",new rn),p(this,"identityQuaternion",new ae),p(this,"cameraQuaternion",new ae),p(this,"worldPosition",new P),p(this,"worldQuaternion",new ae),p(this,"eye",new P),p(this,"axis",null),p(this,"mode","translate"),p(this,"space","world"),p(this,"updateMatrixWorld",()=>{let a=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(a="local"),this.unitX.set(1,0,0).applyQuaternion(a==="local"?this.worldQuaternion:this.identityQuaternion),this.unitY.set(0,1,0).applyQuaternion(a==="local"?this.worldQuaternion:this.identityQuaternion),this.unitZ.set(0,0,1).applyQuaternion(a==="local"?this.worldQuaternion:this.identityQuaternion),this.alignVector.copy(this.unitY),this.mode){case"translate":case"scale":switch(this.axis){case"X":this.alignVector.copy(this.eye).cross(this.unitX),this.dirVector.copy(this.unitX).cross(this.alignVector);break;case"Y":this.alignVector.copy(this.eye).cross(this.unitY),this.dirVector.copy(this.unitY).cross(this.alignVector);break;case"Z":this.alignVector.copy(this.eye).cross(this.unitZ),this.dirVector.copy(this.unitZ).cross(this.alignVector);break;case"XY":this.dirVector.copy(this.unitZ);break;case"YZ":this.dirVector.copy(this.unitX);break;case"XZ":this.alignVector.copy(this.unitZ),this.dirVector.copy(this.unitY);break;case"XYZ":case"E":this.dirVector.set(0,0,0);break}break;case"rotate":default:this.dirVector.set(0,0,0)}this.dirVector.length()===0?this.quaternion.copy(this.cameraQuaternion):(this.tempMatrix.lookAt(this.tempVector.set(0,0,0),this.dirVector,this.alignVector),this.quaternion.setFromRotationMatrix(this.tempMatrix)),super.updateMatrixWorld()})}}var aa=Object.defineProperty,oa=(t,a,o)=>a in t?aa(t,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[a]=o,N=(t,a,o)=>(oa(t,typeof a!="symbol"?a+"":a,o),o);const tt=new On,Wt=new _n,ia=Math.cos(70*(Math.PI/180)),$t=(t,a)=>(t%a+a)%a;let sa=class extends Hn{constructor(a,o){super(),N(this,"object"),N(this,"domElement"),N(this,"enabled",!0),N(this,"target",new P),N(this,"minDistance",0),N(this,"maxDistance",1/0),N(this,"minZoom",0),N(this,"maxZoom",1/0),N(this,"minPolarAngle",0),N(this,"maxPolarAngle",Math.PI),N(this,"minAzimuthAngle",-1/0),N(this,"maxAzimuthAngle",1/0),N(this,"enableDamping",!1),N(this,"dampingFactor",.05),N(this,"enableZoom",!0),N(this,"zoomSpeed",1),N(this,"enableRotate",!0),N(this,"rotateSpeed",1),N(this,"enablePan",!0),N(this,"panSpeed",1),N(this,"screenSpacePanning",!0),N(this,"keyPanSpeed",7),N(this,"zoomToCursor",!1),N(this,"autoRotate",!1),N(this,"autoRotateSpeed",2),N(this,"reverseOrbit",!1),N(this,"reverseHorizontalOrbit",!1),N(this,"reverseVerticalOrbit",!1),N(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),N(this,"mouseButtons",{LEFT:Re.ROTATE,MIDDLE:Re.DOLLY,RIGHT:Re.PAN}),N(this,"touches",{ONE:Ye.ROTATE,TWO:Ye.DOLLY_PAN}),N(this,"target0"),N(this,"position0"),N(this,"zoom0"),N(this,"_domElementKeyEvents",null),N(this,"getPolarAngle"),N(this,"getAzimuthalAngle"),N(this,"setPolarAngle"),N(this,"setAzimuthalAngle"),N(this,"getDistance"),N(this,"getZoomScale"),N(this,"listenToKeyEvents"),N(this,"stopListenToKeyEvents"),N(this,"saveState"),N(this,"reset"),N(this,"update"),N(this,"connect"),N(this,"dispose"),N(this,"dollyIn"),N(this,"dollyOut"),N(this,"getScale"),N(this,"setScale"),this.object=a,this.domElement=o,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>h.phi,this.getAzimuthalAngle=()=>h.theta,this.setPolarAngle=l=>{let D=$t(l,2*Math.PI),L=h.phi;L<0&&(L+=2*Math.PI),D<0&&(D+=2*Math.PI);let V=Math.abs(D-L);2*Math.PI-V<V&&(D<L?D+=2*Math.PI:L+=2*Math.PI),f.phi=D-L,n.update()},this.setAzimuthalAngle=l=>{let D=$t(l,2*Math.PI),L=h.theta;L<0&&(L+=2*Math.PI),D<0&&(D+=2*Math.PI);let V=Math.abs(D-L);2*Math.PI-V<V&&(D<L?D+=2*Math.PI:L+=2*Math.PI),f.theta=D-L,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=l=>{l.addEventListener("keydown",dt),this._domElementKeyEvents=l},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",dt),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),u=i.NONE},this.update=(()=>{const l=new P,D=new P(0,1,0),L=new ae().setFromUnitVectors(a.up,D),V=L.clone().invert(),ne=new P,he=new ae,we=2*Math.PI;return function(){const Ut=n.object.position;L.setFromUnitVectors(a.up,D),V.copy(L).invert(),l.copy(Ut).sub(n.target),l.applyQuaternion(L),h.setFromVector3(l),n.autoRotate&&u===i.NONE&&X(se()),n.enableDamping?(h.theta+=f.theta*n.dampingFactor,h.phi+=f.phi*n.dampingFactor):(h.theta+=f.theta,h.phi+=f.phi);let ve=n.minAzimuthAngle,ye=n.maxAzimuthAngle;isFinite(ve)&&isFinite(ye)&&(ve<-Math.PI?ve+=we:ve>Math.PI&&(ve-=we),ye<-Math.PI?ye+=we:ye>Math.PI&&(ye-=we),ve<=ye?h.theta=Math.max(ve,Math.min(ye,h.theta)):h.theta=h.theta>(ve+ye)/2?Math.max(ve,h.theta):Math.min(ye,h.theta)),h.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,h.phi)),h.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(g,n.dampingFactor):n.target.add(g),n.zoomToCursor&&W||n.object.isOrthographicCamera?h.radius=H(h.radius):h.radius=H(h.radius*x),l.setFromSpherical(h),l.applyQuaternion(V),Ut.copy(n.target).add(l),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),n.enableDamping===!0?(f.theta*=1-n.dampingFactor,f.phi*=1-n.dampingFactor,g.multiplyScalar(1-n.dampingFactor)):(f.set(0,0,0),g.set(0,0,0));let Ze=!1;if(n.zoomToCursor&&W){let Ke=null;if(n.object instanceof ht&&n.object.isPerspectiveCamera){const Ue=l.length();Ke=H(Ue*x);const et=Ue-Ke;n.object.position.addScaledVector(c,et),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const Ue=new P(R.x,R.y,0);Ue.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/x)),n.object.updateProjectionMatrix(),Ze=!0;const et=new P(R.x,R.y,0);et.unproject(n.object),n.object.position.sub(et).add(Ue),n.object.updateMatrixWorld(),Ke=l.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Ke!==null&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Ke).add(n.object.position):(tt.origin.copy(n.object.position),tt.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(tt.direction))<ia?a.lookAt(n.target):(Wt.setFromNormalAndCoplanarPoint(n.object.up,n.target),tt.intersectPlane(Wt,n.target))))}else n.object instanceof ot&&n.object.isOrthographicCamera&&(Ze=x!==1,Ze&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/x)),n.object.updateProjectionMatrix()));return x=1,W=!1,Ze||ne.distanceToSquared(n.object.position)>v||8*(1-he.dot(n.object.quaternion))>v?(n.dispatchEvent(r),ne.copy(n.object.position),he.copy(n.object.quaternion),Ze=!1,!0):!1}})(),this.connect=l=>{n.domElement=l,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",Zt),n.domElement.addEventListener("pointerdown",Xt),n.domElement.addEventListener("pointercancel",Ve),n.domElement.addEventListener("wheel",Vt)},this.dispose=()=>{var l,D,L,V,ne,he;n.domElement&&(n.domElement.style.touchAction="auto"),(l=n.domElement)==null||l.removeEventListener("contextmenu",Zt),(D=n.domElement)==null||D.removeEventListener("pointerdown",Xt),(L=n.domElement)==null||L.removeEventListener("pointercancel",Ve),(V=n.domElement)==null||V.removeEventListener("wheel",Vt),(ne=n.domElement)==null||ne.ownerDocument.removeEventListener("pointermove",ut),(he=n.domElement)==null||he.ownerDocument.removeEventListener("pointerup",Ve),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener("keydown",dt)};const n=this,r={type:"change"},s={type:"start"},_={type:"end"},i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let u=i.NONE;const v=1e-6,h=new Gt,f=new Gt;let x=1;const g=new P,m=new ie,w=new ie,k=new ie,C=new ie,E=new ie,Y=new ie,z=new ie,j=new ie,I=new ie,c=new P,R=new ie;let W=!1;const O=[],oe={};function se(){return 2*Math.PI/60/60*n.autoRotateSpeed}function J(){return Math.pow(.95,n.zoomSpeed)}function X(l){n.reverseOrbit||n.reverseHorizontalOrbit?f.theta+=l:f.theta-=l}function U(l){n.reverseOrbit||n.reverseVerticalOrbit?f.phi+=l:f.phi-=l}const le=(()=>{const l=new P;return function(L,V){l.setFromMatrixColumn(V,0),l.multiplyScalar(-L),g.add(l)}})(),_e=(()=>{const l=new P;return function(L,V){n.screenSpacePanning===!0?l.setFromMatrixColumn(V,1):(l.setFromMatrixColumn(V,0),l.crossVectors(n.object.up,l)),l.multiplyScalar(L),g.add(l)}})(),te=(()=>{const l=new P;return function(L,V){const ne=n.domElement;if(ne&&n.object instanceof ht&&n.object.isPerspectiveCamera){const he=n.object.position;l.copy(he).sub(n.target);let we=l.length();we*=Math.tan(n.object.fov/2*Math.PI/180),le(2*L*we/ne.clientHeight,n.object.matrix),_e(2*V*we/ne.clientHeight,n.object.matrix)}else ne&&n.object instanceof ot&&n.object.isOrthographicCamera?(le(L*(n.object.right-n.object.left)/n.object.zoom/ne.clientWidth,n.object.matrix),_e(V*(n.object.top-n.object.bottom)/n.object.zoom/ne.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function $(l){n.object instanceof ht&&n.object.isPerspectiveCamera||n.object instanceof ot&&n.object.isOrthographicCamera?x=l:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(l){$(x/l)}function M(l){$(x*l)}function G(l){if(!n.zoomToCursor||!n.domElement)return;W=!0;const D=n.domElement.getBoundingClientRect(),L=l.clientX-D.left,V=l.clientY-D.top,ne=D.width,he=D.height;R.x=L/ne*2-1,R.y=-(V/he)*2+1,c.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function H(l){return Math.max(n.minDistance,Math.min(n.maxDistance,l))}function d(l){m.set(l.clientX,l.clientY)}function b(l){G(l),z.set(l.clientX,l.clientY)}function S(l){C.set(l.clientX,l.clientY)}function T(l){w.set(l.clientX,l.clientY),k.subVectors(w,m).multiplyScalar(n.rotateSpeed);const D=n.domElement;D&&(X(2*Math.PI*k.x/D.clientHeight),U(2*Math.PI*k.y/D.clientHeight)),m.copy(w),n.update()}function F(l){j.set(l.clientX,l.clientY),I.subVectors(j,z),I.y>0?K(J()):I.y<0&&M(J()),z.copy(j),n.update()}function Q(l){E.set(l.clientX,l.clientY),Y.subVectors(E,C).multiplyScalar(n.panSpeed),te(Y.x,Y.y),C.copy(E),n.update()}function fe(l){G(l),l.deltaY<0?M(J()):l.deltaY>0&&K(J()),n.update()}function bn(l){let D=!1;switch(l.code){case n.keys.UP:te(0,n.keyPanSpeed),D=!0;break;case n.keys.BOTTOM:te(0,-n.keyPanSpeed),D=!0;break;case n.keys.LEFT:te(n.keyPanSpeed,0),D=!0;break;case n.keys.RIGHT:te(-n.keyPanSpeed,0),D=!0;break}D&&(l.preventDefault(),n.update())}function Ot(){if(O.length==1)m.set(O[0].pageX,O[0].pageY);else{const l=.5*(O[0].pageX+O[1].pageX),D=.5*(O[0].pageY+O[1].pageY);m.set(l,D)}}function Lt(){if(O.length==1)C.set(O[0].pageX,O[0].pageY);else{const l=.5*(O[0].pageX+O[1].pageX),D=.5*(O[0].pageY+O[1].pageY);C.set(l,D)}}function Rt(){const l=O[0].pageX-O[1].pageX,D=O[0].pageY-O[1].pageY,L=Math.sqrt(l*l+D*D);z.set(0,L)}function wn(){n.enableZoom&&Rt(),n.enablePan&&Lt()}function In(){n.enableZoom&&Rt(),n.enableRotate&&Ot()}function Yt(l){if(O.length==1)w.set(l.pageX,l.pageY);else{const L=mt(l),V=.5*(l.pageX+L.x),ne=.5*(l.pageY+L.y);w.set(V,ne)}k.subVectors(w,m).multiplyScalar(n.rotateSpeed);const D=n.domElement;D&&(X(2*Math.PI*k.x/D.clientHeight),U(2*Math.PI*k.y/D.clientHeight)),m.copy(w)}function Ft(l){if(O.length==1)E.set(l.pageX,l.pageY);else{const D=mt(l),L=.5*(l.pageX+D.x),V=.5*(l.pageY+D.y);E.set(L,V)}Y.subVectors(E,C).multiplyScalar(n.panSpeed),te(Y.x,Y.y),C.copy(E)}function Bt(l){const D=mt(l),L=l.pageX-D.x,V=l.pageY-D.y,ne=Math.sqrt(L*L+V*V);j.set(0,ne),I.set(0,Math.pow(j.y/z.y,n.zoomSpeed)),K(I.y),z.copy(j)}function jn(l){n.enableZoom&&Bt(l),n.enablePan&&Ft(l)}function Dn(l){n.enableZoom&&Bt(l),n.enableRotate&&Yt(l)}function Xt(l){var D,L;n.enabled!==!1&&(O.length===0&&((D=n.domElement)==null||D.ownerDocument.addEventListener("pointermove",ut),(L=n.domElement)==null||L.ownerDocument.addEventListener("pointerup",Ve)),Pn(l),l.pointerType==="touch"?Sn(l):kn(l))}function ut(l){n.enabled!==!1&&(l.pointerType==="touch"?Cn(l):zn(l))}function Ve(l){var D,L,V;Mn(l),O.length===0&&((D=n.domElement)==null||D.releasePointerCapture(l.pointerId),(L=n.domElement)==null||L.ownerDocument.removeEventListener("pointermove",ut),(V=n.domElement)==null||V.ownerDocument.removeEventListener("pointerup",Ve)),n.dispatchEvent(_),u=i.NONE}function kn(l){let D;switch(l.button){case 0:D=n.mouseButtons.LEFT;break;case 1:D=n.mouseButtons.MIDDLE;break;case 2:D=n.mouseButtons.RIGHT;break;default:D=-1}switch(D){case Re.DOLLY:if(n.enableZoom===!1)return;b(l),u=i.DOLLY;break;case Re.ROTATE:if(l.ctrlKey||l.metaKey||l.shiftKey){if(n.enablePan===!1)return;S(l),u=i.PAN}else{if(n.enableRotate===!1)return;d(l),u=i.ROTATE}break;case Re.PAN:if(l.ctrlKey||l.metaKey||l.shiftKey){if(n.enableRotate===!1)return;d(l),u=i.ROTATE}else{if(n.enablePan===!1)return;S(l),u=i.PAN}break;default:u=i.NONE}u!==i.NONE&&n.dispatchEvent(s)}function zn(l){if(n.enabled!==!1)switch(u){case i.ROTATE:if(n.enableRotate===!1)return;T(l);break;case i.DOLLY:if(n.enableZoom===!1)return;F(l);break;case i.PAN:if(n.enablePan===!1)return;Q(l);break}}function Vt(l){n.enabled===!1||n.enableZoom===!1||u!==i.NONE&&u!==i.ROTATE||(l.preventDefault(),n.dispatchEvent(s),fe(l),n.dispatchEvent(_))}function dt(l){n.enabled===!1||n.enablePan===!1||bn(l)}function Sn(l){switch(Kt(l),O.length){case 1:switch(n.touches.ONE){case Ye.ROTATE:if(n.enableRotate===!1)return;Ot(),u=i.TOUCH_ROTATE;break;case Ye.PAN:if(n.enablePan===!1)return;Lt(),u=i.TOUCH_PAN;break;default:u=i.NONE}break;case 2:switch(n.touches.TWO){case Ye.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;wn(),u=i.TOUCH_DOLLY_PAN;break;case Ye.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;In(),u=i.TOUCH_DOLLY_ROTATE;break;default:u=i.NONE}break;default:u=i.NONE}u!==i.NONE&&n.dispatchEvent(s)}function Cn(l){switch(Kt(l),u){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Yt(l),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;Ft(l),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;jn(l),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Dn(l),n.update();break;default:u=i.NONE}}function Zt(l){n.enabled!==!1&&l.preventDefault()}function Pn(l){O.push(l)}function Mn(l){delete oe[l.pointerId];for(let D=0;D<O.length;D++)if(O[D].pointerId==l.pointerId){O.splice(D,1);return}}function Kt(l){let D=oe[l.pointerId];D===void 0&&(D=new ie,oe[l.pointerId]=D),D.set(l.pageX,l.pageY)}function mt(l){const D=l.pointerId===O[0].pointerId?O[1]:O[0];return oe[D.pointerId]}this.dollyIn=(l=J())=>{M(l),n.update()},this.dollyOut=(l=J())=>{K(l),n.update()},this.getScale=()=>x,this.setScale=l=>{$(l),n.update()},this.getZoomScale=()=>J(),o!==void 0&&this.connect(o),this.update()}};const ra={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},la={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},ca=()=>parseInt(Ln.replace(/\D+/g,"")),_a=ca(),ua=y.forwardRef(({makeDefault:t,camera:a,regress:o,domElement:n,enableDamping:r=!0,keyEvents:s=!1,onChange:_,onStart:i,onEnd:u,...v},h)=>{const f=ee(I=>I.invalidate),x=ee(I=>I.camera),g=ee(I=>I.gl),m=ee(I=>I.events),w=ee(I=>I.setEvents),k=ee(I=>I.set),C=ee(I=>I.get),E=ee(I=>I.performance),Y=a||x,z=n||m.connected||g.domElement,j=y.useMemo(()=>new sa(Y),[Y]);return Xe(()=>{j.enabled&&j.update()},-1),y.useEffect(()=>(s&&j.connect(s===!0?z:s),j.connect(z),()=>void j.dispose()),[s,z,o,j,f]),y.useEffect(()=>{const I=W=>{f(),o&&E.regress(),_&&_(W)},c=W=>{i&&i(W)},R=W=>{u&&u(W)};return j.addEventListener("change",I),j.addEventListener("start",c),j.addEventListener("end",R),()=>{j.removeEventListener("start",c),j.removeEventListener("end",R),j.removeEventListener("change",I)}},[_,i,u,j,f,w]),y.useEffect(()=>{if(t){const I=C().controls;return k({controls:j}),()=>k({controls:I})}},[t,j]),y.createElement("primitive",$e({ref:h,object:j,enableDamping:r},v))}),da=y.forwardRef(({children:t,domElement:a,onChange:o,onMouseDown:n,onMouseUp:r,onObjectChange:s,object:_,makeDefault:i,camera:u,enabled:v,axis:h,mode:f,translationSnap:x,rotationSnap:g,scaleSnap:m,space:w,size:k,showX:C,showY:E,showZ:Y,...z},j)=>{const I=ee(M=>M.controls),c=ee(M=>M.gl),R=ee(M=>M.events),W=ee(M=>M.camera),O=ee(M=>M.invalidate),oe=ee(M=>M.get),se=ee(M=>M.set),J=u||W,X=a||R.connected||c.domElement,U=y.useMemo(()=>new ea(J,X),[J,X]),le=y.useRef(null);y.useLayoutEffect(()=>(_?U.attach(_ instanceof We?_:_.current):le.current instanceof We&&U.attach(le.current),()=>void U.detach()),[_,t,U]),y.useEffect(()=>{if(I){const M=G=>I.enabled=!G.value;return U.addEventListener("dragging-changed",M),()=>U.removeEventListener("dragging-changed",M)}},[U,I]);const _e=y.useRef(),te=y.useRef(),$=y.useRef(),K=y.useRef();return y.useLayoutEffect(()=>void(_e.current=o),[o]),y.useLayoutEffect(()=>void(te.current=n),[n]),y.useLayoutEffect(()=>void($.current=r),[r]),y.useLayoutEffect(()=>void(K.current=s),[s]),y.useEffect(()=>{const M=b=>{O(),_e.current==null||_e.current(b)},G=b=>te.current==null?void 0:te.current(b),H=b=>$.current==null?void 0:$.current(b),d=b=>K.current==null?void 0:K.current(b);return U.addEventListener("change",M),U.addEventListener("mouseDown",G),U.addEventListener("mouseUp",H),U.addEventListener("objectChange",d),()=>{U.removeEventListener("change",M),U.removeEventListener("mouseDown",G),U.removeEventListener("mouseUp",H),U.removeEventListener("objectChange",d)}},[O,U]),y.useEffect(()=>{if(i){const M=oe().controls;return se({controls:U}),()=>se({controls:M})}},[i,U]),y.createElement(y.Fragment,null,y.createElement("primitive",{ref:j,object:U,enabled:v,axis:h,mode:f,translationSnap:x,rotationSnap:g,scaleSnap:m,space:w,size:k,showX:C,showY:E,showZ:Y}),y.createElement("group",$e({ref:le},z),t))}),ma=Gn({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new be,sectionColor:new be,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new P,worldPlanePosition:new P},`
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
      #include <${_a>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),pa=y.forwardRef(({args:t,cellColor:a="#000000",sectionColor:o="#2080ff",cellSize:n=.5,sectionSize:r=1,followCamera:s=!1,infiniteGrid:_=!1,fadeDistance:i=100,fadeStrength:u=1,fadeFrom:v=1,cellThickness:h=.5,sectionThickness:f=1,side:x=un,...g},m)=>{Rn({GridMaterial:ma});const w=y.useRef(null);y.useImperativeHandle(m,()=>w.current,[]);const k=new _n,C=new P(0,1,0),E=new P(0,0,0);Xe(j=>{k.setFromNormalAndCoplanarPoint(C,E).applyMatrix4(w.current.matrixWorld);const I=w.current.material,c=I.uniforms.worldCamProjPosition,R=I.uniforms.worldPlanePosition;k.projectPoint(j.camera.position,c.value),R.value.set(0,0,0).applyMatrix4(w.current.matrixWorld)});const Y={cellSize:n,sectionSize:r,cellColor:a,sectionColor:o,cellThickness:h,sectionThickness:f},z={fadeDistance:i,fadeStrength:u,fadeFrom:v,infiniteGrid:_,followCamera:s};return y.createElement("mesh",$e({ref:w,frustumCulled:!1},g),y.createElement("gridMaterial",$e({transparent:!0,"extensions-derivatives":!0,side:x},Y,z)),y.createElement("planeGeometry",{args:t}))}),fa=y.forwardRef(({scale:t=10,frames:a=1/0,opacity:o=1,width:n=1,height:r=1,blur:s=1,near:_=0,far:i=10,resolution:u=512,smooth:v=!0,color:h="#000000",depthWrite:f=!1,renderOrder:x,...g},m)=>{const w=y.useRef(null),k=ee(X=>X.scene),C=ee(X=>X.gl),E=y.useRef(null);n=n*(Array.isArray(t)?t[0]:t||1),r=r*(Array.isArray(t)?t[1]:t||1);const[Y,z,j,I,c,R,W]=y.useMemo(()=>{const X=new It(u,u),U=new It(u,u);U.texture.generateMipmaps=X.texture.generateMipmaps=!1;const le=new xe(n,r).rotateX(Math.PI/2),_e=new A(le),te=new Yn;te.depthTest=te.depthWrite=!1,te.onBeforeCompile=M=>{M.uniforms={...M.uniforms,ucolor:{value:new be(h)}},M.fragmentShader=M.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),M.fragmentShader=M.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const $=new rt(ra),K=new rt(la);return K.depthTest=$.depthTest=!1,[X,le,te,_e,$,K,U]},[u,n,r,t,h]),O=X=>{I.visible=!0,I.material=c,c.uniforms.tDiffuse.value=Y.texture,c.uniforms.h.value=X*1/256,C.setRenderTarget(W),C.render(I,E.current),I.material=R,R.uniforms.tDiffuse.value=W.texture,R.uniforms.v.value=X*1/256,C.setRenderTarget(Y),C.render(I,E.current),I.visible=!1};let oe=0,se,J;return Xe(()=>{E.current&&(a===1/0||oe<a)&&(oe++,se=k.background,J=k.overrideMaterial,w.current.visible=!1,k.background=null,k.overrideMaterial=j,C.setRenderTarget(Y),C.render(k,E.current),O(s),v&&O(s*.4),C.setRenderTarget(null),w.current.visible=!0,k.overrideMaterial=J,k.background=se)}),y.useImperativeHandle(m,()=>w.current,[]),y.createElement("group",$e({"rotation-x":Math.PI/2},g,{ref:w}),y.createElement("mesh",{renderOrder:x,geometry:z,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},y.createElement("meshBasicMaterial",{transparent:!0,map:Y.texture,opacity:o,depthWrite:f})),y.createElement("orthographicCamera",{ref:E,args:[-n/2,n/2,r/2,-r/2,_,i]}))}),B=({size:t=18,children:a,...o})=>e.jsx("svg",{width:t,height:t,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...o,children:a}),Ae=t=>e.jsxs(B,{...t,children:[e.jsx("path",{d:"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("circle",{cx:"12",cy:"12",r:"2.6",stroke:"currentColor",strokeWidth:"1.7"})]}),Te=t=>e.jsxs(B,{...t,children:[e.jsx("path",{d:"M4 4l16 16",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"}),e.jsx("path",{d:"M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.3 4M6.2 6.9A15 15 0 0 0 2.5 12S6 19 12 19a9 9 0 0 0 4-1",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),He=t=>e.jsx(B,{...t,children:e.jsx("path",{d:"M6 6l12 12M18 6L6 18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),Me=t=>e.jsx(B,{...t,children:e.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),qe=t=>e.jsx(B,{...t,children:e.jsx("path",{d:"M7 10l5 5 5-5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),mn=t=>e.jsx(B,{...t,children:e.jsx("path",{d:"M5 12.5l4.2 4L19 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),Mt=t=>e.jsx(B,{...t,children:[8,12,16].map(a=>e.jsxs("g",{children:[e.jsx("circle",{cx:"9.4",cy:a,r:"1.15",fill:"currentColor"}),e.jsx("circle",{cx:"14.6",cy:a,r:"1.15",fill:"currentColor"})]},a))}),pn=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"11",cy:"11",r:"6.5",stroke:"currentColor",strokeWidth:"1.8"}),e.jsx("path",{d:"M15.8 15.8L20.5 20.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),ha=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"6",y:"10.5",width:"12",height:"8.5",rx:"2",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",stroke:"currentColor",strokeWidth:"1.7"})]}),va=t=>e.jsx(B,{...t,children:e.jsx("path",{d:"M13 2.5L5.5 13.5h5L10 21.5l8-11.5h-5.2L13 2.5Z",fill:"currentColor"})}),fn=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"3.5",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"13.1",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"3.5",y:"13.1",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"13.1",y:"13.1",width:"7.4",height:"7.4",rx:"3.7",stroke:"currentColor",strokeWidth:"1.7"})]}),jt=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"6.2",stroke:"currentColor",strokeWidth:"1.6",opacity:"0.9"}),e.jsx("circle",{cx:"12",cy:"12",r:"2.2",fill:"currentColor",opacity:"0.9"})]}),Je=({id:t,from:a,to:o,vertical:n=!1})=>e.jsxs("linearGradient",{id:t,x1:"0",y1:"0",x2:n?"0":"1",y2:n?"1":"0",children:[e.jsx("stop",{offset:"0",stopColor:a}),e.jsx("stop",{offset:"1",stopColor:o})]}),ya=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"sm-rainbow",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#ff5f6d"}),e.jsx("stop",{offset:"0.35",stopColor:"#ffc371"}),e.jsx("stop",{offset:"0.65",stopColor:"#7ee8a2"}),e.jsx("stop",{offset:"1",stopColor:"#7aa8ff"})]})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-rainbow)"})]}),xa=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsx(Je,{id:"sm-normal",from:"#b48cff",to:"#4d7cff",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-normal)"}),e.jsx("circle",{cx:"9.4",cy:"9",r:"2.6",fill:"#ffffff",opacity:"0.35"})]}),ga=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsx(Je,{id:"sm-depth",from:"#8f9bb3",to:"#39415a",vertical:!0})}),e.jsx("path",{d:"M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z",fill:"url(#sm-depth)"})]}),ba=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsx(Je,{id:"sm-gradient",from:"#f2f2f2",to:"#4a4a4a",vertical:!0})}),e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-gradient)"})]}),wa=t=>e.jsx(B,{...t,children:[7.5,12,16.5].map(a=>e.jsx("path",{d:`M4 ${a}c2.4-2.6 4.8 2.6 7.2 0s4.8 2.6 8.8 0`,stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",fill:"none"},a))}),Ia=t=>e.jsx(B,{...t,children:e.jsx("circle",{cx:"12",cy:"12",r:"8",stroke:"currentColor",strokeWidth:"4.4",opacity:"0.85"})}),ja=t=>e.jsxs(B,{...t,children:[e.jsx("path",{d:"M12 3.5l7.4 4.3v8.4L12 20.5l-7.4-4.3V7.8L12 3.5Z",fill:"currentColor",opacity:"0.35"}),e.jsx("path",{d:"M12 7l4.3 2.5v5L12 17l-4.3-2.5v-5L12 7Z",fill:"currentColor",opacity:"0.9"})]}),Da=t=>e.jsx(B,{...t,children:[7,12,17].map((a,o)=>e.jsx("g",{fill:"currentColor",opacity:.9-o*.18,children:[5,9.5,14,18.5].map((n,r)=>e.jsx("circle",{cx:n+o%2*1.4,cy:a+r%2*1.2-.6,r:"1.05"},n))},a))}),ka=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"13.5",r:"7.5",stroke:"#ff6b6b",strokeWidth:"1.9",fill:"none"}),e.jsx("circle",{cx:"12",cy:"15",r:"5",stroke:"#ffc94d",strokeWidth:"1.9",fill:"none"}),e.jsx("circle",{cx:"12",cy:"16.5",r:"2.6",stroke:"#5fd08a",strokeWidth:"1.9",fill:"none"})]}),za=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.28"}),e.jsx("path",{d:"M12 3.6a8.4 8.4 0 0 1 0 16.8V3.6Z",fill:"currentColor",opacity:"0.95"})]}),Sa=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.2",stroke:"currentColor",strokeWidth:"1.8"}),e.jsx("circle",{cx:"12",cy:"12",r:"4.6",stroke:"currentColor",strokeWidth:"1.8"})]}),Ca=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsx(Je,{id:"sm-glass",from:"#eef7fb",to:"#9fc4d8",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-glass)",opacity:"0.9"}),e.jsx("path",{d:"M7.5 9.5c1-2 3.4-3.2 5.6-3",stroke:"#ffffff",strokeWidth:"1.8",strokeLinecap:"round",fill:"none"})]}),Pa=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsx(Je,{id:"sm-reflect",from:"#f5f9ff",to:"#5b7ea8",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-reflect)"}),e.jsx("path",{d:"M6.5 13.5c3.5-1.2 7.5-1.2 11 0",stroke:"#ffffff",strokeWidth:"1.6",opacity:"0.7",fill:"none"})]}),Ma=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"sm-matcap",cx:"0.35",cy:"0.3",r:"0.95",children:[e.jsx("stop",{offset:"0",stopColor:"#ffffff"}),e.jsx("stop",{offset:"0.55",stopColor:"#b9b9b9"}),e.jsx("stop",{offset:"1",stopColor:"#5c5c5c"})]})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-matcap)"})]}),Ea=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.3"}),[[8.5,8.5],[13.5,7.5],[16.5,11.5],[10.5,13],[14.5,16],[8,15.5]].map(([a,o])=>e.jsx("circle",{cx:a,cy:o,r:"1.5",fill:"currentColor"},`${a}-${o}`))]}),Na=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16",stroke:"currentColor",strokeWidth:"1.5",opacity:"0.85"})]}),Aa=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"sm-vertex",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#ff8f6b"}),e.jsx("stop",{offset:"0.5",stopColor:"#ffd36b"}),e.jsx("stop",{offset:"1",stopColor:"#6bc9ff"})]})}),e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-vertex)"})]}),Ta=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"8",y:"8",width:"8",height:"8",rx:"2",fill:"currentColor",opacity:"0.55"})]}),Oa=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M10.2 8.8l5 3.2-5 3.2V8.8Z",fill:"currentColor",opacity:"0.85"})]}),La=t=>e.jsxs(B,{...t,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7",opacity:"0.7"}),e.jsx("path",{d:"M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3L12 7Z",fill:"currentColor"})]}),Ra=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"12",cy:"12",r:"4",fill:"currentColor"}),e.jsx("circle",{cx:"12",cy:"12",r:"7.4",stroke:"currentColor",strokeWidth:"1.6",opacity:"0.45"}),e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.2",opacity:"0.2"})]}),Ya=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"9",cy:"12",r:"6.2",fill:"currentColor",opacity:"0.85"}),e.jsx("circle",{cx:"14",cy:"12",r:"6.2",fill:"currentColor",opacity:"0.4"})]}),Fa=t=>e.jsxs(B,{...t,children:[e.jsx("circle",{cx:"9.4",cy:"12",r:"6.4",fill:"#ff5f6d",opacity:"0.65"}),e.jsx("circle",{cx:"12",cy:"12",r:"6.4",fill:"#5fd08a",opacity:"0.5"}),e.jsx("circle",{cx:"14.6",cy:"12",r:"6.4",fill:"#5b8cff",opacity:"0.65"})]}),Ba=t=>e.jsxs(B,{...t,children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"sm-vignette",cx:"0.5",cy:"0.5",r:"0.55",children:[e.jsx("stop",{offset:"0",stopColor:"currentColor",stopOpacity:"0"}),e.jsx("stop",{offset:"1",stopColor:"currentColor",stopOpacity:"0.95"})]})}),e.jsx("rect",{x:"3.5",y:"3.5",width:"17",height:"17",rx:"4",fill:"url(#sm-vignette)"})]}),Xa=t=>e.jsx(B,{...t,children:[[6,7],[11,5.5],[16,8],[8,12],[13,11],[18,13],[6,17],[11,16],[16,18]].map(([a,o],n)=>e.jsx("circle",{cx:a,cy:o,r:n%3===0?1.4:.95,fill:"currentColor",opacity:.5+n%3*.2},n))}),Va=t=>e.jsx(B,{...t,children:Array.from({length:18},(a,o)=>e.jsx("rect",{x:4+o%6*3,y:4+Math.floor(o/6)*5+o%2,width:"2.1",height:"2.1",fill:"currentColor",opacity:.25+o%4*.2},o))}),Za=t=>e.jsx(B,{...t,children:[[0,0,.9],[1,0,.5],[2,0,.3],[0,1,.5],[1,1,.95],[2,1,.45],[0,2,.3],[1,2,.5],[2,2,.85]].map(([a,o,n],r)=>e.jsx("rect",{x:4.5+a*5,y:4.5+o*5,width:"4.4",height:"4.4",fill:"currentColor",opacity:n},r))}),Ka=t=>e.jsxs(B,{...t,children:[[12,8,16].map((a,o)=>e.jsx("path",{d:`M4 ${a}h16`,stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",opacity:.4+o*.25},a)),e.jsx("circle",{cx:"14",cy:"8",r:"2.5",fill:"currentColor"}),e.jsx("circle",{cx:"9",cy:"12",r:"2.5",fill:"currentColor"}),e.jsx("circle",{cx:"15",cy:"16",r:"2.5",fill:"currentColor"})]}),Ua=t=>e.jsx(B,{...t,children:e.jsx("rect",{x:"4.5",y:"4.5",width:"15",height:"15",rx:"4",stroke:"currentColor",strokeWidth:"2.6"})}),Ga=t=>e.jsxs(B,{...t,children:[e.jsx("path",{d:"M5 8.2h9l-2.4 3H19l-3.4 3.6H4.6L7 11.8H3.2L5 8.2Z",fill:"currentColor",opacity:"0.9"}),e.jsx("path",{d:"M8 18h8M10.5 4.5h5",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),vt={bloom:Ra,blur:Ya,chromatic:Fa,vignette:Ba,grain:Xa,noise:Va,pixelate:Za,colorAdjust:Ka,outline:Ua,glitch:Ga},Dt={aiTexture:La,image:Ta,video:Oa,color:ya,depth:ga,normal:xa,gradient:ba,noise:wa,fresnel:Ia,cavity:ja,dust:Da,rainbow:ka,toon:za,outline:Sa,glass:Ca,reflection:Pa,matcap:Ma,displace:Ea,pattern:Na,vertexColor:Aa};function Le(t){const a=y.useRef(null);return y.useEffect(()=>{const o=n=>{a.current&&!a.current.contains(n.target)&&t()};return window.addEventListener("mousedown",o),()=>window.removeEventListener("mousedown",o)},[t]),a}const re=t=>{if(!t)return{top:120,left:window.innerWidth-340};const a=t.getBoundingClientRect();return{top:a.top,left:a.left}},de=({value:t,prefix:a,step:o=.1,width:n,onChange:r,className:s})=>{const[_,i]=y.useState(String(t)),[u,v]=y.useState(!1);y.useEffect(()=>{u||i(String(t))},[t,u]);const h=f=>{const x=parseFloat(f);Number.isFinite(x)?r(x):i(String(t))};return e.jsxs("span",{className:`ninput ${s??""}`,style:n?{width:n}:void 0,children:[a?e.jsx("span",{className:"ninput-prefix",children:a}):null,e.jsx("input",{value:_,step:o,onChange:f=>{i(f.target.value),h(f.target.value)},onFocus:()=>v(!0),onBlur:()=>{v(!1),h(_)},onKeyDown:f=>{f.key==="Enter"&&f.target.blur()}})]})},kt=({value:t,prefixes:a,step:o,onChange:n})=>e.jsx("span",{className:"vec",children:a.map((r,s)=>e.jsx(de,{value:t[s]??0,prefix:r,step:o,onChange:_=>{const i=[...t];i[s]=_,n(i)}},r+s))}),Et=({value:t,onChange:a,percent:o})=>e.jsxs("span",{className:"colorfield",children:[e.jsxs("label",{className:"swatch",children:[e.jsx("span",{style:{background:t}}),e.jsx("input",{type:"color",value:t,onChange:n=>a(n.target.value)})]}),e.jsx("span",{className:"hexbox",children:e.jsx("input",{value:t.replace("#","").toUpperCase(),onChange:n=>a(`#${n.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}),o?e.jsx("span",{className:"ninput pct",children:e.jsx("input",{value:"100%",readOnly:!0})}):null]}),Qa=({value:t,onChange:a})=>{const o=y.useRef(null);return e.jsxs("span",{className:"texture-input",children:[e.jsxs("span",{className:`swatch texture ${t?"has":""}`,onClick:()=>{var n;return(n=o.current)==null?void 0:n.click()},title:t?"更换图片":"上传图片",children:[t?e.jsx("span",{className:"texture-thumb",children:e.jsx("img",{src:t,alt:""})}):e.jsx("span",{className:"texture-plus",children:"+"}),e.jsx("input",{ref:o,type:"file",accept:"image/*",onChange:n=>{var _;const r=(_=n.target.files)==null?void 0:_[0];if(!r)return;const s=new FileReader;s.onload=()=>a(String(s.result??"")),s.readAsDataURL(r),n.target.value=""}})]}),t?e.jsx("button",{className:"iconbtn",title:"清除贴图",onClick:()=>a(""),children:"✕"}):null]})},ze=({value:t,options:a,onChange:o})=>e.jsx("span",{className:"segmented",children:a.map(n=>e.jsx("button",{className:n===t?"on":"",onClick:()=>o(n),children:n[0].toUpperCase()+n.slice(1)},n))}),Ce=({value:t,options:a,onChange:o,placeholder:n,style:r})=>{const[s,_]=y.useState(!1),i=Le(()=>_(!1)),u=a.find(v=>v.value===t);return e.jsxs("div",{className:"dropdown",style:r,ref:i,children:[e.jsxs("button",{className:"dropdown-btn",onClick:()=>_(v=>!v),children:[e.jsx("span",{children:(u==null?void 0:u.label)??n??t}),e.jsx(qe,{size:14})]}),s?e.jsx("div",{className:"dropdown-menu",children:a.map(v=>e.jsx("button",{className:v.value===t?"on":"",onClick:()=>{o(v.value),_(!1)},children:v.label},v.value))}):null]})},Wa=({title:t,anchor:a,width:o=440,onClose:n,children:r})=>{const s=Le(n),_={left:Math.max(12,a.left-o-14),top:Math.min(Math.max(12,a.top-8),Math.max(window.innerHeight-360,12)),width:o};return e.jsxs("div",{className:"popup",style:_,ref:s,children:[e.jsxs("header",{children:[e.jsx("h3",{children:t}),e.jsx("button",{className:"iconbtn",onClick:n,children:e.jsx(He,{size:16})})]}),e.jsx("div",{className:"popup-body",children:r})]})},$a=[{key:"brightness",label:"Brightness",type:"number",step:.02,group:0},{key:"contrast",label:"Contrast",type:"number",step:.02,group:0},{key:"saturation",label:"Saturation",type:"number",step:.02,group:0},{key:"hue",label:"Hue",type:"number",step:.01,group:0}],ct={bloom:{label:"Bloom",icon:"bloom",defaults:{threshold:.72,intensity:.5,blur:1.4},fields:[{key:"threshold",label:"Threshold",type:"number",step:.02,group:0},{key:"intensity",label:"Intensity",type:"number",step:.02,group:0},{key:"blur",label:"Blur",type:"number",step:.05,group:0}]},blur:{label:"Blur",icon:"blur",defaults:{amount:4},fields:[{key:"amount",label:"Amount",type:"number",step:.2,group:0}]},chromatic:{label:"Chromatic",icon:"chromatic",defaults:{amount:.15},fields:[{key:"amount",label:"Amount",type:"number",step:.01,group:0}]},vignette:{label:"Vignette",icon:"vignette",defaults:{offset:.32,darkness:.6},fields:[{key:"offset",label:"Offset",type:"number",step:.02,group:0},{key:"darkness",label:"Darkness",type:"number",step:.02,group:0}]},grain:{label:"Grain",icon:"grain",defaults:{intensity:.28,size:1.4,animated:"on"},fields:[{key:"intensity",label:"Intensity",type:"number",step:.02,group:0},{key:"size",label:"Size",type:"number",step:.1,group:0},{key:"animated",label:"Animated",type:"segment",options:["on","off"],group:1}]},noise:{label:"Noise",icon:"noise",defaults:{intensity:.22},fields:[{key:"intensity",label:"Intensity",type:"number",step:.02,group:0}]},pixelate:{label:"Pixelate",icon:"pixelate",defaults:{pixelSize:10},fields:[{key:"pixelSize",label:"Pixel Size",type:"number",step:1,group:0}]},colorAdjust:{label:"Color Adjust",icon:"colorAdjust",defaults:{brightness:0,contrast:1,saturation:1,hue:0},fields:$a},outline:{label:"Outline",icon:"outline",defaults:{color:"#101014",threshold:.22,thickness:1.4},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"threshold",label:"Threshold",type:"number",step:.02,group:0},{key:"thickness",label:"Thickness",type:"number",step:.1,group:0}]},glitch:{label:"Glitch",icon:"glitch",defaults:{amount:.2,speed:1},fields:[{key:"amount",label:"Amount",type:"number",step:.02,group:0},{key:"speed",label:"Speed",type:"number",step:.1,group:0}]}},Ha=["bloom","blur","chromatic","vignette","grain","noise","pixelate","colorAdjust","outline","glitch"];let qa=0;const Ja=()=>`e${++qa}_${Math.random().toString(36).slice(2,6)}`,Nt=(t,a={})=>{const o=ct[t];return{id:Ja(),kind:t,name:o.label,visible:!0,opacity:100,params:{...o.defaults},...a}},eo=()=>[Nt("bloom")],Ht={bloom:"让画面中亮的部分晕开发光",blur:"整画面柔焦模糊",chromatic:"镜头色散：边缘红蓝重影",vignette:"镜头暗角：四周压暗",grain:"胶片颗粒质感",noise:"整屏彩色雪花噪点",pixelate:"马赛克像素风",colorAdjust:"调亮度 / 对比 / 饱和 / 色相",outline:"按明暗交界描一圈线",glitch:"信号故障式的画面撕裂"},to={"bloom.threshold":"多亮的部分才算发光","bloom.intensity":"光晕强度","bloom.blur":"光晕扩散范围","blur.amount":"模糊程度","chromatic.amount":"红蓝错位幅度","vignette.offset":"暗角从多大范围开始","vignette.darkness":"暗角浓度","grain.intensity":"颗粒强度","grain.size":"颗粒粗细","grain.animated":"颗粒是否每帧闪动","noise.intensity":"噪点浓度","pixelate.pixelSize":"马赛克格子大小","colorAdjust.brightness":"整体提亮或压暗","colorAdjust.contrast":"明暗对比强度","colorAdjust.saturation":"颜色鲜艳程度","colorAdjust.hue":"整体转动色相","outline.color":"描边颜色","outline.threshold":"描边灵敏度","outline.thickness":"描边粗细","glitch.amount":"撕裂位移大小","glitch.speed":"撕裂闪动频率"},no=t=>t.spec.effects.map(({kind:a,overrides:o})=>Nt(a,o)),Ie=(t,a,o,n)=>({id:t,name:a,category:"Stack",swatch:o,spec:{effects:n}}),ao=[Ie("cinematic","Cinematic",["#3a4a58","#12181e"],[{kind:"colorAdjust",overrides:{params:{brightness:-.02,contrast:1.18,saturation:.86,hue:0}}},{kind:"vignette",overrides:{opacity:80,params:{offset:.38,darkness:.55}}},{kind:"grain",overrides:{opacity:55,params:{intensity:.16,size:1.6,animated:"on"}}}]),Ie("dreamy","Dreamy",["#ffe3f0","#b89fd9"],[{kind:"bloom",overrides:{params:{threshold:.45,intensity:1.15,blur:2.2}}},{kind:"chromatic",overrides:{opacity:45,params:{amount:.08}}},{kind:"grain",overrides:{opacity:35,params:{intensity:.1,size:2,animated:"on"}}}]),Ie("retro-vhs","Retro VHS",["#4a3ad9","#d93a6e"],[{kind:"noise",overrides:{opacity:55,params:{intensity:.3}}},{kind:"chromatic",overrides:{params:{amount:.22}}},{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.08,saturation:1.3,hue:.02}}},{kind:"glitch",overrides:{opacity:70,params:{amount:.24,speed:.8}}}]),Ie("noir","Noir",["#2c2c2c","#0a0a0a"],[{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.35,saturation:.05,hue:0}}},{kind:"grain",overrides:{params:{intensity:.3,size:1.2,animated:"on"}}},{kind:"vignette",overrides:{params:{offset:.45,darkness:.75}}}]),Ie("neon-night","Neon Night",["#7a2ee8","#2ee8d9"],[{kind:"colorAdjust",overrides:{params:{brightness:-.05,contrast:1.15,saturation:1.45,hue:.55}}},{kind:"bloom",overrides:{params:{threshold:.5,intensity:1.2,blur:1.6}}},{kind:"chromatic",overrides:{opacity:60,params:{amount:.12}}},{kind:"vignette",overrides:{opacity:70,params:{offset:.3,darkness:.6}}}]),Ie("pixel-art","Pixel Art",["#8ae06b","#2f6e3c"],[{kind:"pixelate",overrides:{params:{pixelSize:28}}},{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.1,saturation:1.25,hue:0}}}]),Ie("film-35mm","Film 35mm",["#d9c9a8","#4a3f30"],[{kind:"grain",overrides:{params:{intensity:.22,size:1.8,animated:"on"}}},{kind:"vignette",overrides:{opacity:65,params:{offset:.32,darkness:.45}}},{kind:"bloom",overrides:{opacity:45,params:{threshold:.68,intensity:.5,blur:1.8}}}]),Ie("frost","Frost",["#cfe8f2","#6e93a8"],[{kind:"blur",overrides:{params:{amount:6}}},{kind:"bloom",overrides:{opacity:70,params:{threshold:.55,intensity:.9,blur:2}}},{kind:"colorAdjust",overrides:{opacity:80,params:{brightness:.03,contrast:.96,saturation:.9,hue:0}}}])],oo=["normal","add","subtract","multiply","screen","overlay","softlight","lighten","darken","divide","reflect","negation"],hn={normal:"Normal",add:"Add",subtract:"Subtract",multiply:"Multiply",screen:"Screen",overlay:"Overlay",softlight:"Soft Light",lighten:"Lighten",darken:"Darken",divide:"Divide",reflect:"Reflect",negation:"Negation"},io=[{key:"mode",label:"Mode",type:"segment",options:["mask","color"],group:0},{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:1},{key:"size",label:"Size",type:"vec3",prefix:"XYZ",group:1},{key:"scale",label:"Scale",type:"number",prefix:"S",step:.1,group:1},{key:"movement",label:"Movement",type:"number",prefix:"M",step:.1,group:1},{key:"colorA",label:"Color",type:"color",group:1},{key:"colorB",label:"Color",type:"color",group:1},{key:"colorC",label:"Color",type:"color",group:1},{key:"colorD",label:"Color",type:"color",group:1},{key:"distortion",label:"Distortion",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorA",label:"FactorA",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorB",label:"FactorB",type:"vec2",prefix:"XY",step:.1,group:2}],Se={aiTexture:{label:"AI Texture",icon:"aiTexture",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},image:{label:"Image",icon:"image",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},video:{label:"Video",icon:"video",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},color:{label:"Color",icon:"color",hexKey:"color",defaults:{color:"#54545e"},fields:[{key:"color",label:"Color",type:"color",group:0}]},depth:{label:"Depth",icon:"depth",defaults:{colorA:"#ffffff",colorB:"#1c1c1c",near:2,far:10},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"near",label:"Near",type:"number",step:.1,group:0},{key:"far",label:"Far",type:"number",step:.5,group:0}]},normal:{label:"Normal",icon:"normal",defaults:{direction:[1,1,1],tint:"#ffffff"},fields:[{key:"direction",label:"Direction",type:"vec3",prefix:"XYZ",step:.1,group:0},{key:"tint",label:"Tint",type:"color",group:0}]},gradient:{label:"Gradient",icon:"gradient",defaults:{colorA:"#ffffff",colorB:"#232323",axes:"y",start:-1,end:1,contrast:1},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"axes",label:"Axes",type:"select",options:["x","y","z"],group:0},{key:"start",label:"Start",type:"number",step:.1,group:1},{key:"end",label:"End",type:"number",step:.1,group:1},{key:"contrast",label:"Contrast",type:"number",step:.1,group:1}]},noise:{label:"Noise",icon:"noise",defaults:{mode:"color",type:"simplex",size:[100,100,100],scale:1,movement:1,colorA:"#666666",colorB:"#666666",colorC:"#ffffff",colorD:"#ffffff",distortion:[1,1],factorA:[1.7,9.2],factorB:[8.3,2.8]},fields:io},fresnel:{label:"Fresnel",icon:"fresnel",defaults:{color:"#ffffff",power:3,intensity:1,bias:0},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0},{key:"intensity",label:"Intensity",type:"number",step:.1,group:0},{key:"bias",label:"Bias",type:"number",step:.05,group:0}]},cavity:{label:"Cavity",icon:"cavity",defaults:{scale:2.5,threshold:.55,strength:.8},fields:[{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"threshold",label:"Threshold",type:"number",step:.05,group:0},{key:"strength",label:"Strength",type:"number",step:.05,group:0}]},dust:{label:"Dust",icon:"dust",defaults:{color:"#ffffff",scale:14,coverage:.18},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0},{key:"coverage",label:"Coverage",type:"number",step:.02,group:0}]},rainbow:{label:"Rainbow",icon:"rainbow",defaults:{hueShift:0,saturation:.75},fields:[{key:"hueShift",label:"Hue Shift",type:"number",step:.05,group:0},{key:"saturation",label:"Saturation",type:"number",step:.05,group:0}]},toon:{label:"Toon",icon:"toon",defaults:{color:"#ff9060",steps:3},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"steps",label:"Steps",type:"number",step:1,group:0}]},outline:{label:"Outline",icon:"outline",defaults:{color:"#101010",width:.08,threshold:.32},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"width",label:"Width",type:"number",step:.01,group:0},{key:"threshold",label:"Threshold",type:"number",step:.02,group:0}]},glass:{label:"Glass",icon:"glass",defaults:{color:"#ffffff",transmission:.92,refraction:1.14,thickness:.55,aberration:.05,roughness:.08},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"transmission",label:"Transmission",type:"number",step:.02,group:0},{key:"refraction",label:"Refraction",type:"number",step:.01,group:1},{key:"thickness",label:"Thickness",type:"number",step:.05,group:1},{key:"aberration",label:"Aberration",type:"number",step:.01,group:1},{key:"roughness",label:"Blur",type:"number",step:.01,group:2}]},reflection:{label:"Reflection",icon:"reflection",defaults:{sky:"#bcd6ff",ground:"#3a2f2a",power:1.2},fields:[{key:"sky",label:"Sky",type:"color",group:0},{key:"ground",label:"Ground",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0}]},matcap:{label:"Matcap",icon:"matcap",defaults:{light:"#f2f2f2",dark:"#3c3c3c",rim:.6},fields:[{key:"light",label:"Light",type:"color",group:0},{key:"dark",label:"Dark",type:"color",group:0},{key:"rim",label:"Rim",type:"number",step:.05,group:0}]},displace:{label:"Displace",icon:"displace",defaults:{strength:.22,scale:2.4,offset:[0,0,0],type:"simplex"},fields:[{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:0},{key:"strength",label:"Strength",type:"number",step:.01,group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"offset",label:"Offset",type:"vec3",prefix:"XYZ",step:.1,group:0}]},pattern:{label:"Pattern",icon:"pattern",defaults:{colorA:"#e8e8e8",colorB:"#3a3a3a",scale:8,pattern:"checker"},fields:[{key:"pattern",label:"Type",type:"select",options:["checker","stripes"],group:0},{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0}]},vertexColor:{label:"Vertex Color",icon:"vertexColor",defaults:{colorA:"#7fe0c3",colorB:"#7f9fe0"},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0}]}},so=["aiTexture","image","video","color","depth","normal","gradient","noise","fresnel","cavity","dust","rainbow","toon","outline","glass","reflection","matcap","displace","pattern","vertexColor"],vn={enabled:!0,strength:100,type:"physical",color:"#ffffff",shining:48,roughness:.16,metalness:0,reflectivity:1,glass:0,aberration:.05,thickness:.5,refraction:1.12,blur:.1,bumpMap:"none",occlusion:!0},ro=[{key:"type",label:"Type",type:"select",options:["lambert","phong","physical","toon"],group:0},{key:"color",label:"Color",type:"color",group:0},{key:"shining",label:"Shining",type:"number",step:1,group:0},{key:"roughness",label:"Roughness",type:"number",step:.01,group:1},{key:"metalness",label:"Metalness",type:"number",step:.01,group:1},{key:"reflectivity",label:"Reflectivity",type:"number",step:.05,group:1},{key:"glass",label:"Glass",type:"number",step:.02,group:1},{key:"aberration",label:"Aberration",type:"number",step:.01,group:2},{key:"thickness",label:"Thickness",type:"number",step:.05,group:2},{key:"refraction",label:"Refraction",type:"number",step:.01,group:2},{key:"blur",label:"Blur",type:"number",step:.01,group:2},{key:"bumpMap",label:"Bump Map",type:"select",options:["none","noise"],group:3},{key:"occlusion",label:"Occlusion",type:"segment",options:["on","off"],group:3}],lo={enabled:!0,map:"studio_white",exposure:1,rotation:[0,0,0]},co={enabled:!0,intensity:1,color:"#ffffff",ambient:.75,shadowMode:"auto",shadowColor:"#000000"};let _o=0;const uo=()=>`l${++_o}_${Math.random().toString(36).slice(2,6)}`,pe=(t,a={})=>{const o=Se[t];return{id:uo(),kind:t,name:o.label,mode:"normal",visible:!0,opacity:100,params:{...o.defaults,...a.params??{}},...a}},mo=()=>({opacity:100,layers:[pe("color"),pe("noise")],lighting:{...vn},env:{...lo},wireframe:!1,shading:"normal",sides:"front",shadows:"castreceive",collision:"visibility"}),yt={aiTexture:"用一张图片（比如 AI 生成的图）贴在表面",image:"上传本地图片作为表面贴图",video:"视频贴图占位：当前与 Image 相同方式采样",color:"一层纯色底",depth:"按远近距离混合两种颜色",normal:"把表面朝向显示成颜色，常用于调试或科技感",gradient:"两种颜色沿一个方向渐变过渡",noise:"程序噪声混四色，做大理石 / 云雾 / 流动纹理",fresnel:"物体边缘发亮，像逆光时的轮廓光",cavity:"往凹缝处压暗，强调磨损细节",dust:"在表面撒一层细小颗粒",rainbow:"按位置铺开彩虹色相",toon:"卡通式分档明暗",outline:"在轮廓边缘画一圈描边",glass:"透明玻璃，带折射、厚度与色散",reflection:"像镜面一样反射一个虚拟天空",matcap:"固定打光的球面材质，快速获得金属 / 陶瓷感",displace:"真实挤出表面凹凸（改变几何形状）",pattern:"棋盘格或条纹的程序图案",vertexColor:"按表面朝向上下混合两种颜色",lighting:"决定表面的打光方式与反射质感"},qt={"image.map":"点击方块选一张本地图片","image.tint":"给贴图叠色，白色 = 原色","image.scale":"贴图重复密度，越大越密","video.map":"点击方块选一张本地图片","video.tint":"给贴图叠色，白色 = 原色","video.scale":"贴图重复密度，越大越密","aiTexture.map":"点击方块选一张本地图片","aiTexture.tint":"给贴图叠色，白色 = 原色","aiTexture.scale":"贴图重复密度，越大越密","color.color":"物体的基础颜色","depth.colorA":"近处的颜色","depth.colorB":"远处的颜色","depth.near":"从多近开始过渡","depth.far":"到多远完全变成远色","normal.direction":"X / Y / Z 三个方向的强度","normal.tint":"整体亮度与染色","gradient.colorA":"渐变起点的颜色","gradient.colorB":"渐变终点的颜色","gradient.axes":"渐变沿哪个轴铺开","gradient.start":"渐变开始的位置","gradient.end":"渐变结束的位置","gradient.contrast":"分界的生硬程度","noise.mode":"Color = 当颜色画；Mask = 只控制透明度","noise.type":"噪声花纹的风格","noise.size":"X / Y / Z 方向的纹理密度","noise.scale":"整体缩放，越大纹理越细","noise.movement":"流动速度，0 = 静止","noise.colorA":"最暗处的颜色","noise.colorB":"偏暗处的颜色","noise.colorC":"偏亮处的颜色","noise.colorD":"最亮处的颜色","noise.distortion":"把纹理扭歪（X = 强度，Y = 频率）","noise.factorA":"细节层的强度与频率","noise.factorB":"第二层细节的强度与频率","fresnel.color":"边缘光的颜色","fresnel.power":"边缘范围收得多细，越大越细","fresnel.intensity":"边缘光亮度","fresnel.bias":"整体加亮的底量","cavity.scale":"裂缝纹理大小","cavity.threshold":"判定凹缝的范围","cavity.strength":"凹缝压暗的程度","dust.color":"颗粒颜色","dust.scale":"颗粒密集程度","dust.coverage":"被颗粒覆盖的比例","rainbow.hueShift":"整体转动色相","rainbow.saturation":"颜色鲜艳程度","toon.color":"卡通底色","toon.steps":"明暗分几档，越大过渡越多","outline.color":"描边颜色","outline.width":"描边粗细","outline.threshold":"多大转角才出描边","glass.color":"玻璃的染色","glass.transmission":"透过程，1 = 全透","glass.refraction":"折射弯折程度","glass.thickness":"厚度感，越厚颜色越重","glass.aberration":"边缘红蓝分离（色散）","glass.roughness":"毛玻璃模糊程度","reflection.sky":"反射中的天空色","reflection.ground":"反射中的地面色","reflection.power":"上下过渡的对比","matcap.light":"受光面的颜色","matcap.dark":"背光面的颜色","matcap.rim":"边缘高光强度","displace.type":"凹凸花纹的风格","displace.strength":"凹凸深度","displace.scale":"凹凸密度","displace.offset":"花纹的整体偏移","pattern.pattern":"格子还是条纹","pattern.colorA":"第一格的颜色","pattern.colorB":"第二格的颜色","pattern.scale":"图案大小，越大越密","vertexColor.colorA":"朝上部分的颜色","vertexColor.colorB":"朝下部分的颜色","lighting.type":"打光模型：从简单到物理","lighting.color":"高光的颜色","lighting.shining":"高光锐利程度，越大光斑越小","lighting.roughness":"表面粗糙度，0 = 镜面","lighting.metalness":"金属度，1 = 纯金属","lighting.reflectivity":"环境反射强度","lighting.glass":"玻璃感，0 = 实体，1 = 全透明","lighting.aberration":"玻璃边缘红蓝分离（色散）","lighting.thickness":"玻璃厚度感，越厚颜色越重","lighting.refraction":"折射弯折程度","lighting.blur":"玻璃的磨砂模糊","lighting.bumpMap":"用噪声给表面加细凹凸","lighting.occlusion":"边缘环境光遮蔽"},po=t=>{const a=t.spec;return{opacity:a.opacity??100,layers:a.layers.map(({kind:o,overrides:n})=>pe(o,n)),lighting:{enabled:!0,strength:100,type:"physical",color:"#ffffff",shining:48,roughness:.16,metalness:0,reflectivity:1,bumpMap:"none",occlusion:!0,...a.lighting??{}}}},ce=(t,a,o,n,r,s=!0)=>({id:t,name:a,library:"spline",category:o,swatch:n,locked:s,spec:r}),je=(t,a,o,n)=>ce(`candy-${t}`,a,"Candy",[o,n],{layers:[{kind:"color",overrides:{params:{color:o}}},{kind:"fresnel",overrides:{opacity:35,params:{color:"#ffffff",power:2.6,intensity:.55,bias:0}}}],lighting:{type:"physical",roughness:.07,metalness:0,reflectivity:1.05}}),Ne=(t,a,o,n,r,s={},_=[])=>ce(`metal-${t}`,a,"Metal",[o,n],{layers:[{kind:"color",overrides:{params:{color:o}}},..._],lighting:{type:"physical",roughness:r,metalness:1,reflectivity:1.25,...s}}),Jt=[ce("gradient-pastel-shiny-01","Gradient Pastel Shiny 01","Gradient",["#ffb199","#ff8177"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#ffb199",colorB:"#ff8177",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ce("gradient-pastel-shiny-03","Gradient Pastel Shiny 03","Gradient",["#96fbc4","#f9f586"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#96fbc4",colorB:"#f9f586",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ce("gradient-pastel-shiny-04","Gradient Pastel Shiny 04","Gradient",["#a1c4fd","#c2e9fb"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#a1c4fd",colorB:"#c2e9fb",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ce("gradient-contrast-01","Gradient Contrast 01","Gradient",["#ff9a5a","#7d2ae8"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#ff9a5a",colorB:"#7d2ae8",axes:"y",start:-1,end:1}}},{kind:"fresnel",overrides:{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}}],lighting:{type:"physical",roughness:.1,reflectivity:1.05}}),ce("gradient-contrast-04","Gradient Contrast 04","Gradient",["#6a11cb","#2575fc"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#6a11cb",colorB:"#2575fc",axes:"y",start:-1,end:1}}},{kind:"fresnel",overrides:{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}}],lighting:{type:"physical",roughness:.1,reflectivity:1.05}}),je("deep-blue","Candy Deep Blue","#2c3fd8","#101a6e"),je("lime","Candy Lime","#a8e063","#3f7d20"),je("red","Candy Red","#e8281e","#6e0a06"),je("orange","Candy Orange","#f2790f","#7a3704"),je("cobalt","Candy Cobalt","#2f6bff","#0c2a7a"),je("sky","Candy Sky","#5ec8f2","#1a6e94"),je("magenta","Candy Magenta","#e93cac","#70104f"),je("violet","Candy Violet","#8b3df0","#3c1268"),Ne("silver","Metal Silver","#d9d9de","#4c4c52",.09),Ne("black-gloss","Metal Black Gloss","#26262a","#050506",.14),Ne("chrome-swirl","Metal 8 Swirl","#e8e8ec","#3a3a40",.22,{bumpMap:"noise"}),Ne("brushed","Metal Brushed Steel","#b8bcc4","#3c3f46",.32,{bumpMap:"noise"}),Ne("dark-chrome","Metal Dark Chrome","#6e7076","#17181c",.07),Ne("bronze","Metal Bronze","#b4783a","#3f2408",.16),Ne("gold","Metal Gold","#f0b342","#6e4408",.1),ce("glass-clear","Clear Glass","Special",["#eef6fb","#8fb0c4"],{opacity:96,layers:[{kind:"glass",overrides:{params:{color:"#ffffff",transmission:.9,refraction:1.15,thickness:.5,aberration:.06,roughness:.05}}}],lighting:{type:"physical",roughness:.05}}),ce("glass-frosted","Frosted Glass","Special",["#cfe8f2","#8fb8c9"],{opacity:92,layers:[{kind:"glass",overrides:{params:{color:"#dfeef5",transmission:.82,refraction:1.09,thickness:.7,aberration:.02,roughness:.3}}}],lighting:{type:"physical",roughness:.3}}),ce("iridescent-swirl","Iridescent Swirl","Special",["#2a3f3c","#0d1413"],{layers:[{kind:"noise",overrides:{params:{mode:"color",type:"curl",scale:1.6,movement:.25,colorA:"#0e1a18",colorB:"#1f4f46",colorC:"#3fa070",colorD:"#b7f0d8",distortion:[1.8,2.6],factorA:[1.7,9.2],factorB:[8.3,2.8]}}},{kind:"fresnel",overrides:{opacity:65,params:{color:"#9fe8ff",power:2.4,intensity:.8,bias:0}}}],lighting:{type:"physical",roughness:.12,metalness:.35,reflectivity:1.3,bumpMap:"noise"}}),ce("nebula-pearl","Nebula Pearl","Special",["#d9c8ff","#9fe8ff"],{layers:[{kind:"noise",overrides:{params:{mode:"color",type:"simplex",scale:1.4,movement:.4,colorA:"#d9c8ff",colorB:"#9fe8ff",colorC:"#ffd9ec",colorD:"#ffffff",distortion:[1.4,2.2],factorA:[1.7,9.2],factorB:[8.3,2.8]}}},{kind:"dust",overrides:{opacity:70,params:{color:"#ffffff",scale:22,coverage:.14}}},{kind:"fresnel",overrides:{opacity:60,params:{color:"#ffffff",power:2.4,intensity:.9,bias:0}}}],lighting:{type:"physical",roughness:.15,metalness:.2,reflectivity:1.15}}),ce("soft-clay","Soft Clay","Special",["#e3c8b8","#c9a18c"],{layers:[{kind:"color",overrides:{params:{color:"#e3c8b8"}}},{kind:"cavity",overrides:{opacity:45,params:{scale:2.2,threshold:.5,strength:.7}}}],lighting:{type:"physical",roughness:.62,metalness:0,reflectivity:.7}}),ce("toon-shade","Toon Shade","Special",["#ff9060","#c14a33"],{layers:[{kind:"toon",overrides:{params:{color:"#ff9060",steps:3}}},{kind:"outline",overrides:{params:{color:"#1a0f0a",width:.07,threshold:.3}}}],lighting:{type:"toon"}})],fo=(t,a,o)=>{var r,s;const n=a[t.key];switch(t.type){case"color":return e.jsx(Et,{value:String(n??"#ffffff"),onChange:_=>o(t.key,_),percent:!0});case"texture":return e.jsx(Qa,{value:String(n??""),onChange:_=>o(t.key,_)});case"number":return e.jsx(de,{value:typeof n=="number"?n:0,prefix:t.prefix,step:t.step,onChange:_=>o(t.key,_)});case"vec2":return e.jsx(kt,{value:Array.isArray(n)?n:[0,0],prefixes:(t.prefix??"XY").split(""),step:t.step,onChange:_=>o(t.key,_)});case"vec3":return e.jsx(kt,{value:Array.isArray(n)?n:[0,0,0],prefixes:(t.prefix??"XYZ").split(""),step:t.step,onChange:_=>o(t.key,_)});case"select":return e.jsx(Ce,{value:String(n??((r=t.options)==null?void 0:r[0])),options:(t.options??[]).map(_=>({value:_,label:_[0].toUpperCase()+_.slice(1)})),onChange:_=>o(t.key,_),style:{width:168}});case"segment":return e.jsx(ze,{value:String(n??((s=t.options)==null?void 0:s[0])),options:t.options??[],onChange:_=>o(t.key,_)});default:return null}},_t=({title:t,fields:a,params:o,anchor:n,onChange:r,onClose:s,hints:_,kindId:i,description:u})=>{var h;let v=((h=a[0])==null?void 0:h.group)??0;return e.jsxs(Wa,{title:t,anchor:n,width:452,onClose:s,children:[u?e.jsx("p",{className:"popup-desc",children:u}):null,a.map(f=>{const x=f.group!==v;v=f.group??0;const g=_==null?void 0:_[`${i}.${f.key}`];return e.jsxs("div",{children:[x?e.jsx("hr",{}):null,e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:f.label}),e.jsx("span",{className:"prow-control",children:fo(f,o,r)})]}),g?e.jsx("p",{className:"field-hint",children:g}):null]},f.key)})]})},At=({current:t,order:a,meta:o,iconMap:n,anchor:r,onPick:s,onClose:_,boltFirst:i,width:u=232,descMap:v})=>{const h=Le(_),f=i?1:0;return e.jsxs("div",{className:"tmenu",style:{left:Math.max(12,r.left-u-14),top:Math.min(Math.max(12,r.top-12),Math.max(window.innerHeight-640,12))},ref:h,children:[(()=>{if(!i)return null;const x=n[a[0]];return e.jsxs("button",{className:`tmenu-item ai ${t===a[0]?"on":""}`,onClick:()=>s(a[0]),title:(v==null?void 0:v[a[0]])??o[a[0]].label,children:[e.jsx("span",{className:"tmenu-icon",children:e.jsx(x,{})}),e.jsx("span",{className:"tmenu-label",children:o[a[0]].label}),e.jsx(va,{size:15,className:"tmenu-bolt"})]})})(),i?e.jsx("hr",{}):null,a.slice(f).map(x=>{const g=n[x];return!g||!o[x]?null:e.jsxs("button",{className:`tmenu-item ${t===x?"on":""}`,onClick:()=>s(x),title:(v==null?void 0:v[x])??o[x].label,children:[e.jsx("span",{className:"tmenu-icon",children:e.jsx(g,{})}),e.jsx("span",{className:"tmenu-label",children:o[x].label}),t===x?e.jsx(mn,{size:15,className:"tmenu-check"}):null]},x)})]})},ho=({current:t,anchor:a,onPick:o,onClose:n})=>{const r=Le(n);return e.jsx("div",{className:"tmenu blend",style:{left:Math.max(12,a.left-190),top:Math.min(a.top+20,window.innerHeight-320)},ref:r,children:oo.map(s=>e.jsxs("button",{className:`tmenu-item ${t===s?"on":""}`,onClick:()=>o(s),children:[e.jsx("span",{className:"tmenu-label",children:hn[s]}),t===s?e.jsx(mn,{size:15,className:"tmenu-check"}):null]},s))})},vo=({myMaterials:t,appliedId:a,anchor:o,onApply:n,onSaveCurrent:r,onDeleteMine:s,onClose:_})=>{const i=Le(_),[u,v]=y.useState(""),[h,f]=y.useState("all"),[x,g]=y.useState("all"),m=y.useMemo(()=>["all",...Array.from(new Set(Jt.map(j=>j.category)))],[]),w=u.trim().toLowerCase(),k=h==="all"||h==="mine",C=h==="all"||h==="spline",E=t.filter(j=>!w||j.name.toLowerCase().includes(w)),Y=Jt.filter(j=>C&&(x==="all"||j.category===x)&&(!w||j.name.toLowerCase().includes(w))),z=(j,I=!1)=>e.jsxs("div",{className:`asset-cell ${a===j.id?"applied":""}`,onClick:()=>n(j),children:[e.jsx("span",{className:"torus",style:{"--c1":j.swatch[0],"--c2":j.swatch[1]}}),e.jsxs("span",{className:"asset-tip",children:[j.name,j.locked&&!I?e.jsx(ha,{size:11}):null]}),I?e.jsx("button",{className:"asset-del",title:"Delete",onClick:c=>{c.stopPropagation(),s(j.id)},children:e.jsx(Me,{size:12,style:{transform:"rotate(45deg)"}})}):null]},j.id);return e.jsxs("div",{className:"assets",style:{left:Math.max(12,o.left-384-14),top:Math.min(Math.max(12,o.top-60),Math.max(window.innerHeight-620,12))},ref:i,children:[e.jsxs("header",{children:[e.jsx("h3",{children:"Material Assets"}),e.jsx("button",{className:"iconbtn",onClick:_,children:"×"})]}),e.jsxs("div",{className:"assets-toolbar",children:[e.jsx("button",{className:"assets-add",title:"Save current material",onClick:r,children:e.jsx(Me,{size:17})}),e.jsxs("label",{className:"assets-search",children:[e.jsx(pn,{size:15}),e.jsx("input",{placeholder:"Search",value:u,onChange:j=>v(j.target.value)})]})]}),e.jsx(Ce,{value:h,options:[{value:"all",label:"All Libraries"},{value:"mine",label:"My Materials"},{value:"spline",label:"Spline Library"}],onChange:f,style:{width:"100%"}}),k?e.jsxs("section",{children:[e.jsx("h4",{children:"My Materials"}),E.length?e.jsx("div",{className:"asset-grid",children:E.map(j=>z(j,!0))}):e.jsx("p",{className:"assets-empty",children:"点击左侧 + 保存当前材质"})]}):null,C?e.jsxs("section",{children:[e.jsxs("div",{className:"assets-section-head",children:[e.jsx("h4",{children:"Spline Library"}),e.jsx(Ce,{value:x,options:m.map(j=>({value:j,label:j==="all"?"All":j})),onChange:g,style:{width:132}})]}),e.jsx("div",{className:"asset-grid",children:Y.map(j=>z(j))})]}):null]})},yo=({effects:t,onUpdate:a,onUpdateParam:o,onAdd:n,onRemove:r,onApplyPreset:s})=>{const[_,i]=y.useState({kind:"none"}),[u,v]=y.useState(""),h=Le(()=>i({kind:"none"})),f=()=>i({kind:"none"}),x=m=>{const w=vt[m.kind];return e.jsxs("div",{className:`layer-row ${m.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:k=>i({kind:"settings",effectId:m.id,anchor:re(k.currentTarget)}),children:[e.jsx(qe,{size:13,className:"row-chevron"}),e.jsx("span",{className:"row-name",children:m.name})]}),e.jsx("button",{className:"row-swatch",title:"Switch effect",onClick:k=>i({kind:"type",anchor:re(k.currentTarget)}),children:e.jsx(w,{size:17})}),e.jsxs("span",{className:"ninput opa",children:[e.jsx(de,{value:m.opacity,onChange:k=>a(m.id,{opacity:Math.min(Math.max(k,0),100)})}),e.jsx("span",{className:"blend-dot static",title:"Strength",children:e.jsx(jt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>a(m.id,{visible:!m.visible}),children:m.visible?e.jsx(Ae,{size:16}):e.jsx(Te,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>r(m.id),children:e.jsx(He,{size:14})})]},m.id)},g=_.kind==="settings"?t.find(m=>m.id===_.effectId):void 0;return e.jsxs("aside",{className:"spanel",children:[e.jsx("div",{className:"spanel-scroll",children:e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsxs("h2",{children:["Effects ",e.jsx(Mt,{size:15,className:"drag"})]}),e.jsxs("span",{className:"section-tools",children:[e.jsx("button",{className:"iconbtn",title:"Effect Presets",onClick:m=>{v(""),i({kind:"library",anchor:re(m.currentTarget)})},children:e.jsx(fn,{size:16})}),e.jsx("button",{className:"iconbtn",title:"Add effect",onClick:m=>i({kind:"type",anchor:re(m.currentTarget)}),children:e.jsx(Me,{size:17})})]})]}),e.jsx("p",{className:"panel-note",children:"全局 post-processing：未选中元素时作用于整个场景。"}),e.jsx("div",{className:"layer-list",children:t.map(x)})]})}),g?e.jsx(_t,{title:g.name,fields:ct[g.kind].fields,params:g.params,anchor:_.kind==="settings"?_.anchor:{top:0,left:0},onChange:(m,w)=>o(g.id,m,w),onClose:f,hints:to,kindId:g.kind,description:Ht[g.kind]}):null,_.kind==="library"?e.jsxs("div",{className:"assets",style:{left:Math.max(12,_.anchor.left-384-14),top:Math.min(Math.max(12,_.anchor.top-60),Math.max(window.innerHeight-560,12))},ref:h,children:[e.jsxs("header",{children:[e.jsx("h3",{children:"Effect Presets"}),e.jsx("button",{className:"iconbtn",onClick:f,children:"×"})]}),e.jsx("div",{className:"assets-toolbar",children:e.jsxs("label",{className:"assets-search",children:[e.jsx(pn,{size:15}),e.jsx("input",{placeholder:"Search",value:u,onChange:m=>v(m.target.value)})]})}),e.jsx("section",{children:e.jsx("div",{className:"asset-grid",children:ao.filter(m=>!u.trim()||m.name.toLowerCase().includes(u.trim().toLowerCase())).map(m=>e.jsxs("div",{className:"asset-cell",onClick:()=>{s(no(m)),f()},children:[e.jsx("span",{className:"fx-stack",children:m.spec.effects.slice(0,4).map(({kind:w})=>{const k=vt[w];return e.jsx(k,{size:13},w)})}),e.jsx("span",{className:"asset-tip",children:m.name})]},m.id))})})]}):null,_.kind==="type"?e.jsx(At,{order:Ha,meta:ct,iconMap:vt,descMap:Ht,anchor:_.anchor,width:190,onPick:m=>{n(m),f()},onClose:f}):null]})},xo="https://app.spline.design/images/envs/",q=(t,a)=>({id:t,name:a,url:`${xo}${t}.webp`}),Oe=[q("neutral_studio","Neutral Studio"),q("studio_white","White Studio"),q("studio_simple","Simple Studio"),q("blue_photo_studio","Blue Photo Studio"),q("christmas_photo_studio_02","Christmas Studio"),q("photo_studio_loft_hall","Loft Hall"),q("studio_small_03","Small Studio"),q("studio_dark","Dark Studio"),q("studio_led","LED Studio"),q("qwantani_dusk_2_puresky","Dusk Sky"),q("sunset_fairway","Sunset Fairway"),q("abstract_gradient_gold","Gold Gradient"),q("gradient_clean","Clean Gradient"),q("clay_nature","Clay Nature"),q("forest","Forest"),q("fantasy_environment","Fantasy"),q("voxel_islands","Voxel Islands"),q("neon_city","Neon City"),q("neon_light","Neon Light"),q("industrial","Industrial"),q("loft_office","Loft Office"),q("synth_wave","Synth Wave")],Tt={studio:"neutral_studio",bright:"studio_white",night:"studio_dark",warm:"sunset_fairway",sunset:"sunset_fairway"},go=t=>{if(!t)return"";if(t.startsWith("data:")||t.startsWith("http")||t.startsWith("/"))return t;const a=Oe.find(o=>o.id===t)??Oe.find(o=>o.id===Tt[t]);return(a==null?void 0:a.url)??""},en=t=>{if(!t)return"None";if(t.startsWith("data:"))return"Custom Upload";const a=Oe.find(o=>o.id===t)??Oe.find(o=>o.id===Tt[t]);return(a==null?void 0:a.name)??t},bo=({value:t,onChange:a})=>{const[o,n]=y.useState(!1),r=y.useRef(null),s=Le(()=>n(!1)),_=Oe.find(i=>i.id===t)??Oe.find(i=>i.id===Tt[t]);return e.jsxs("div",{className:"envpick",ref:s,children:[e.jsxs("button",{className:"envpick-btn",onClick:()=>n(i=>!i),title:en(t),children:[t.startsWith("data:")?e.jsx("img",{src:t,alt:""}):_?e.jsx("img",{src:_.url,alt:""}):e.jsx("span",{className:"envpick-empty",children:"None"}),e.jsx("span",{className:"envpick-name",children:en(t)}),e.jsx(qe,{size:13})]}),o?e.jsxs("div",{className:"envpick-pop",children:[e.jsxs("label",{className:"envpick-upload",children:[e.jsx(Me,{size:14}),e.jsx("span",{children:"Upload"}),e.jsx("input",{ref:r,type:"file",accept:"image/*,.hdr,image/vnd.radiance",onChange:i=>{var h;const u=(h=i.target.files)==null?void 0:h[0];if(!u)return;const v=new FileReader;v.onload=()=>{a(String(v.result??"")),n(!1)},v.readAsDataURL(u),i.target.value=""}})]}),Oe.map(i=>e.jsx("button",{className:`envpick-cell ${t===i.id?"on":""}`,title:i.name,onClick:()=>{a(i.id),n(!1)},children:e.jsx("img",{src:i.url,alt:i.name,loading:"lazy"})},i.id))]}):null]})},wo=({material:t,actions:a,sceneLight:o,tonemapping:n,onChangeLight:r,onToggleTonemapping:s,myMaterials:_,appliedPresetId:i,onApplyPreset:u,onSavePreset:v,onDeletePreset:h})=>{var k,C,E,Y,z,j,I;const[f,x]=y.useState({kind:"none"}),g=()=>x({kind:"none"}),m=c=>{var J;const R=Se[c.kind],W=Dt[c.kind],O=R.hexKey,oe=(J=R.fields.find(X=>X.type==="texture"))==null?void 0:J.key,se=oe&&typeof c.params[oe]=="string"?c.params[oe]:"";return e.jsxs("div",{className:`layer-row ${c.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:X=>x({kind:"settings",layerId:c.id,anchor:re(X.currentTarget)}),children:[e.jsx(qe,{size:13,className:"row-chevron"}),e.jsx("span",{className:"row-name",children:c.name})]}),e.jsx("button",{className:"row-swatch",title:"Switch layer type",onClick:X=>{X.stopPropagation(),x({kind:"type",layerId:c.id,anchor:re(X.currentTarget)})},children:se?e.jsx("img",{className:"swatch-img",src:se,alt:""}):O?e.jsx("span",{className:"swatch-color",style:{background:String(c.params[O]??"#888")}}):e.jsx(W,{size:17})}),O?e.jsx("span",{className:"ninput hex",children:e.jsx("input",{value:String(c.params[O]??"").replace("#","").toUpperCase(),onChange:X=>a.updateLayerParam(c.id,O,`#${X.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}):null,e.jsxs("span",{className:"ninput opa",children:[e.jsx(de,{value:c.opacity,onChange:X=>a.updateLayer(c.id,{opacity:Math.min(Math.max(X,0),100)})}),e.jsx("button",{className:"blend-dot",title:`Blend: ${hn[c.mode]}`,onClick:X=>{X.stopPropagation(),x({kind:"blend",layerId:c.id,anchor:re(X.currentTarget)})},children:e.jsx(jt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>a.updateLayer(c.id,{visible:!c.visible}),children:c.visible?e.jsx(Ae,{size:16}):e.jsx(Te,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>a.removeLayer(c.id),children:e.jsx(He,{size:14})})]},c.id)},w=()=>e.jsxs("div",{className:`layer-row ${t.lighting.enabled?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:c=>x({kind:"lighting",anchor:re(c.currentTarget)}),children:[e.jsx("span",{className:"row-chevron"}),e.jsx("span",{className:"row-name",children:"Lighting"})]}),e.jsx("button",{className:"row-swatch",onClick:c=>x({kind:"lighting",anchor:re(c.currentTarget)}),children:e.jsx("span",{className:"swatch-sphere",style:{background:"radial-gradient(circle at 34% 30%, #ffffff 0%, #c9c9c9 55%, #7c7c7c 100%)"}})}),e.jsxs("span",{className:"ninput opa",children:[e.jsx(de,{value:t.lighting.strength,onChange:c=>a.updateLighting({strength:Math.min(Math.max(c,0),100)})}),e.jsx("span",{className:"blend-dot static",children:e.jsx(jt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>a.updateLighting({enabled:!t.lighting.enabled}),children:t.lighting.enabled?e.jsx(Ae,{size:16}):e.jsx(Te,{size:16})}),e.jsx("span",{className:"iconbtn placeholder"})]});return e.jsxs("aside",{className:"spanel",children:[e.jsxs("div",{className:"spanel-scroll",children:[e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsxs("h2",{children:["Material ",e.jsx(Mt,{size:15,className:"drag"})]}),e.jsxs("span",{className:"section-tools",children:[e.jsx(de,{value:t.opacity,width:64,onChange:c=>a.updateMaterial({opacity:Math.min(Math.max(c,0),100)})}),e.jsx("button",{className:"iconbtn",title:"Material Assets",onClick:c=>x({kind:"assets",anchor:re(c.currentTarget)}),children:e.jsx(fn,{size:16})}),e.jsx("button",{className:"iconbtn",title:"Add layer",onClick:c=>x({kind:"type",layerId:null,anchor:re(c.currentTarget)}),children:e.jsx(Me,{size:17})})]})]}),e.jsxs("div",{className:"layer-list",children:[t.layers.map(m),w()]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("header",{className:"section-head",children:e.jsxs("h2",{children:["Environment Map",e.jsx("button",{className:"iconbtn",onClick:()=>a.updateEnv({enabled:!t.env.enabled}),children:t.env.enabled?e.jsx(Ae,{size:15}):e.jsx(Te,{size:15})})]})}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Image"}),e.jsx("span",{className:"prow-control",children:e.jsx(bo,{value:t.env.map,onChange:c=>a.updateEnv({map:c})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Exposure"}),e.jsx("span",{className:"prow-control",children:e.jsx(de,{value:t.env.exposure,onChange:c=>a.updateEnv({exposure:Math.min(Math.max(c,0),3)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Rotation"}),e.jsx("span",{className:"prow-control",children:e.jsx(kt,{value:t.env.rotation,prefixes:["X","Y","Z"],step:.05,onChange:c=>a.updateEnv({rotation:[c[0]??0,c[1]??0,c[2]??0]})})})]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("header",{className:"section-head",children:e.jsxs("h2",{children:["Light",e.jsx("button",{className:"iconbtn",onClick:()=>r({enabled:!o.enabled}),children:o.enabled?e.jsx(Ae,{size:15}):e.jsx(Te,{size:15})})]})}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Intensity"}),e.jsx("span",{className:"prow-control",children:e.jsx(de,{value:o.intensity,onChange:c=>r({intensity:Math.min(Math.max(c,0),4)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Color"}),e.jsx("span",{className:"prow-control",children:e.jsx(Ce,{value:o.color,options:[{value:"#ffffff",label:"White"},{value:"#fff2e0",label:"Warm"},{value:"#e8f0ff",label:"Cool"}],onChange:c=>r({color:c}),style:{width:172}})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shadow C…"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:o.shadowMode,options:["auto","custom"],onChange:c=>r({shadowMode:c})})})]}),o.shadowMode==="custom"?e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Color"}),e.jsx("span",{className:"prow-control",children:e.jsx(Et,{value:o.shadowColor,onChange:c=>r({shadowColor:c})})})]}):null,e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Ambient In…"}),e.jsx("span",{className:"prow-control",children:e.jsx(de,{value:o.ambient,onChange:c=>r({ambient:Math.min(Math.max(c,0),2)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Tonemappi…"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:n?"yes":"no",options:["yes","no"],onChange:c=>s(c==="yes")})})]})]}),e.jsx("section",{className:"spanel-section",children:e.jsxs("header",{className:"section-head",children:[e.jsx("h2",{children:"Modifiers"}),e.jsx("button",{className:"iconbtn",title:"Add modifier (decorative)",children:e.jsx(Me,{size:17})})]})}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Visibility"}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Wireframe"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:t.wireframe?"show":"hide",options:["show","hide"],onChange:c=>a.updateMaterial({wireframe:c==="show"})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shading"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:t.shading,options:["normal","flat"],onChange:c=>a.updateMaterial({shading:c})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Sides"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:t.sides,options:["both","front","back"],onChange:c=>a.updateMaterial({sides:c})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shadows"}),e.jsx("span",{className:"prow-control",children:e.jsx(Ce,{value:t.shadows,options:[{value:"castreceive",label:"Cast & Receive"},{value:"cast",label:"Cast"},{value:"receive",label:"Receive"},{value:"off",label:"Off"}],onChange:c=>a.updateMaterial({shadows:c}),style:{width:172}})})]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Collision"}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Enabled"}),e.jsx("span",{className:"prow-control",children:e.jsx(Ce,{value:t.collision,options:[{value:"visibility",label:"Based on Visibility"},{value:"on",label:"On"},{value:"off",label:"Off"}],onChange:c=>a.updateMaterial({collision:c}),style:{width:172}})})]})]})]}),f.kind==="settings"?e.jsx(_t,{title:Se[((k=t.layers.find(c=>c.id===f.layerId))==null?void 0:k.kind)??"color"].label,fields:Se[((C=t.layers.find(c=>c.id===f.layerId))==null?void 0:C.kind)??"color"].fields,params:((E=t.layers.find(c=>c.id===f.layerId))==null?void 0:E.params)??{},anchor:f.anchor,onChange:(c,R)=>a.updateLayerParam(f.layerId,c,R),onClose:g,hints:qt,kindId:(Y=t.layers.find(c=>c.id===f.layerId))==null?void 0:Y.kind,description:yt[((z=t.layers.find(c=>c.id===f.layerId))==null?void 0:z.kind)??"color"]}):null,f.kind==="lighting"?e.jsx(_t,{title:"Lighting",fields:ro,params:{type:t.lighting.type,color:t.lighting.color,shining:t.lighting.shining,roughness:t.lighting.roughness,metalness:t.lighting.metalness,reflectivity:t.lighting.reflectivity,glass:t.lighting.glass,aberration:t.lighting.aberration,thickness:t.lighting.thickness,refraction:t.lighting.refraction,blur:t.lighting.blur,bumpMap:t.lighting.bumpMap,occlusion:t.lighting.occlusion?"on":"off"},anchor:f.anchor,onChange:(c,R)=>{c==="occlusion"?a.updateLighting({occlusion:R==="on"}):c==="type"?a.updateLighting({type:R}):c==="bumpMap"?a.updateLighting({bumpMap:R}):a.updateLighting({[c]:R})},onClose:g,hints:qt,kindId:"lighting",description:yt.lighting}):null,f.kind==="type"?e.jsx(At,{current:f.layerId?(j=t.layers.find(c=>c.id===f.layerId))==null?void 0:j.kind:void 0,order:so,meta:Se,iconMap:Dt,boltFirst:!0,descMap:yt,anchor:f.anchor,onPick:c=>{f.layerId?a.setLayerKind(f.layerId,c):a.addLayer(c),g()},onClose:g}):null,f.kind==="blend"?e.jsx(ho,{current:((I=t.layers.find(c=>c.id===f.layerId))==null?void 0:I.mode)??"normal",anchor:f.anchor,onPick:c=>{a.updateLayer(f.layerId,{mode:c}),g()},onClose:g}):null,f.kind==="assets"?e.jsx(vo,{myMaterials:_,appliedId:i,anchor:f.anchor,onApply:c=>{u(c),g()},onSaveCurrent:v,onDeleteMine:h,onClose:g}):null]})},Ge=new P;function ue(t,a,o,n,r,s){const _=2*Math.PI*r/4,i=Math.max(s-2*r,0),u=Math.PI/4;Ge.copy(a),Ge[n]=0,Ge.normalize();const v=.5*_/(_+i),h=1-Ge.angleTo(t)/u;return Math.sign(Ge[o])===1?h*v:i/(_+i)+v+v*(1-h)}class Io extends ke{constructor(a=1,o=1,n=1,r=2,s=.1){if(r=r*2+1,s=Math.min(a/2,o/2,n/2,s),super(1,1,1,r,r,r),r===1)return;const _=this.toNonIndexed();this.index=null,this.attributes.position=_.attributes.position,this.attributes.normal=_.attributes.normal,this.attributes.uv=_.attributes.uv;const i=new P,u=new P,v=new P(a,o,n).divideScalar(2).subScalar(s),h=this.attributes.position.array,f=this.attributes.normal.array,x=this.attributes.uv.array,g=h.length/6,m=new P,w=.5/r;for(let k=0,C=0;k<h.length;k+=3,C+=2)switch(i.fromArray(h,k),u.copy(i),u.x-=Math.sign(u.x)*w,u.y-=Math.sign(u.y)*w,u.z-=Math.sign(u.z)*w,u.normalize(),h[k+0]=v.x*Math.sign(i.x)+u.x*s,h[k+1]=v.y*Math.sign(i.y)+u.y*s,h[k+2]=v.z*Math.sign(i.z)+u.z*s,f[k+0]=u.x,f[k+1]=u.y,f[k+2]=u.z,Math.floor(k/g)){case 0:m.set(1,0,0),x[C+0]=ue(m,u,"z","y",s,n),x[C+1]=1-ue(m,u,"y","z",s,o);break;case 1:m.set(-1,0,0),x[C+0]=1-ue(m,u,"z","y",s,n),x[C+1]=1-ue(m,u,"y","z",s,o);break;case 2:m.set(0,1,0),x[C+0]=1-ue(m,u,"x","z",s,a),x[C+1]=ue(m,u,"z","x",s,n);break;case 3:m.set(0,-1,0),x[C+0]=1-ue(m,u,"x","z",s,a),x[C+1]=1-ue(m,u,"z","x",s,n);break;case 4:m.set(0,0,1),x[C+0]=1-ue(m,u,"x","y",s,a),x[C+1]=1-ue(m,u,"y","x",s,o);break;case 5:m.set(0,0,-1),x[C+0]=ue(m,u,"x","y",s,a),x[C+1]=1-ue(m,u,"y","x",s,o);break}}}const zt=`
float lamina_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float lamina_normalize(float v) { return lamina_map(v, -1.0, 1.0, 0.0, 1.0); }
vec3 lamina_hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}
`,tn=`
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
`,jo=`
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
`,Do=`
uniform float u_lamina_time;
uniform float u_lamina_opacity;
uniform float u_lamina_lighting;
uniform float u_lamina_lightStrength;
uniform vec3 u_lamina_lightColor;
uniform float u_lamina_shininess;
uniform float u_lamina_roughness;
uniform float u_lamina_metalness;
uniform float u_lamina_reflectivity;
uniform float u_lamina_glass;
uniform float u_lamina_aberration;
uniform float u_lamina_thickness;
uniform float u_lamina_refraction;
uniform float u_lamina_blur;
uniform float u_lamina_fx_liquid;
uniform float u_lamina_fx_liquidAmount;
uniform float u_lamina_fx_ngScale;
uniform float u_lamina_fx_ngOpacity;
uniform vec2 u_lamina_fx_glassOffset;
uniform float u_lamina_fx_glassMode;
uniform float u_lamina_fx_glassProfile;
uniform float u_lamina_fx_glassMag;
uniform float u_lamina_envEnabled;
uniform float u_lamina_envExposure;
uniform vec3 u_lamina_envRotation;
uniform float u_lamina_envHasMap;
uniform sampler2D u_lamina_envMap;
uniform float u_lamina_bump;
uniform float u_lamina_occlusion;
uniform float u_lamina_flat;
uniform float u_lamina_selected;
uniform float u_lamina_lightIntensity;
uniform float u_lamina_ambient;
uniform float u_lamina_tonemapping;
uniform vec3 u_lamina_base;

const vec3 LAMINA_KEY = vec3(0.44462, 0.60634, 0.52599);
const vec3 LAMINA_FILL = vec3(-0.66248, -0.14210, 0.47368);

/** 环境光照：优先采样 equirect env 贴图（mipmap bias 模拟粗糙度模糊），未加载/失败时回退程序化摄影棚 */
vec3 lamina_env(vec3 dir, float lod) {
  vec3 r = normalize(dir);
  vec3 rot = u_lamina_envRotation;
  float cy = cos(rot.y), sy = sin(rot.y);
  r = vec3(cy * r.x + sy * r.z, r.y, -sy * r.x + cy * r.z);
  float cx = cos(rot.x), sx = sin(rot.x);
  r = vec3(r.x, cx * r.y - sx * r.z, sx * r.y + cx * r.z);
  float cz = cos(rot.z), sz = sin(rot.z);
  r = vec3(cz * r.x - sz * r.y, sz * r.x + cz * r.y, r.z);
  float envOn = u_lamina_envEnabled;
  if (u_lamina_envHasMap > 0.5) {
    float f_u = atan(r.z, r.x) * 0.15915494 + 0.5;
    float f_v = acos(clamp(-r.y, -1.0, 1.0)) * 0.31830988;
    float bias = lod * 3.5;
    vec3 c = texture2D(u_lamina_envMap, vec2(f_u, f_v), bias).rgb;
    c += texture2D(u_lamina_envMap, vec2(f_u + 0.02 * lod, f_v + 0.012 * lod), bias).rgb;
    c += texture2D(u_lamina_envMap, vec2(f_u - 0.016 * lod, f_v - 0.01 * lod), bias).rgb;
    return c * 0.3334 * 1.5 * u_lamina_envExposure;
  }
  float up = r.y;
  vec3 base = mix(vec3(0.05, 0.05, 0.06), vec3(0.34, 0.36, 0.40), smoothstep(-0.7, 1.0, up));
  float soft = 0.05 + lod * 0.2;
  vec3 e = base * mix(0.6, 1.0, envOn);
  e += vec3(1.0) * smoothstep(0.94 - soft, 0.995 - lod * 0.05, dot(r, normalize(vec3(0.25, 1.0, 0.5)))) * 2.5 * envOn;
  e += vec3(0.95, 0.97, 1.0) * smoothstep(0.958 - soft, 0.997, dot(r, normalize(vec3(-1.0, 0.32, 0.38)))) * 1.55 * envOn;
  e += vec3(1.0, 0.84, 0.66) * smoothstep(0.964 - soft, 0.998, dot(r, normalize(vec3(1.0, 0.22, 0.28)))) * 1.15 * envOn;
  e += vec3(0.8, 0.86, 1.0) * smoothstep(0.968 - soft * 0.5, 0.999, dot(r, normalize(vec3(0.0, 0.12, -1.0)))) * 1.0 * envOn;
  e += vec3(0.30, 0.27, 0.24) * smoothstep(-0.15, -1.0, up) * 0.5 * envOn;
  return e * u_lamina_envExposure;
}

vec3 lamina_shade(vec3 albedo, vec3 N, vec3 V) {
  if (u_lamina_lighting < 0.5) return albedo;
  float ndl = max(dot(N, LAMINA_KEY), 0.0) * u_lamina_lightIntensity;
  float ndlF = max(dot(N, LAMINA_FILL), 0.0) * u_lamina_lightIntensity;
  float ndv = max(dot(N, V), 0.0);
  vec3 lit = albedo;
  if (u_lamina_lighting < 1.5) {
    vec3 amb = mix(vec3(0.34), lamina_env(N, 2.6), 0.65);
    lit = albedo * (amb + 0.72 * ndl + 0.2 * ndlF);
  } else if (u_lamina_lighting < 2.5) {
    vec3 R = reflect(-LAMINA_KEY, N);
    float spec = pow(max(dot(R, V), 0.0), max(u_lamina_shininess, 1.0)) * 0.85;
    vec3 amb = mix(vec3(0.30), lamina_env(N, 2.6), 0.55) * mix(1.0, u_lamina_ambient * 1.33, 0.8);
    lit = albedo * (amb + 0.72 * ndl + 0.18 * ndlF) + u_lamina_lightColor * spec;
  } else if (u_lamina_lighting < 3.5) {
    float rough = clamp(u_lamina_roughness, 0.03, 1.0);
    float metal = clamp(u_lamina_metalness, 0.0, 1.0);
    float glassAmt = clamp(u_lamina_glass, 0.0, 1.0);
    float glassRough = clamp(max(u_lamina_roughness, u_lamina_blur), 0.03, 1.0);
    vec3 R = reflect(-V, N);
    float lod = rough * 2.4;
    vec3 env = lamina_env(R, lod) * 0.55;
    env += lamina_env(normalize(R + vec3(rough * 0.38, -rough * 0.22, rough * 0.3)), lod) * 0.24;
    env += lamina_env(normalize(R + vec3(-rough * 0.3, rough * 0.26, -rough * 0.32)), lod) * 0.21;
    vec3 F0 = mix(vec3(0.05) * u_lamina_reflectivity, albedo, metal);
    vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
    vec3 amb = mix(vec3(0.42), lamina_env(N, 2.8), 0.6) * mix(1.0, u_lamina_ambient * 1.33, 0.8);
    vec3 col = albedo * (1.0 - metal) * (amb + vec3(0.95, 0.96, 1.0) * (0.36 + 0.66 * ndl));
    col += env * F * (0.65 + 0.5 * metal);
    vec3 H = normalize(LAMINA_KEY + V);
    float s = pow(max(dot(N, H), 0.0), mix(10.0, 520.0, pow(1.0 - rough, 2.0)));
    col += u_lamina_lightColor * s * (1.0 - rough) * mix(vec3(0.6), F0 + 0.25, 0.5) * 1.6;
    if (glassAmt > 0.001) {
      float gLod = glassRough * 2.2;
      float ior = max(u_lamina_refraction * (1.0 + u_lamina_fx_glassMag * 0.35), 1.01);
      vec3 fN = N;
      if (u_lamina_fx_liquid > 0.5) {
        vec3 fwp = v_lamina_position * 2.6 + u_lamina_time * 0.4;
        fN = normalize(N + (vec3(lamina_noise_simplex(fwp), lamina_noise_simplex(fwp + 17.1), lamina_noise_simplex(fwp + 43.7)) - 0.5) * (u_lamina_fx_liquidAmount * 0.35));
      }
      vec3 rd = refract(-V, fN, 1.0 / ior) + vec3(u_lamina_fx_glassOffset * 0.12, 0.0);
      if (dot(rd, rd) < 0.001) rd = R;
      float ab = u_lamina_aberration * 0.06;
      vec3 refr = vec3(
        lamina_env(normalize(rd + fN * ab), gLod).r,
        lamina_env(rd, gLod).g,
        lamina_env(normalize(rd - fN * ab), gLod).b);
      float fFpow = mix(5.0, 2.2, clamp(u_lamina_fx_glassProfile, 0.0, 1.0));
      float fF = pow(1.0 - ndv, fFpow);
      float fEdge = mix(1.0, pow(1.0 - ndv, 1.6), 1.0 - clamp(u_lamina_fx_glassMode, 0.0, 1.0));
      vec3 glassCol = mix(vec3(0.88) * refr, env * 1.3, clamp(fF * 1.7 + 0.05, 0.0, 1.0));
      glassCol *= mix(vec3(1.0), albedo * 0.9, clamp(u_lamina_thickness * (1.0 - ndv) * 1.15, 0.0, 1.0));
      col = mix(col, glassCol, clamp(glassAmt * fEdge, 0.0, 1.0));
    }
    lit = col;
  } else {
    float cel = floor(ndl * 3.0) / 3.0;
    lit = albedo * (0.34 + 0.66 * cel);
  }
  return mix(albedo, lit, clamp(u_lamina_lightStrength, 0.0, 1.0));
}
`,ko={colorAdjust:{uniforms:`uniform float u___ID___brightness;
uniform float u___ID___contrast;
uniform float u___ID___saturation;
uniform float u___ID___hue;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  col *= (1.0 + u___ID___brightness);
  col = (col - 0.5) * u___ID___contrast + 0.5;
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(l), col, clamp(u___ID___saturation, 0.0, 2.0));
  float a = u___ID___hue * 6.2831853;
  float c = cos(a); float s = sin(a);
  mat3 hue = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.211, -0.523, 0.312) * mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.106, 1.703);
  col = hue * col;
  return clamp(col, 0.0, 1.0);
}`},bloom:{uniforms:`uniform float u___ID___threshold;
uniform float u___ID___intensity;
uniform float u___ID___blur;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec3 sum = vec3(0.0);
  for (int i = -2; i <= 2; i++) {
    for (int j = -2; j <= 2; j++) {
      vec2 o = vec2(float(i), float(j)) * u___ID___blur / u_res;
      vec3 s = texture(tDiffuse, uv + o).rgb;
      sum += max(s - u___ID___threshold, 0.0);
    }
  }
  return col + (sum / 25.0) * u___ID___intensity;
}`},blur:{uniforms:"uniform float u___ID___amount;",func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec3 sum = vec3(0.0); float w = 0.0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 o = vec2(float(i), float(j)) * u___ID___amount / u_res;
      sum += texture(tDiffuse, uv + o).rgb;
      w += 1.0;
    }
  }
  return sum / w;
}`},chromatic:{uniforms:"uniform float u___ID___amount;",func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 o = (uv - 0.5) * u___ID___amount * 0.12;
  return vec3(texture(tDiffuse, uv + o).r, texture(tDiffuse, uv).g, texture(tDiffuse, uv - o).b);
}`},vignette:{uniforms:`uniform float u___ID___offset;
uniform float u___ID___darkness;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  float d = distance(uv, vec2(0.5));
  float v = 1.0 - smoothstep(0.8 - u___ID___offset, 0.8, d);
  return col * (1.0 - (1.0 - v) * u___ID___darkness);
}`},grain:{uniforms:`uniform float u___ID___intensity;
uniform float u___ID___size;
uniform float u___ID___animated;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 p = uv * u_res / max(u___ID___size, 0.5) + (u___ID___animated > 0.5 ? u_time : 0.0);
  float g = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  return col + (g - 0.5) * u___ID___intensity;
}`},noise:{uniforms:"uniform float u___ID___intensity;",func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 p = uv * u_res * 0.5;
  vec3 n = vec3(
    fract(sin(dot(p + vec2(0.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p + vec2(31.4, 17.2), vec2(12.9898, 78.233))) * 43758.5453),
    fract(sin(dot(p + vec2(7.1, 53.7), vec2(12.9898, 78.233))) * 43758.5453));
  return mix(col, n, u___ID___intensity);
}`},pixelate:{uniforms:"uniform float u___ID___pixelSize;",func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 uvp = floor(uv * max(u___ID___pixelSize, 1.0)) / max(u___ID___pixelSize, 1.0);
  return texture(tDiffuse, uvp + 0.5 / max(u___ID___pixelSize, 1.0)).rgb;
}`},outline:{uniforms:`uniform vec3 u___ID___color;
uniform float u___ID___threshold;
uniform float u___ID___thickness;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  vec2 px = 1.5 / u_res;
  float gx = -dot(texture(tDiffuse, uv - vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114)) + dot(texture(tDiffuse, uv + vec2(px.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
  float gy = -dot(texture(tDiffuse, uv - vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114)) + dot(texture(tDiffuse, uv + vec2(0.0, px.y)).rgb, vec3(0.299, 0.587, 0.114));
  float edge = clamp(length(vec2(gx, gy)) * u___ID___thickness * 4.0, 0.0, 1.0);
  edge *= step(u___ID___threshold, 0.5);
  return mix(col, u___ID___color, edge);
}`},glitch:{uniforms:`uniform float u___ID___amount;
uniform float u___ID___speed;`,func:`vec3 fx___ID__(vec3 col, vec2 uv) {
  float t = floor(u_time * u___ID___speed);
  float line = step(0.97, fract(sin(floor(uv.y * 42.0) + t) * 43758.5453));
  vec2 uv2 = uv + vec2(line * u___ID___amount * 0.08 * sin(t * 1.7), 0.0);
  return texture(tDiffuse, uv2).rgb;
}`}},zo=`
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 u_res;
uniform float u_time;
${zt}
`;function So(t){const a={tDiffuse:{value:null},u_res:{value:new ie(1,1)},u_time:{value:0}},o=[],n=[],r=[];for(const _ of t){if(!_.visible)continue;const i=_.id,u=ct[_.kind],v=ko[_.kind];if(!v)continue;a[`u_${i}_strength`]={value:_.opacity/100};for(const f of u.fields){const x=_.params[f.key],g=`u_${i}_${f.key}`;f.type==="color"?a[g]={value:new be(String(x??"#000000"))}:f.type==="segment"?a[g]={value:x==="on"?1:0}:f.type==="vec2"||f.type==="vec3"?a[g]={value:Array.isArray(x)?new ie(x[0],x[1]):new ie(0,0)}:a[g]={value:typeof x=="number"?x:0}}const h=f=>f.replaceAll("__ID__",i);o.push(`uniform float u_${i}_strength;
${h(v.uniforms)}`),n.push(h(v.func)),r.push(`col = mix(col, fx_${i}(col, uv), u_${i}_strength);`)}const s=`
${zo}
${o.join(`
`)}
${n.join(`
`)}
void main() {
  vec2 uv = vUv;
  vec3 col = texture(tDiffuse, uv).rgb;
${r.join(`
`)}
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;return new rt({vertexShader:`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,fragmentShader:s,uniforms:a,depthTest:!1,depthWrite:!1})}const Co=({effects:t})=>{const a=ee(v=>v.gl),o=ee(v=>v.scene),n=ee(v=>v.camera),r=y.useMemo(()=>new It(1,1,{minFilter:Qt,magFilter:Qt,depthBuffer:!0,samples:4}),[]),s=y.useMemo(()=>new Fn,[]),_=y.useMemo(()=>new ot(-1,1,1,-1,0,1),[]),i=y.useMemo(()=>So(t),[t]),u=y.useMemo(()=>new ie,[]);return y.useEffect(()=>{const v=new A(new xe(2,2),i);return v.frustumCulled=!1,s.add(v),()=>{s.remove(v),v.geometry.dispose()}},[i,s]),y.useEffect(()=>()=>{i.dispose(),r.dispose()},[i,r]),Xe(({clock:v})=>{a.getDrawingBufferSize(u),(r.width!==u.x||r.height!==u.y)&&(r.setSize(u.x,u.y),i.uniforms.u_res.value.copy(u)),i.uniforms.tDiffuse.value=r.texture,i.uniforms.u_time.value=v.elapsedTime,a.setRenderTarget(r),a.clear(),a.render(o,n),a.setRenderTarget(null),a.render(s,_)},1),null},xt=new Map,St=new Bn,Po=t=>{if(!t)return;const a=xt.get(t);if(a)return a;const o=new dn;return o.colorSpace=Pe,o.flipY=!1,o.name="pending",xt.set(t,o),St.load(t,n=>{o.image=n.image,o.name=n.name,o.colorSpace=Pe,o.flipY=!1,o.wrapS=lt,o.wrapT=lt,o.needsUpdate=!0},void 0,()=>{xt.delete(t)}),o},gt=new Map;let Fe=null;const Mo=()=>{if(Fe)return Fe;const t=new Uint8Array([128,132,138,255]);return Fe=new Xn(t,1,1),Fe.colorSpace=Pe,Fe.needsUpdate=!0,Fe},Eo=t=>{if(!t)return Mo();const a=gt.get(t);if(a)return a;const o=new dn;return o.colorSpace=Pe,o.name="pending",gt.set(t,o),St.setCrossOrigin("anonymous"),St.load(t,n=>{o.image=n.image,o.colorSpace=Pe,o.needsUpdate=!0},void 0,()=>{gt.delete(t)}),o};let De=null;const No=()=>{if(De)return De;const t=document.createElement("canvas");t.width=t.height=128;const a=t.getContext("2d");return a.fillStyle="#8f8f8f",a.fillRect(0,0,128,128),a.fillStyle="#6e6e6e",a.fillRect(0,0,64,64),a.fillRect(64,64,64,64),De=new Pt(t),De.colorSpace=Pe,De.wrapS=De.wrapT=lt,De.flipY=!1,De},Be={dropShadow:{label:"Drop Shadow",desc:"跟随物体剪影的柔和投影",stage:"ground",defaults:{offsetX:0,offsetY:.5,blur:.35,color:"#5c3540",strength:55},fields:[{key:"offsetX",label:"Offset",type:"vec2",prefix:"XY",step:.05,group:0},{key:"blur",label:"Blur",type:"number",step:.02,group:1},{key:"color",label:"Color",type:"color",group:2},{key:"strength",label:"Strength",type:"number",step:1,group:2}]},innerShadow:{label:"Inner Shadow",desc:"物体边缘向内压暗一圈",stage:"shader",defaults:{strength:.5,power:2.2},fields:[{key:"strength",label:"Strength",type:"number",step:.02,group:0},{key:"power",label:"Power",type:"number",step:.1,group:0}]},layerBlur:{label:"Layer Blur",desc:"把这个物体整体柔焦模糊",stage:"shader",defaults:{amount:.45},fields:[{key:"amount",label:"Amount",type:"number",step:.02,group:0}]},noise:{label:"Noise",desc:"只在物体表面叠加噪声（调均匀/渐进与幅度）",stage:"shader",defaults:{noiseType:"simplex",blur:0,type:"uniform",amplitude:10,scale:4,stretch:[1,1],offset:[0,0],movement:0,seed:0},fields:[{key:"noiseType",label:"Noise Type",type:"select",options:["simplex","fbm","voronoi","sine"],group:0},{key:"blur",label:"Blur",type:"number",step:.05,group:0},{key:"type",label:"Type",type:"segment",options:["uniform","progressive"],group:1},{key:"amplitude",label:"Amplitude",type:"number",step:.5,group:1},{key:"scale",label:"Scale",type:"number",step:.1,group:1},{key:"stretch",label:"Stretch",type:"vec2",prefix:"XY",step:.1,group:2},{key:"offset",label:"Offset",type:"vec2",prefix:"XY",step:.1,group:2},{key:"movement",label:"Movement",type:"number",step:.1,group:3},{key:"seed",label:"Seed",type:"number",step:1,group:3}]},glass:{label:"Glass",desc:"把物体变成可折射的玻璃（带边缘/填充两种模式）",stage:"shader",defaults:{offset:[0,0],distortion:.15,depth:10,blur:.1,aberration:.05,edgeFill:"edge",profile:0,magnification:0},fields:[{key:"offset",label:"Offset",type:"vec2",prefix:"XY",step:.1,group:0},{key:"distortion",label:"Distortion",type:"number",step:.01,group:0},{key:"depth",label:"Depth",type:"number",step:.5,group:0},{key:"blur",label:"Blur",type:"number",step:.01,group:1},{key:"aberration",label:"Aberration",type:"number",step:.01,group:1},{key:"edgeFill",label:"Mode",type:"segment",options:["edge","fill"],group:2},{key:"profile",label:"Profile",type:"number",step:.05,group:2},{key:"magnification",label:"Magnificat…",type:"number",step:.05,group:2}]},projection:{label:"Projection",desc:"在地面上投影一个可调的环境光斑",stage:"ground",defaults:{type:"sphere",radius:3,blur:.35,strength:30,offsetX:.3,offsetZ:.2},fields:[{key:"type",label:"Type",type:"select",options:["sphere","disc"],group:0},{key:"radius",label:"Radius",type:"number",step:.1,group:0},{key:"blur",label:"Blur",type:"number",step:.02,group:1},{key:"strength",label:"Strength",type:"number",step:1,group:1},{key:"offsetX",label:"Offset X",type:"number",step:.05,group:2},{key:"offsetZ",label:"Offset Y",type:"number",step:.05,group:2}]},noiseGlass:{label:"Noise Glass",desc:"磨砂颗粒感的玻璃",stage:"shader",defaults:{blur:.08,scale:6,grain:.55},fields:[{key:"blur",label:"Blur",type:"number",step:.01,group:0},{key:"scale",label:"Noise Scale",type:"number",step:.1,group:1},{key:"grain",label:"Grain",type:"number",step:.02,group:1}]}},Ao=["dropShadow","innerShadow","layerBlur","noise","glass","projection","noiseGlass"],nn=Object.fromEntries(Object.keys(Be).map(t=>[t,Be[t].desc])),To={"dropShadow.offsetX":"影子偏移（X / Y）","dropShadow.blur":"影子边缘模糊，0 = 剪影锐利","dropShadow.color":"影子颜色","dropShadow.strength":"影子浓度（颜色的不透明度）","innerShadow.strength":"内阴影浓度","innerShadow.power":"阴影向内收的范围","layerBlur.amount":"柔焦程度，1 = 最模糊","noise.noiseType":"噪声类型：Simplex / Fbm / Voronoi / Sine","noise.blur":"弱化噪声对比，0.5 = 均匀","noise.type":"Uniform = 均匀分布；Progressive = 沿高度渐隐","noise.amplitude":"明暗扰动幅度","noise.scale":"噪声密度，越大越细","noise.stretch":"沿 X / Y 拉伸噪声","noise.offset":"噪声的整体偏移","noise.movement":"流动速度，0 = 静止","noise.seed":"噪声种子，换一个花纹","glass.offset":"折射采样偏移（X / Y）","glass.distortion":"液态扭曲强度","glass.depth":"玻璃厚度，颜色随厚度变重","glass.blur":"玻璃模糊","glass.aberration":"红蓝分离（色散）","glass.edgeFill":"Edge = 只在边缘；Fill = 整体填充","glass.profile":"边缘过渡的锐利程度","glass.magnification":"折射放大倍率","projection.type":"光斑形状：球形 / 圆盘","projection.radius":"光斑半径","projection.blur":"光斑边缘模糊","projection.strength":"光斑浓度","projection.offsetX":"光斑偏移（X）","projection.offsetZ":"光斑偏移（Y）","noiseGlass.blur":"玻璃模糊","noiseGlass.scale":"颗粒密度","noiseGlass.grain":"颗粒强度"};let Oo=0;const Lo=()=>`oe${++Oo}_${Math.random().toString(36).slice(2,6)}`,yn=(t,a={})=>{const o=Be[t];return{id:Lo(),kind:t,name:o.label,visible:!0,opacity:100,params:{...o.defaults},...a}},nt={perlin:"lamina_noise_perlin",simplex:"lamina_noise_simplex",cell:"lamina_noise_worley",white:"lamina_noise_white",curl:"lamina_noise_swirl"},Ro={normal:"lamina_blend_normal",add:"lamina_blend_add",subtract:"lamina_blend_subtract",multiply:"lamina_blend_multiply",screen:"lamina_blend_screen",overlay:"lamina_blend_overlay",softlight:"lamina_blend_softlight",lighten:"lamina_blend_lighten",darken:"lamina_blend_darken",divide:"lamina_blend_divide",reflect:"lamina_blend_reflect",negation:"lamina_blend_negation"},Yo={basic:0,lambert:1,phong:2,physical:3,toon:4},an={aiTexture:{uniforms:`uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,body:`{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`},image:{uniforms:`uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,body:`{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
}`},video:{uniforms:`uniform sampler2D u___ID___map;
uniform vec3 u___ID___tint;
uniform float u___ID___scale;`,body:`{
  vec2 f_uv___ID__ = fract(v_lamina_uv * max(u___ID___scale, 0.001));
  vec3 f_c___ID__ = texture(u___ID___map, f_uv___ID__).rgb * u___ID___tint;
  f_lc___ID__ = vec4(f_c___ID__, u___ID___alpha);
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
uniform float u___ID___transmission;
uniform float u___ID___refraction;
uniform float u___ID___thickness;
uniform float u___ID___aberration;
uniform float u___ID___roughness;`,body:`{
  vec3 f_N___ID__ = normalize(v_lamina_normal);
  vec3 f_V___ID__ = normalize(v_lamina_viewDir);
  float f_ndv___ID__ = max(dot(f_N___ID__, f_V___ID__), 0.0);
  float f_rough___ID__ = clamp(u___ID___roughness, 0.02, 1.0);
  float f_ior___ID__ = max(u___ID___refraction, 1.01);
  vec3 f_rd___ID__ = refract(-f_V___ID__, f_N___ID__, 1.0 / f_ior___ID__);
  if (dot(f_rd___ID__, f_rd___ID__) < 0.001) f_rd___ID__ = reflect(-f_V___ID__, f_N___ID__);
  float f_ab___ID__ = u___ID___aberration * 0.08;
  vec3 f_refr___ID__ = vec3(
    lamina_env(normalize(f_rd___ID__ + f_N___ID__ * f_ab___ID__), f_rough___ID__ * 2.0).r,
    lamina_env(f_rd___ID__, f_rough___ID__ * 2.0).g,
    lamina_env(normalize(f_rd___ID__ - f_N___ID__ * f_ab___ID__), f_rough___ID__ * 2.0).b);
  vec3 f_refl___ID__ = lamina_env(reflect(-f_V___ID__, f_N___ID__), f_rough___ID__ * 2.0);
  float f_F___ID__ = pow(1.0 - f_ndv___ID__, 5.0);
  vec3 f_c___ID__ = mix(u___ID___color * f_refr___ID__, f_refl___ID__, clamp(f_F___ID__ * 1.7 + 0.05, 0.0, 1.0));
  f_c___ID__ *= mix(vec3(1.0), u___ID___color, clamp(u___ID___thickness * (1.0 - f_ndv___ID__) * 0.85, 0.0, 1.0));
  f_lc___ID__ = vec4(f_c___ID__, clamp(u___ID___transmission + f_F___ID__ * 0.4, 0.0, 1.0));
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
}`}},on={uniforms:`uniform float u___ID___strength;
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
}`},Fo={noise:{stage:"pre",noise:!0,uniforms:`uniform float u___ID___blur;
uniform float u___ID___type;
uniform float u___ID___amplitude;
uniform float u___ID___scale;
uniform vec2 u___ID___stretch;
uniform vec2 u___ID___offset;
uniform float u___ID___movement;
uniform float u___ID___seed;`,body:`{
  vec3 f_p___ID__ = v_lamina_position * max(u___ID___scale, 0.001) * vec3(max(u___ID___stretch.x, 0.001), 1.0, max(u___ID___stretch.y, 0.001));
  f_p___ID__ += vec3(u___ID___offset.x, u___ID___seed * 17.31, u___ID___offset.y);
  f_p___ID__ += u_lamina_time * u___ID___movement * 0.25;
  float f_oe___ID__ = lamina_normalize(%NOISE%(f_p___ID__));
  f_oe___ID__ = mix(f_oe___ID__, 0.5, clamp(u___ID___blur, 0.0, 1.0));
  float f_k___ID__ = 1.0 - u___ID___amplitude * 0.1 + f_oe___ID__ * u___ID___amplitude * 0.2;
  float f_fade___ID__ = u___ID___type > 0.5 ? clamp(v_lamina_position.y * 0.5 + 0.5, 0.0, 1.0) : 1.0;
  lamina_finalColor.rgb *= mix(1.0, f_k___ID__, clamp(u___ID___opacity * f_fade___ID__, 0.0, 1.0));
}`},innerShadow:{stage:"post",uniforms:`uniform float u___ID___strength;
uniform float u___ID___power;`,body:`{
  float f_oe___ID__ = pow(1.0 - lamina_ndv, max(u___ID___power, 0.01));
  lamina_lit *= 1.0 - clamp(u___ID___strength * f_oe___ID__, 0.0, 1.0);
}`},layerBlur:{stage:"post",uniforms:"uniform float u___ID___amount;",body:`{
  float f_oe___ID__ = clamp(u___ID___amount, 0.0, 1.0);
  vec3 f_oeB___ID__ = lamina_env(normalize(v_lamina_normal), 3.0);
  lamina_lit = mix(lamina_lit, f_oeB___ID__, f_oe___ID__ * 0.8);
  lamina_finalColor.a *= 1.0 - f_oe___ID__ * 0.22 * pow(1.0 - lamina_ndv, 1.5);
}`}},at=t=>new be(t).convertSRGBToLinear(),bt=(t,a)=>{const o=Array.isArray(t)&&t.length>=2?t:a;return new ie(o[0],o[1])},sn=(t,a)=>{const o=Array.isArray(t)&&t.length>=3?t:a;return new P(o[0],o[1],o[2])},Bo=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
uniform float u_lamina_time;
`,Xo=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
`;function Vo(t,a=[]){var x,g;const o={u_lamina_time:{value:0},u_lamina_opacity:{value:t.opacity/100},u_lamina_lighting:{value:t.lighting.enabled?Yo[t.lighting.type]:0},u_lamina_lightStrength:{value:t.lighting.strength/100},u_lamina_lightColor:{value:at(t.lighting.color)},u_lamina_shininess:{value:t.lighting.shining},u_lamina_roughness:{value:t.lighting.roughness},u_lamina_metalness:{value:t.lighting.metalness},u_lamina_reflectivity:{value:t.lighting.reflectivity},u_lamina_glass:{value:t.lighting.glass},u_lamina_aberration:{value:t.lighting.aberration},u_lamina_thickness:{value:t.lighting.thickness},u_lamina_refraction:{value:t.lighting.refraction},u_lamina_blur:{value:t.lighting.blur},u_lamina_envEnabled:{value:t.env.enabled?1:0},u_lamina_envExposure:{value:t.env.exposure},u_lamina_envRotation:{value:sn(t.env.rotation,[0,0,0])},u_lamina_envHasMap:{value:t.env.map?1:0},u_lamina_envMap:{value:Eo(go(t.env.map))},u_lamina_lightIntensity:{value:1},u_lamina_ambient:{value:.75},u_lamina_tonemapping:{value:0},u_lamina_bump:{value:t.lighting.bumpMap==="noise"?1:0},u_lamina_occlusion:{value:t.lighting.occlusion?1:0},u_lamina_flat:{value:t.shading==="flat"?1:0},u_lamina_selected:{value:0},u_lamina_fx_liquid:{value:0},u_lamina_fx_liquidAmount:{value:.5},u_lamina_fx_ngScale:{value:6},u_lamina_fx_ngOpacity:{value:0},u_lamina_fx_glassOffset:{value:new ie(0,0)},u_lamina_fx_glassMode:{value:0},u_lamina_fx_glassProfile:{value:0},u_lamina_fx_glassMag:{value:0},u_lamina_base:{value:at("#ffffff")}},n=[],r=[],s=[],_=[];for(const m of t.layers){if(!m.visible)continue;const w=m.id,k=Se[m.kind],C=an[m.kind];if(!C||!k)continue;o[`u_${w}_alpha`]={value:m.opacity/100};for(const I of k.fields){const c=m.params[I.key],R=`u_${w}_${I.key}`;switch(I.type){case"color":o[R]={value:at(typeof c=="string"?c:"#ffffff")};break;case"texture":{const W=String(c??"");o[R]={value:W?Po(W):No()};break}case"vec2":o[R]={value:bt(c,[1,1])};break;case"vec3":o[R]={value:sn(c,[0,0,0])};break;case"select":case"segment":o[R]={value:Math.max(((x=I.options)==null?void 0:x.indexOf(String(c)))??0,0)};break;default:o[R]={value:typeof c=="number"?c:0}}}const E=nt[String(m.params.type)]??nt.simplex,Y=I=>I.replaceAll("__ID__",w).replaceAll("%NOISE%",E).replaceAll("%AXIS%",`.${m.params.axes??"y"}`).replaceAll("%PAT%",m.params.pattern==="stripes"?"step(0.5, fract(f_g___ID__.x * 0.5))".replaceAll("__ID__",w):"mod(floor(f_g___ID__.x) + floor(f_g___ID__.y), 2.0)".replaceAll("__ID__",w));n.push(`uniform float u_${w}_alpha;
${Y(C.uniforms)}`);const z=m.kind==="noise"&&m.params.mode==="mask",j=z?an.noise.maskBody:C.body;if(z)r.push(Y(j));else{const I=Ro[m.mode];r.push(`{
  vec4 f_lc___ID__;
${Y(j)}
  lamina_finalColor = ${I}(lamina_finalColor, f_lc___ID__, u___ID___alpha);
}`.replaceAll("__ID__",w))}m.kind==="displace"&&C!==void 0&&(s.push(Y(on.uniforms)),_.push(Y(on.body)))}const i=[],u=[];for(const m of a){if(!m.visible)continue;const w=Be[m.kind],k=Fo[m.kind];if(o[`u_${m.id}_opacity`]={value:m.opacity/100},k){for(const j of w.fields){const I=m.params[j.key],c=`u_${m.id}_${j.key}`;j.type==="color"?o[c]={value:at(typeof I=="string"?I:"#ffffff")}:j.type==="select"?o[c]={value:Math.max(((g=j.options)==null?void 0:g.indexOf(String(I)))??0,0)}:j.type==="vec2"?o[c]={value:bt(I,[0,0])}:o[c]={value:typeof I=="number"?I:0}}let C="",E=nt[String(m.params.noiseType)]??nt.simplex;m.params.noiseType==="fbm"&&(C="float lamina_noise_fbm(vec3 p) { return lamina_noise_perlin(p) * 0.6 + lamina_noise_perlin(p * 2.7) * 0.4; }"),m.params.noiseType==="sine"&&(C="float lamina_noise_sine(vec3 p) { return sin(p.x) * sin(p.y) * sin(p.z) * 0.55 + sin((p.x + p.y + p.z) * 0.7) * 0.45; }"),m.params.noiseType==="sine"&&(E="lamina_noise_sine"),m.params.noiseType==="fbm"&&(E="lamina_noise_fbm"),C&&n.push(C);const Y=`uniform float u_${m.id}_opacity;
${k.uniforms.replaceAll("__ID__",m.id).replaceAll("%NOISE%",E)}`;n.push(Y);const z=k.body.replaceAll("__ID__",m.id).replaceAll("%NOISE%",E);(k.stage==="pre"?i:u).push(z)}if(m.kind==="glass"){const C=(Y,z)=>Array.isArray(m.params[Y])?m.params[Y]:z,E=(Y,z)=>typeof m.params[Y]=="number"?m.params[Y]:z;o.u_lamina_glass.value=1,o.u_lamina_roughness.value=Math.max(o.u_lamina_roughness.value,.04),o.u_lamina_blur.value=E("blur",.1),o.u_lamina_aberration.value=E("aberration",.05),o.u_lamina_thickness.value=E("depth",10)*.05,o.u_lamina_refraction.value=1.12*(1+E("magnification",0)*.35),o.u_lamina_fx_liquid.value=E("distortion",.15)>.001?1:0,o.u_lamina_fx_liquidAmount.value=E("distortion",.15),o.u_lamina_fx_glassOffset.value=bt(C("offset",[0,0]),[0,0]),o.u_lamina_fx_glassMode.value=String(m.params.edgeFill)==="fill"?1:0,o.u_lamina_fx_glassProfile.value=E("profile",0),o.u_lamina_fx_glassMag.value=E("magnification",0)}m.kind==="noiseGlass"&&(o.u_lamina_glass.value=1,o.u_lamina_blur.value=typeof m.params.blur=="number"?m.params.blur:.08,o.u_lamina_fx_ngScale.value=typeof m.params.scale=="number"?m.params.scale:6,o.u_lamina_fx_ngOpacity.value=typeof m.params.grain=="number"?m.params.grain:.55)}const v=`
${zt}
${tn}
${Bo}
${s.join(`
`)}
void main() {
  vec3 lamina_finalPosition = position;
  vec3 lamina_finalNormal = normal;
${_.join(`
`)}
  vec4 lamina_world = modelMatrix * vec4(lamina_finalPosition, 1.0);
  v_lamina_worldPosition = lamina_world.xyz;
  v_lamina_position = lamina_finalPosition;
  v_lamina_uv = uv;
  v_lamina_normal = normalize(mat3(modelMatrix) * lamina_finalNormal);
  v_lamina_viewDir = cameraPosition - lamina_world.xyz;
  gl_Position = projectionMatrix * viewMatrix * lamina_world;
}
`,h=`
${zt}
${tn}
${jo}
${Xo}
${n.join(`
`)}
${Do}
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
  
  if (u_lamina_lighting > 2.5 && u_lamina_lighting < 3.5) {
    lamina_finalColor.a = mix(lamina_finalColor.a, lamina_finalColor.a * (1.0 - u_lamina_glass * 0.45), step(0.001, u_lamina_glass));
  }
${r.join(`
`)}
${i.join(`
`)}
  vec3 lamina_lit = lamina_shade(lamina_finalColor.rgb, N, V);
  float lamina_ndv = max(dot(N, V), 0.0);
  lamina_lit *= mix(1.0, 0.5 + 0.5 * smoothstep(0.0, 1.0, lamina_ndv), u_lamina_occlusion);
${u.join(`
`)}
  lamina_lit += vec3(0.25, 0.55, 1.0) * pow(1.0 - lamina_ndv, 2.5) * u_lamina_selected * 1.1;
  if (u_lamina_fx_ngOpacity > 0.001) {
    float lamina_ng = lamina_normalize(lamina_noise_simplex(v_lamina_position * max(u_lamina_fx_ngScale, 0.001) + u_lamina_time * 0.15));
    lamina_lit = mix(lamina_lit, lamina_lit * (0.45 + 0.55 * lamina_ng), clamp(u_lamina_fx_ngOpacity, 0.0, 1.0));
  }
  if (u_lamina_tonemapping > 0.5) {
    lamina_lit = (lamina_lit * (2.51 * lamina_lit + 0.03)) / (lamina_lit * (2.43 * lamina_lit + 0.59) + 0.14);
  }
  gl_FragColor = vec4(pow(max(lamina_lit, vec3(0.0)), vec3(0.4545)), lamina_finalColor.a);
}
`,f=t.sides==="both"?Ct:t.sides==="back"?un:Vn;return{vertexShader:v,fragmentShader:h,uniforms:o,side:f}}function Zo(t,a=[]){const o=Vo(t,a);return new rt({vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,uniforms:o.uniforms,side:o.side,transparent:!0,depthWrite:!0})}const xn={knot:()=>new Un(.82,.3,256,40),sphere:()=>new cn(1.12,128,72),torus:()=>new Qe(1.02,.44,64,128),capsule:()=>new Kn(.72,1.1,24,64),roundedBox:()=>new Io(1.7,1.15,.38,5,.16)},ge={dark:{label:"Dark",background:"#141414",grid:{cell:"#262626",section:"#3a3a3a"},shadowOpacity:.5},white:{label:"White",background:"#f0eff2",light:!0,shadowOpacity:.32},neutral:{label:"Gray",background:"#9a9aa0",shadowOpacity:.38},checker:{label:"Checker",background:"#eceae6",light:!0,checker:!0,shadowOpacity:.3},horizon:{label:"Horizon",background:"#101012",grid:{cell:"#232326",section:"#333338"},gradient:["#08080a","#43434e","#08080a"],shadowOpacity:.55}},Ko=t=>{const a=document.createElement("canvas");a.width=2,a.height=512;const o=a.getContext("2d"),n=o.createLinearGradient(0,0,0,512);n.addColorStop(0,t[0]),n.addColorStop(.55,t[1]),n.addColorStop(1,t[0]),o.fillStyle=n,o.fillRect(0,0,2,512);const r=new Pt(a);return r.colorSpace=Pe,r},Uo=()=>{const t=document.createElement("canvas");t.width=t.height=128;const a=t.getContext("2d");a.fillStyle="#fbfaf8",a.fillRect(0,0,128,128),a.fillStyle="#d7d4ce",a.fillRect(0,0,64,64),a.fillRect(64,64,64,64);const o=new Pt(t);return o.wrapS=o.wrapT=lt,o.repeat.set(30,30),o.anisotropy=4,o.colorSpace=Pe,o},Go=(t,a,o,n,r)=>{const s=y.useMemo(()=>Zo(t,r),[t,r]);return y.useEffect(()=>()=>s.dispose(),[s]),y.useEffect(()=>{s.uniforms.u_lamina_selected&&(s.uniforms.u_lamina_selected.value=a?1:0)},[s,a]),y.useEffect(()=>{s.uniforms.u_lamina_lightIntensity&&(s.uniforms.u_lamina_lightIntensity.value=o.enabled?o.intensity:.25),s.uniforms.u_lamina_ambient&&(s.uniforms.u_lamina_ambient.value=o.ambient),s.uniforms.u_lamina_tonemapping&&(s.uniforms.u_lamina_tonemapping.value=n?1:0)},[s,o,n]),Xe(({clock:_})=>{s.uniforms.u_lamina_time.value=_.elapsedTime}),s},Qo=({geometry:t})=>e.jsx("mesh",{geometry:t,scale:1.002,raycast:()=>null,children:e.jsx("meshBasicMaterial",{color:"#565656",transparent:!0,opacity:.35,wireframe:!0})}),Wo=({geometry:t,object:a,ring:o,blur:n,color:r,strength:s,offsetX:_,offsetY:i})=>{const u=y.useRef(null),v=y.useMemo(()=>({right:new P,up:new P,viewDir:new P}),[]);Xe(({camera:f})=>{const x=u.current;if(!x)return;x.quaternion.copy(f.quaternion),v.right.set(1,0,0).applyQuaternion(f.quaternion),v.up.set(0,1,0).applyQuaternion(f.quaternion),v.viewDir.set(a.position[0]-f.position.x,a.position[1]-f.position.y,a.position[2]-f.position.z).normalize();const g=.18+o*n*.2,m=a.position[0]+v.right.x*_-v.up.x*i+v.viewDir.x*g,w=a.position[1]+v.right.y*_-v.up.y*i+v.viewDir.y*g,k=a.position[2]+v.right.z*_-v.up.z*i+v.viewDir.z*g;x.position.set(m,w,k)});const h=1+o*n*.26;return e.jsx("mesh",{ref:u,geometry:t,scale:[a.scale*h,a.scale*h,.02],raycast:()=>null,children:e.jsx("meshBasicMaterial",{color:r,transparent:!0,opacity:s,depthWrite:!1})})},$o=({object:t,selected:a,transformMode:o,sceneLight:n,tonemapping:r,onSelect:s,onTransform:_})=>{const i=xn[t.geometry],u=y.useMemo(()=>i(),[i]);y.useEffect(()=>()=>u.dispose(),[u]);const v=Go(t.material,a,n,r,t.effects),h=y.useRef(null),f=t.effects.find(w=>w.visible&&w.kind==="dropShadow"),x=t.effects.find(w=>w.visible&&w.kind==="projection"),g=-1.546,m=()=>{if(!h.current)return;const{position:w,rotation:k,scale:C}=h.current;_(t.id,{position:[w.x,w.y,w.z],rotation:[k.x,k.y,k.z],scale:C.x})};return e.jsxs(e.Fragment,{children:[e.jsx("mesh",{ref:h,geometry:u,position:t.position,rotation:t.rotation,scale:t.scale,visible:t.visible,onClick:w=>{w.stopPropagation(),s(t.id)},children:e.jsx("primitive",{object:v,attach:"material"})}),f&&t.visible?[0,1,2].map(w=>e.jsx(Wo,{geometry:u,object:t,ring:w,blur:Number(f.params.blur??.35),color:String(f.params.color??"#000000"),strength:Number(f.params.strength??55)/100*[.42,.2,.09][w],offsetX:Number(f.params.offsetX??0),offsetY:Number(f.params.offsetY??0)},w)):null,x&&t.visible?[0,1,2].map(w=>{const k=Number(x.params.blur??.35),C=Math.max(Number(x.params.radius??3)*.5,.2)*(1+w*k*.4),E=Number(x.params.strength??30)/100*[1,.45,.22][w];return e.jsxs("mesh",{"rotation-x":-Math.PI/2,position:[t.position[0]+Number(x.params.offsetX??0),g+.002+w*.001,t.position[2]+Number(x.params.offsetZ??0)],raycast:()=>null,children:[String(x.params.type)==="disc"?e.jsx("planeGeometry",{args:[C*2,C*2]}):e.jsx("circleGeometry",{args:[C,48]}),e.jsx("meshBasicMaterial",{color:"#9aa7b8",transparent:!0,opacity:E,depthWrite:!1})]},w)}):null,a&&t.visible?e.jsx(da,{object:h,mode:o,onMouseUp:m,size:.8}):null,!a&&t.material.wireframe&&t.visible?e.jsx(Qo,{geometry:u}):null]})},Ho=({config:t,shadowColor:a})=>{const o=y.useMemo(()=>t.gradient?Ko(t.gradient):null,[t]),n=y.useMemo(()=>t.checker?Uo():null,[t]);return y.useEffect(()=>()=>o==null?void 0:o.dispose(),[o]),y.useEffect(()=>()=>n==null?void 0:n.dispose(),[n]),e.jsxs(e.Fragment,{children:[o?e.jsx("primitive",{object:o,attach:"background"}):e.jsx("color",{attach:"background",args:[t.background]}),e.jsx(fa,{position:[0,t.checker?-1.549:-1.548,0],opacity:t.shadowOpacity,scale:16,blur:2.6,far:3.2,resolution:512,color:a}),n?e.jsxs("mesh",{"rotation-x":-Math.PI/2,position:[0,-1.551,0],raycast:()=>null,children:[e.jsx("planeGeometry",{args:[90,90]}),e.jsx("meshBasicMaterial",{map:n})]}):null,t.grid?e.jsx(pa,{position:[0,-1.55,0],args:[40,40],cellSize:.6,cellThickness:.6,cellColor:t.grid.cell,sectionSize:3,sectionThickness:1,sectionColor:t.grid.section,fadeDistance:26,fadeStrength:1.4,infiniteGrid:!0}):null]})},qo=({objects:t,selectedId:a,scene:o,globalEffects:n,transformMode:r,sceneLight:s,tonemapping:_,onSelect:i,onTransform:u})=>{const v=ge[o],h=y.useMemo(()=>n.filter(f=>f.visible&&f.opacity>0),[n]);return e.jsxs(Zn,{camera:{fov:36,position:[1.7,5.5,5.1]},dpr:[1,2],gl:{antialias:!0},onPointerMissed:()=>i(null),children:[e.jsx(Ho,{config:v,shadowColor:s.shadowMode==="custom"?s.shadowColor:v.light?"#5a5550":"#000000"}),t.map(f=>e.jsx($o,{object:f,selected:f.id===a,transformMode:r,sceneLight:s,tonemapping:_,onSelect:i,onTransform:u},f.id)),e.jsx(ua,{makeDefault:!0,enablePan:!1,minDistance:2.6,maxDistance:12,target:[.35,0,.15]}),h.length?e.jsx(Co,{effects:h}):null]})},wt={dropShadow:t=>e.jsx("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:e.jsx("ellipse",{cx:"12",cy:"17",rx:"8",ry:"3.2",fill:"currentColor",opacity:"0.55"})}),innerShadow:t=>e.jsxs("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"8",stroke:"currentColor",strokeWidth:"2.4",opacity:"0.75",fill:"none"}),e.jsx("circle",{cx:"12",cy:"12",r:"4.4",fill:"none",stroke:"currentColor",strokeWidth:"1.2",opacity:"0.4"})]}),layerBlur:t=>e.jsxs("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"9",cy:"12",r:"6",fill:"currentColor",opacity:"0.75"}),e.jsx("circle",{cx:"15",cy:"12",r:"6",fill:"currentColor",opacity:"0.35"})]}),noise:t=>e.jsx("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:Array.from({length:12},(a,o)=>e.jsx("rect",{x:5+o%4*4,y:5+Math.floor(o/4)*5,width:"2.4",height:"2.4",fill:"currentColor",opacity:.3+o%3*.25},o))}),glass:t=>e.jsxs("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:[e.jsx("path",{d:"M6 14c2-4 4.5-6 6-6s4 2 6 6c-2 3-4.5 4-6 4s-4-1-6-4Z",stroke:"currentColor",strokeWidth:"1.8",fill:"none"}),e.jsx("path",{d:"M9 12c1-1.6 2-2.4 3-2.4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none",opacity:"0.7"})]}),projection:t=>e.jsxs("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:[e.jsx("ellipse",{cx:"14.5",cy:"16.5",rx:"7",ry:"3",fill:"currentColor",opacity:"0.4"}),e.jsx("path",{d:"M8 5v9",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),noiseGlass:t=>e.jsxs("svg",{width:t.size??18,height:t.size??18,viewBox:"0 0 24 24",children:[e.jsx("circle",{cx:"12",cy:"12",r:"8",stroke:"currentColor",strokeWidth:"1.8",fill:"none",opacity:"0.8"}),Array.from({length:6},(a,o)=>e.jsx("circle",{cx:9+o%3*3,cy:9+Math.floor(o/3)*4,r:"0.9",fill:"currentColor"},o))]})},Jo=({effects:t,onUpdate:a,onUpdateParam:o,onAdd:n,onRemove:r})=>{const[s,_]=y.useState({kind:"none"}),i=()=>_({kind:"none"}),u=h=>{const f=wt[h.kind]??wt.layerBlur;return e.jsxs("div",{className:`layer-row ${h.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:x=>_({kind:"settings",effectId:h.id,anchor:re(x.currentTarget)}),children:[e.jsx(qe,{size:13,className:"row-chevron"}),e.jsx("span",{className:"row-name",children:h.name})]}),e.jsx("button",{className:"row-swatch",title:"Switch effect",onClick:x=>_({kind:"type",anchor:re(x.currentTarget)}),children:e.jsx(f,{size:17})}),e.jsx("span",{className:"ninput opa",children:e.jsx(de,{value:h.opacity,onChange:x=>a(h.id,{opacity:Math.min(Math.max(x,0),100)})})}),e.jsx("button",{className:"iconbtn",onClick:()=>a(h.id,{visible:!h.visible}),children:h.visible?e.jsx(Ae,{size:16}):e.jsx(Te,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>r(h.id),children:e.jsx(He,{size:14})})]},h.id)},v=s.kind==="settings"?t.find(h=>h.id===s.effectId):void 0;return e.jsxs("aside",{className:"spanel",children:[e.jsx("div",{className:"spanel-scroll",children:e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsxs("h2",{children:["Effects ",e.jsx(Mt,{size:15,className:"drag"})]}),e.jsx("span",{className:"section-tools",children:e.jsx("button",{className:"iconbtn",title:"Add effect",onClick:h=>_({kind:"type",anchor:re(h.currentTarget)}),children:e.jsx(Me,{size:17})})})]}),e.jsx("p",{className:"panel-note",children:"物体级效果：只作用于选中的物体。"}),e.jsx("div",{className:"layer-list",children:t.map(u)})]})}),v?e.jsx(_t,{title:v.name,fields:Be[v.kind].fields,params:v.params,anchor:s.kind==="settings"?s.anchor:{top:0,left:0},onChange:(h,f)=>o(v.id,h,f),onClose:i,hints:To,kindId:v.kind,description:nn[v.kind]}):null,s.kind==="type"?e.jsx(At,{order:Ao,meta:Be,iconMap:wt,descMap:nn,anchor:s.anchor,width:200,onPick:h=>{n(h),i()},onClose:i}):null]})};let ei=0;const ti=()=>`o${++ei}_${Math.random().toString(36).slice(2,6)}`,it=(t,a,o,n,r={})=>({id:ti(),name:t,geometry:a,position:o,rotation:[0,0,0],scale:1,visible:!0,material:n,effects:[],...r}),st=(t,a={})=>({...mo(),layers:t,lighting:{...vn,...a},env:{enabled:!0,map:"studio_white",exposure:1,rotation:[0,0,0]}}),ni=()=>{const t=st([pe("color",{params:{color:"#ffffff"}})],{type:"physical",roughness:.16,glass:.95,refraction:1.08,thickness:.3,aberration:.02,blur:.14});return[it("Pink Card","roundedBox",[-1.7,.42,.1],st([pe("color",{params:{color:"#ff3d8f"}}),pe("fresnel",{opacity:22,params:{color:"#ffd1e6",power:2.8,intensity:.4,bias:0}})],{type:"physical",roughness:.1,metalness:0,reflectivity:1}),{rotation:[1.15,.35,-.18],effects:[yn("dropShadow",{opacity:100,params:{offsetX:0,offsetY:0,blur:.45,color:"#ff5ba4",strength:32}})]}),it("Pearl","sphere",[2.05,.55,-.5],{...t,env:{...t.env,map:"christmas_photo_studio_02"}},{scale:.48}),it("Dark Card","roundedBox",[-.85,-1.55,.95],st([pe("color",{params:{color:"#1a1a1d"}}),pe("fresnel",{opacity:18,params:{color:"#cfcfd8",power:3.2,intensity:.5,bias:0}})],{type:"physical",roughness:.16,metalness:0,reflectivity:1.1}),{rotation:[1.25,-.45,.12],scale:1.02})]},ai=t=>it(`Object ${t+1}`,"sphere",[(t%3-1)*1.9,t%2*1.5-.4,.4*(t%2*2-1)],st([pe("color",{params:{color:"#8f9bb3"}})],{roughness:.25})),oi={knot:"Knot",sphere:"Sphere",torus:"Torus",capsule:"Capsule",roundedBox:"Card"},ii=({objects:t,selectedId:a,scene:o,sceneLight:n,tonemapping:r,onSelect:s,onSelectScene:_,onChangeLight:i,onToggleTonemapping:u,onChangeGeometry:v,onToggleObject:h,onRemoveObject:f,onAddObject:x})=>e.jsx("aside",{className:"spanel",children:e.jsxs("div",{className:"spanel-scroll",children:[e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Background"}),e.jsx("div",{className:"scene-grid",children:Object.keys(ge).map(g=>{var m;return e.jsxs("button",{className:`scene-cell ${o===g?"on":""}`,onClick:()=>_(g),children:[e.jsx("span",{className:"scene-chip",style:{background:`linear-gradient(180deg, ${((m=ge[g].gradient)==null?void 0:m[1])??ge[g].background} 0%, ${ge[g].background} 100%)`}}),e.jsx("span",{children:ge[g].label})]},g)})}),e.jsx("p",{className:"panel-note",children:"Effects 是全局后处理，作用于整个画面（切到 Effects 标签编辑）。"})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("header",{className:"section-head",children:e.jsxs("h2",{children:["Light",e.jsx("button",{className:"iconbtn",onClick:()=>i({enabled:!n.enabled}),children:n.enabled?"◉":"○"})]})}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Intensity"}),e.jsx("span",{className:"prow-control",children:e.jsx(de,{value:n.intensity,onChange:g=>i({intensity:Math.min(Math.max(g,0),4)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Color"}),e.jsx("span",{className:"prow-control",children:e.jsx(Ce,{value:n.color,options:[{value:"#ffffff",label:"White"},{value:"#fff2e0",label:"Warm"},{value:"#e8f0ff",label:"Cool"}],onChange:g=>i({color:g}),style:{width:172}})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shadow C…"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:n.shadowMode,options:["auto","custom"],onChange:g=>i({shadowMode:g})})})]}),n.shadowMode==="custom"?e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Color"}),e.jsx("span",{className:"prow-control",children:e.jsx(Et,{value:n.shadowColor,onChange:g=>i({shadowColor:g})})})]}):null,e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Ambient In…"}),e.jsx("span",{className:"prow-control",children:e.jsx(de,{value:n.ambient,onChange:g=>i({ambient:Math.min(Math.max(g,0),2)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Tonemappi…"}),e.jsx("span",{className:"prow-control",children:e.jsx(ze,{value:r?"yes":"no",options:["yes","no"],onChange:g=>u(g==="yes")})})]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsx("h2",{children:"Objects"}),e.jsx("button",{className:"iconbtn",title:"Add object",onClick:x,children:e.jsx(Me,{size:17})})]}),e.jsx("div",{className:"layer-list",children:t.map(g=>{const m=Dt.matcap;return e.jsxs("div",{className:`layer-row ${g.id===a?"selected":""} ${g.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:()=>s(g.id),children:[e.jsx("span",{className:"row-chevron"}),e.jsx(m,{size:14}),e.jsx("span",{className:"row-name",children:g.name})]}),e.jsx(Ce,{value:g.geometry,options:Object.keys(xn).map(w=>({value:w,label:oi[w]})),onChange:w=>v(g.id,w),style:{width:86}}),e.jsx("button",{className:"iconbtn",onClick:()=>h(g.id),children:g.visible?e.jsx(Ae,{size:16}):e.jsx(Te,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>f(g.id),children:e.jsx(He,{size:14})})]},g.id)})}),e.jsx("p",{className:"panel-note",children:"点击画布中的物体可选中并编辑它的 Material 与 Effects；点击空白处取消选择。"})]})]})}),gn="spline-material-lab.my-materials",si=()=>{try{const t=localStorage.getItem(gn);return t?JSON.parse(t):[]}catch{return[]}},ri=t=>{var a;for(const o of t){const n=Se[o.kind],r=n.hexKey??((a=n.fields.find(s=>s.type==="color"))==null?void 0:a.key);if(r&&typeof o.params[r]=="string"){const s=o.params[r],_=n.fields.filter(u=>u.type==="color")[1],i=_&&typeof o.params[_.key]=="string"?o.params[_.key]:s;return[s,i]}}return["#9aa0a6","#3c3c3c"]},li=()=>{const[t,a]=y.useState(ni),[o,n]=y.useState(null),[r,s]=y.useState(eo),[_,i]=y.useState("white"),[u,v]=y.useState({...co}),[h,f]=y.useState(!0),[x,g]=y.useState("scene"),[m,w]=y.useState("translate"),[k,C]=y.useState(si),[E,Y]=y.useState(null),z=t.find(b=>b.id===o)??null;y.useEffect(()=>{g(z?"material":"scene")},[o]);const j=y.useCallback(b=>{C(b);try{localStorage.setItem(gn,JSON.stringify(b))}catch{}},[]),I=y.useCallback((b,S)=>{a(T=>T.map(F=>F.id===b?{...F,...typeof S=="function"?S(F):S}:F))},[]),c=y.useCallback((b,S)=>{a(T=>T.map(F=>F.id===b?{...F,material:{...F.material,...typeof S=="function"?S(F.material):S}}:F))},[]),R=y.useCallback(b=>({updateMaterial:S=>c(b,T=>({...T,...S})),updateLayer:(S,T)=>c(b,F=>({...F,layers:F.layers.map(Q=>Q.id===S?{...Q,...T}:Q)})),updateLayerParam:(S,T,F)=>c(b,Q=>({...Q,layers:Q.layers.map(fe=>fe.id===S?{...fe,params:{...fe.params,[T]:F}}:fe)})),addLayer:S=>c(b,T=>({...T,layers:[...T.layers,pe(S)]})),setLayerKind:(S,T)=>c(b,F=>({...F,layers:F.layers.map(Q=>{if(Q.id!==S)return Q;const fe=Se[T];return{...Q,kind:T,name:fe.label,params:{...fe.defaults}}})})),removeLayer:S=>c(b,T=>({...T,layers:T.layers.filter(F=>F.id!==S)})),updateLighting:S=>c(b,T=>({...T,lighting:{...T.lighting,...S}})),updateEnv:S=>c(b,T=>({...T,env:{...T.env,...S}}))}),[c]),W=y.useCallback((b,S)=>I(b,S),[I]),O=y.useCallback(()=>{a(b=>[...b,ai(b.length)])},[]),oe=y.useCallback(b=>{a(S=>S.filter(T=>T.id!==b)),o===b&&n(null)},[o]),se=y.useCallback((b,S)=>s(T=>T.map(F=>F.id===b?{...F,...S}:F)),[]),J=y.useCallback((b,S,T)=>s(F=>F.map(Q=>Q.id===b?{...Q,params:{...Q.params,[S]:T}}:Q)),[]),X=y.useCallback(b=>s(S=>[...S,Nt(b)]),[]),U=y.useCallback(b=>s(S=>S.filter(T=>T.id!==b)),[]),le=y.useCallback(b=>s(b),[]),_e=y.useCallback((b,S)=>{z&&I(z.id,T=>({effects:T.effects.map(F=>F.id===b?{...F,...S}:F)}))},[I,z]),te=y.useCallback((b,S,T)=>{z&&I(z.id,F=>({effects:F.effects.map(Q=>Q.id===b?{...Q,params:{...Q.params,[S]:T}}:Q)}))},[I,z]),$=y.useCallback(b=>{z&&I(z.id,S=>({effects:[...S.effects,yn(b)]}))},[I,z]),K=y.useCallback(b=>{z&&I(z.id,S=>({effects:S.effects.filter(T=>T.id!==b)}))},[I,z]),M=y.useCallback(b=>{if(!z)return;const S=po(b);c(z.id,T=>({...T,opacity:S.opacity,layers:S.layers,lighting:S.lighting})),Y(b.id)},[c,z]),G=y.useCallback(()=>{if(!z)return;const b=z.material,S=`My Material ${k.length+1}`,T={id:`mine-${Date.now()}`,name:S,library:"mine",category:"Custom",swatch:ri(b.layers),spec:{opacity:b.opacity,layers:b.layers.map(F=>({kind:F.kind,overrides:{mode:F.mode,opacity:F.opacity,visible:F.visible,params:{...F.params}}})),lighting:{...b.lighting}}};j([...k,T])},[k,j,z]),H=y.useCallback(b=>{j(k.filter(S=>S.id!==b)),E===b&&Y(null)},[E,k,j]),d=z?z.effects.length:r.length;return e.jsxs("div",{className:"lab",children:[e.jsxs("div",{className:`viewport ${ge[_].light?"light":""}`,children:[e.jsx(qo,{objects:t,selectedId:o,scene:_,globalEffects:r,transformMode:m,sceneLight:u,tonemapping:h,onSelect:n,onTransform:W}),e.jsx("div",{className:"viewport-toolbar",children:e.jsx("div",{className:"vt-group",children:Object.keys(ge).map(b=>e.jsx("button",{className:_===b?"on":"",onClick:()=>i(b),children:ge[b].label},b))})}),z?e.jsxs("div",{className:"object-toolbar",children:[e.jsx("span",{className:"object-name",children:z.name}),e.jsx("span",{className:"vt-divider"}),["translate","rotate","scale"].map(b=>e.jsx("button",{className:m===b?"on":"",onClick:()=>w(b),children:b==="translate"?"Move":b==="rotate"?"Rotate":"Scale"},b)),e.jsx("span",{className:"vt-divider"}),e.jsx("button",{onClick:()=>n(null),children:"Deselect"})]}):null,e.jsx("div",{className:"viewport-hint",children:z?"拖拽 gizmo 调整物体 · 点击空白取消选择":"点击物体选择 · Spline Library 26 presets"})]}),e.jsxs("div",{className:"spanel-col",children:[e.jsx("div",{className:"spanel-tabs",children:z?e.jsxs(e.Fragment,{children:[e.jsx("button",{className:x==="material"?"on":"",onClick:()=>g("material"),children:"Material"}),e.jsxs("button",{className:x==="effects"?"on":"",onClick:()=>g("effects"),children:["Effects",d?` ${d}`:""]})]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{className:x==="scene"?"on":"",onClick:()=>g("scene"),children:"Scene"}),e.jsxs("button",{className:x==="effects"?"on":"",onClick:()=>g("effects"),children:["Effects",d?` ${d}`:""]})]})}),z&&x==="material"?e.jsx(wo,{material:z.material,actions:R(z.id),sceneLight:u,tonemapping:h,onChangeLight:b=>v(S=>({...S,...b})),onToggleTonemapping:f,myMaterials:k,appliedPresetId:E,onApplyPreset:M,onSavePreset:G,onDeletePreset:H}):null,!z&&x==="scene"?e.jsx(ii,{objects:t,selectedId:o,scene:_,sceneLight:u,tonemapping:h,onSelect:n,onSelectScene:i,onChangeLight:b=>v(S=>({...S,...b})),onToggleTonemapping:f,onChangeGeometry:(b,S)=>I(b,{geometry:S}),onToggleObject:b=>I(b,S=>({visible:!S.visible})),onRemoveObject:oe,onAddObject:O}):null,x==="effects"&&z?e.jsx(Jo,{effects:z.effects,onUpdate:_e,onUpdateParam:te,onAdd:$,onRemove:K}):null,x==="effects"&&!z?e.jsx(yo,{effects:r,onUpdate:se,onUpdateParam:J,onAdd:X,onRemove:U,onApplyPreset:le}):null]})]})};En.createRoot(document.getElementById("root")).render(e.jsx(li,{}));
