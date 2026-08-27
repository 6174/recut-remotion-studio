import{j as e,c as vn}from"./client-DOSV_kvz.js";import{r as p}from"./index-DzXGc9LX.js";import{a5 as Ve,a6 as yn,J as z,a7 as xn,a8 as Zt,a9 as ee,C as ve,r as Kt,D as vt,aa as gn,ab as ce,ac as Ie,ad as at,ae as st,M as T,af as X,P as pe,ag as ke,ah as Qt,ai as Oe,aj as Pe,ak as Se,al as Mt,O as We,V as te,am as rt,an as bn,ao as Ut,R as wn,u as $,b as Ze,i as In,B as Gt,W as mt,ap as Dn,c as qe,L as Nt,m as jn,aq as kn,T as zn,S as Xe,ar as Je,a as yt,j as Pn,a4 as Sn,as as Cn,at as En}from"./react-three-fiber.esm-DVnjAo8Q.js";import{_ as Be,s as Mn}from"./shaderMaterial-vqI5kPED.js";var Nn=Object.defineProperty,An=(n,o,i)=>o in n?Nn(n,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[o]=i,Tn=(n,o,i)=>(An(n,o+"",i),i);class Ln{constructor(){Tn(this,"_listeners")}addEventListener(o,i){this._listeners===void 0&&(this._listeners={});const t=this._listeners;t[o]===void 0&&(t[o]=[]),t[o].indexOf(i)===-1&&t[o].push(i)}hasEventListener(o,i){if(this._listeners===void 0)return!1;const t=this._listeners;return t[o]!==void 0&&t[o].indexOf(i)!==-1}removeEventListener(o,i){if(this._listeners===void 0)return;const r=this._listeners[o];if(r!==void 0){const c=r.indexOf(i);c!==-1&&r.splice(c,1)}}dispatchEvent(o){if(this._listeners===void 0)return;const t=this._listeners[o.type];if(t!==void 0){o.target=this;const r=t.slice(0);for(let c=0,u=r.length;c<u;c++)r[c].call(this,o);o.target=null}}}var On=Object.defineProperty,Rn=(n,o,i)=>o in n?On(n,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[o]=i,m=(n,o,i)=>(Rn(n,typeof o!="symbol"?o+"":o,i),i);let Yn=class extends Ve{constructor(o,i){super(),m(this,"isTransformControls",!0),m(this,"visible",!1),m(this,"domElement"),m(this,"raycaster",new yn),m(this,"gizmo"),m(this,"plane"),m(this,"tempVector",new z),m(this,"tempVector2",new z),m(this,"tempQuaternion",new ee),m(this,"unit",{X:new z(1,0,0),Y:new z(0,1,0),Z:new z(0,0,1)}),m(this,"pointStart",new z),m(this,"pointEnd",new z),m(this,"offset",new z),m(this,"rotationAxis",new z),m(this,"startNorm",new z),m(this,"endNorm",new z),m(this,"rotationAngle",0),m(this,"cameraPosition",new z),m(this,"cameraQuaternion",new ee),m(this,"cameraScale",new z),m(this,"parentPosition",new z),m(this,"parentQuaternion",new ee),m(this,"parentQuaternionInv",new ee),m(this,"parentScale",new z),m(this,"worldPositionStart",new z),m(this,"worldQuaternionStart",new ee),m(this,"worldScaleStart",new z),m(this,"worldPosition",new z),m(this,"worldQuaternion",new ee),m(this,"worldQuaternionInv",new ee),m(this,"worldScale",new z),m(this,"eye",new z),m(this,"positionStart",new z),m(this,"quaternionStart",new ee),m(this,"scaleStart",new z),m(this,"camera"),m(this,"object"),m(this,"enabled",!0),m(this,"axis",null),m(this,"mode","translate"),m(this,"translationSnap",null),m(this,"rotationSnap",null),m(this,"scaleSnap",null),m(this,"space","world"),m(this,"size",1),m(this,"dragging",!1),m(this,"showX",!0),m(this,"showY",!0),m(this,"showZ",!0),m(this,"changeEvent",{type:"change"}),m(this,"mouseDownEvent",{type:"mouseDown",mode:this.mode}),m(this,"mouseUpEvent",{type:"mouseUp",mode:this.mode}),m(this,"objectChangeEvent",{type:"objectChange"}),m(this,"intersectObjectWithRay",(r,c,u)=>{const a=c.intersectObject(r,!0);for(let _=0;_<a.length;_++)if(a[_].object.visible||u)return a[_];return!1}),m(this,"attach",r=>(this.object=r,this.visible=!0,this)),m(this,"detach",()=>(this.object=void 0,this.visible=!1,this.axis=null,this)),m(this,"reset",()=>this.enabled?(this.dragging&&this.object!==void 0&&(this.object.position.copy(this.positionStart),this.object.quaternion.copy(this.quaternionStart),this.object.scale.copy(this.scaleStart),this.dispatchEvent(this.changeEvent),this.dispatchEvent(this.objectChangeEvent),this.pointStart.copy(this.pointEnd)),this):this),m(this,"updateMatrixWorld",()=>{this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this.parentPosition,this.parentQuaternion,this.parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this.worldScale),this.parentQuaternionInv.copy(this.parentQuaternion).invert(),this.worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this.cameraScale),this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld()}),m(this,"pointerHover",r=>{if(this.object===void 0||this.dragging===!0)return;this.raycaster.setFromCamera(r,this.camera);const c=this.intersectObjectWithRay(this.gizmo.picker[this.mode],this.raycaster);c?this.axis=c.object.name:this.axis=null}),m(this,"pointerDown",r=>{if(!(this.object===void 0||this.dragging===!0||r.button!==0)&&this.axis!==null){this.raycaster.setFromCamera(r,this.camera);const c=this.intersectObjectWithRay(this.plane,this.raycaster,!0);if(c){let u=this.space;if(this.mode==="scale"?u="local":(this.axis==="E"||this.axis==="XYZE"||this.axis==="XYZ")&&(u="world"),u==="local"&&this.mode==="rotate"){const a=this.rotationSnap;this.axis==="X"&&a&&(this.object.rotation.x=Math.round(this.object.rotation.x/a)*a),this.axis==="Y"&&a&&(this.object.rotation.y=Math.round(this.object.rotation.y/a)*a),this.axis==="Z"&&a&&(this.object.rotation.z=Math.round(this.object.rotation.z/a)*a)}this.object.updateMatrixWorld(),this.object.parent&&this.object.parent.updateMatrixWorld(),this.positionStart.copy(this.object.position),this.quaternionStart.copy(this.object.quaternion),this.scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this.worldScaleStart),this.pointStart.copy(c.point).sub(this.worldPositionStart)}this.dragging=!0,this.mouseDownEvent.mode=this.mode,this.dispatchEvent(this.mouseDownEvent)}}),m(this,"pointerMove",r=>{const c=this.axis,u=this.mode,a=this.object;let _=this.space;if(u==="scale"?_="local":(c==="E"||c==="XYZE"||c==="XYZ")&&(_="world"),a===void 0||c===null||this.dragging===!1||r.button!==-1)return;this.raycaster.setFromCamera(r,this.camera);const v=this.intersectObjectWithRay(this.plane,this.raycaster,!0);if(v){if(this.pointEnd.copy(v.point).sub(this.worldPositionStart),u==="translate")this.offset.copy(this.pointEnd).sub(this.pointStart),_==="local"&&c!=="XYZ"&&this.offset.applyQuaternion(this.worldQuaternionInv),c.indexOf("X")===-1&&(this.offset.x=0),c.indexOf("Y")===-1&&(this.offset.y=0),c.indexOf("Z")===-1&&(this.offset.z=0),_==="local"&&c!=="XYZ"?this.offset.applyQuaternion(this.quaternionStart).divide(this.parentScale):this.offset.applyQuaternion(this.parentQuaternionInv).divide(this.parentScale),a.position.copy(this.offset).add(this.positionStart),this.translationSnap&&(_==="local"&&(a.position.applyQuaternion(this.tempQuaternion.copy(this.quaternionStart).invert()),c.search("X")!==-1&&(a.position.x=Math.round(a.position.x/this.translationSnap)*this.translationSnap),c.search("Y")!==-1&&(a.position.y=Math.round(a.position.y/this.translationSnap)*this.translationSnap),c.search("Z")!==-1&&(a.position.z=Math.round(a.position.z/this.translationSnap)*this.translationSnap),a.position.applyQuaternion(this.quaternionStart)),_==="world"&&(a.parent&&a.position.add(this.tempVector.setFromMatrixPosition(a.parent.matrixWorld)),c.search("X")!==-1&&(a.position.x=Math.round(a.position.x/this.translationSnap)*this.translationSnap),c.search("Y")!==-1&&(a.position.y=Math.round(a.position.y/this.translationSnap)*this.translationSnap),c.search("Z")!==-1&&(a.position.z=Math.round(a.position.z/this.translationSnap)*this.translationSnap),a.parent&&a.position.sub(this.tempVector.setFromMatrixPosition(a.parent.matrixWorld))));else if(u==="scale"){if(c.search("XYZ")!==-1){let f=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(f*=-1),this.tempVector2.set(f,f,f)}else this.tempVector.copy(this.pointStart),this.tempVector2.copy(this.pointEnd),this.tempVector.applyQuaternion(this.worldQuaternionInv),this.tempVector2.applyQuaternion(this.worldQuaternionInv),this.tempVector2.divide(this.tempVector),c.search("X")===-1&&(this.tempVector2.x=1),c.search("Y")===-1&&(this.tempVector2.y=1),c.search("Z")===-1&&(this.tempVector2.z=1);a.scale.copy(this.scaleStart).multiply(this.tempVector2),this.scaleSnap&&this.object&&(c.search("X")!==-1&&(this.object.scale.x=Math.round(a.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),c.search("Y")!==-1&&(a.scale.y=Math.round(a.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),c.search("Z")!==-1&&(a.scale.z=Math.round(a.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(u==="rotate"){this.offset.copy(this.pointEnd).sub(this.pointStart);const f=20/this.worldPosition.distanceTo(this.tempVector.setFromMatrixPosition(this.camera.matrixWorld));c==="E"?(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this.startNorm.copy(this.pointStart).normalize(),this.endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this.endNorm.cross(this.startNorm).dot(this.eye)<0?1:-1):c==="XYZE"?(this.rotationAxis.copy(this.offset).cross(this.eye).normalize(),this.rotationAngle=this.offset.dot(this.tempVector.copy(this.rotationAxis).cross(this.eye))*f):(c==="X"||c==="Y"||c==="Z")&&(this.rotationAxis.copy(this.unit[c]),this.tempVector.copy(this.unit[c]),_==="local"&&this.tempVector.applyQuaternion(this.worldQuaternion),this.rotationAngle=this.offset.dot(this.tempVector.cross(this.eye).normalize())*f),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),_==="local"&&c!=="E"&&c!=="XYZE"?(a.quaternion.copy(this.quaternionStart),a.quaternion.multiply(this.tempQuaternion.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this.parentQuaternionInv),a.quaternion.copy(this.tempQuaternion.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),a.quaternion.multiply(this.quaternionStart).normalize())}this.dispatchEvent(this.changeEvent),this.dispatchEvent(this.objectChangeEvent)}}),m(this,"pointerUp",r=>{r.button===0&&(this.dragging&&this.axis!==null&&(this.mouseUpEvent.mode=this.mode,this.dispatchEvent(this.mouseUpEvent)),this.dragging=!1,this.axis=null)}),m(this,"getPointer",r=>{var c;if(this.domElement&&((c=this.domElement.ownerDocument)!=null&&c.pointerLockElement))return{x:0,y:0,button:r.button};{const u=r.changedTouches?r.changedTouches[0]:r,a=this.domElement.getBoundingClientRect();return{x:(u.clientX-a.left)/a.width*2-1,y:-(u.clientY-a.top)/a.height*2+1,button:r.button}}}),m(this,"onPointerHover",r=>{if(this.enabled)switch(r.pointerType){case"mouse":case"pen":this.pointerHover(this.getPointer(r));break}}),m(this,"onPointerDown",r=>{!this.enabled||!this.domElement||(this.domElement.style.touchAction="none",this.domElement.ownerDocument.addEventListener("pointermove",this.onPointerMove),this.pointerHover(this.getPointer(r)),this.pointerDown(this.getPointer(r)))}),m(this,"onPointerMove",r=>{this.enabled&&this.pointerMove(this.getPointer(r))}),m(this,"onPointerUp",r=>{!this.enabled||!this.domElement||(this.domElement.style.touchAction="",this.domElement.ownerDocument.removeEventListener("pointermove",this.onPointerMove),this.pointerUp(this.getPointer(r)))}),m(this,"getMode",()=>this.mode),m(this,"setMode",r=>{this.mode=r}),m(this,"setTranslationSnap",r=>{this.translationSnap=r}),m(this,"setRotationSnap",r=>{this.rotationSnap=r}),m(this,"setScaleSnap",r=>{this.scaleSnap=r}),m(this,"setSize",r=>{this.size=r}),m(this,"setSpace",r=>{this.space=r}),m(this,"update",()=>{console.warn("THREE.TransformControls: update function has no more functionality and therefore has been deprecated.")}),m(this,"connect",r=>{r===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.domElement=r,this.domElement.addEventListener("pointerdown",this.onPointerDown),this.domElement.addEventListener("pointermove",this.onPointerHover),this.domElement.ownerDocument.addEventListener("pointerup",this.onPointerUp)}),m(this,"dispose",()=>{var r,c,u,a,_,v;(r=this.domElement)==null||r.removeEventListener("pointerdown",this.onPointerDown),(c=this.domElement)==null||c.removeEventListener("pointermove",this.onPointerHover),(a=(u=this.domElement)==null?void 0:u.ownerDocument)==null||a.removeEventListener("pointermove",this.onPointerMove),(v=(_=this.domElement)==null?void 0:_.ownerDocument)==null||v.removeEventListener("pointerup",this.onPointerUp),this.traverse(f=>{const h=f;h.geometry&&h.geometry.dispose(),h.material&&h.material.dispose()})}),this.domElement=i,this.camera=o,this.gizmo=new Fn,this.add(this.gizmo),this.plane=new Vn,this.add(this.plane);const t=(r,c)=>{let u=c;Object.defineProperty(this,r,{get:function(){return u!==void 0?u:c},set:function(a){u!==a&&(u=a,this.plane[r]=a,this.gizmo[r]=a,this.dispatchEvent({type:r+"-changed",value:a}),this.dispatchEvent(this.changeEvent))}}),this[r]=c,this.plane[r]=c,this.gizmo[r]=c};t("camera",this.camera),t("object",this.object),t("enabled",this.enabled),t("axis",this.axis),t("mode",this.mode),t("translationSnap",this.translationSnap),t("rotationSnap",this.rotationSnap),t("scaleSnap",this.scaleSnap),t("space",this.space),t("size",this.size),t("dragging",this.dragging),t("showX",this.showX),t("showY",this.showY),t("showZ",this.showZ),t("worldPosition",this.worldPosition),t("worldPositionStart",this.worldPositionStart),t("worldQuaternion",this.worldQuaternion),t("worldQuaternionStart",this.worldQuaternionStart),t("cameraPosition",this.cameraPosition),t("cameraQuaternion",this.cameraQuaternion),t("pointStart",this.pointStart),t("pointEnd",this.pointEnd),t("rotationAxis",this.rotationAxis),t("rotationAngle",this.rotationAngle),t("eye",this.eye),i!==void 0&&this.connect(i)}};class Fn extends Ve{constructor(){super(),m(this,"isTransformControlsGizmo",!0),m(this,"type","TransformControlsGizmo"),m(this,"tempVector",new z(0,0,0)),m(this,"tempEuler",new xn),m(this,"alignVector",new z(0,1,0)),m(this,"zeroVector",new z(0,0,0)),m(this,"lookAtMatrix",new Zt),m(this,"tempQuaternion",new ee),m(this,"tempQuaternion2",new ee),m(this,"identityQuaternion",new ee),m(this,"unitX",new z(1,0,0)),m(this,"unitY",new z(0,1,0)),m(this,"unitZ",new z(0,0,1)),m(this,"gizmo"),m(this,"picker"),m(this,"helper"),m(this,"rotationAxis",new z),m(this,"cameraPosition",new z),m(this,"worldPositionStart",new z),m(this,"worldQuaternionStart",new ee),m(this,"worldPosition",new z),m(this,"worldQuaternion",new ee),m(this,"eye",new z),m(this,"camera",null),m(this,"enabled",!0),m(this,"axis",null),m(this,"mode","translate"),m(this,"space","world"),m(this,"size",1),m(this,"dragging",!1),m(this,"showX",!0),m(this,"showY",!0),m(this,"showZ",!0),m(this,"updateMatrixWorld",()=>{let Z=this.space;this.mode==="scale"&&(Z="local");const S=Z==="local"?this.worldQuaternion:this.identityQuaternion;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let F=[];F=F.concat(this.picker[this.mode].children),F=F.concat(this.gizmo[this.mode].children),F=F.concat(this.helper[this.mode].children);for(let x=0;x<F.length;x++){const s=F[x];s.visible=!0,s.rotation.set(0,0,0),s.position.copy(this.worldPosition);let E;if(this.camera.isOrthographicCamera?E=(this.camera.top-this.camera.bottom)/this.camera.zoom:E=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),s.scale.set(1,1,1).multiplyScalar(E*this.size/7),s.tag==="helper"){s.visible=!1,s.name==="AXIS"?(s.position.copy(this.worldPositionStart),s.visible=!!this.axis,this.axis==="X"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,0,0)),s.quaternion.copy(S).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(S).dot(this.eye))>.9&&(s.visible=!1)),this.axis==="Y"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,0,Math.PI/2)),s.quaternion.copy(S).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(S).dot(this.eye))>.9&&(s.visible=!1)),this.axis==="Z"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,Math.PI/2,0)),s.quaternion.copy(S).multiply(this.tempQuaternion),Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(S).dot(this.eye))>.9&&(s.visible=!1)),this.axis==="XYZE"&&(this.tempQuaternion.setFromEuler(this.tempEuler.set(0,Math.PI/2,0)),this.alignVector.copy(this.rotationAxis),s.quaternion.setFromRotationMatrix(this.lookAtMatrix.lookAt(this.zeroVector,this.alignVector,this.unitY)),s.quaternion.multiply(this.tempQuaternion),s.visible=this.dragging),this.axis==="E"&&(s.visible=!1)):s.name==="START"?(s.position.copy(this.worldPositionStart),s.visible=this.dragging):s.name==="END"?(s.position.copy(this.worldPosition),s.visible=this.dragging):s.name==="DELTA"?(s.position.copy(this.worldPositionStart),s.quaternion.copy(this.worldQuaternionStart),this.tempVector.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),this.tempVector.applyQuaternion(this.worldQuaternionStart.clone().invert()),s.scale.copy(this.tempVector),s.visible=this.dragging):(s.quaternion.copy(S),this.dragging?s.position.copy(this.worldPositionStart):s.position.copy(this.worldPosition),this.axis&&(s.visible=this.axis.search(s.name)!==-1));continue}s.quaternion.copy(S),this.mode==="translate"||this.mode==="scale"?((s.name==="X"||s.name==="XYZX")&&Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(S).dot(this.eye))>.99&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),(s.name==="Y"||s.name==="XYZY")&&Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(S).dot(this.eye))>.99&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),(s.name==="Z"||s.name==="XYZZ")&&Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(S).dot(this.eye))>.99&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),s.name==="XY"&&Math.abs(this.alignVector.copy(this.unitZ).applyQuaternion(S).dot(this.eye))<.2&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),s.name==="YZ"&&Math.abs(this.alignVector.copy(this.unitX).applyQuaternion(S).dot(this.eye))<.2&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),s.name==="XZ"&&Math.abs(this.alignVector.copy(this.unitY).applyQuaternion(S).dot(this.eye))<.2&&(s.scale.set(1e-10,1e-10,1e-10),s.visible=!1),s.name.search("X")!==-1&&(this.alignVector.copy(this.unitX).applyQuaternion(S).dot(this.eye)<0?s.tag==="fwd"?s.visible=!1:s.scale.x*=-1:s.tag==="bwd"&&(s.visible=!1)),s.name.search("Y")!==-1&&(this.alignVector.copy(this.unitY).applyQuaternion(S).dot(this.eye)<0?s.tag==="fwd"?s.visible=!1:s.scale.y*=-1:s.tag==="bwd"&&(s.visible=!1)),s.name.search("Z")!==-1&&(this.alignVector.copy(this.unitZ).applyQuaternion(S).dot(this.eye)<0?s.tag==="fwd"?s.visible=!1:s.scale.z*=-1:s.tag==="bwd"&&(s.visible=!1))):this.mode==="rotate"&&(this.tempQuaternion2.copy(S),this.alignVector.copy(this.eye).applyQuaternion(this.tempQuaternion.copy(S).invert()),s.name.search("E")!==-1&&s.quaternion.setFromRotationMatrix(this.lookAtMatrix.lookAt(this.eye,this.zeroVector,this.unitY)),s.name==="X"&&(this.tempQuaternion.setFromAxisAngle(this.unitX,Math.atan2(-this.alignVector.y,this.alignVector.z)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),s.quaternion.copy(this.tempQuaternion)),s.name==="Y"&&(this.tempQuaternion.setFromAxisAngle(this.unitY,Math.atan2(this.alignVector.x,this.alignVector.z)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),s.quaternion.copy(this.tempQuaternion)),s.name==="Z"&&(this.tempQuaternion.setFromAxisAngle(this.unitZ,Math.atan2(this.alignVector.y,this.alignVector.x)),this.tempQuaternion.multiplyQuaternions(this.tempQuaternion2,this.tempQuaternion),s.quaternion.copy(this.tempQuaternion))),s.visible=s.visible&&(s.name.indexOf("X")===-1||this.showX),s.visible=s.visible&&(s.name.indexOf("Y")===-1||this.showY),s.visible=s.visible&&(s.name.indexOf("Z")===-1||this.showZ),s.visible=s.visible&&(s.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),s.material.tempOpacity=s.material.tempOpacity||s.material.opacity,s.material.tempColor=s.material.tempColor||s.material.color.clone(),s.material.color.copy(s.material.tempColor),s.material.opacity=s.material.tempOpacity,this.enabled?this.axis&&(s.name===this.axis?(s.material.opacity=1,s.material.color.lerp(new ve(1,1,1),.5)):this.axis.split("").some(function(R){return s.name===R})?(s.material.opacity=1,s.material.color.lerp(new ve(1,1,1),.5)):(s.material.opacity*=.25,s.material.color.lerp(new ve(1,1,1),.5))):(s.material.opacity*=.5,s.material.color.lerp(new ve(1,1,1),.5))}super.updateMatrixWorld()});const o=new Kt({depthTest:!1,depthWrite:!1,transparent:!0,side:vt,fog:!1,toneMapped:!1}),i=new gn({depthTest:!1,depthWrite:!1,transparent:!0,linewidth:1,fog:!1,toneMapped:!1}),t=o.clone();t.opacity=.15;const r=o.clone();r.opacity=.33;const c=o.clone();c.color.set(16711680);const u=o.clone();u.color.set(65280);const a=o.clone();a.color.set(255);const _=o.clone();_.opacity=.25;const v=_.clone();v.color.set(16776960);const f=_.clone();f.color.set(65535);const h=_.clone();h.color.set(16711935),o.clone().color.set(16776960);const g=i.clone();g.color.set(16711680);const y=i.clone();y.color.set(65280);const P=i.clone();P.color.set(255);const k=i.clone();k.color.set(65535);const N=i.clone();N.color.set(16711935);const L=i.clone();L.color.set(16776960);const d=i.clone();d.color.set(7895160);const j=L.clone();j.opacity=.25;const I=new ce(0,.05,.2,12,1,!1),D=new Ie(.125,.125,.125),C=new at;C.setAttribute("position",new st([0,0,0,1,0,0],3));const B=(Z,S)=>{const F=new at,x=[];for(let s=0;s<=64*S;++s)x.push(0,Math.cos(s/32*Math.PI)*Z,Math.sin(s/32*Math.PI)*Z);return F.setAttribute("position",new st(x,3)),F},G=()=>{const Z=new at;return Z.setAttribute("position",new st([0,0,0,1,1,1],3)),Z},M={X:[[new T(I,c),[1,0,0],[0,0,-Math.PI/2],null,"fwd"],[new T(I,c),[1,0,0],[0,0,Math.PI/2],null,"bwd"],[new X(C,g)]],Y:[[new T(I,u),[0,1,0],null,null,"fwd"],[new T(I,u),[0,1,0],[Math.PI,0,0],null,"bwd"],[new X(C,y),null,[0,0,Math.PI/2]]],Z:[[new T(I,a),[0,0,1],[Math.PI/2,0,0],null,"fwd"],[new T(I,a),[0,0,1],[-Math.PI/2,0,0],null,"bwd"],[new X(C,P),null,[0,-Math.PI/2,0]]],XYZ:[[new T(new ke(.1,0),_.clone()),[0,0,0],[0,0,0]]],XY:[[new T(new pe(.295,.295),v.clone()),[.15,.15,0]],[new X(C,L),[.18,.3,0],null,[.125,1,1]],[new X(C,L),[.3,.18,0],[0,0,Math.PI/2],[.125,1,1]]],YZ:[[new T(new pe(.295,.295),f.clone()),[0,.15,.15],[0,Math.PI/2,0]],[new X(C,k),[0,.18,.3],[0,0,Math.PI/2],[.125,1,1]],[new X(C,k),[0,.3,.18],[0,-Math.PI/2,0],[.125,1,1]]],XZ:[[new T(new pe(.295,.295),h.clone()),[.15,0,.15],[-Math.PI/2,0,0]],[new X(C,N),[.18,0,.3],null,[.125,1,1]],[new X(C,N),[.3,0,.18],[0,-Math.PI/2,0],[.125,1,1]]]},ne={X:[[new T(new ce(.2,0,1,4,1,!1),t),[.6,0,0],[0,0,-Math.PI/2]]],Y:[[new T(new ce(.2,0,1,4,1,!1),t),[0,.6,0]]],Z:[[new T(new ce(.2,0,1,4,1,!1),t),[0,0,.6],[Math.PI/2,0,0]]],XYZ:[[new T(new ke(.2,0),t)]],XY:[[new T(new pe(.4,.4),t),[.2,.2,0]]],YZ:[[new T(new pe(.4,.4),t),[0,.2,.2],[0,Math.PI/2,0]]],XZ:[[new T(new pe(.4,.4),t),[.2,0,.2],[-Math.PI/2,0,0]]]},ae={START:[[new T(new ke(.01,2),r),null,null,null,"helper"]],END:[[new T(new ke(.01,2),r),null,null,null,"helper"]],DELTA:[[new X(G(),r),null,null,null,"helper"]],X:[[new X(C,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new X(C,r.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new X(C,r.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},Q={X:[[new X(B(1,.5),g)],[new T(new ke(.04,0),c),[0,0,.99],null,[1,3,1]]],Y:[[new X(B(1,.5),y),null,[0,0,-Math.PI/2]],[new T(new ke(.04,0),u),[0,0,.99],null,[3,1,1]]],Z:[[new X(B(1,.5),P),null,[0,Math.PI/2,0]],[new T(new ke(.04,0),a),[.99,0,0],null,[1,3,1]]],E:[[new X(B(1.25,1),j),null,[0,Math.PI/2,0]],[new T(new ce(.03,0,.15,4,1,!1),j),[1.17,0,0],[0,0,-Math.PI/2],[1,1,.001]],[new T(new ce(.03,0,.15,4,1,!1),j),[-1.17,0,0],[0,0,Math.PI/2],[1,1,.001]],[new T(new ce(.03,0,.15,4,1,!1),j),[0,-1.17,0],[Math.PI,0,0],[1,1,.001]],[new T(new ce(.03,0,.15,4,1,!1),j),[0,1.17,0],[0,0,0],[1,1,.001]]],XYZE:[[new X(B(1,1),d),null,[0,Math.PI/2,0]]]},H={AXIS:[[new X(C,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},K={X:[[new T(new Oe(1,.1,4,24),t),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new T(new Oe(1,.1,4,24),t),[0,0,0],[Math.PI/2,0,0]]],Z:[[new T(new Oe(1,.1,4,24),t),[0,0,0],[0,0,-Math.PI/2]]],E:[[new T(new Oe(1.25,.1,2,24),t)]],XYZE:[[new T(new Qt(.7,10,8),t)]]},oe={X:[[new T(D,c),[.8,0,0],[0,0,-Math.PI/2]],[new X(C,g),null,null,[.8,1,1]]],Y:[[new T(D,u),[0,.8,0]],[new X(C,y),null,[0,0,Math.PI/2],[.8,1,1]]],Z:[[new T(D,a),[0,0,.8],[Math.PI/2,0,0]],[new X(C,P),null,[0,-Math.PI/2,0],[.8,1,1]]],XY:[[new T(D,v),[.85,.85,0],null,[2,2,.2]],[new X(C,L),[.855,.98,0],null,[.125,1,1]],[new X(C,L),[.98,.855,0],[0,0,Math.PI/2],[.125,1,1]]],YZ:[[new T(D,f),[0,.85,.85],null,[.2,2,2]],[new X(C,k),[0,.855,.98],[0,0,Math.PI/2],[.125,1,1]],[new X(C,k),[0,.98,.855],[0,-Math.PI/2,0],[.125,1,1]]],XZ:[[new T(D,h),[.85,0,.85],null,[2,.2,2]],[new X(C,N),[.855,0,.98],null,[.125,1,1]],[new X(C,N),[.98,0,.855],[0,-Math.PI/2,0],[.125,1,1]]],XYZX:[[new T(new Ie(.125,.125,.125),_.clone()),[1.1,0,0]]],XYZY:[[new T(new Ie(.125,.125,.125),_.clone()),[0,1.1,0]]],XYZZ:[[new T(new Ie(.125,.125,.125),_.clone()),[0,0,1.1]]]},se={X:[[new T(new ce(.2,0,.8,4,1,!1),t),[.5,0,0],[0,0,-Math.PI/2]]],Y:[[new T(new ce(.2,0,.8,4,1,!1),t),[0,.5,0]]],Z:[[new T(new ce(.2,0,.8,4,1,!1),t),[0,0,.5],[Math.PI/2,0,0]]],XY:[[new T(D,t),[.85,.85,0],null,[3,3,.2]]],YZ:[[new T(D,t),[0,.85,.85],null,[.2,3,3]]],XZ:[[new T(D,t),[.85,0,.85],null,[3,.2,3]]],XYZX:[[new T(new Ie(.2,.2,.2),t),[1.1,0,0]]],XYZY:[[new T(new Ie(.2,.2,.2),t),[0,1.1,0]]],XYZZ:[[new T(new Ie(.2,.2,.2),t),[0,0,1.1]]]},q={X:[[new X(C,r.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new X(C,r.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new X(C,r.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},W=Z=>{const S=new Ve;for(let F in Z)for(let x=Z[F].length;x--;){const s=Z[F][x][0].clone(),E=Z[F][x][1],R=Z[F][x][2],U=Z[F][x][3],re=Z[F][x][4];s.name=F,s.tag=re,E&&s.position.set(E[0],E[1],E[2]),R&&s.rotation.set(R[0],R[1],R[2]),U&&s.scale.set(U[0],U[1],U[2]),s.updateMatrix();const Qe=s.geometry.clone();Qe.applyMatrix4(s.matrix),s.geometry=Qe,s.renderOrder=1/0,s.position.set(0,0,0),s.rotation.set(0,0,0),s.scale.set(1,1,1),S.add(s)}return S};this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=W(M)),this.add(this.gizmo.rotate=W(Q)),this.add(this.gizmo.scale=W(oe)),this.add(this.picker.translate=W(ne)),this.add(this.picker.rotate=W(K)),this.add(this.picker.scale=W(se)),this.add(this.helper.translate=W(ae)),this.add(this.helper.rotate=W(H)),this.add(this.helper.scale=W(q)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}}class Vn extends T{constructor(){super(new pe(1e5,1e5,2,2),new Kt({visible:!1,wireframe:!0,side:vt,transparent:!0,opacity:.1,toneMapped:!1})),m(this,"isTransformControlsPlane",!0),m(this,"type","TransformControlsPlane"),m(this,"unitX",new z(1,0,0)),m(this,"unitY",new z(0,1,0)),m(this,"unitZ",new z(0,0,1)),m(this,"tempVector",new z),m(this,"dirVector",new z),m(this,"alignVector",new z),m(this,"tempMatrix",new Zt),m(this,"identityQuaternion",new ee),m(this,"cameraQuaternion",new ee),m(this,"worldPosition",new z),m(this,"worldQuaternion",new ee),m(this,"eye",new z),m(this,"axis",null),m(this,"mode","translate"),m(this,"space","world"),m(this,"updateMatrixWorld",()=>{let o=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(o="local"),this.unitX.set(1,0,0).applyQuaternion(o==="local"?this.worldQuaternion:this.identityQuaternion),this.unitY.set(0,1,0).applyQuaternion(o==="local"?this.worldQuaternion:this.identityQuaternion),this.unitZ.set(0,0,1).applyQuaternion(o==="local"?this.worldQuaternion:this.identityQuaternion),this.alignVector.copy(this.unitY),this.mode){case"translate":case"scale":switch(this.axis){case"X":this.alignVector.copy(this.eye).cross(this.unitX),this.dirVector.copy(this.unitX).cross(this.alignVector);break;case"Y":this.alignVector.copy(this.eye).cross(this.unitY),this.dirVector.copy(this.unitY).cross(this.alignVector);break;case"Z":this.alignVector.copy(this.eye).cross(this.unitZ),this.dirVector.copy(this.unitZ).cross(this.alignVector);break;case"XY":this.dirVector.copy(this.unitZ);break;case"YZ":this.dirVector.copy(this.unitX);break;case"XZ":this.alignVector.copy(this.unitZ),this.dirVector.copy(this.unitY);break;case"XYZ":case"E":this.dirVector.set(0,0,0);break}break;case"rotate":default:this.dirVector.set(0,0,0)}this.dirVector.length()===0?this.quaternion.copy(this.cameraQuaternion):(this.tempMatrix.lookAt(this.tempVector.set(0,0,0),this.dirVector,this.alignVector),this.quaternion.setFromRotationMatrix(this.tempMatrix)),super.updateMatrixWorld()})}}var Xn=Object.defineProperty,Bn=(n,o,i)=>o in n?Xn(n,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[o]=i,A=(n,o,i)=>(Bn(n,typeof o!="symbol"?o+"":o,i),i);const Ge=new bn,At=new Ut,Zn=Math.cos(70*(Math.PI/180)),Tt=(n,o)=>(n%o+o)%o;let Kn=class extends Ln{constructor(o,i){super(),A(this,"object"),A(this,"domElement"),A(this,"enabled",!0),A(this,"target",new z),A(this,"minDistance",0),A(this,"maxDistance",1/0),A(this,"minZoom",0),A(this,"maxZoom",1/0),A(this,"minPolarAngle",0),A(this,"maxPolarAngle",Math.PI),A(this,"minAzimuthAngle",-1/0),A(this,"maxAzimuthAngle",1/0),A(this,"enableDamping",!1),A(this,"dampingFactor",.05),A(this,"enableZoom",!0),A(this,"zoomSpeed",1),A(this,"enableRotate",!0),A(this,"rotateSpeed",1),A(this,"enablePan",!0),A(this,"panSpeed",1),A(this,"screenSpacePanning",!0),A(this,"keyPanSpeed",7),A(this,"zoomToCursor",!1),A(this,"autoRotate",!1),A(this,"autoRotateSpeed",2),A(this,"reverseOrbit",!1),A(this,"reverseHorizontalOrbit",!1),A(this,"reverseVerticalOrbit",!1),A(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),A(this,"mouseButtons",{LEFT:Pe.ROTATE,MIDDLE:Pe.DOLLY,RIGHT:Pe.PAN}),A(this,"touches",{ONE:Se.ROTATE,TWO:Se.DOLLY_PAN}),A(this,"target0"),A(this,"position0"),A(this,"zoom0"),A(this,"_domElementKeyEvents",null),A(this,"getPolarAngle"),A(this,"getAzimuthalAngle"),A(this,"setPolarAngle"),A(this,"setAzimuthalAngle"),A(this,"getDistance"),A(this,"getZoomScale"),A(this,"listenToKeyEvents"),A(this,"stopListenToKeyEvents"),A(this,"saveState"),A(this,"reset"),A(this,"update"),A(this,"connect"),A(this,"dispose"),A(this,"dollyIn"),A(this,"dollyOut"),A(this,"getScale"),A(this,"setScale"),this.object=o,this.domElement=i,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>f.phi,this.getAzimuthalAngle=()=>f.theta,this.setPolarAngle=l=>{let w=Tt(l,2*Math.PI),O=f.phi;O<0&&(O+=2*Math.PI),w<0&&(w+=2*Math.PI);let V=Math.abs(w-O);2*Math.PI-V<V&&(w<O?w+=2*Math.PI:O+=2*Math.PI),h.phi=w-O,t.update()},this.setAzimuthalAngle=l=>{let w=Tt(l,2*Math.PI),O=f.theta;O<0&&(O+=2*Math.PI),w<0&&(w+=2*Math.PI);let V=Math.abs(w-O);2*Math.PI-V<V&&(w<O?w+=2*Math.PI:O+=2*Math.PI),h.theta=w-O,t.update()},this.getDistance=()=>t.object.position.distanceTo(t.target),this.listenToKeyEvents=l=>{l.addEventListener("keydown",ot),this._domElementKeyEvents=l},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ot),this._domElementKeyEvents=null},this.saveState=()=>{t.target0.copy(t.target),t.position0.copy(t.object.position),t.zoom0=t.object.zoom},this.reset=()=>{t.target.copy(t.target0),t.object.position.copy(t.position0),t.object.zoom=t.zoom0,t.object.updateProjectionMatrix(),t.dispatchEvent(r),t.update(),_=a.NONE},this.update=(()=>{const l=new z,w=new z(0,1,0),O=new ee().setFromUnitVectors(o.up,w),V=O.clone().invert(),J=new z,me=new ee,xe=2*Math.PI;return function(){const Et=t.object.position;O.setFromUnitVectors(o.up,w),V.copy(O).invert(),l.copy(Et).sub(t.target),l.applyQuaternion(O),f.setFromVector3(l),t.autoRotate&&_===a.NONE&&H(ae()),t.enableDamping?(f.theta+=h.theta*t.dampingFactor,f.phi+=h.phi*t.dampingFactor):(f.theta+=h.theta,f.phi+=h.phi);let de=t.minAzimuthAngle,fe=t.maxAzimuthAngle;isFinite(de)&&isFinite(fe)&&(de<-Math.PI?de+=xe:de>Math.PI&&(de-=xe),fe<-Math.PI?fe+=xe:fe>Math.PI&&(fe-=xe),de<=fe?f.theta=Math.max(de,Math.min(fe,f.theta)):f.theta=f.theta>(de+fe)/2?Math.max(de,f.theta):Math.min(fe,f.theta)),f.phi=Math.max(t.minPolarAngle,Math.min(t.maxPolarAngle,f.phi)),f.makeSafe(),t.enableDamping===!0?t.target.addScaledVector(g,t.dampingFactor):t.target.add(g),t.zoomToCursor&&G||t.object.isOrthographicCamera?f.radius=x(f.radius):f.radius=x(f.radius*b),l.setFromSpherical(f),l.applyQuaternion(V),Et.copy(t.target).add(l),t.object.matrixAutoUpdate||t.object.updateMatrix(),t.object.lookAt(t.target),t.enableDamping===!0?(h.theta*=1-t.dampingFactor,h.phi*=1-t.dampingFactor,g.multiplyScalar(1-t.dampingFactor)):(h.set(0,0,0),g.set(0,0,0));let Ne=!1;if(t.zoomToCursor&&G){let Ae=null;if(t.object instanceof rt&&t.object.isPerspectiveCamera){const Te=l.length();Ae=x(Te*b);const Ue=Te-Ae;t.object.position.addScaledVector(C,Ue),t.object.updateMatrixWorld()}else if(t.object.isOrthographicCamera){const Te=new z(B.x,B.y,0);Te.unproject(t.object),t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/b)),t.object.updateProjectionMatrix(),Ne=!0;const Ue=new z(B.x,B.y,0);Ue.unproject(t.object),t.object.position.sub(Ue).add(Te),t.object.updateMatrixWorld(),Ae=l.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),t.zoomToCursor=!1;Ae!==null&&(t.screenSpacePanning?t.target.set(0,0,-1).transformDirection(t.object.matrix).multiplyScalar(Ae).add(t.object.position):(Ge.origin.copy(t.object.position),Ge.direction.set(0,0,-1).transformDirection(t.object.matrix),Math.abs(t.object.up.dot(Ge.direction))<Zn?o.lookAt(t.target):(At.setFromNormalAndCoplanarPoint(t.object.up,t.target),Ge.intersectPlane(At,t.target))))}else t.object instanceof We&&t.object.isOrthographicCamera&&(Ne=b!==1,Ne&&(t.object.zoom=Math.max(t.minZoom,Math.min(t.maxZoom,t.object.zoom/b)),t.object.updateProjectionMatrix()));return b=1,G=!1,Ne||J.distanceToSquared(t.object.position)>v||8*(1-me.dot(t.object.quaternion))>v?(t.dispatchEvent(r),J.copy(t.object.position),me.copy(t.object.quaternion),Ne=!1,!0):!1}})(),this.connect=l=>{t.domElement=l,t.domElement.style.touchAction="none",t.domElement.addEventListener("contextmenu",St),t.domElement.addEventListener("pointerdown",zt),t.domElement.addEventListener("pointercancel",Me),t.domElement.addEventListener("wheel",Pt)},this.dispose=()=>{var l,w,O,V,J,me;t.domElement&&(t.domElement.style.touchAction="auto"),(l=t.domElement)==null||l.removeEventListener("contextmenu",St),(w=t.domElement)==null||w.removeEventListener("pointerdown",zt),(O=t.domElement)==null||O.removeEventListener("pointercancel",Me),(V=t.domElement)==null||V.removeEventListener("wheel",Pt),(J=t.domElement)==null||J.ownerDocument.removeEventListener("pointermove",nt),(me=t.domElement)==null||me.ownerDocument.removeEventListener("pointerup",Me),t._domElementKeyEvents!==null&&t._domElementKeyEvents.removeEventListener("keydown",ot)};const t=this,r={type:"change"},c={type:"start"},u={type:"end"},a={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let _=a.NONE;const v=1e-6,f=new Mt,h=new Mt;let b=1;const g=new z,y=new te,P=new te,k=new te,N=new te,L=new te,d=new te,j=new te,I=new te,D=new te,C=new z,B=new te;let G=!1;const M=[],ne={};function ae(){return 2*Math.PI/60/60*t.autoRotateSpeed}function Q(){return Math.pow(.95,t.zoomSpeed)}function H(l){t.reverseOrbit||t.reverseHorizontalOrbit?h.theta+=l:h.theta-=l}function K(l){t.reverseOrbit||t.reverseVerticalOrbit?h.phi+=l:h.phi-=l}const oe=(()=>{const l=new z;return function(O,V){l.setFromMatrixColumn(V,0),l.multiplyScalar(-O),g.add(l)}})(),se=(()=>{const l=new z;return function(O,V){t.screenSpacePanning===!0?l.setFromMatrixColumn(V,1):(l.setFromMatrixColumn(V,0),l.crossVectors(t.object.up,l)),l.multiplyScalar(O),g.add(l)}})(),q=(()=>{const l=new z;return function(O,V){const J=t.domElement;if(J&&t.object instanceof rt&&t.object.isPerspectiveCamera){const me=t.object.position;l.copy(me).sub(t.target);let xe=l.length();xe*=Math.tan(t.object.fov/2*Math.PI/180),oe(2*O*xe/J.clientHeight,t.object.matrix),se(2*V*xe/J.clientHeight,t.object.matrix)}else J&&t.object instanceof We&&t.object.isOrthographicCamera?(oe(O*(t.object.right-t.object.left)/t.object.zoom/J.clientWidth,t.object.matrix),se(V*(t.object.top-t.object.bottom)/t.object.zoom/J.clientHeight,t.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),t.enablePan=!1)}})();function W(l){t.object instanceof rt&&t.object.isPerspectiveCamera||t.object instanceof We&&t.object.isOrthographicCamera?b=l:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),t.enableZoom=!1)}function Z(l){W(b/l)}function S(l){W(b*l)}function F(l){if(!t.zoomToCursor||!t.domElement)return;G=!0;const w=t.domElement.getBoundingClientRect(),O=l.clientX-w.left,V=l.clientY-w.top,J=w.width,me=w.height;B.x=O/J*2-1,B.y=-(V/me)*2+1,C.set(B.x,B.y,1).unproject(t.object).sub(t.object.position).normalize()}function x(l){return Math.max(t.minDistance,Math.min(t.maxDistance,l))}function s(l){y.set(l.clientX,l.clientY)}function E(l){F(l),j.set(l.clientX,l.clientY)}function R(l){N.set(l.clientX,l.clientY)}function U(l){P.set(l.clientX,l.clientY),k.subVectors(P,y).multiplyScalar(t.rotateSpeed);const w=t.domElement;w&&(H(2*Math.PI*k.x/w.clientHeight),K(2*Math.PI*k.y/w.clientHeight)),y.copy(P),t.update()}function re(l){I.set(l.clientX,l.clientY),D.subVectors(I,j),D.y>0?Z(Q()):D.y<0&&S(Q()),j.copy(I),t.update()}function Qe(l){L.set(l.clientX,l.clientY),d.subVectors(L,N).multiplyScalar(t.panSpeed),q(d.x,d.y),N.copy(L),t.update()}function an(l){F(l),l.deltaY<0?S(Q()):l.deltaY>0&&Z(Q()),t.update()}function sn(l){let w=!1;switch(l.code){case t.keys.UP:q(0,t.keyPanSpeed),w=!0;break;case t.keys.BOTTOM:q(0,-t.keyPanSpeed),w=!0;break;case t.keys.LEFT:q(t.keyPanSpeed,0),w=!0;break;case t.keys.RIGHT:q(-t.keyPanSpeed,0),w=!0;break}w&&(l.preventDefault(),t.update())}function bt(){if(M.length==1)y.set(M[0].pageX,M[0].pageY);else{const l=.5*(M[0].pageX+M[1].pageX),w=.5*(M[0].pageY+M[1].pageY);y.set(l,w)}}function wt(){if(M.length==1)N.set(M[0].pageX,M[0].pageY);else{const l=.5*(M[0].pageX+M[1].pageX),w=.5*(M[0].pageY+M[1].pageY);N.set(l,w)}}function It(){const l=M[0].pageX-M[1].pageX,w=M[0].pageY-M[1].pageY,O=Math.sqrt(l*l+w*w);j.set(0,O)}function rn(){t.enableZoom&&It(),t.enablePan&&wt()}function ln(){t.enableZoom&&It(),t.enableRotate&&bt()}function Dt(l){if(M.length==1)P.set(l.pageX,l.pageY);else{const O=it(l),V=.5*(l.pageX+O.x),J=.5*(l.pageY+O.y);P.set(V,J)}k.subVectors(P,y).multiplyScalar(t.rotateSpeed);const w=t.domElement;w&&(H(2*Math.PI*k.x/w.clientHeight),K(2*Math.PI*k.y/w.clientHeight)),y.copy(P)}function jt(l){if(M.length==1)L.set(l.pageX,l.pageY);else{const w=it(l),O=.5*(l.pageX+w.x),V=.5*(l.pageY+w.y);L.set(O,V)}d.subVectors(L,N).multiplyScalar(t.panSpeed),q(d.x,d.y),N.copy(L)}function kt(l){const w=it(l),O=l.pageX-w.x,V=l.pageY-w.y,J=Math.sqrt(O*O+V*V);I.set(0,J),D.set(0,Math.pow(I.y/j.y,t.zoomSpeed)),Z(D.y),j.copy(I)}function cn(l){t.enableZoom&&kt(l),t.enablePan&&jt(l)}function _n(l){t.enableZoom&&kt(l),t.enableRotate&&Dt(l)}function zt(l){var w,O;t.enabled!==!1&&(M.length===0&&((w=t.domElement)==null||w.ownerDocument.addEventListener("pointermove",nt),(O=t.domElement)==null||O.ownerDocument.addEventListener("pointerup",Me)),pn(l),l.pointerType==="touch"?dn(l):un(l))}function nt(l){t.enabled!==!1&&(l.pointerType==="touch"?fn(l):mn(l))}function Me(l){var w,O,V;hn(l),M.length===0&&((w=t.domElement)==null||w.releasePointerCapture(l.pointerId),(O=t.domElement)==null||O.ownerDocument.removeEventListener("pointermove",nt),(V=t.domElement)==null||V.ownerDocument.removeEventListener("pointerup",Me)),t.dispatchEvent(u),_=a.NONE}function un(l){let w;switch(l.button){case 0:w=t.mouseButtons.LEFT;break;case 1:w=t.mouseButtons.MIDDLE;break;case 2:w=t.mouseButtons.RIGHT;break;default:w=-1}switch(w){case Pe.DOLLY:if(t.enableZoom===!1)return;E(l),_=a.DOLLY;break;case Pe.ROTATE:if(l.ctrlKey||l.metaKey||l.shiftKey){if(t.enablePan===!1)return;R(l),_=a.PAN}else{if(t.enableRotate===!1)return;s(l),_=a.ROTATE}break;case Pe.PAN:if(l.ctrlKey||l.metaKey||l.shiftKey){if(t.enableRotate===!1)return;s(l),_=a.ROTATE}else{if(t.enablePan===!1)return;R(l),_=a.PAN}break;default:_=a.NONE}_!==a.NONE&&t.dispatchEvent(c)}function mn(l){if(t.enabled!==!1)switch(_){case a.ROTATE:if(t.enableRotate===!1)return;U(l);break;case a.DOLLY:if(t.enableZoom===!1)return;re(l);break;case a.PAN:if(t.enablePan===!1)return;Qe(l);break}}function Pt(l){t.enabled===!1||t.enableZoom===!1||_!==a.NONE&&_!==a.ROTATE||(l.preventDefault(),t.dispatchEvent(c),an(l),t.dispatchEvent(u))}function ot(l){t.enabled===!1||t.enablePan===!1||sn(l)}function dn(l){switch(Ct(l),M.length){case 1:switch(t.touches.ONE){case Se.ROTATE:if(t.enableRotate===!1)return;bt(),_=a.TOUCH_ROTATE;break;case Se.PAN:if(t.enablePan===!1)return;wt(),_=a.TOUCH_PAN;break;default:_=a.NONE}break;case 2:switch(t.touches.TWO){case Se.DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;rn(),_=a.TOUCH_DOLLY_PAN;break;case Se.DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;ln(),_=a.TOUCH_DOLLY_ROTATE;break;default:_=a.NONE}break;default:_=a.NONE}_!==a.NONE&&t.dispatchEvent(c)}function fn(l){switch(Ct(l),_){case a.TOUCH_ROTATE:if(t.enableRotate===!1)return;Dt(l),t.update();break;case a.TOUCH_PAN:if(t.enablePan===!1)return;jt(l),t.update();break;case a.TOUCH_DOLLY_PAN:if(t.enableZoom===!1&&t.enablePan===!1)return;cn(l),t.update();break;case a.TOUCH_DOLLY_ROTATE:if(t.enableZoom===!1&&t.enableRotate===!1)return;_n(l),t.update();break;default:_=a.NONE}}function St(l){t.enabled!==!1&&l.preventDefault()}function pn(l){M.push(l)}function hn(l){delete ne[l.pointerId];for(let w=0;w<M.length;w++)if(M[w].pointerId==l.pointerId){M.splice(w,1);return}}function Ct(l){let w=ne[l.pointerId];w===void 0&&(w=new te,ne[l.pointerId]=w),w.set(l.pageX,l.pageY)}function it(l){const w=l.pointerId===M[0].pointerId?M[1]:M[0];return ne[w.pointerId]}this.dollyIn=(l=Q())=>{S(l),t.update()},this.dollyOut=(l=Q())=>{Z(l),t.update()},this.getScale=()=>b,this.setScale=l=>{W(l),t.update()},this.getZoomScale=()=>Q(),i!==void 0&&this.connect(i),this.update()}};const Qn={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
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
  `},Un={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
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
  `},Gn=()=>parseInt(wn.replace(/\D+/g,"")),Wn=Gn(),Hn=p.forwardRef(({makeDefault:n,camera:o,regress:i,domElement:t,enableDamping:r=!0,keyEvents:c=!1,onChange:u,onStart:a,onEnd:_,...v},f)=>{const h=$(D=>D.invalidate),b=$(D=>D.camera),g=$(D=>D.gl),y=$(D=>D.events),P=$(D=>D.setEvents),k=$(D=>D.set),N=$(D=>D.get),L=$(D=>D.performance),d=o||b,j=t||y.connected||g.domElement,I=p.useMemo(()=>new Kn(d),[d]);return Ze(()=>{I.enabled&&I.update()},-1),p.useEffect(()=>(c&&I.connect(c===!0?j:c),I.connect(j),()=>void I.dispose()),[c,j,i,I,h]),p.useEffect(()=>{const D=G=>{h(),i&&L.regress(),u&&u(G)},C=G=>{a&&a(G)},B=G=>{_&&_(G)};return I.addEventListener("change",D),I.addEventListener("start",C),I.addEventListener("end",B),()=>{I.removeEventListener("start",C),I.removeEventListener("end",B),I.removeEventListener("change",D)}},[u,a,_,I,h,P]),p.useEffect(()=>{if(n){const D=N().controls;return k({controls:I}),()=>k({controls:D})}},[n,I]),p.createElement("primitive",Be({ref:f,object:I,enableDamping:r},v))}),$n=p.forwardRef(({children:n,domElement:o,onChange:i,onMouseDown:t,onMouseUp:r,onObjectChange:c,object:u,makeDefault:a,camera:_,enabled:v,axis:f,mode:h,translationSnap:b,rotationSnap:g,scaleSnap:y,space:P,size:k,showX:N,showY:L,showZ:d,...j},I)=>{const D=$(S=>S.controls),C=$(S=>S.gl),B=$(S=>S.events),G=$(S=>S.camera),M=$(S=>S.invalidate),ne=$(S=>S.get),ae=$(S=>S.set),Q=_||G,H=o||B.connected||C.domElement,K=p.useMemo(()=>new Yn(Q,H),[Q,H]),oe=p.useRef(null);p.useLayoutEffect(()=>(u?K.attach(u instanceof Ve?u:u.current):oe.current instanceof Ve&&K.attach(oe.current),()=>void K.detach()),[u,n,K]),p.useEffect(()=>{if(D){const S=F=>D.enabled=!F.value;return K.addEventListener("dragging-changed",S),()=>K.removeEventListener("dragging-changed",S)}},[K,D]);const se=p.useRef(),q=p.useRef(),W=p.useRef(),Z=p.useRef();return p.useLayoutEffect(()=>void(se.current=i),[i]),p.useLayoutEffect(()=>void(q.current=t),[t]),p.useLayoutEffect(()=>void(W.current=r),[r]),p.useLayoutEffect(()=>void(Z.current=c),[c]),p.useEffect(()=>{const S=E=>{M(),se.current==null||se.current(E)},F=E=>q.current==null?void 0:q.current(E),x=E=>W.current==null?void 0:W.current(E),s=E=>Z.current==null?void 0:Z.current(E);return K.addEventListener("change",S),K.addEventListener("mouseDown",F),K.addEventListener("mouseUp",x),K.addEventListener("objectChange",s),()=>{K.removeEventListener("change",S),K.removeEventListener("mouseDown",F),K.removeEventListener("mouseUp",x),K.removeEventListener("objectChange",s)}},[M,K]),p.useEffect(()=>{if(a){const S=ne().controls;return ae({controls:K}),()=>ae({controls:S})}},[a,K]),p.createElement(p.Fragment,null,p.createElement("primitive",{ref:I,object:K,enabled:v,axis:f,mode:h,translationSnap:b,rotationSnap:g,scaleSnap:y,space:P,size:k,showX:N,showY:L,showZ:d}),p.createElement("group",Be({ref:oe},j),n))}),qn=Mn({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new ve,sectionColor:new ve,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new z,worldPlanePosition:new z},`
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
      #include <${Wn>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),Jn=p.forwardRef(({args:n,cellColor:o="#000000",sectionColor:i="#2080ff",cellSize:t=.5,sectionSize:r=1,followCamera:c=!1,infiniteGrid:u=!1,fadeDistance:a=100,fadeStrength:_=1,fadeFrom:v=1,cellThickness:f=.5,sectionThickness:h=1,side:b=Gt,...g},y)=>{In({GridMaterial:qn});const P=p.useRef(null);p.useImperativeHandle(y,()=>P.current,[]);const k=new Ut,N=new z(0,1,0),L=new z(0,0,0);Ze(I=>{k.setFromNormalAndCoplanarPoint(N,L).applyMatrix4(P.current.matrixWorld);const D=P.current.material,C=D.uniforms.worldCamProjPosition,B=D.uniforms.worldPlanePosition;k.projectPoint(I.camera.position,C.value),B.value.set(0,0,0).applyMatrix4(P.current.matrixWorld)});const d={cellSize:t,sectionSize:r,cellColor:o,sectionColor:i,cellThickness:f,sectionThickness:h},j={fadeDistance:a,fadeStrength:_,fadeFrom:v,infiniteGrid:u,followCamera:c};return p.createElement("mesh",Be({ref:P,frustumCulled:!1},g),p.createElement("gridMaterial",Be({transparent:!0,"extensions-derivatives":!0,side:b},d,j)),p.createElement("planeGeometry",{args:n}))}),eo=p.forwardRef(({scale:n=10,frames:o=1/0,opacity:i=1,width:t=1,height:r=1,blur:c=1,near:u=0,far:a=10,resolution:_=512,smooth:v=!0,color:f="#000000",depthWrite:h=!1,renderOrder:b,...g},y)=>{const P=p.useRef(null),k=$(H=>H.scene),N=$(H=>H.gl),L=p.useRef(null);t=t*(Array.isArray(n)?n[0]:n||1),r=r*(Array.isArray(n)?n[1]:n||1);const[d,j,I,D,C,B,G]=p.useMemo(()=>{const H=new mt(_,_),K=new mt(_,_);K.texture.generateMipmaps=H.texture.generateMipmaps=!1;const oe=new pe(t,r).rotateX(Math.PI/2),se=new T(oe),q=new Dn;q.depthTest=q.depthWrite=!1,q.onBeforeCompile=S=>{S.uniforms={...S.uniforms,ucolor:{value:new ve(f)}},S.fragmentShader=S.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),S.fragmentShader=S.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const W=new qe(Qn),Z=new qe(Un);return Z.depthTest=W.depthTest=!1,[H,oe,q,se,W,Z,K]},[_,t,r,n,f]),M=H=>{D.visible=!0,D.material=C,C.uniforms.tDiffuse.value=d.texture,C.uniforms.h.value=H*1/256,N.setRenderTarget(G),N.render(D,L.current),D.material=B,B.uniforms.tDiffuse.value=G.texture,B.uniforms.v.value=H*1/256,N.setRenderTarget(d),N.render(D,L.current),D.visible=!1};let ne=0,ae,Q;return Ze(()=>{L.current&&(o===1/0||ne<o)&&(ne++,ae=k.background,Q=k.overrideMaterial,P.current.visible=!1,k.background=null,k.overrideMaterial=I,N.setRenderTarget(d),N.render(k,L.current),M(c),v&&M(c*.4),N.setRenderTarget(null),P.current.visible=!0,k.overrideMaterial=Q,k.background=ae)}),p.useImperativeHandle(y,()=>P.current,[]),p.createElement("group",Be({"rotation-x":Math.PI/2},g,{ref:P}),p.createElement("mesh",{renderOrder:b,geometry:j,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},p.createElement("meshBasicMaterial",{transparent:!0,map:d.texture,opacity:i,depthWrite:h})),p.createElement("orthographicCamera",{ref:L,args:[-t/2,t/2,r/2,-r/2,u,a]}))}),Y=({size:n=18,children:o,...i})=>e.jsx("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...i,children:o}),Re=n=>e.jsxs(Y,{...n,children:[e.jsx("path",{d:"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("circle",{cx:"12",cy:"12",r:"2.6",stroke:"currentColor",strokeWidth:"1.7"})]}),Ye=n=>e.jsxs(Y,{...n,children:[e.jsx("path",{d:"M4 4l16 16",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"}),e.jsx("path",{d:"M9.9 5.2A9.6 9.6 0 0 1 12 5c6 0 9.5 7 9.5 7a15.6 15.6 0 0 1-3.3 4M6.2 6.9A15 15 0 0 0 2.5 12S6 19 12 19a9 9 0 0 0 4-1",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),tt=n=>e.jsx(Y,{...n,children:e.jsx("path",{d:"M6 6l12 12M18 6L6 18",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),Ce=n=>e.jsx(Y,{...n,children:e.jsx("path",{d:"M12 5v14M5 12h14",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})}),xt=n=>e.jsx(Y,{...n,children:e.jsx("path",{d:"M7 10l5 5 5-5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),Wt=n=>e.jsx(Y,{...n,children:e.jsx("path",{d:"M5 12.5l4.2 4L19 7.5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),Ht=n=>e.jsx(Y,{...n,children:[8,12,16].map(o=>e.jsxs("g",{children:[e.jsx("circle",{cx:"9.4",cy:o,r:"1.15",fill:"currentColor"}),e.jsx("circle",{cx:"14.6",cy:o,r:"1.15",fill:"currentColor"})]},o))}),$t=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"11",cy:"11",r:"6.5",stroke:"currentColor",strokeWidth:"1.8"}),e.jsx("path",{d:"M15.8 15.8L20.5 20.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})]}),to=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"6",y:"10.5",width:"12",height:"8.5",rx:"2",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5",stroke:"currentColor",strokeWidth:"1.7"})]}),no=n=>e.jsx(Y,{...n,children:e.jsx("path",{d:"M13 2.5L5.5 13.5h5L10 21.5l8-11.5h-5.2L13 2.5Z",fill:"currentColor"})}),qt=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"3.5",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"13.1",y:"3.5",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"3.5",y:"13.1",width:"7.4",height:"7.4",rx:"1.6",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"13.1",y:"13.1",width:"7.4",height:"7.4",rx:"3.7",stroke:"currentColor",strokeWidth:"1.7"})]}),dt=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"12",r:"6.2",stroke:"currentColor",strokeWidth:"1.6",opacity:"0.9"}),e.jsx("circle",{cx:"12",cy:"12",r:"2.2",fill:"currentColor",opacity:"0.9"})]}),Ke=({id:n,from:o,to:i,vertical:t=!1})=>e.jsxs("linearGradient",{id:n,x1:"0",y1:"0",x2:t?"0":"1",y2:t?"1":"0",children:[e.jsx("stop",{offset:"0",stopColor:o}),e.jsx("stop",{offset:"1",stopColor:i})]}),oo=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"sm-rainbow",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#ff5f6d"}),e.jsx("stop",{offset:"0.35",stopColor:"#ffc371"}),e.jsx("stop",{offset:"0.65",stopColor:"#7ee8a2"}),e.jsx("stop",{offset:"1",stopColor:"#7aa8ff"})]})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-rainbow)"})]}),io=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsx(Ke,{id:"sm-normal",from:"#b48cff",to:"#4d7cff",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-normal)"}),e.jsx("circle",{cx:"9.4",cy:"9",r:"2.6",fill:"#ffffff",opacity:"0.35"})]}),ao=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsx(Ke,{id:"sm-depth",from:"#8f9bb3",to:"#39415a",vertical:!0})}),e.jsx("path",{d:"M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z",fill:"url(#sm-depth)"})]}),so=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsx(Ke,{id:"sm-gradient",from:"#f2f2f2",to:"#4a4a4a",vertical:!0})}),e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-gradient)"})]}),ro=n=>e.jsx(Y,{...n,children:[7.5,12,16.5].map(o=>e.jsx("path",{d:`M4 ${o}c2.4-2.6 4.8 2.6 7.2 0s4.8 2.6 8.8 0`,stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",fill:"none"},o))}),lo=n=>e.jsx(Y,{...n,children:e.jsx("circle",{cx:"12",cy:"12",r:"8",stroke:"currentColor",strokeWidth:"4.4",opacity:"0.85"})}),co=n=>e.jsxs(Y,{...n,children:[e.jsx("path",{d:"M12 3.5l7.4 4.3v8.4L12 20.5l-7.4-4.3V7.8L12 3.5Z",fill:"currentColor",opacity:"0.35"}),e.jsx("path",{d:"M12 7l4.3 2.5v5L12 17l-4.3-2.5v-5L12 7Z",fill:"currentColor",opacity:"0.9"})]}),_o=n=>e.jsx(Y,{...n,children:[7,12,17].map((o,i)=>e.jsx("g",{fill:"currentColor",opacity:.9-i*.18,children:[5,9.5,14,18.5].map((t,r)=>e.jsx("circle",{cx:t+i%2*1.4,cy:o+r%2*1.2-.6,r:"1.05"},t))},o))}),uo=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"13.5",r:"7.5",stroke:"#ff6b6b",strokeWidth:"1.9",fill:"none"}),e.jsx("circle",{cx:"12",cy:"15",r:"5",stroke:"#ffc94d",strokeWidth:"1.9",fill:"none"}),e.jsx("circle",{cx:"12",cy:"16.5",r:"2.6",stroke:"#5fd08a",strokeWidth:"1.9",fill:"none"})]}),mo=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.28"}),e.jsx("path",{d:"M12 3.6a8.4 8.4 0 0 1 0 16.8V3.6Z",fill:"currentColor",opacity:"0.95"})]}),fo=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.2",stroke:"currentColor",strokeWidth:"1.8"}),e.jsx("circle",{cx:"12",cy:"12",r:"4.6",stroke:"currentColor",strokeWidth:"1.8"})]}),po=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsx(Ke,{id:"sm-glass",from:"#eef7fb",to:"#9fc4d8",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-glass)",opacity:"0.9"}),e.jsx("path",{d:"M7.5 9.5c1-2 3.4-3.2 5.6-3",stroke:"#ffffff",strokeWidth:"1.8",strokeLinecap:"round",fill:"none"})]}),ho=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsx(Ke,{id:"sm-reflect",from:"#f5f9ff",to:"#5b7ea8",vertical:!0})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-reflect)"}),e.jsx("path",{d:"M6.5 13.5c3.5-1.2 7.5-1.2 11 0",stroke:"#ffffff",strokeWidth:"1.6",opacity:"0.7",fill:"none"})]}),vo=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"sm-matcap",cx:"0.35",cy:"0.3",r:"0.95",children:[e.jsx("stop",{offset:"0",stopColor:"#ffffff"}),e.jsx("stop",{offset:"0.55",stopColor:"#b9b9b9"}),e.jsx("stop",{offset:"1",stopColor:"#5c5c5c"})]})}),e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"url(#sm-matcap)"})]}),yo=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"12",r:"8.4",fill:"currentColor",opacity:"0.3"}),[[8.5,8.5],[13.5,7.5],[16.5,11.5],[10.5,13],[14.5,16],[8,15.5]].map(([o,i])=>e.jsx("circle",{cx:o,cy:i,r:"1.5",fill:"currentColor"},`${o}-${i}`))]}),xo=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16",stroke:"currentColor",strokeWidth:"1.5",opacity:"0.85"})]}),go=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"sm-vertex",x1:"0",y1:"0",x2:"1",y2:"1",children:[e.jsx("stop",{offset:"0",stopColor:"#ff8f6b"}),e.jsx("stop",{offset:"0.5",stopColor:"#ffd36b"}),e.jsx("stop",{offset:"1",stopColor:"#6bc9ff"})]})}),e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"4.5",fill:"url(#sm-vertex)"})]}),bo=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("rect",{x:"8",y:"8",width:"8",height:"8",rx:"2",fill:"currentColor",opacity:"0.55"})]}),wo=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7"}),e.jsx("path",{d:"M10.2 8.8l5 3.2-5 3.2V8.8Z",fill:"currentColor",opacity:"0.85"})]}),Io=n=>e.jsxs(Y,{...n,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"3.5",stroke:"currentColor",strokeWidth:"1.7",opacity:"0.7"}),e.jsx("path",{d:"M12 7l1.3 3.7L17 12l-3.7 1.3L12 17l-1.3-3.7L7 12l3.7-1.3L12 7Z",fill:"currentColor"})]}),Do=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"12",cy:"12",r:"4",fill:"currentColor"}),e.jsx("circle",{cx:"12",cy:"12",r:"7.4",stroke:"currentColor",strokeWidth:"1.6",opacity:"0.45"}),e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"1.2",opacity:"0.2"})]}),jo=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"9",cy:"12",r:"6.2",fill:"currentColor",opacity:"0.85"}),e.jsx("circle",{cx:"14",cy:"12",r:"6.2",fill:"currentColor",opacity:"0.4"})]}),ko=n=>e.jsxs(Y,{...n,children:[e.jsx("circle",{cx:"9.4",cy:"12",r:"6.4",fill:"#ff5f6d",opacity:"0.65"}),e.jsx("circle",{cx:"12",cy:"12",r:"6.4",fill:"#5fd08a",opacity:"0.5"}),e.jsx("circle",{cx:"14.6",cy:"12",r:"6.4",fill:"#5b8cff",opacity:"0.65"})]}),zo=n=>e.jsxs(Y,{...n,children:[e.jsx("defs",{children:e.jsxs("radialGradient",{id:"sm-vignette",cx:"0.5",cy:"0.5",r:"0.55",children:[e.jsx("stop",{offset:"0",stopColor:"currentColor",stopOpacity:"0"}),e.jsx("stop",{offset:"1",stopColor:"currentColor",stopOpacity:"0.95"})]})}),e.jsx("rect",{x:"3.5",y:"3.5",width:"17",height:"17",rx:"4",fill:"url(#sm-vignette)"})]}),Po=n=>e.jsx(Y,{...n,children:[[6,7],[11,5.5],[16,8],[8,12],[13,11],[18,13],[6,17],[11,16],[16,18]].map(([o,i],t)=>e.jsx("circle",{cx:o,cy:i,r:t%3===0?1.4:.95,fill:"currentColor",opacity:.5+t%3*.2},t))}),So=n=>e.jsx(Y,{...n,children:Array.from({length:18},(o,i)=>e.jsx("rect",{x:4+i%6*3,y:4+Math.floor(i/6)*5+i%2,width:"2.1",height:"2.1",fill:"currentColor",opacity:.25+i%4*.2},i))}),Co=n=>e.jsx(Y,{...n,children:[[0,0,.9],[1,0,.5],[2,0,.3],[0,1,.5],[1,1,.95],[2,1,.45],[0,2,.3],[1,2,.5],[2,2,.85]].map(([o,i,t],r)=>e.jsx("rect",{x:4.5+o*5,y:4.5+i*5,width:"4.4",height:"4.4",fill:"currentColor",opacity:t},r))}),Eo=n=>e.jsxs(Y,{...n,children:[[12,8,16].map((o,i)=>e.jsx("path",{d:`M4 ${o}h16`,stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",opacity:.4+i*.25},o)),e.jsx("circle",{cx:"14",cy:"8",r:"2.5",fill:"currentColor"}),e.jsx("circle",{cx:"9",cy:"12",r:"2.5",fill:"currentColor"}),e.jsx("circle",{cx:"15",cy:"16",r:"2.5",fill:"currentColor"})]}),Mo=n=>e.jsx(Y,{...n,children:e.jsx("rect",{x:"4.5",y:"4.5",width:"15",height:"15",rx:"4",stroke:"currentColor",strokeWidth:"2.6"})}),No=n=>e.jsxs(Y,{...n,children:[e.jsx("path",{d:"M5 8.2h9l-2.4 3H19l-3.4 3.6H4.6L7 11.8H3.2L5 8.2Z",fill:"currentColor",opacity:"0.9"}),e.jsx("path",{d:"M8 18h8M10.5 4.5h5",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),lt={bloom:Do,blur:jo,chromatic:ko,vignette:zo,grain:Po,noise:So,pixelate:Co,colorAdjust:Eo,outline:Mo,glitch:No},ft={aiTexture:Io,image:bo,video:wo,color:oo,depth:ao,normal:io,gradient:so,noise:ro,fresnel:lo,cavity:co,dust:_o,rainbow:uo,toon:mo,outline:fo,glass:po,reflection:ho,matcap:vo,displace:yo,pattern:xo,vertexColor:go};function Ee(n){const o=p.useRef(null);return p.useEffect(()=>{const i=t=>{o.current&&!o.current.contains(t.target)&&n()};return window.addEventListener("mousedown",i),()=>window.removeEventListener("mousedown",i)},[n]),o}const _e=n=>{if(!n)return{top:120,left:window.innerWidth-340};const o=n.getBoundingClientRect();return{top:o.top,left:o.left}},ue=({value:n,prefix:o,step:i=.1,width:t,onChange:r,className:c})=>{const[u,a]=p.useState(String(n)),[_,v]=p.useState(!1);p.useEffect(()=>{_||a(String(n))},[n,_]);const f=h=>{const b=parseFloat(h);Number.isFinite(b)?r(b):a(String(n))};return e.jsxs("span",{className:`ninput ${c??""}`,style:t?{width:t}:void 0,children:[o?e.jsx("span",{className:"ninput-prefix",children:o}):null,e.jsx("input",{value:u,step:i,onChange:h=>{a(h.target.value),f(h.target.value)},onFocus:()=>v(!0),onBlur:()=>{v(!1),f(u)},onKeyDown:h=>{h.key==="Enter"&&h.target.blur()}})]})},Lt=({value:n,prefixes:o,step:i,onChange:t})=>e.jsx("span",{className:"vec",children:o.map((r,c)=>e.jsx(ue,{value:n[c]??0,prefix:r,step:i,onChange:u=>{const a=[...n];a[c]=u,t(a)}},r+c))}),Ao=({value:n,onChange:o,percent:i})=>e.jsxs("span",{className:"colorfield",children:[e.jsxs("label",{className:"swatch",children:[e.jsx("span",{style:{background:n}}),e.jsx("input",{type:"color",value:n,onChange:t=>o(t.target.value)})]}),e.jsx("span",{className:"hexbox",children:e.jsx("input",{value:n.replace("#","").toUpperCase(),onChange:t=>o(`#${t.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}),i?e.jsx("span",{className:"ninput pct",children:e.jsx("input",{value:"100%",readOnly:!0})}):null]}),To=({value:n,onChange:o})=>{const i=p.useRef(null);return e.jsxs("span",{className:"texture-input",children:[e.jsxs("span",{className:`swatch texture ${n?"has":""}`,onClick:()=>{var t;return(t=i.current)==null?void 0:t.click()},title:n?"更换图片":"上传图片",children:[n?e.jsx("span",{className:"texture-thumb",children:e.jsx("img",{src:n,alt:""})}):e.jsx("span",{className:"texture-plus",children:"+"}),e.jsx("input",{ref:i,type:"file",accept:"image/*",onChange:t=>{var u;const r=(u=t.target.files)==null?void 0:u[0];if(!r)return;const c=new FileReader;c.onload=()=>o(String(c.result??"")),c.readAsDataURL(r),t.target.value=""}})]}),n?e.jsx("button",{className:"iconbtn",title:"清除贴图",onClick:()=>o(""),children:"✕"}):null]})},Fe=({value:n,options:o,onChange:i})=>e.jsx("span",{className:"segmented",children:o.map(t=>e.jsx("button",{className:t===n?"on":"",onClick:()=>i(t),children:t[0].toUpperCase()+t.slice(1)},t))}),je=({value:n,options:o,onChange:i,placeholder:t,style:r})=>{const[c,u]=p.useState(!1),a=Ee(()=>u(!1)),_=o.find(v=>v.value===n);return e.jsxs("div",{className:"dropdown",style:r,ref:a,children:[e.jsxs("button",{className:"dropdown-btn",onClick:()=>u(v=>!v),children:[e.jsx("span",{children:(_==null?void 0:_.label)??t??n}),e.jsx(xt,{size:14})]}),c?e.jsx("div",{className:"dropdown-menu",children:o.map(v=>e.jsx("button",{className:v.value===n?"on":"",onClick:()=>{i(v.value),u(!1)},children:v.label},v.value))}):null]})},Lo=({title:n,anchor:o,width:i=440,onClose:t,children:r})=>{const c=Ee(t),u={left:Math.max(12,o.left-i-14),top:Math.min(Math.max(12,o.top-8),Math.max(window.innerHeight-360,12)),width:i};return e.jsxs("div",{className:"popup",style:u,ref:c,children:[e.jsxs("header",{children:[e.jsx("h3",{children:n}),e.jsx("button",{className:"iconbtn",onClick:t,children:e.jsx(tt,{size:16})})]}),e.jsx("div",{className:"popup-body",children:r})]})},Oo=[{key:"brightness",label:"Brightness",type:"number",step:.02,group:0},{key:"contrast",label:"Contrast",type:"number",step:.02,group:0},{key:"saturation",label:"Saturation",type:"number",step:.02,group:0},{key:"hue",label:"Hue",type:"number",step:.01,group:0}],et={bloom:{label:"Bloom",icon:"bloom",defaults:{threshold:.72,intensity:.5,blur:1.4},fields:[{key:"threshold",label:"Threshold",type:"number",step:.02,group:0},{key:"intensity",label:"Intensity",type:"number",step:.02,group:0},{key:"blur",label:"Blur",type:"number",step:.05,group:0}]},blur:{label:"Blur",icon:"blur",defaults:{amount:4},fields:[{key:"amount",label:"Amount",type:"number",step:.2,group:0}]},chromatic:{label:"Chromatic",icon:"chromatic",defaults:{amount:.15},fields:[{key:"amount",label:"Amount",type:"number",step:.01,group:0}]},vignette:{label:"Vignette",icon:"vignette",defaults:{offset:.32,darkness:.6},fields:[{key:"offset",label:"Offset",type:"number",step:.02,group:0},{key:"darkness",label:"Darkness",type:"number",step:.02,group:0}]},grain:{label:"Grain",icon:"grain",defaults:{intensity:.28,size:1.4,animated:"on"},fields:[{key:"intensity",label:"Intensity",type:"number",step:.02,group:0},{key:"size",label:"Size",type:"number",step:.1,group:0},{key:"animated",label:"Animated",type:"segment",options:["on","off"],group:1}]},noise:{label:"Noise",icon:"noise",defaults:{intensity:.22},fields:[{key:"intensity",label:"Intensity",type:"number",step:.02,group:0}]},pixelate:{label:"Pixelate",icon:"pixelate",defaults:{pixelSize:10},fields:[{key:"pixelSize",label:"Pixel Size",type:"number",step:1,group:0}]},colorAdjust:{label:"Color Adjust",icon:"colorAdjust",defaults:{brightness:0,contrast:1,saturation:1,hue:0},fields:Oo},outline:{label:"Outline",icon:"outline",defaults:{color:"#101014",threshold:.22,thickness:1.4},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"threshold",label:"Threshold",type:"number",step:.02,group:0},{key:"thickness",label:"Thickness",type:"number",step:.1,group:0}]},glitch:{label:"Glitch",icon:"glitch",defaults:{amount:.2,speed:1},fields:[{key:"amount",label:"Amount",type:"number",step:.02,group:0},{key:"speed",label:"Speed",type:"number",step:.1,group:0}]}},Ro=["bloom","blur","chromatic","vignette","grain","noise","pixelate","colorAdjust","outline","glitch"];let Yo=0;const Fo=()=>`e${++Yo}_${Math.random().toString(36).slice(2,6)}`,gt=(n,o={})=>{const i=et[n];return{id:Fo(),kind:n,name:i.label,visible:!0,opacity:100,params:{...i.defaults},...o}},Vo=()=>[gt("bloom")],Ot={bloom:"让画面中亮的部分晕开发光",blur:"整画面柔焦模糊",chromatic:"镜头色散：边缘红蓝重影",vignette:"镜头暗角：四周压暗",grain:"胶片颗粒质感",noise:"整屏彩色雪花噪点",pixelate:"马赛克像素风",colorAdjust:"调亮度 / 对比 / 饱和 / 色相",outline:"按明暗交界描一圈线",glitch:"信号故障式的画面撕裂"},Xo={"bloom.threshold":"多亮的部分才算发光","bloom.intensity":"光晕强度","bloom.blur":"光晕扩散范围","blur.amount":"模糊程度","chromatic.amount":"红蓝错位幅度","vignette.offset":"暗角从多大范围开始","vignette.darkness":"暗角浓度","grain.intensity":"颗粒强度","grain.size":"颗粒粗细","grain.animated":"颗粒是否每帧闪动","noise.intensity":"噪点浓度","pixelate.pixelSize":"马赛克格子大小","colorAdjust.brightness":"整体提亮或压暗","colorAdjust.contrast":"明暗对比强度","colorAdjust.saturation":"颜色鲜艳程度","colorAdjust.hue":"整体转动色相","outline.color":"描边颜色","outline.threshold":"描边灵敏度","outline.thickness":"描边粗细","glitch.amount":"撕裂位移大小","glitch.speed":"撕裂闪动频率"},Bo=n=>n.spec.effects.map(({kind:o,overrides:i})=>gt(o,i)),ge=(n,o,i,t)=>({id:n,name:o,category:"Stack",swatch:i,spec:{effects:t}}),Zo=[ge("cinematic","Cinematic",["#3a4a58","#12181e"],[{kind:"colorAdjust",overrides:{params:{brightness:-.02,contrast:1.18,saturation:.86,hue:0}}},{kind:"vignette",overrides:{opacity:80,params:{offset:.38,darkness:.55}}},{kind:"grain",overrides:{opacity:55,params:{intensity:.16,size:1.6,animated:"on"}}}]),ge("dreamy","Dreamy",["#ffe3f0","#b89fd9"],[{kind:"bloom",overrides:{params:{threshold:.45,intensity:1.15,blur:2.2}}},{kind:"chromatic",overrides:{opacity:45,params:{amount:.08}}},{kind:"grain",overrides:{opacity:35,params:{intensity:.1,size:2,animated:"on"}}}]),ge("retro-vhs","Retro VHS",["#4a3ad9","#d93a6e"],[{kind:"noise",overrides:{opacity:55,params:{intensity:.3}}},{kind:"chromatic",overrides:{params:{amount:.22}}},{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.08,saturation:1.3,hue:.02}}},{kind:"glitch",overrides:{opacity:70,params:{amount:.24,speed:.8}}}]),ge("noir","Noir",["#2c2c2c","#0a0a0a"],[{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.35,saturation:.05,hue:0}}},{kind:"grain",overrides:{params:{intensity:.3,size:1.2,animated:"on"}}},{kind:"vignette",overrides:{params:{offset:.45,darkness:.75}}}]),ge("neon-night","Neon Night",["#7a2ee8","#2ee8d9"],[{kind:"colorAdjust",overrides:{params:{brightness:-.05,contrast:1.15,saturation:1.45,hue:.55}}},{kind:"bloom",overrides:{params:{threshold:.5,intensity:1.2,blur:1.6}}},{kind:"chromatic",overrides:{opacity:60,params:{amount:.12}}},{kind:"vignette",overrides:{opacity:70,params:{offset:.3,darkness:.6}}}]),ge("pixel-art","Pixel Art",["#8ae06b","#2f6e3c"],[{kind:"pixelate",overrides:{params:{pixelSize:28}}},{kind:"colorAdjust",overrides:{params:{brightness:0,contrast:1.1,saturation:1.25,hue:0}}}]),ge("film-35mm","Film 35mm",["#d9c9a8","#4a3f30"],[{kind:"grain",overrides:{params:{intensity:.22,size:1.8,animated:"on"}}},{kind:"vignette",overrides:{opacity:65,params:{offset:.32,darkness:.45}}},{kind:"bloom",overrides:{opacity:45,params:{threshold:.68,intensity:.5,blur:1.8}}}]),ge("frost","Frost",["#cfe8f2","#6e93a8"],[{kind:"blur",overrides:{params:{amount:6}}},{kind:"bloom",overrides:{opacity:70,params:{threshold:.55,intensity:.9,blur:2}}},{kind:"colorAdjust",overrides:{opacity:80,params:{brightness:.03,contrast:.96,saturation:.9,hue:0}}}])],Ko=["normal","add","subtract","multiply","screen","overlay","softlight","lighten","darken","divide","reflect","negation"],Jt={normal:"Normal",add:"Add",subtract:"Subtract",multiply:"Multiply",screen:"Screen",overlay:"Overlay",softlight:"Soft Light",lighten:"Lighten",darken:"Darken",divide:"Divide",reflect:"Reflect",negation:"Negation"},Qo=[{key:"mode",label:"Mode",type:"segment",options:["mask","color"],group:0},{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:1},{key:"size",label:"Size",type:"vec3",prefix:"XYZ",group:1},{key:"scale",label:"Scale",type:"number",prefix:"S",step:.1,group:1},{key:"movement",label:"Movement",type:"number",prefix:"M",step:.1,group:1},{key:"colorA",label:"Color",type:"color",group:1},{key:"colorB",label:"Color",type:"color",group:1},{key:"colorC",label:"Color",type:"color",group:1},{key:"colorD",label:"Color",type:"color",group:1},{key:"distortion",label:"Distortion",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorA",label:"FactorA",type:"vec2",prefix:"XY",step:.1,group:2},{key:"factorB",label:"FactorB",type:"vec2",prefix:"XY",step:.1,group:2}],De={aiTexture:{label:"AI Texture",icon:"aiTexture",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},image:{label:"Image",icon:"image",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},video:{label:"Video",icon:"video",defaults:{map:"",tint:"#ffffff",scale:1},fields:[{key:"map",label:"Image",type:"texture",group:0},{key:"tint",label:"Tint",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:1}]},color:{label:"Color",icon:"color",hexKey:"color",defaults:{color:"#54545e"},fields:[{key:"color",label:"Color",type:"color",group:0}]},depth:{label:"Depth",icon:"depth",defaults:{colorA:"#ffffff",colorB:"#1c1c1c",near:2,far:10},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"near",label:"Near",type:"number",step:.1,group:0},{key:"far",label:"Far",type:"number",step:.5,group:0}]},normal:{label:"Normal",icon:"normal",defaults:{direction:[1,1,1],tint:"#ffffff"},fields:[{key:"direction",label:"Direction",type:"vec3",prefix:"XYZ",step:.1,group:0},{key:"tint",label:"Tint",type:"color",group:0}]},gradient:{label:"Gradient",icon:"gradient",defaults:{colorA:"#ffffff",colorB:"#232323",axes:"y",start:-1,end:1,contrast:1},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"axes",label:"Axes",type:"select",options:["x","y","z"],group:0},{key:"start",label:"Start",type:"number",step:.1,group:1},{key:"end",label:"End",type:"number",step:.1,group:1},{key:"contrast",label:"Contrast",type:"number",step:.1,group:1}]},noise:{label:"Noise",icon:"noise",defaults:{mode:"color",type:"simplex",size:[100,100,100],scale:1,movement:1,colorA:"#666666",colorB:"#666666",colorC:"#ffffff",colorD:"#ffffff",distortion:[1,1],factorA:[1.7,9.2],factorB:[8.3,2.8]},fields:Qo},fresnel:{label:"Fresnel",icon:"fresnel",defaults:{color:"#ffffff",power:3,intensity:1,bias:0},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0},{key:"intensity",label:"Intensity",type:"number",step:.1,group:0},{key:"bias",label:"Bias",type:"number",step:.05,group:0}]},cavity:{label:"Cavity",icon:"cavity",defaults:{scale:2.5,threshold:.55,strength:.8},fields:[{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"threshold",label:"Threshold",type:"number",step:.05,group:0},{key:"strength",label:"Strength",type:"number",step:.05,group:0}]},dust:{label:"Dust",icon:"dust",defaults:{color:"#ffffff",scale:14,coverage:.18},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0},{key:"coverage",label:"Coverage",type:"number",step:.02,group:0}]},rainbow:{label:"Rainbow",icon:"rainbow",defaults:{hueShift:0,saturation:.75},fields:[{key:"hueShift",label:"Hue Shift",type:"number",step:.05,group:0},{key:"saturation",label:"Saturation",type:"number",step:.05,group:0}]},toon:{label:"Toon",icon:"toon",defaults:{color:"#ff9060",steps:3},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"steps",label:"Steps",type:"number",step:1,group:0}]},outline:{label:"Outline",icon:"outline",defaults:{color:"#101010",width:.08,threshold:.32},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"width",label:"Width",type:"number",step:.01,group:0},{key:"threshold",label:"Threshold",type:"number",step:.02,group:0}]},glass:{label:"Glass",icon:"glass",defaults:{color:"#ffffff",transmission:.92,refraction:1.14,thickness:.55,aberration:.05,roughness:.08},fields:[{key:"color",label:"Color",type:"color",group:0},{key:"transmission",label:"Transmission",type:"number",step:.02,group:0},{key:"refraction",label:"Refraction",type:"number",step:.01,group:1},{key:"thickness",label:"Thickness",type:"number",step:.05,group:1},{key:"aberration",label:"Aberration",type:"number",step:.01,group:1},{key:"roughness",label:"Blur",type:"number",step:.01,group:2}]},reflection:{label:"Reflection",icon:"reflection",defaults:{sky:"#bcd6ff",ground:"#3a2f2a",power:1.2},fields:[{key:"sky",label:"Sky",type:"color",group:0},{key:"ground",label:"Ground",type:"color",group:0},{key:"power",label:"Power",type:"number",step:.1,group:0}]},matcap:{label:"Matcap",icon:"matcap",defaults:{light:"#f2f2f2",dark:"#3c3c3c",rim:.6},fields:[{key:"light",label:"Light",type:"color",group:0},{key:"dark",label:"Dark",type:"color",group:0},{key:"rim",label:"Rim",type:"number",step:.05,group:0}]},displace:{label:"Displace",icon:"displace",defaults:{strength:.22,scale:2.4,offset:[0,0,0],type:"simplex"},fields:[{key:"type",label:"Type",type:"select",options:["perlin","simplex","cell","white","curl"],group:0},{key:"strength",label:"Strength",type:"number",step:.01,group:0},{key:"scale",label:"Scale",type:"number",step:.1,group:0},{key:"offset",label:"Offset",type:"vec3",prefix:"XYZ",step:.1,group:0}]},pattern:{label:"Pattern",icon:"pattern",defaults:{colorA:"#e8e8e8",colorB:"#3a3a3a",scale:8,pattern:"checker"},fields:[{key:"pattern",label:"Type",type:"select",options:["checker","stripes"],group:0},{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0},{key:"scale",label:"Scale",type:"number",step:.5,group:0}]},vertexColor:{label:"Vertex Color",icon:"vertexColor",defaults:{colorA:"#7fe0c3",colorB:"#7f9fe0"},fields:[{key:"colorA",label:"Color A",type:"color",group:0},{key:"colorB",label:"Color B",type:"color",group:0}]}},Uo=["aiTexture","image","video","color","depth","normal","gradient","noise","fresnel","cavity","dust","rainbow","toon","outline","glass","reflection","matcap","displace","pattern","vertexColor"],en={enabled:!0,strength:100,type:"physical",color:"#ffffff",shining:48,roughness:.16,metalness:0,reflectivity:1,glass:0,aberration:.05,thickness:.5,refraction:1.12,blur:.1,bumpMap:"none",occlusion:!0},Go=[{key:"type",label:"Type",type:"select",options:["lambert","phong","physical","toon"],group:0},{key:"color",label:"Color",type:"color",group:0},{key:"shining",label:"Shining",type:"number",step:1,group:0},{key:"roughness",label:"Roughness",type:"number",step:.01,group:1},{key:"metalness",label:"Metalness",type:"number",step:.01,group:1},{key:"reflectivity",label:"Reflectivity",type:"number",step:.05,group:1},{key:"glass",label:"Glass",type:"number",step:.02,group:1},{key:"aberration",label:"Aberration",type:"number",step:.01,group:2},{key:"thickness",label:"Thickness",type:"number",step:.05,group:2},{key:"refraction",label:"Refraction",type:"number",step:.01,group:2},{key:"blur",label:"Blur",type:"number",step:.01,group:2},{key:"bumpMap",label:"Bump Map",type:"select",options:["none","noise"],group:3},{key:"occlusion",label:"Occlusion",type:"segment",options:["on","off"],group:3}],Wo={enabled:!0,preset:"studio",exposure:1,rotation:0},Ho={enabled:!0,intensity:1,color:"#ffffff",ambient:.75};let $o=0;const qo=()=>`l${++$o}_${Math.random().toString(36).slice(2,6)}`,ye=(n,o={})=>{const i=De[n];return{id:qo(),kind:n,name:i.label,mode:"normal",visible:!0,opacity:100,params:{...i.defaults,...o.params??{}},...o}},Jo=()=>({opacity:100,layers:[ye("color"),ye("noise")],lighting:{...en},env:{...Wo},wireframe:!1,shading:"normal",sides:"front",shadows:"castreceive",collision:"visibility"}),ct={aiTexture:"用一张图片（比如 AI 生成的图）贴在表面",image:"上传本地图片作为表面贴图",video:"视频贴图占位：当前与 Image 相同方式采样",color:"一层纯色底",depth:"按远近距离混合两种颜色",normal:"把表面朝向显示成颜色，常用于调试或科技感",gradient:"两种颜色沿一个方向渐变过渡",noise:"程序噪声混四色，做大理石 / 云雾 / 流动纹理",fresnel:"物体边缘发亮，像逆光时的轮廓光",cavity:"往凹缝处压暗，强调磨损细节",dust:"在表面撒一层细小颗粒",rainbow:"按位置铺开彩虹色相",toon:"卡通式分档明暗",outline:"在轮廓边缘画一圈描边",glass:"透明玻璃，带折射、厚度与色散",reflection:"像镜面一样反射一个虚拟天空",matcap:"固定打光的球面材质，快速获得金属 / 陶瓷感",displace:"真实挤出表面凹凸（改变几何形状）",pattern:"棋盘格或条纹的程序图案",vertexColor:"按表面朝向上下混合两种颜色",lighting:"决定表面的打光方式与反射质感"},Rt={"image.map":"点击方块选一张本地图片","image.tint":"给贴图叠色，白色 = 原色","image.scale":"贴图重复密度，越大越密","video.map":"点击方块选一张本地图片","video.tint":"给贴图叠色，白色 = 原色","video.scale":"贴图重复密度，越大越密","aiTexture.map":"点击方块选一张本地图片","aiTexture.tint":"给贴图叠色，白色 = 原色","aiTexture.scale":"贴图重复密度，越大越密","color.color":"物体的基础颜色","depth.colorA":"近处的颜色","depth.colorB":"远处的颜色","depth.near":"从多近开始过渡","depth.far":"到多远完全变成远色","normal.direction":"X / Y / Z 三个方向的强度","normal.tint":"整体亮度与染色","gradient.colorA":"渐变起点的颜色","gradient.colorB":"渐变终点的颜色","gradient.axes":"渐变沿哪个轴铺开","gradient.start":"渐变开始的位置","gradient.end":"渐变结束的位置","gradient.contrast":"分界的生硬程度","noise.mode":"Color = 当颜色画；Mask = 只控制透明度","noise.type":"噪声花纹的风格","noise.size":"X / Y / Z 方向的纹理密度","noise.scale":"整体缩放，越大纹理越细","noise.movement":"流动速度，0 = 静止","noise.colorA":"最暗处的颜色","noise.colorB":"偏暗处的颜色","noise.colorC":"偏亮处的颜色","noise.colorD":"最亮处的颜色","noise.distortion":"把纹理扭歪（X = 强度，Y = 频率）","noise.factorA":"细节层的强度与频率","noise.factorB":"第二层细节的强度与频率","fresnel.color":"边缘光的颜色","fresnel.power":"边缘范围收得多细，越大越细","fresnel.intensity":"边缘光亮度","fresnel.bias":"整体加亮的底量","cavity.scale":"裂缝纹理大小","cavity.threshold":"判定凹缝的范围","cavity.strength":"凹缝压暗的程度","dust.color":"颗粒颜色","dust.scale":"颗粒密集程度","dust.coverage":"被颗粒覆盖的比例","rainbow.hueShift":"整体转动色相","rainbow.saturation":"颜色鲜艳程度","toon.color":"卡通底色","toon.steps":"明暗分几档，越大过渡越多","outline.color":"描边颜色","outline.width":"描边粗细","outline.threshold":"多大转角才出描边","glass.color":"玻璃的染色","glass.transmission":"透过程，1 = 全透","glass.refraction":"折射弯折程度","glass.thickness":"厚度感，越厚颜色越重","glass.aberration":"边缘红蓝分离（色散）","glass.roughness":"毛玻璃模糊程度","reflection.sky":"反射中的天空色","reflection.ground":"反射中的地面色","reflection.power":"上下过渡的对比","matcap.light":"受光面的颜色","matcap.dark":"背光面的颜色","matcap.rim":"边缘高光强度","displace.type":"凹凸花纹的风格","displace.strength":"凹凸深度","displace.scale":"凹凸密度","displace.offset":"花纹的整体偏移","pattern.pattern":"格子还是条纹","pattern.colorA":"第一格的颜色","pattern.colorB":"第二格的颜色","pattern.scale":"图案大小，越大越密","vertexColor.colorA":"朝上部分的颜色","vertexColor.colorB":"朝下部分的颜色","lighting.type":"打光模型：从简单到物理","lighting.color":"高光的颜色","lighting.shining":"高光锐利程度，越大光斑越小","lighting.roughness":"表面粗糙度，0 = 镜面","lighting.metalness":"金属度，1 = 纯金属","lighting.reflectivity":"环境反射强度","lighting.glass":"玻璃感，0 = 实体，1 = 全透明","lighting.aberration":"玻璃边缘红蓝分离（色散）","lighting.thickness":"玻璃厚度感，越厚颜色越重","lighting.refraction":"折射弯折程度","lighting.blur":"玻璃的磨砂模糊","lighting.bumpMap":"用噪声给表面加细凹凸","lighting.occlusion":"边缘环境光遮蔽"},ei=n=>{const o=n.spec;return{opacity:o.opacity??100,layers:o.layers.map(({kind:i,overrides:t})=>ye(i,t)),lighting:{enabled:!0,strength:100,type:"physical",color:"#ffffff",shining:48,roughness:.16,metalness:0,reflectivity:1,bumpMap:"none",occlusion:!0,...o.lighting??{}}}},ie=(n,o,i,t,r,c=!0)=>({id:n,name:o,library:"spline",category:i,swatch:t,locked:c,spec:r}),be=(n,o,i,t)=>ie(`candy-${n}`,o,"Candy",[i,t],{layers:[{kind:"color",overrides:{params:{color:i}}},{kind:"fresnel",overrides:{opacity:35,params:{color:"#ffffff",power:2.6,intensity:.55,bias:0}}}],lighting:{type:"physical",roughness:.07,metalness:0,reflectivity:1.05}}),ze=(n,o,i,t,r,c={},u=[])=>ie(`metal-${n}`,o,"Metal",[i,t],{layers:[{kind:"color",overrides:{params:{color:i}}},...u],lighting:{type:"physical",roughness:r,metalness:1,reflectivity:1.25,...c}}),Yt=[ie("gradient-pastel-shiny-01","Gradient Pastel Shiny 01","Gradient",["#ffb199","#ff8177"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#ffb199",colorB:"#ff8177",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ie("gradient-pastel-shiny-03","Gradient Pastel Shiny 03","Gradient",["#96fbc4","#f9f586"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#96fbc4",colorB:"#f9f586",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ie("gradient-pastel-shiny-04","Gradient Pastel Shiny 04","Gradient",["#a1c4fd","#c2e9fb"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#a1c4fd",colorB:"#c2e9fb",axes:"y",start:-1.1,end:.9}}},{kind:"fresnel",overrides:{opacity:55,params:{color:"#ffffff",power:2.6,intensity:.85,bias:0}}}],lighting:{type:"physical",roughness:.08,reflectivity:1.1}}),ie("gradient-contrast-01","Gradient Contrast 01","Gradient",["#ff9a5a","#7d2ae8"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#ff9a5a",colorB:"#7d2ae8",axes:"y",start:-1,end:1}}},{kind:"fresnel",overrides:{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}}],lighting:{type:"physical",roughness:.1,reflectivity:1.05}}),ie("gradient-contrast-04","Gradient Contrast 04","Gradient",["#6a11cb","#2575fc"],{layers:[{kind:"gradient",overrides:{params:{colorA:"#6a11cb",colorB:"#2575fc",axes:"y",start:-1,end:1}}},{kind:"fresnel",overrides:{opacity:40,params:{color:"#ffffff",power:3,intensity:.7,bias:0}}}],lighting:{type:"physical",roughness:.1,reflectivity:1.05}}),be("deep-blue","Candy Deep Blue","#2c3fd8","#101a6e"),be("lime","Candy Lime","#a8e063","#3f7d20"),be("red","Candy Red","#e8281e","#6e0a06"),be("orange","Candy Orange","#f2790f","#7a3704"),be("cobalt","Candy Cobalt","#2f6bff","#0c2a7a"),be("sky","Candy Sky","#5ec8f2","#1a6e94"),be("magenta","Candy Magenta","#e93cac","#70104f"),be("violet","Candy Violet","#8b3df0","#3c1268"),ze("silver","Metal Silver","#d9d9de","#4c4c52",.09),ze("black-gloss","Metal Black Gloss","#26262a","#050506",.14),ze("chrome-swirl","Metal 8 Swirl","#e8e8ec","#3a3a40",.22,{bumpMap:"noise"}),ze("brushed","Metal Brushed Steel","#b8bcc4","#3c3f46",.32,{bumpMap:"noise"}),ze("dark-chrome","Metal Dark Chrome","#6e7076","#17181c",.07),ze("bronze","Metal Bronze","#b4783a","#3f2408",.16),ze("gold","Metal Gold","#f0b342","#6e4408",.1),ie("glass-clear","Clear Glass","Special",["#eef6fb","#8fb0c4"],{opacity:96,layers:[{kind:"glass",overrides:{params:{color:"#ffffff",transmission:.9,refraction:1.15,thickness:.5,aberration:.06,roughness:.05}}}],lighting:{type:"physical",roughness:.05}}),ie("glass-frosted","Frosted Glass","Special",["#cfe8f2","#8fb8c9"],{opacity:92,layers:[{kind:"glass",overrides:{params:{color:"#dfeef5",transmission:.82,refraction:1.09,thickness:.7,aberration:.02,roughness:.3}}}],lighting:{type:"physical",roughness:.3}}),ie("iridescent-swirl","Iridescent Swirl","Special",["#2a3f3c","#0d1413"],{layers:[{kind:"noise",overrides:{params:{mode:"color",type:"curl",scale:1.6,movement:.25,colorA:"#0e1a18",colorB:"#1f4f46",colorC:"#3fa070",colorD:"#b7f0d8",distortion:[1.8,2.6],factorA:[1.7,9.2],factorB:[8.3,2.8]}}},{kind:"fresnel",overrides:{opacity:65,params:{color:"#9fe8ff",power:2.4,intensity:.8,bias:0}}}],lighting:{type:"physical",roughness:.12,metalness:.35,reflectivity:1.3,bumpMap:"noise"}}),ie("nebula-pearl","Nebula Pearl","Special",["#d9c8ff","#9fe8ff"],{layers:[{kind:"noise",overrides:{params:{mode:"color",type:"simplex",scale:1.4,movement:.4,colorA:"#d9c8ff",colorB:"#9fe8ff",colorC:"#ffd9ec",colorD:"#ffffff",distortion:[1.4,2.2],factorA:[1.7,9.2],factorB:[8.3,2.8]}}},{kind:"dust",overrides:{opacity:70,params:{color:"#ffffff",scale:22,coverage:.14}}},{kind:"fresnel",overrides:{opacity:60,params:{color:"#ffffff",power:2.4,intensity:.9,bias:0}}}],lighting:{type:"physical",roughness:.15,metalness:.2,reflectivity:1.15}}),ie("soft-clay","Soft Clay","Special",["#e3c8b8","#c9a18c"],{layers:[{kind:"color",overrides:{params:{color:"#e3c8b8"}}},{kind:"cavity",overrides:{opacity:45,params:{scale:2.2,threshold:.5,strength:.7}}}],lighting:{type:"physical",roughness:.62,metalness:0,reflectivity:.7}}),ie("toon-shade","Toon Shade","Special",["#ff9060","#c14a33"],{layers:[{kind:"toon",overrides:{params:{color:"#ff9060",steps:3}}},{kind:"outline",overrides:{params:{color:"#1a0f0a",width:.07,threshold:.3}}}],lighting:{type:"toon"}})],ti=(n,o,i)=>{var r,c;const t=o[n.key];switch(n.type){case"color":return e.jsx(Ao,{value:String(t??"#ffffff"),onChange:u=>i(n.key,u),percent:!0});case"texture":return e.jsx(To,{value:String(t??""),onChange:u=>i(n.key,u)});case"number":return e.jsx(ue,{value:typeof t=="number"?t:0,prefix:n.prefix,step:n.step,onChange:u=>i(n.key,u)});case"vec2":return e.jsx(Lt,{value:Array.isArray(t)?t:[0,0],prefixes:(n.prefix??"XY").split(""),step:n.step,onChange:u=>i(n.key,u)});case"vec3":return e.jsx(Lt,{value:Array.isArray(t)?t:[0,0,0],prefixes:(n.prefix??"XYZ").split(""),step:n.step,onChange:u=>i(n.key,u)});case"select":return e.jsx(je,{value:String(t??((r=n.options)==null?void 0:r[0])),options:(n.options??[]).map(u=>({value:u,label:u[0].toUpperCase()+u.slice(1)})),onChange:u=>i(n.key,u),style:{width:168}});case"segment":return e.jsx(Fe,{value:String(t??((c=n.options)==null?void 0:c[0])),options:n.options??[],onChange:u=>i(n.key,u)});default:return null}},pt=({title:n,fields:o,params:i,anchor:t,onChange:r,onClose:c,hints:u,kindId:a,description:_})=>{var f;let v=((f=o[0])==null?void 0:f.group)??0;return e.jsxs(Lo,{title:n,anchor:t,width:452,onClose:c,children:[_?e.jsx("p",{className:"popup-desc",children:_}):null,o.map(h=>{const b=h.group!==v;v=h.group??0;const g=u==null?void 0:u[`${a}.${h.key}`];return e.jsxs("div",{children:[b?e.jsx("hr",{}):null,e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:h.label}),e.jsx("span",{className:"prow-control",children:ti(h,i,r)})]}),g?e.jsx("p",{className:"field-hint",children:g}):null]},h.key)})]})},tn=({current:n,order:o,meta:i,iconMap:t,anchor:r,onPick:c,onClose:u,boltFirst:a,width:_=232,descMap:v})=>{const f=Ee(u),h=a?1:0;return e.jsxs("div",{className:"tmenu",style:{left:Math.max(12,r.left-_-14),top:Math.min(Math.max(12,r.top-12),Math.max(window.innerHeight-640,12))},ref:f,children:[(()=>{if(!a)return null;const b=t[o[0]];return e.jsxs("button",{className:`tmenu-item ai ${n===o[0]?"on":""}`,onClick:()=>c(o[0]),title:(v==null?void 0:v[o[0]])??i[o[0]].label,children:[e.jsx("span",{className:"tmenu-icon",children:e.jsx(b,{})}),e.jsx("span",{className:"tmenu-label",children:i[o[0]].label}),e.jsx(no,{size:15,className:"tmenu-bolt"})]})})(),a?e.jsx("hr",{}):null,o.slice(h).map(b=>{const g=t[b];return e.jsxs("button",{className:`tmenu-item ${n===b?"on":""}`,onClick:()=>c(b),title:(v==null?void 0:v[b])??i[b].label,children:[e.jsx("span",{className:"tmenu-icon",children:e.jsx(g,{})}),e.jsx("span",{className:"tmenu-label",children:i[b].label}),n===b?e.jsx(Wt,{size:15,className:"tmenu-check"}):null]},b)})]})},ni=({current:n,anchor:o,onPick:i,onClose:t})=>{const r=Ee(t);return e.jsx("div",{className:"tmenu blend",style:{left:Math.max(12,o.left-190),top:Math.min(o.top+20,window.innerHeight-320)},ref:r,children:Ko.map(c=>e.jsxs("button",{className:`tmenu-item ${n===c?"on":""}`,onClick:()=>i(c),children:[e.jsx("span",{className:"tmenu-label",children:Jt[c]}),n===c?e.jsx(Wt,{size:15,className:"tmenu-check"}):null]},c))})},oi=({myMaterials:n,appliedId:o,anchor:i,onApply:t,onSaveCurrent:r,onDeleteMine:c,onClose:u})=>{const a=Ee(u),[_,v]=p.useState(""),[f,h]=p.useState("all"),[b,g]=p.useState("all"),y=p.useMemo(()=>["all",...Array.from(new Set(Yt.map(I=>I.category)))],[]),P=_.trim().toLowerCase(),k=f==="all"||f==="mine",N=f==="all"||f==="spline",L=n.filter(I=>!P||I.name.toLowerCase().includes(P)),d=Yt.filter(I=>N&&(b==="all"||I.category===b)&&(!P||I.name.toLowerCase().includes(P))),j=(I,D=!1)=>e.jsxs("div",{className:`asset-cell ${o===I.id?"applied":""}`,onClick:()=>t(I),children:[e.jsx("span",{className:"torus",style:{"--c1":I.swatch[0],"--c2":I.swatch[1]}}),e.jsxs("span",{className:"asset-tip",children:[I.name,I.locked&&!D?e.jsx(to,{size:11}):null]}),D?e.jsx("button",{className:"asset-del",title:"Delete",onClick:C=>{C.stopPropagation(),c(I.id)},children:e.jsx(Ce,{size:12,style:{transform:"rotate(45deg)"}})}):null]},I.id);return e.jsxs("div",{className:"assets",style:{left:Math.max(12,i.left-384-14),top:Math.min(Math.max(12,i.top-60),Math.max(window.innerHeight-620,12))},ref:a,children:[e.jsxs("header",{children:[e.jsx("h3",{children:"Material Assets"}),e.jsx("button",{className:"iconbtn",onClick:u,children:"×"})]}),e.jsxs("div",{className:"assets-toolbar",children:[e.jsx("button",{className:"assets-add",title:"Save current material",onClick:r,children:e.jsx(Ce,{size:17})}),e.jsxs("label",{className:"assets-search",children:[e.jsx($t,{size:15}),e.jsx("input",{placeholder:"Search",value:_,onChange:I=>v(I.target.value)})]})]}),e.jsx(je,{value:f,options:[{value:"all",label:"All Libraries"},{value:"mine",label:"My Materials"},{value:"spline",label:"Spline Library"}],onChange:h,style:{width:"100%"}}),k?e.jsxs("section",{children:[e.jsx("h4",{children:"My Materials"}),L.length?e.jsx("div",{className:"asset-grid",children:L.map(I=>j(I,!0))}):e.jsx("p",{className:"assets-empty",children:"点击左侧 + 保存当前材质"})]}):null,N?e.jsxs("section",{children:[e.jsxs("div",{className:"assets-section-head",children:[e.jsx("h4",{children:"Spline Library"}),e.jsx(je,{value:b,options:y.map(I=>({value:I,label:I==="all"?"All":I})),onChange:g,style:{width:132}})]}),e.jsx("div",{className:"asset-grid",children:d.map(I=>j(I))})]}):null]})},ii=({effects:n,onUpdate:o,onUpdateParam:i,onAdd:t,onRemove:r,onApplyPreset:c})=>{const[u,a]=p.useState({kind:"none"}),[_,v]=p.useState(""),f=Ee(()=>a({kind:"none"})),h=()=>a({kind:"none"}),b=y=>{const P=lt[y.kind];return e.jsxs("div",{className:`layer-row ${y.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:k=>a({kind:"settings",effectId:y.id,anchor:_e(k.currentTarget)}),children:[e.jsx(xt,{size:13,className:"row-chevron"}),e.jsx("span",{className:"row-name",children:y.name})]}),e.jsx("button",{className:"row-swatch",title:"Switch effect",onClick:k=>a({kind:"type",anchor:_e(k.currentTarget)}),children:e.jsx(P,{size:17})}),e.jsxs("span",{className:"ninput opa",children:[e.jsx(ue,{value:y.opacity,onChange:k=>o(y.id,{opacity:Math.min(Math.max(k,0),100)})}),e.jsx("span",{className:"blend-dot static",title:"Strength",children:e.jsx(dt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>o(y.id,{visible:!y.visible}),children:y.visible?e.jsx(Re,{size:16}):e.jsx(Ye,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>r(y.id),children:e.jsx(tt,{size:14})})]},y.id)},g=u.kind==="settings"?n.find(y=>y.id===u.effectId):void 0;return e.jsxs("aside",{className:"spanel",children:[e.jsx("div",{className:"spanel-scroll",children:e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsxs("h2",{children:["Effects ",e.jsx(Ht,{size:15,className:"drag"})]}),e.jsxs("span",{className:"section-tools",children:[e.jsx("button",{className:"iconbtn",title:"Effect Presets",onClick:y=>{v(""),a({kind:"library",anchor:_e(y.currentTarget)})},children:e.jsx(qt,{size:16})}),e.jsx("button",{className:"iconbtn",title:"Add effect",onClick:y=>a({kind:"type",anchor:_e(y.currentTarget)}),children:e.jsx(Ce,{size:17})})]})]}),e.jsx("p",{className:"panel-note",children:"全局 post-processing：未选中元素时作用于整个场景。"}),e.jsx("div",{className:"layer-list",children:n.map(b)})]})}),g?e.jsx(pt,{title:g.name,fields:et[g.kind].fields,params:g.params,anchor:u.kind==="settings"?u.anchor:{top:0,left:0},onChange:(y,P)=>i(g.id,y,P),onClose:h,hints:Xo,kindId:g.kind,description:Ot[g.kind]}):null,u.kind==="library"?e.jsxs("div",{className:"assets",style:{left:Math.max(12,u.anchor.left-384-14),top:Math.min(Math.max(12,u.anchor.top-60),Math.max(window.innerHeight-560,12))},ref:f,children:[e.jsxs("header",{children:[e.jsx("h3",{children:"Effect Presets"}),e.jsx("button",{className:"iconbtn",onClick:h,children:"×"})]}),e.jsx("div",{className:"assets-toolbar",children:e.jsxs("label",{className:"assets-search",children:[e.jsx($t,{size:15}),e.jsx("input",{placeholder:"Search",value:_,onChange:y=>v(y.target.value)})]})}),e.jsx("section",{children:e.jsx("div",{className:"asset-grid",children:Zo.filter(y=>!_.trim()||y.name.toLowerCase().includes(_.trim().toLowerCase())).map(y=>e.jsxs("div",{className:"asset-cell",onClick:()=>{c(Bo(y)),h()},children:[e.jsx("span",{className:"fx-stack",children:y.spec.effects.slice(0,4).map(({kind:P})=>{const k=lt[P];return e.jsx(k,{size:13},P)})}),e.jsx("span",{className:"asset-tip",children:y.name})]},y.id))})})]}):null,u.kind==="type"?e.jsx(tn,{order:Ro,meta:et,iconMap:lt,descMap:Ot,anchor:u.anchor,width:190,onPick:y=>{t(y),h()},onClose:h}):null]})},ai=({material:n,actions:o,myMaterials:i,appliedPresetId:t,onApplyPreset:r,onSavePreset:c,onDeletePreset:u})=>{var b,g,y,P,k,N,L;const[a,_]=p.useState({kind:"none"}),v=()=>_({kind:"none"}),f=d=>{var G;const j=De[d.kind],I=ft[d.kind],D=j.hexKey,C=(G=j.fields.find(M=>M.type==="texture"))==null?void 0:G.key,B=C&&typeof d.params[C]=="string"?d.params[C]:"";return e.jsxs("div",{className:`layer-row ${d.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:M=>_({kind:"settings",layerId:d.id,anchor:_e(M.currentTarget)}),children:[e.jsx(xt,{size:13,className:"row-chevron"}),e.jsx("span",{className:"row-name",children:d.name})]}),e.jsx("button",{className:"row-swatch",title:"Switch layer type",onClick:M=>{M.stopPropagation(),_({kind:"type",layerId:d.id,anchor:_e(M.currentTarget)})},children:B?e.jsx("img",{className:"swatch-img",src:B,alt:""}):D?e.jsx("span",{className:"swatch-color",style:{background:String(d.params[D]??"#888")}}):e.jsx(I,{size:17})}),D?e.jsx("span",{className:"ninput hex",children:e.jsx("input",{value:String(d.params[D]??"").replace("#","").toUpperCase(),onChange:M=>o.updateLayerParam(d.id,D,`#${M.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6)}`),spellCheck:!1})}):null,e.jsxs("span",{className:"ninput opa",children:[e.jsx(ue,{value:d.opacity,onChange:M=>o.updateLayer(d.id,{opacity:Math.min(Math.max(M,0),100)})}),e.jsx("button",{className:"blend-dot",title:`Blend: ${Jt[d.mode]}`,onClick:M=>{M.stopPropagation(),_({kind:"blend",layerId:d.id,anchor:_e(M.currentTarget)})},children:e.jsx(dt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>o.updateLayer(d.id,{visible:!d.visible}),children:d.visible?e.jsx(Re,{size:16}):e.jsx(Ye,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>o.removeLayer(d.id),children:e.jsx(tt,{size:14})})]},d.id)},h=()=>e.jsxs("div",{className:`layer-row ${n.lighting.enabled?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:d=>_({kind:"lighting",anchor:_e(d.currentTarget)}),children:[e.jsx("span",{className:"row-chevron"}),e.jsx("span",{className:"row-name",children:"Lighting"})]}),e.jsx("button",{className:"row-swatch",onClick:d=>_({kind:"lighting",anchor:_e(d.currentTarget)}),children:e.jsx("span",{className:"swatch-sphere",style:{background:"radial-gradient(circle at 34% 30%, #ffffff 0%, #c9c9c9 55%, #7c7c7c 100%)"}})}),e.jsxs("span",{className:"ninput opa",children:[e.jsx(ue,{value:n.lighting.strength,onChange:d=>o.updateLighting({strength:Math.min(Math.max(d,0),100)})}),e.jsx("span",{className:"blend-dot static",children:e.jsx(dt,{size:13})})]}),e.jsx("button",{className:"iconbtn",onClick:()=>o.updateLighting({enabled:!n.lighting.enabled}),children:n.lighting.enabled?e.jsx(Re,{size:16}):e.jsx(Ye,{size:16})}),e.jsx("span",{className:"iconbtn placeholder"})]});return e.jsxs("aside",{className:"spanel",children:[e.jsxs("div",{className:"spanel-scroll",children:[e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsxs("h2",{children:["Material ",e.jsx(Ht,{size:15,className:"drag"})]}),e.jsxs("span",{className:"section-tools",children:[e.jsx(ue,{value:n.opacity,width:64,onChange:d=>o.updateMaterial({opacity:Math.min(Math.max(d,0),100)})}),e.jsx("button",{className:"iconbtn",title:"Material Assets",onClick:d=>_({kind:"assets",anchor:_e(d.currentTarget)}),children:e.jsx(qt,{size:16})}),e.jsx("button",{className:"iconbtn",title:"Add layer",onClick:d=>_({kind:"type",layerId:null,anchor:_e(d.currentTarget)}),children:e.jsx(Ce,{size:17})})]})]}),e.jsxs("div",{className:"layer-list",children:[n.layers.map(f),h()]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("header",{className:"section-head",children:e.jsxs("h2",{children:["Environment Map",e.jsx("button",{className:"iconbtn",onClick:()=>o.updateEnv({enabled:!n.env.enabled}),children:n.env.enabled?e.jsx(Re,{size:15}):e.jsx(Ye,{size:15})})]})}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Image"}),e.jsx("span",{className:"prow-control",children:e.jsx(je,{value:n.env.preset,options:[{value:"studio",label:"Studio Procedural"},{value:"bright",label:"Bright Room"},{value:"warm",label:"Warm Sunset"},{value:"sunset",label:"Sunset Field"},{value:"night",label:"Cold Night"}],onChange:d=>o.updateEnv({preset:d}),style:{width:172}})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Exposure"}),e.jsx("span",{className:"prow-control",children:e.jsx(ue,{value:n.env.exposure,onChange:d=>o.updateEnv({exposure:Math.min(Math.max(d,0),3)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Rotation"}),e.jsx("span",{className:"prow-control",children:e.jsx(ue,{value:n.env.rotation,step:.05,onChange:d=>o.updateEnv({rotation:d})})})]})]}),e.jsx("section",{className:"spanel-section",children:e.jsxs("header",{className:"section-head",children:[e.jsx("h2",{children:"Modifiers"}),e.jsx("button",{className:"iconbtn",title:"Add modifier (decorative)",children:e.jsx(Ce,{size:17})})]})}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Visibility"}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Wireframe"}),e.jsx("span",{className:"prow-control",children:e.jsx(Fe,{value:n.wireframe?"show":"hide",options:["show","hide"],onChange:d=>o.updateMaterial({wireframe:d==="show"})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shading"}),e.jsx("span",{className:"prow-control",children:e.jsx(Fe,{value:n.shading,options:["normal","flat"],onChange:d=>o.updateMaterial({shading:d})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Sides"}),e.jsx("span",{className:"prow-control",children:e.jsx(Fe,{value:n.sides,options:["both","front","back"],onChange:d=>o.updateMaterial({sides:d})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Shadows"}),e.jsx("span",{className:"prow-control",children:e.jsx(je,{value:n.shadows,options:[{value:"castreceive",label:"Cast & Receive"},{value:"cast",label:"Cast"},{value:"receive",label:"Receive"},{value:"off",label:"Off"}],onChange:d=>o.updateMaterial({shadows:d}),style:{width:172}})})]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Collision"}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Enabled"}),e.jsx("span",{className:"prow-control",children:e.jsx(je,{value:n.collision,options:[{value:"visibility",label:"Based on Visibility"},{value:"on",label:"On"},{value:"off",label:"Off"}],onChange:d=>o.updateMaterial({collision:d}),style:{width:172}})})]})]})]}),a.kind==="settings"?e.jsx(pt,{title:De[((b=n.layers.find(d=>d.id===a.layerId))==null?void 0:b.kind)??"color"].label,fields:De[((g=n.layers.find(d=>d.id===a.layerId))==null?void 0:g.kind)??"color"].fields,params:((y=n.layers.find(d=>d.id===a.layerId))==null?void 0:y.params)??{},anchor:a.anchor,onChange:(d,j)=>o.updateLayerParam(a.layerId,d,j),onClose:v,hints:Rt,kindId:(P=n.layers.find(d=>d.id===a.layerId))==null?void 0:P.kind,description:ct[((k=n.layers.find(d=>d.id===a.layerId))==null?void 0:k.kind)??"color"]}):null,a.kind==="lighting"?e.jsx(pt,{title:"Lighting",fields:Go,params:{type:n.lighting.type,color:n.lighting.color,shining:n.lighting.shining,roughness:n.lighting.roughness,metalness:n.lighting.metalness,reflectivity:n.lighting.reflectivity,glass:n.lighting.glass,aberration:n.lighting.aberration,thickness:n.lighting.thickness,refraction:n.lighting.refraction,blur:n.lighting.blur,bumpMap:n.lighting.bumpMap,occlusion:n.lighting.occlusion?"on":"off"},anchor:a.anchor,onChange:(d,j)=>{d==="occlusion"?o.updateLighting({occlusion:j==="on"}):d==="type"?o.updateLighting({type:j}):d==="bumpMap"?o.updateLighting({bumpMap:j}):o.updateLighting({[d]:j})},onClose:v,hints:Rt,kindId:"lighting",description:ct.lighting}):null,a.kind==="type"?e.jsx(tn,{current:a.layerId?(N=n.layers.find(d=>d.id===a.layerId))==null?void 0:N.kind:void 0,order:Uo,meta:De,iconMap:ft,boltFirst:!0,descMap:ct,anchor:a.anchor,onPick:d=>{a.layerId?o.setLayerKind(a.layerId,d):o.addLayer(d),v()},onClose:v}):null,a.kind==="blend"?e.jsx(ni,{current:((L=n.layers.find(d=>d.id===a.layerId))==null?void 0:L.mode)??"normal",anchor:a.anchor,onPick:d=>{o.updateLayer(a.layerId,{mode:d}),v()},onClose:v}):null,a.kind==="assets"?e.jsx(oi,{myMaterials:i,appliedId:t,anchor:a.anchor,onApply:d=>{r(d),v()},onSaveCurrent:c,onDeleteMine:u,onClose:v}):null]})},Le=new z;function le(n,o,i,t,r,c){const u=2*Math.PI*r/4,a=Math.max(c-2*r,0),_=Math.PI/4;Le.copy(o),Le[t]=0,Le.normalize();const v=.5*u/(u+a),f=1-Le.angleTo(n)/_;return Math.sign(Le[i])===1?f*v:a/(u+a)+v+v*(1-f)}class si extends Ie{constructor(o=1,i=1,t=1,r=2,c=.1){if(r=r*2+1,c=Math.min(o/2,i/2,t/2,c),super(1,1,1,r,r,r),r===1)return;const u=this.toNonIndexed();this.index=null,this.attributes.position=u.attributes.position,this.attributes.normal=u.attributes.normal,this.attributes.uv=u.attributes.uv;const a=new z,_=new z,v=new z(o,i,t).divideScalar(2).subScalar(c),f=this.attributes.position.array,h=this.attributes.normal.array,b=this.attributes.uv.array,g=f.length/6,y=new z,P=.5/r;for(let k=0,N=0;k<f.length;k+=3,N+=2)switch(a.fromArray(f,k),_.copy(a),_.x-=Math.sign(_.x)*P,_.y-=Math.sign(_.y)*P,_.z-=Math.sign(_.z)*P,_.normalize(),f[k+0]=v.x*Math.sign(a.x)+_.x*c,f[k+1]=v.y*Math.sign(a.y)+_.y*c,f[k+2]=v.z*Math.sign(a.z)+_.z*c,h[k+0]=_.x,h[k+1]=_.y,h[k+2]=_.z,Math.floor(k/g)){case 0:y.set(1,0,0),b[N+0]=le(y,_,"z","y",c,t),b[N+1]=1-le(y,_,"y","z",c,i);break;case 1:y.set(-1,0,0),b[N+0]=1-le(y,_,"z","y",c,t),b[N+1]=1-le(y,_,"y","z",c,i);break;case 2:y.set(0,1,0),b[N+0]=1-le(y,_,"x","z",c,o),b[N+1]=le(y,_,"z","x",c,t);break;case 3:y.set(0,-1,0),b[N+0]=1-le(y,_,"x","z",c,o),b[N+1]=1-le(y,_,"z","x",c,t);break;case 4:y.set(0,0,1),b[N+0]=1-le(y,_,"x","y",c,o),b[N+1]=1-le(y,_,"y","x",c,i);break;case 5:y.set(0,0,-1),b[N+0]=le(y,_,"x","y",c,o),b[N+1]=1-le(y,_,"y","x",c,i);break}}}const ht=`
float lamina_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float lamina_normalize(float v) { return lamina_map(v, -1.0, 1.0, 0.0, 1.0); }
vec3 lamina_hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}
`,Ft=`
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
`,ri=`
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
`,li=`
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
uniform float u_lamina_envEnabled;
uniform float u_lamina_envExposure;
uniform float u_lamina_envRotation;
uniform float u_lamina_envPreset;
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

/** 程序化摄影棚环境：底色渐变 + 顶灯柔光箱 + 左右灯条 + 背面轮廓光 + 地面反弹（lod 模拟粗糙度模糊） */
vec3 lamina_env(vec3 dir, float lod) {
  vec3 r = normalize(dir);
  float c = cos(u_lamina_envRotation);
  float s = sin(u_lamina_envRotation);
  r = vec3(c * r.x + s * r.z, r.y, -s * r.x + c * r.z);
  float up = r.y;
  float p = u_lamina_envPreset;
  vec3 base;
  vec3 keyTint;
  if (p < 0.5) {
    base = mix(vec3(0.05, 0.05, 0.06), vec3(0.34, 0.36, 0.40), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(1.0);
  } else if (p < 1.5) {
    base = mix(vec3(0.10, 0.055, 0.03), vec3(0.52, 0.34, 0.20), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(1.0, 0.86, 0.68);
  } else if (p < 2.5) {
    base = mix(vec3(0.012, 0.016, 0.03), vec3(0.10, 0.12, 0.20), smoothstep(-0.7, 1.0, up));
    keyTint = vec3(0.75, 0.82, 1.0);
  } else if (p < 3.5) {
    base = mix(vec3(0.30, 0.31, 0.33), vec3(0.72, 0.73, 0.76), smoothstep(-0.8, 1.0, up));
    keyTint = vec3(1.0);
  } else {
    base = mix(vec3(0.16, 0.07, 0.05), vec3(0.98, 0.52, 0.26), smoothstep(-0.6, 0.9, up));
    keyTint = vec3(1.0, 0.62, 0.36);
  }
  float bright = (p > 2.5 && p < 3.5) ? 1.0 : 0.0;
  float soft = 0.05 + lod * 0.2;
  vec3 e = base * mix(0.6, 1.0, u_lamina_envEnabled);
  e += keyTint * smoothstep(0.94 - soft, 0.995 - lod * 0.05, dot(r, normalize(vec3(0.25, 1.0, 0.5)))) * mix(2.5, 2.2, bright) * u_lamina_envEnabled;
  e += keyTint * smoothstep(0.958 - soft, 0.997, dot(r, normalize(vec3(-1.0, 0.32, 0.38)))) * mix(1.55, 1.35, bright) * u_lamina_envEnabled;
  e += vec3(1.0, 0.84, 0.66) * smoothstep(0.964 - soft, 0.998, dot(r, normalize(vec3(1.0, 0.22, 0.28)))) * mix(1.15, 1.0, bright) * u_lamina_envEnabled;
  e += vec3(0.8, 0.86, 1.0) * smoothstep(0.968 - soft * 0.5, 0.999, dot(r, normalize(vec3(0.0, 0.12, -1.0)))) * mix(1.0, 0.9, bright) * u_lamina_envEnabled;
  e += vec3(0.30, 0.27, 0.24) * smoothstep(-0.15, -1.0, up) * 0.5 * u_lamina_envEnabled;
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
      float ior = max(u_lamina_refraction, 1.01);
      vec3 rd = refract(-V, N, 1.0 / ior);
      if (dot(rd, rd) < 0.001) rd = R;
      float ab = u_lamina_aberration * 0.06;
      vec3 refr = vec3(
        lamina_env(normalize(rd + N * ab), gLod).r,
        lamina_env(rd, gLod).g,
        lamina_env(normalize(rd - N * ab), gLod).b);
      vec3 glassCol = mix(vec3(0.88) * refr, env * 1.3, clamp(F * 1.7 + 0.05, 0.0, 1.0));
      glassCol *= mix(vec3(1.0), albedo * 0.9, clamp(u_lamina_thickness * (1.0 - ndv) * 1.15, 0.0, 1.0));
      col = mix(col, glassCol, glassAmt);
    }
    lit = col;
  } else {
    float cel = floor(ndl * 3.0) / 3.0;
    lit = albedo * (0.34 + 0.66 * cel);
  }
  return mix(albedo, lit, clamp(u_lamina_lightStrength, 0.0, 1.0));
}
`,ci={colorAdjust:{uniforms:`uniform float u___ID___brightness;
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
}`}},_i=`
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 u_res;
uniform float u_time;
${ht}
`;function ui(n){const o={tDiffuse:{value:null},u_res:{value:new te(1,1)},u_time:{value:0}},i=[],t=[],r=[];for(const u of n){if(!u.visible)continue;const a=u.id,_=et[u.kind],v=ci[u.kind];if(!v)continue;o[`u_${a}_strength`]={value:u.opacity/100};for(const h of _.fields){const b=u.params[h.key],g=`u_${a}_${h.key}`;h.type==="color"?o[g]={value:new ve(String(b??"#000000"))}:h.type==="segment"?o[g]={value:b==="on"?1:0}:h.type==="vec2"||h.type==="vec3"?o[g]={value:Array.isArray(b)?new te(b[0],b[1]):new te(0,0)}:o[g]={value:typeof b=="number"?b:0}}const f=h=>h.replaceAll("__ID__",a);i.push(`uniform float u_${a}_strength;
${f(v.uniforms)}`),t.push(f(v.func)),r.push(`col = mix(col, fx_${a}(col, uv), u_${a}_strength);`)}const c=`
${_i}
${i.join(`
`)}
${t.join(`
`)}
void main() {
  vec2 uv = vUv;
  vec3 col = texture(tDiffuse, uv).rgb;
${r.join(`
`)}
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;return new qe({vertexShader:`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,fragmentShader:c,uniforms:o,depthTest:!1,depthWrite:!1})}const mi=({effects:n})=>{const o=$(v=>v.gl),i=$(v=>v.scene),t=$(v=>v.camera),r=p.useMemo(()=>new mt(1,1,{minFilter:Nt,magFilter:Nt,depthBuffer:!0,samples:4}),[]),c=p.useMemo(()=>new jn,[]),u=p.useMemo(()=>new We(-1,1,1,-1,0,1),[]),a=p.useMemo(()=>ui(n),[n]),_=p.useMemo(()=>new te,[]);return p.useEffect(()=>{const v=new T(new pe(2,2),a);return v.frustumCulled=!1,c.add(v),()=>{c.remove(v),v.geometry.dispose()}},[a,c]),p.useEffect(()=>()=>{a.dispose(),r.dispose()},[a,r]),Ze(({clock:v})=>{o.getDrawingBufferSize(_),(r.width!==_.x||r.height!==_.y)&&(r.setSize(_.x,_.y),a.uniforms.u_res.value.copy(_)),a.uniforms.tDiffuse.value=r.texture,a.uniforms.u_time.value=v.elapsedTime,o.setRenderTarget(r),o.clear(),o.render(i,t),o.setRenderTarget(null),o.render(c,u)},1),null},_t=new Map,di=new kn,fi=n=>{if(!n)return;const o=_t.get(n);if(o)return o;const i=new zn;return i.colorSpace=Xe,i.flipY=!1,i.name="pending",_t.set(n,i),di.load(n,t=>{i.image=t.image,i.name=t.name,i.colorSpace=Xe,i.flipY=!1,i.wrapS=Je,i.wrapT=Je,i.needsUpdate=!0},void 0,()=>{_t.delete(n)}),i};let we=null;const pi=()=>{if(we)return we;const n=document.createElement("canvas");n.width=n.height=128;const o=n.getContext("2d");return o.fillStyle="#8f8f8f",o.fillRect(0,0,128,128),o.fillStyle="#6e6e6e",o.fillRect(0,0,64,64),o.fillRect(64,64,64,64),we=new yt(n),we.colorSpace=Xe,we.wrapS=we.wrapT=Je,we.flipY=!1,we},Vt={perlin:"lamina_noise_perlin",simplex:"lamina_noise_simplex",cell:"lamina_noise_worley",white:"lamina_noise_white",curl:"lamina_noise_swirl"},hi={normal:"lamina_blend_normal",add:"lamina_blend_add",subtract:"lamina_blend_subtract",multiply:"lamina_blend_multiply",screen:"lamina_blend_screen",overlay:"lamina_blend_overlay",softlight:"lamina_blend_softlight",lighten:"lamina_blend_lighten",darken:"lamina_blend_darken",divide:"lamina_blend_divide",reflect:"lamina_blend_reflect",negation:"lamina_blend_negation"},vi={basic:0,lambert:1,phong:2,physical:3,toon:4},Xt={aiTexture:{uniforms:`uniform sampler2D u___ID___map;
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
}`}},Bt={uniforms:`uniform float u___ID___strength;
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
}`},ut=n=>new ve(n).convertSRGBToLinear(),yi=(n,o)=>{const i=Array.isArray(n)&&n.length>=2?n:o;return new te(i[0],i[1])},xi=(n,o)=>{const i=Array.isArray(n)&&n.length>=3?n:o;return new z(i[0],i[1],i[2])},gi=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
uniform float u_lamina_time;
`,bi=`
varying vec3 v_lamina_position;
varying vec3 v_lamina_worldPosition;
varying vec3 v_lamina_normal;
varying vec3 v_lamina_viewDir;
varying vec2 v_lamina_uv;
`;function wi(n){var v;const o={u_lamina_time:{value:0},u_lamina_opacity:{value:n.opacity/100},u_lamina_lighting:{value:n.lighting.enabled?vi[n.lighting.type]:0},u_lamina_lightStrength:{value:n.lighting.strength/100},u_lamina_lightColor:{value:ut(n.lighting.color)},u_lamina_shininess:{value:n.lighting.shining},u_lamina_roughness:{value:n.lighting.roughness},u_lamina_metalness:{value:n.lighting.metalness},u_lamina_reflectivity:{value:n.lighting.reflectivity},u_lamina_glass:{value:n.lighting.glass},u_lamina_aberration:{value:n.lighting.aberration},u_lamina_thickness:{value:n.lighting.thickness},u_lamina_refraction:{value:n.lighting.refraction},u_lamina_blur:{value:n.lighting.blur},u_lamina_envEnabled:{value:n.env.enabled?1:0},u_lamina_envExposure:{value:n.env.exposure},u_lamina_envRotation:{value:n.env.rotation},u_lamina_envPreset:{value:{studio:0,warm:1,night:2,bright:3,sunset:4}[n.env.preset]??0},u_lamina_lightIntensity:{value:1},u_lamina_ambient:{value:.75},u_lamina_tonemapping:{value:0},u_lamina_bump:{value:n.lighting.bumpMap==="noise"?1:0},u_lamina_occlusion:{value:n.lighting.occlusion?1:0},u_lamina_flat:{value:n.shading==="flat"?1:0},u_lamina_selected:{value:0},u_lamina_base:{value:ut("#ffffff")}},i=[],t=[],r=[],c=[];for(const f of n.layers){if(!f.visible)continue;const h=f.id,b=De[f.kind],g=Xt[f.kind];if(!g||!b)continue;o[`u_${h}_alpha`]={value:f.opacity/100};for(const L of b.fields){const d=f.params[L.key],j=`u_${h}_${L.key}`;switch(L.type){case"color":o[j]={value:ut(typeof d=="string"?d:"#ffffff")};break;case"texture":{const I=String(d??"");o[j]={value:I?fi(I):pi()};break}case"vec2":o[j]={value:yi(d,[1,1])};break;case"vec3":o[j]={value:xi(d,[0,0,0])};break;case"select":case"segment":o[j]={value:Math.max(((v=L.options)==null?void 0:v.indexOf(String(d)))??0,0)};break;default:o[j]={value:typeof d=="number"?d:0}}}const y=Vt[String(f.params.type)]??Vt.simplex,P=L=>L.replaceAll("__ID__",h).replaceAll("%NOISE%",y).replaceAll("%AXIS%",`.${f.params.axes??"y"}`).replaceAll("%PAT%",f.params.pattern==="stripes"?"step(0.5, fract(f_g___ID__.x * 0.5))".replaceAll("__ID__",h):"mod(floor(f_g___ID__.x) + floor(f_g___ID__.y), 2.0)".replaceAll("__ID__",h));i.push(`uniform float u_${h}_alpha;
${P(g.uniforms)}`);const k=f.kind==="noise"&&f.params.mode==="mask",N=k?Xt.noise.maskBody:g.body;if(k)t.push(P(N));else{const L=hi[f.mode];t.push(`{
  vec4 f_lc___ID__;
${P(N)}
  lamina_finalColor = ${L}(lamina_finalColor, f_lc___ID__, u___ID___alpha);
}`.replaceAll("__ID__",h))}f.kind==="displace"&&g!==void 0&&(r.push(P(Bt.uniforms)),c.push(P(Bt.body)))}const u=`
${ht}
${Ft}
${gi}
${r.join(`
`)}
void main() {
  vec3 lamina_finalPosition = position;
  vec3 lamina_finalNormal = normal;
${c.join(`
`)}
  vec4 lamina_world = modelMatrix * vec4(lamina_finalPosition, 1.0);
  v_lamina_worldPosition = lamina_world.xyz;
  v_lamina_position = lamina_finalPosition;
  v_lamina_uv = uv;
  v_lamina_normal = normalize(mat3(modelMatrix) * lamina_finalNormal);
  v_lamina_viewDir = cameraPosition - lamina_world.xyz;
  gl_Position = projectionMatrix * viewMatrix * lamina_world;
}
`,a=`
${ht}
${Ft}
${ri}
${bi}
${i.join(`
`)}
${li}
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
${t.join(`
`)}
  vec3 lamina_lit = lamina_shade(lamina_finalColor.rgb, N, V);
  float lamina_ndv = max(dot(N, V), 0.0);
  lamina_lit *= mix(1.0, 0.5 + 0.5 * smoothstep(0.0, 1.0, lamina_ndv), u_lamina_occlusion);
  lamina_lit += vec3(0.25, 0.55, 1.0) * pow(1.0 - lamina_ndv, 2.5) * u_lamina_selected * 1.1;
  if (u_lamina_tonemapping > 0.5) {
    lamina_lit = (lamina_lit * (2.51 * lamina_lit + 0.03)) / (lamina_lit * (2.43 * lamina_lit + 0.59) + 0.14);
  }
  gl_FragColor = vec4(pow(max(lamina_lit, vec3(0.0)), vec3(0.4545)), lamina_finalColor.a);
}
`,_=n.sides==="both"?vt:n.sides==="back"?Gt:Pn;return{vertexShader:u,fragmentShader:a,uniforms:o,side:_}}function Ii(n){const o=wi(n);return new qe({vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,uniforms:o.uniforms,side:o.side,transparent:!0,depthWrite:!0})}const nn={knot:()=>new En(.82,.3,256,40),sphere:()=>new Qt(1.12,128,72),torus:()=>new Oe(1.02,.44,64,128),capsule:()=>new Cn(.72,1.1,24,64),roundedBox:()=>new si(1.7,1.15,.38,5,.16)},he={dark:{label:"Dark",background:"#141414",grid:{cell:"#262626",section:"#3a3a3a"},shadowOpacity:.5},white:{label:"White",background:"#f0eff2",light:!0,shadowOpacity:.32},neutral:{label:"Gray",background:"#9a9aa0",shadowOpacity:.38},checker:{label:"Checker",background:"#eceae6",light:!0,checker:!0,shadowOpacity:.3},horizon:{label:"Horizon",background:"#101012",grid:{cell:"#232326",section:"#333338"},gradient:["#08080a","#43434e","#08080a"],shadowOpacity:.55}},Di=n=>{const o=document.createElement("canvas");o.width=2,o.height=512;const i=o.getContext("2d"),t=i.createLinearGradient(0,0,0,512);t.addColorStop(0,n[0]),t.addColorStop(.55,n[1]),t.addColorStop(1,n[0]),i.fillStyle=t,i.fillRect(0,0,2,512);const r=new yt(o);return r.colorSpace=Xe,r},ji=()=>{const n=document.createElement("canvas");n.width=n.height=128;const o=n.getContext("2d");o.fillStyle="#fbfaf8",o.fillRect(0,0,128,128),o.fillStyle="#d7d4ce",o.fillRect(0,0,64,64),o.fillRect(64,64,64,64);const i=new yt(n);return i.wrapS=i.wrapT=Je,i.repeat.set(30,30),i.anisotropy=4,i.colorSpace=Xe,i},ki=(n,o,i,t)=>{const r=p.useMemo(()=>Ii(n),[n]);return p.useEffect(()=>()=>r.dispose(),[r]),p.useEffect(()=>{r.uniforms.u_lamina_selected&&(r.uniforms.u_lamina_selected.value=o?1:0)},[r,o]),p.useEffect(()=>{r.uniforms.u_lamina_lightIntensity&&(r.uniforms.u_lamina_lightIntensity.value=i.enabled?i.intensity:.25),r.uniforms.u_lamina_ambient&&(r.uniforms.u_lamina_ambient.value=i.ambient),r.uniforms.u_lamina_tonemapping&&(r.uniforms.u_lamina_tonemapping.value=t?1:0)},[r,i,t]),Ze(({clock:c})=>{r.uniforms.u_lamina_time.value=c.elapsedTime}),r},zi=({geometry:n})=>e.jsx("mesh",{geometry:n,scale:1.002,raycast:()=>null,children:e.jsx("meshBasicMaterial",{color:"#565656",transparent:!0,opacity:.35,wireframe:!0})}),Pi=({object:n,selected:o,transformMode:i,sceneLight:t,tonemapping:r,onSelect:c,onTransform:u})=>{const a=nn[n.geometry],_=p.useMemo(()=>a(),[a]);p.useEffect(()=>()=>_.dispose(),[_]);const v=ki(n.material,o,t,r),f=p.useRef(null),h=()=>{if(!f.current)return;const{position:b,rotation:g,scale:y}=f.current;u(n.id,{position:[b.x,b.y,b.z],rotation:[g.x,g.y,g.z],scale:y.x})};return e.jsxs(e.Fragment,{children:[e.jsx("mesh",{ref:f,geometry:_,position:n.position,rotation:n.rotation,scale:n.scale,visible:n.visible,onClick:b=>{b.stopPropagation(),c(n.id)},children:e.jsx("primitive",{object:v,attach:"material"})}),o&&n.visible?e.jsx($n,{object:f,mode:i,onMouseUp:h,size:.8}):null,!o&&n.material.wireframe&&n.visible?e.jsx(zi,{geometry:_}):null]})},Si=({config:n})=>{const o=p.useMemo(()=>n.gradient?Di(n.gradient):null,[n]),i=p.useMemo(()=>n.checker?ji():null,[n]);return p.useEffect(()=>()=>o==null?void 0:o.dispose(),[o]),p.useEffect(()=>()=>i==null?void 0:i.dispose(),[i]),e.jsxs(e.Fragment,{children:[o?e.jsx("primitive",{object:o,attach:"background"}):e.jsx("color",{attach:"background",args:[n.background]}),e.jsx(eo,{position:[0,n.checker?-1.549:-1.548,0],opacity:n.shadowOpacity,scale:16,blur:2.6,far:3.2,resolution:512,color:n.light?"#5a5550":"#000000"}),i?e.jsxs("mesh",{"rotation-x":-Math.PI/2,position:[0,-1.551,0],raycast:()=>null,children:[e.jsx("planeGeometry",{args:[90,90]}),e.jsx("meshBasicMaterial",{map:i})]}):null,n.grid?e.jsx(Jn,{position:[0,-1.55,0],args:[40,40],cellSize:.6,cellThickness:.6,cellColor:n.grid.cell,sectionSize:3,sectionThickness:1,sectionColor:n.grid.section,fadeDistance:26,fadeStrength:1.4,infiniteGrid:!0}):null]})},Ci=({objects:n,selectedId:o,scene:i,globalEffects:t,transformMode:r,sceneLight:c,tonemapping:u,onSelect:a,onTransform:_})=>{const v=he[i],f=p.useMemo(()=>[...n.flatMap(h=>h.effects),...t].filter(h=>h.visible&&h.opacity>0),[n,t]);return e.jsxs(Sn,{camera:{fov:40,position:[4.6,2.3,5.4]},dpr:[1,2],gl:{antialias:!0},onPointerMissed:()=>a(null),children:[e.jsx(Si,{config:v}),n.map(h=>e.jsx(Pi,{object:h,selected:h.id===o,transformMode:r,sceneLight:c,tonemapping:u,onSelect:a,onTransform:_},h.id)),e.jsx(Hn,{makeDefault:!0,enablePan:!1,minDistance:2.6,maxDistance:12,target:[0,.1,0]}),f.length?e.jsx(mi,{effects:f}):null]})};let Ei=0;const Mi=()=>`o${++Ei}_${Math.random().toString(36).slice(2,6)}`,He=(n,o,i,t,r={})=>({id:Mi(),name:n,geometry:o,position:i,rotation:[0,0,0],scale:1,visible:!0,material:t,effects:[],...r}),$e=(n,o={})=>({...Jo(),layers:n,lighting:{...en,...o},env:{enabled:!0,preset:"bright",exposure:1,rotation:0}}),Ni=()=>[He("Pink Card","roundedBox",[-1.55,.42,-.1],$e([ye("color",{params:{color:"#ff2f88"}}),ye("fresnel",{opacity:25,params:{color:"#ffd1e6",power:2.8,intensity:.45,bias:0}})],{type:"physical",roughness:.12,metalness:0,reflectivity:1}),{rotation:[.1,.5,-.12]}),He("Pearl","sphere",[1.62,1.02,-.55],$e([ye("color",{params:{color:"#ffffff"}})],{type:"physical",roughness:.06,glass:.92,refraction:1.14,thickness:.5,aberration:.06,blur:.04}),{scale:.92}),He("Chrome Card","roundedBox",[.15,-1.05,.55],$e([ye("color",{params:{color:"#d9d9de"}})],{type:"physical",roughness:.09,metalness:1,reflectivity:1.25}),{rotation:[.32,-.35,.05],scale:1.05})],Ai=n=>He(`Object ${n+1}`,"sphere",[(n%3-1)*1.9,n%2*1.5-.4,.4*(n%2*2-1)],$e([ye("color",{params:{color:"#8f9bb3"}})],{roughness:.25})),Ti={knot:"Knot",sphere:"Sphere",torus:"Torus",capsule:"Capsule",roundedBox:"Card"},Li=({objects:n,selectedId:o,scene:i,sceneLight:t,tonemapping:r,onSelect:c,onSelectScene:u,onChangeLight:a,onToggleTonemapping:_,onChangeGeometry:v,onToggleObject:f,onRemoveObject:h,onAddObject:b})=>e.jsx("aside",{className:"spanel",children:e.jsxs("div",{className:"spanel-scroll",children:[e.jsxs("section",{className:"spanel-section",children:[e.jsx("h2",{className:"section-title",children:"Background"}),e.jsx("div",{className:"scene-grid",children:Object.keys(he).map(g=>{var y;return e.jsxs("button",{className:`scene-cell ${i===g?"on":""}`,onClick:()=>u(g),children:[e.jsx("span",{className:"scene-chip",style:{background:`linear-gradient(180deg, ${((y=he[g].gradient)==null?void 0:y[1])??he[g].background} 0%, ${he[g].background} 100%)`}}),e.jsx("span",{children:he[g].label})]},g)})}),e.jsx("p",{className:"panel-note",children:"Effects 是全局后处理，作用于整个画面（切到 Effects 标签编辑）。"})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsx("header",{className:"section-head",children:e.jsxs("h2",{children:["Light",e.jsx("button",{className:"iconbtn",onClick:()=>a({enabled:!t.enabled}),children:t.enabled?"◉":"○"})]})}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Intensity"}),e.jsx("span",{className:"prow-control",children:e.jsx(ue,{value:t.intensity,onChange:g=>a({intensity:Math.min(Math.max(g,0),4)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Color"}),e.jsx("span",{className:"prow-control",children:e.jsx(je,{value:t.color,options:[{value:"#ffffff",label:"White"},{value:"#fff2e0",label:"Warm"},{value:"#e8f0ff",label:"Cool"}],onChange:g=>a({color:g}),style:{width:172}})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Ambient In…"}),e.jsx("span",{className:"prow-control",children:e.jsx(ue,{value:t.ambient,onChange:g=>a({ambient:Math.min(Math.max(g,0),2)})})})]}),e.jsxs("div",{className:"prow",children:[e.jsx("span",{className:"prow-label",children:"Tonemappi…"}),e.jsx("span",{className:"prow-control",children:e.jsx(Fe,{value:r?"yes":"no",options:["yes","no"],onChange:g=>_(g==="yes")})})]})]}),e.jsxs("section",{className:"spanel-section",children:[e.jsxs("header",{className:"section-head",children:[e.jsx("h2",{children:"Objects"}),e.jsx("button",{className:"iconbtn",title:"Add object",onClick:b,children:e.jsx(Ce,{size:17})})]}),e.jsx("div",{className:"layer-list",children:n.map(g=>{const y=ft.matcap;return e.jsxs("div",{className:`layer-row ${g.id===o?"selected":""} ${g.visible?"":"hidden"}`,children:[e.jsxs("button",{className:"row-main",onClick:()=>c(g.id),children:[e.jsx("span",{className:"row-chevron"}),e.jsx(y,{size:14}),e.jsx("span",{className:"row-name",children:g.name})]}),e.jsx(je,{value:g.geometry,options:Object.keys(nn).map(P=>({value:P,label:Ti[P]})),onChange:P=>v(g.id,P),style:{width:86}}),e.jsx("button",{className:"iconbtn",onClick:()=>f(g.id),children:g.visible?e.jsx(Re,{size:16}):e.jsx(Ye,{size:16})}),e.jsx("button",{className:"iconbtn remove",onClick:()=>h(g.id),children:e.jsx(tt,{size:14})})]},g.id)})}),e.jsx("p",{className:"panel-note",children:"点击画布中的物体可选中并编辑它的 Material 与 Effects；点击空白处取消选择。"})]})]})}),on="spline-material-lab.my-materials",Oi=()=>{try{const n=localStorage.getItem(on);return n?JSON.parse(n):[]}catch{return[]}},Ri=n=>{var o;for(const i of n){const t=De[i.kind],r=t.hexKey??((o=t.fields.find(c=>c.type==="color"))==null?void 0:o.key);if(r&&typeof i.params[r]=="string"){const c=i.params[r],u=t.fields.filter(_=>_.type==="color")[1],a=u&&typeof i.params[u.key]=="string"?i.params[u.key]:c;return[c,a]}}return["#9aa0a6","#3c3c3c"]},Yi=()=>{const[n,o]=p.useState(Ni),[i,t]=p.useState(null),[r,c]=p.useState(Vo),[u,a]=p.useState("dark"),[_,v]=p.useState({...Ho}),[f,h]=p.useState(!0),[b,g]=p.useState("scene"),[y,P]=p.useState("translate"),[k,N]=p.useState(Oi),[L,d]=p.useState(null),j=n.find(x=>x.id===i)??null;p.useEffect(()=>{g(j?"material":"scene")},[i]);const I=p.useCallback(x=>{N(x);try{localStorage.setItem(on,JSON.stringify(x))}catch{}},[]),D=p.useCallback((x,s)=>{o(E=>E.map(R=>R.id===x?{...R,...typeof s=="function"?s(R):s}:R))},[]),C=p.useCallback((x,s)=>{o(E=>E.map(R=>R.id===x?{...R,material:{...R.material,...typeof s=="function"?s(R.material):s}}:R))},[]),B=p.useCallback(x=>({updateMaterial:s=>C(x,E=>({...E,...s})),updateLayer:(s,E)=>C(x,R=>({...R,layers:R.layers.map(U=>U.id===s?{...U,...E}:U)})),updateLayerParam:(s,E,R)=>C(x,U=>({...U,layers:U.layers.map(re=>re.id===s?{...re,params:{...re.params,[E]:R}}:re)})),addLayer:s=>C(x,E=>({...E,layers:[...E.layers,ye(s)]})),setLayerKind:(s,E)=>C(x,R=>({...R,layers:R.layers.map(U=>{if(U.id!==s)return U;const re=De[E];return{...U,kind:E,name:re.label,params:{...re.defaults}}})})),removeLayer:s=>C(x,E=>({...E,layers:E.layers.filter(R=>R.id!==s)})),updateLighting:s=>C(x,E=>({...E,lighting:{...E.lighting,...s}})),updateEnv:s=>C(x,E=>({...E,env:{...E.env,...s}}))}),[C]),G=p.useCallback((x,s)=>D(x,s),[D]),M=p.useCallback(()=>{o(x=>[...x,Ai(x.length)])},[]),ne=p.useCallback(x=>{o(s=>s.filter(E=>E.id!==x)),i===x&&t(null)},[i]),ae=j?j.effects:r,Q=p.useCallback(x=>{j?D(j.id,s=>({effects:x(s.effects)})):c(s=>x(s))},[D,j]),H=p.useCallback((x,s)=>Q(E=>E.map(R=>R.id===x?{...R,...s}:R)),[Q]),K=p.useCallback((x,s,E)=>Q(R=>R.map(U=>U.id===x?{...U,params:{...U.params,[s]:E}}:U)),[Q]),oe=p.useCallback(x=>Q(s=>[...s,gt(x)]),[Q]),se=p.useCallback(x=>Q(s=>s.filter(E=>E.id!==x)),[Q]),q=p.useCallback(x=>{Q(()=>x)},[Q]),W=p.useCallback(x=>{if(!j)return;const s=ei(x);C(j.id,E=>({...E,opacity:s.opacity,layers:s.layers,lighting:s.lighting})),d(x.id)},[C,j]),Z=p.useCallback(()=>{if(!j)return;const x=j.material,s=`My Material ${k.length+1}`,E={id:`mine-${Date.now()}`,name:s,library:"mine",category:"Custom",swatch:Ri(x.layers),spec:{opacity:x.opacity,layers:x.layers.map(R=>({kind:R.kind,overrides:{mode:R.mode,opacity:R.opacity,visible:R.visible,params:{...R.params}}})),lighting:{...x.lighting}}};I([...k,E])},[k,I,j]),S=p.useCallback(x=>{I(k.filter(s=>s.id!==x)),L===x&&d(null)},[L,k,I]),F=ae.length;return e.jsxs("div",{className:"lab",children:[e.jsxs("div",{className:`viewport ${he[u].light?"light":""}`,children:[e.jsx(Ci,{objects:n,selectedId:i,scene:u,globalEffects:r,transformMode:y,sceneLight:_,tonemapping:f,onSelect:t,onTransform:G}),e.jsx("div",{className:"viewport-toolbar",children:e.jsx("div",{className:"vt-group",children:Object.keys(he).map(x=>e.jsx("button",{className:u===x?"on":"",onClick:()=>a(x),children:he[x].label},x))})}),j?e.jsxs("div",{className:"object-toolbar",children:[e.jsx("span",{className:"object-name",children:j.name}),e.jsx("span",{className:"vt-divider"}),["translate","rotate","scale"].map(x=>e.jsx("button",{className:y===x?"on":"",onClick:()=>P(x),children:x==="translate"?"Move":x==="rotate"?"Rotate":"Scale"},x)),e.jsx("span",{className:"vt-divider"}),e.jsx("button",{onClick:()=>t(null),children:"Deselect"})]}):null,e.jsx("div",{className:"viewport-hint",children:j?"拖拽 gizmo 调整物体 · 点击空白取消选择":"点击物体选择 · Spline Library 26 presets"})]}),e.jsxs("div",{className:"spanel-col",children:[e.jsx("div",{className:"spanel-tabs",children:j?e.jsxs(e.Fragment,{children:[e.jsx("button",{className:b==="material"?"on":"",onClick:()=>g("material"),children:"Material"}),e.jsxs("button",{className:b==="effects"?"on":"",onClick:()=>g("effects"),children:["Effects",F?` ${F}`:""]})]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{className:b==="scene"?"on":"",onClick:()=>g("scene"),children:"Scene"}),e.jsxs("button",{className:b==="effects"?"on":"",onClick:()=>g("effects"),children:["Effects",F?` ${F}`:""]})]})}),j&&b==="material"?e.jsx(ai,{material:j.material,actions:B(j.id),myMaterials:k,appliedPresetId:L,onApplyPreset:W,onSavePreset:Z,onDeletePreset:S}):null,!j&&b==="scene"?e.jsx(Li,{objects:n,selectedId:i,scene:u,sceneLight:_,tonemapping:f,onSelect:t,onSelectScene:a,onChangeLight:x=>v(s=>({...s,...x})),onToggleTonemapping:h,onChangeGeometry:(x,s)=>D(x,{geometry:s}),onToggleObject:x=>D(x,s=>({visible:!s.visible})),onRemoveObject:ne,onAddObject:M}):null,b==="effects"?e.jsx(ii,{effects:ae,onUpdate:H,onUpdateParam:K,onAdd:oe,onRemove:se,onApplyPreset:q}):null]})]})};vn.createRoot(document.getElementById("root")).render(e.jsx(Yi,{}));
