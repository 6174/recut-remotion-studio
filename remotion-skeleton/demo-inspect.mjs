import { readFileSync } from "node:fs";
import zlib from "node:zlib";
function decodePng(path){const buf=readFileSync(path);let pos=8,w=0,h=0,ct=0;const idat=[];while(pos<buf.length){const len=buf.readUInt32BE(pos);const t=buf.toString("ascii",pos+4,pos+8);const d=buf.subarray(pos+8,pos+8+len);if(t==="IHDR"){w=d.readUInt32BE(0);h=d.readUInt32BE(4);ct=d[9];}else if(t==="IDAT")idat.push(d);pos+=12+len;}const ch=ct===6?4:ct===2?3:1;const raw=zlib.inflateSync(Buffer.concat(idat));const stride=w*ch;const out=Buffer.alloc(w*h*ch);let prev=Buffer.alloc(stride);for(let y=0;y<h;y++){const f=raw[y*(stride+1)];const row=raw.subarray(y*(stride+1)+1,(y+1)*(stride+1));const cur=Buffer.alloc(stride);for(let x=0;x<stride;x++){const a=x>=ch?cur[x-ch]:0,b=prev[x],c=x>=ch?prev[x-ch]:0;let v=row[x];if(f===1)v+=a;else if(f===2)v+=b;else if(f===3)v+=(a+b)>>1;else if(f===4){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);v+=pa<=pb&&pa<=pc?a:pb<=pc?b:c;}cur[x]=v&0xff;}cur.copy(out,y*stride);prev=cur;}return{w,h,ch,data:out};}
function px(img,x,y){const i=(y*img.w+x)*img.ch;return[img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]];}
function stats(img,x0,y0,x1,y1,pred){let n=0,t=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){t++;if(pred(px(img,x,y)))n++;}return(n/t*100).toFixed(1);}
for(const f of ["cursor-30.png","cursor-90.png","magnifier-90.png","focus-spotlight-90.png"]){
  const img=decodePng(`demo-render-out/${f}`);
  const white=stats(img,0,0,img.w,img.h,([r,g,b])=>r>190&&g>190&&b>190);
  console.log(f,"| content coverage:",stats(img,200,150,1720,930,([r,g,b])=>r+g+b>60)+"%","| white:",white+"%","| corner:",px(img,20,20).join(","),"| center:",px(img,960,540).join(","));
}
