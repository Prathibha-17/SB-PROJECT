import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function hexShade(hex, amt) {
  const n = parseInt(hex.replace('#',''), 16);
  const cl = v => Math.min(255, Math.max(0, v));
  return `rgb(${cl((n>>16)+amt)},${cl(((n>>8)&0xff)+amt)},${cl((n&0xff)+amt)})`;
}

/* ── LEATHER COVER TEXTURE ── */
function makeCover(base, accent, title) {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const c = cv.getContext('2d');

  // leather gradient
  const g = c.createLinearGradient(0,0,S,S);
  g.addColorStop(0, hexShade(base,22)); g.addColorStop(0.5,base); g.addColorStop(1,hexShade(base,-44));
  c.fillStyle = g; c.fillRect(0,0,S,S);

  // grain
  for (let i=0;i<9000;i++){
    c.fillStyle=`rgba(0,0,0,${Math.random()*0.065})`;
    c.fillRect(Math.random()*S,Math.random()*S,1+Math.random(),1);
  }

  // gold outer border
  c.strokeStyle=accent; c.lineWidth=15; c.strokeRect(20,20,S-40,S-40);
  // inner hairline
  c.strokeStyle=`rgba(251,191,36,0.32)`; c.lineWidth=3; c.strokeRect(40,40,S-80,S-80);

  // corner brackets
  c.fillStyle=accent;
  [[40,40,1,1],[S-40,40,-1,1],[40,S-40,1,-1],[S-40,S-40,-1,-1]].forEach(([x,y,sx,sy])=>{
    c.fillRect(x,y,sx*38,sy*5); c.fillRect(x,y,sx*5,sy*38);
  });

  // mandala
  c.strokeStyle=`rgba(251,191,36,0.55)`; c.lineWidth=4;
  c.beginPath(); c.arc(S/2,S*0.44,104,0,Math.PI*2); c.stroke();
  c.strokeStyle=`rgba(251,191,36,0.22)`; c.lineWidth=2;
  c.beginPath(); c.arc(S/2,S*0.44,80,0,Math.PI*2); c.stroke();

  // spokes
  c.strokeStyle=`rgba(251,191,36,0.18)`; c.lineWidth=1.2;
  for(let a=0;a<Math.PI*2;a+=Math.PI/8){
    c.beginPath();
    c.moveTo(S/2+Math.cos(a)*56,S*0.44+Math.sin(a)*56);
    c.lineTo(S/2+Math.cos(a)*104,S*0.44+Math.sin(a)*104);
    c.stroke();
  }

  c.fillStyle='rgba(255,255,255,0.90)'; c.font='bold 27px serif'; c.textAlign='center';
  c.fillText(title,S/2,S*0.78);

  return new THREE.CanvasTexture(cv);
}

/* ── PAGE TEXTURE ── */
function makePage(isLeft) {
  const S = 512;
  const cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  const c = cv.getContext('2d');

  const g = c.createLinearGradient(0,0,S,0);
  g.addColorStop(0,'#fefce8'); g.addColorStop(1,'#fdf8e3');
  c.fillStyle=g; c.fillRect(0,0,S,S);

  // grain
  for(let i=0;i<3500;i++){
    c.fillStyle=`rgba(160,120,70,${Math.random()*0.04})`;
    c.fillRect(Math.random()*S,Math.random()*S,1.5,1.5);
  }

  // spine shadow
  const sg = c.createLinearGradient(isLeft?S*0.82:0,0,isLeft?S:S*0.18,0);
  sg.addColorStop(0,'rgba(0,0,0,0)'); sg.addColorStop(1,'rgba(0,0,0,0.20)');
  c.fillStyle=sg; c.fillRect(isLeft?S*0.82:0,0,S*0.18,S);

  // text lines
  const lx=isLeft?52:72, rx=isLeft?S*0.78:S*0.88;
  c.fillStyle='rgba(22,14,6,0.46)';
  for(let y=96;y<S-65;y+=21){
    c.fillRect(lx,y,(rx-lx)*(0.62+Math.random()*0.36),4);
  }

  // drop cap
  if(isLeft){
    c.font='bold 76px Georgia,serif'; c.fillStyle='#4338ca';
    c.fillText('T',lx,178);
    c.fillStyle='rgba(67,56,202,0.28)';
    c.fillRect(lx+60,106,rx-lx-62,5);
    c.fillRect(lx+60,126,rx-lx-100,5);
  }

  c.font='12px Georgia,serif'; c.fillStyle='rgba(0,0,0,0.28)';
  c.textAlign='center'; c.fillText(isLeft?'42':'43',S/2,S-42);

  return new THREE.CanvasTexture(cv);
}

/* ══════════════════════════════════════════════════════
   OPEN BOOK  —  centred, dual page flip animation
══════════════════════════════════════════════════════ */
const OpenBook = () => {
  const rootRef  = useRef();
  const flipRef  = useRef();
  const glowRef  = useRef();
  const flipProg = useRef(0);

  const leftTex  = useMemo(()=>makePage(true),  []);
  const rightTex = useMemo(()=>makePage(false), []);
  const coverTex = useMemo(()=>makeCover('#2d0c02','#d97706','MAGIC'), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // gentle float
    if(rootRef.current){
      rootRef.current.position.y = Math.sin(t*1.15)*0.10;
      rootRef.current.rotation.z = Math.sin(t*0.50)*0.022;
      rootRef.current.rotation.x = Math.sin(t*0.38)*0.016;
    }

    // page flip: advances continuously, pauses between flips
    flipProg.current += 0.007;
    const cycleLen = Math.PI + 0.9; // PI of flip + 0.9s pause
    const raw = flipProg.current % cycleLen;
    const angle = Math.min(raw, Math.PI); // clamp to 0→PI

    if(flipRef.current) flipRef.current.rotation.y = -angle;

    // SSS glow pulse
    if(glowRef.current){
      glowRef.current.material.opacity = 0.18 + Math.sin(t*2.8)*0.09;
    }
  });

  return (
    <group ref={rootRef} position={[0,0.15,0]} scale={1.05}>
      {/* LEFT COVER */}
      <mesh position={[-0.72,0,-0.042]} rotation={[0,0.09,0]} castShadow>
        <boxGeometry args={[1.42,1.88,0.055]}/>
        <meshStandardMaterial color="#2d0c02" map={coverTex} roughness={0.63} metalness={0.05}/>
      </mesh>

      {/* RIGHT COVER */}
      <mesh position={[0.72,0,-0.042]} rotation={[0,-0.09,0]} castShadow>
        <boxGeometry args={[1.42,1.88,0.055]}/>
        <meshStandardMaterial color="#1a0801" map={coverTex} roughness={0.63} metalness={0.05}/>
      </mesh>

      {/* SPINE */}
      <mesh position={[0,0,-0.050]} castShadow>
        <boxGeometry args={[0.12,1.90,0.065]}/>
        <meshStandardMaterial color="#090401" roughness={0.55} metalness={0.08}/>
      </mesh>

      {/* LEFT STATIC PAGE */}
      <mesh position={[-0.71,0,0.012]} rotation={[0,0.065,0]}>
        <boxGeometry args={[1.38,1.82,0.014]}/>
        <meshStandardMaterial map={leftTex} roughness={0.82}/>
      </mesh>

      {/* RIGHT STATIC PAGE */}
      <mesh position={[0.71,0,0.012]} rotation={[0,-0.065,0]}>
        <boxGeometry args={[1.38,1.82,0.014]}/>
        <meshStandardMaterial map={rightTex} roughness={0.82}/>
      </mesh>

      {/* FLIPPING PAGE  — pivot at spine (x=0) */}
      <group ref={flipRef} position={[0,0,0.020]}>
        {/* front face shows right page going left */}
        <mesh position={[0.69,0,0.002]}>
          <boxGeometry args={[1.38,1.82,0.004]}/>
          <meshStandardMaterial map={rightTex} roughness={0.80} side={THREE.FrontSide}/>
        </mesh>
        {/* back face shows left page */}
        <mesh position={[0.69,0,-0.002]}>
          <boxGeometry args={[1.38,1.82,0.004]}/>
          <meshStandardMaterial map={leftTex} roughness={0.80} side={THREE.BackSide}/>
        </mesh>
      </group>

      {/* SPINE GOLDEN GLOW STRIP */}
      <mesh position={[0,0,0.025]}>
        <boxGeometry args={[0.050,1.84,0.006]}/>
        <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={3.8}
          transparent opacity={0.92} toneMapped={false}/>
      </mesh>

      {/* SSS GLOW PLANE */}
      <mesh ref={glowRef} position={[0,0,0.032]}>
        <planeGeometry args={[0.55,1.84]}/>
        <meshBasicMaterial color="#fffbda" transparent opacity={0.22}
          blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* INTERNAL WARM LIGHT — core magic from crease */}
      <pointLight position={[0,0.2,0.5]} intensity={5.5} distance={6.5} color="#f59e0b" decay={2}/>
      <pointLight position={[0,0.6,0.3]} intensity={2.8} distance={4.5} color="#fde68a" decay={2}/>
    </group>
  );
};

/* ══════════════════════════════════════════════════════
   STACKED CLOSED BOOK
══════════════════════════════════════════════════════ */
const StackBook = ({ pos, ry, color, accent, title, thick=0.24 }) => {
  const cover = useMemo(()=>makeCover(color,accent,title),[color,accent,title]);
  return (
    <group position={pos} rotation={[0,ry,0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.26,thick,1.68]}/>
        <meshStandardMaterial attach="material-0" color="#f0ead8" roughness={0.88}/>
        <meshStandardMaterial attach="material-1" color="#f0ead8" roughness={0.88}/>
        <meshStandardMaterial attach="material-2" color={color} map={cover} roughness={0.64} metalness={0.05}/>
        <meshStandardMaterial attach="material-3" color={color} roughness={0.68}/>
        <meshStandardMaterial attach="material-4" color="#e8e0cc" roughness={0.85}/>
        <meshStandardMaterial attach="material-5" color={hexShade(color,-28)} roughness={0.60}/>
      </mesh>
      {/* gold fore-edge */}
      <mesh position={[0,0,0.844]}>
        <boxGeometry args={[2.28,thick+0.006,0.013]}/>
        <meshStandardMaterial color={accent} metalness={0.82} roughness={0.18} emissive={accent} emissiveIntensity={0.22}/>
      </mesh>
      {/* spine ridges */}
      {[-0.5,-0.12,0.26,0.60].map((z,i)=>(
        <mesh key={i} position={[-1.134,0,z]}>
          <boxGeometry args={[0.015,thick+0.008,0.022]}/>
          <meshStandardMaterial color={accent} metalness={0.80} roughness={0.20}/>
        </mesh>
      ))}
    </group>
  );
};

/* ══════════════════════════════════════════════════════
   FALLING BOOKS  — fall from top, tumble, loop back up
══════════════════════════════════════════════════════ */
const FALL_DATA = [
  { color:'#3b0764', accent:'#c084fc', title:'MYSTIC',  sx:-2.20, sz:-0.80, sy:4.2,  spd:0.014, rx:0.55, rz:-0.30, rySpd:0.009 },
  { color:'#1e3a8a', accent:'#60a5fa', title:'COSMOS',  sx:-1.50, sz: 0.55, sy:5.5,  spd:0.010, rx:0.40, rz: 0.20, rySpd:0.007 },
  { color:'#0f172a', accent:'#38bdf8', title:'NAVY',    sx:-2.80, sz: 0.20, sy:3.8,  spd:0.016, rx:0.70, rz: 0.38, rySpd:0.011 },
  { color:'#78350f', accent:'#fcd34d', title:'ANTIQUE', sx: 2.10, sz:-0.70, sy:4.8,  spd:0.012, rx:0.35, rz: 0.28, rySpd:0.008 },
  { color:'#4c1d95', accent:'#a78bfa', title:'ARCANE',  sx: 1.80, sz: 0.80, sy:6.0,  spd:0.009, rx:0.60, rz:-0.22, rySpd:0.010 },
  { color:'#7c2d12', accent:'#fb923c', title:'FLAME',   sx: 2.60, sz:-0.30, sy:3.5,  spd:0.017, rx:0.45, rz: 0.35, rySpd:0.012 },
  { color:'#064e3b', accent:'#34d399', title:'REALM',   sx:-0.80, sz:-1.80, sy:5.2,  spd:0.011, rx:0.50, rz:-0.18, rySpd:0.009 },
  { color:'#881337', accent:'#fb7185', title:'LEGEND',  sx: 0.60, sz: 1.90, sy:4.0,  spd:0.015, rx:0.38, rz: 0.44, rySpd:0.010 },
];

const FallingBook = ({ d }) => {
  const meshRef = useRef();
  const yPos    = useRef(d.sy + Math.random()*2.2); // staggered start
  const cover   = useMemo(()=>makeCover(d.color,d.accent,d.title),[d.color,d.accent,d.title]);

  useFrame(() => {
    if(!meshRef.current) return;

    // descend
    yPos.current -= d.spd;
    if(yPos.current < -3.5) yPos.current = d.sy + Math.random()*1.8;

    meshRef.current.position.y = yPos.current;
    // sinusoidal drift so they don't fall perfectly straight
    meshRef.current.position.x = d.sx + Math.sin(yPos.current*0.45)*0.25;
    meshRef.current.position.z = d.sz + Math.cos(yPos.current*0.45)*0.20;

    // tumble
    meshRef.current.rotation.x += d.rySpd * 0.38;
    meshRef.current.rotation.y += d.rySpd;
    meshRef.current.rotation.z += d.rySpd * 0.22;
  });

  return (
    <mesh ref={meshRef}
      position={[d.sx, yPos.current, d.sz]}
      rotation={[d.rx, 0, d.rz]}
      scale={[0.30,0.43,0.045]}
      castShadow
    >
      <boxGeometry args={[1.5,2.0,0.9]}/>
      <meshStandardMaterial attach="material-0" color="#f0ead8" roughness={0.88}/>
      <meshStandardMaterial attach="material-1" color="#f0ead8" roughness={0.88}/>
      <meshStandardMaterial attach="material-2" color={d.color} map={cover} roughness={0.64} metalness={0.05}/>
      <meshStandardMaterial attach="material-3" color={d.color} roughness={0.68}/>
      <meshStandardMaterial attach="material-4" color={d.color} map={cover} roughness={0.18} metalness={0.40}/>
      <meshStandardMaterial attach="material-5" color={hexShade(d.color,-25)} roughness={0.60}/>
    </mesh>
  );
};

/* ══════════════════════════════════════════════════════
   NEON HOLOGRAPHIC PEDESTAL
══════════════════════════════════════════════════════ */
const Pedestal = () => {
  const dashRingRef = useRef();
  const haloRef     = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if(dashRingRef.current) dashRingRef.current.rotation.z = t * 0.40;
    if(haloRef.current)     haloRef.current.material.opacity = 0.08 + Math.sin(t*1.9)*0.04;
  });

  return (
    <group position={[0,-1.70,0]}>
      {/* Dark reflective disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.94,2.06,0.10,80]}/>
        <meshStandardMaterial color="#030308" roughness={0.06} metalness={0.98}/>
      </mesh>

      {/* Outer neon CYAN torus */}
      <mesh rotation={[Math.PI/2,0,0]} position={[0,0.055,0]}>
        <torusGeometry args={[1.90,0.025,16,128]}/>
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={8.0} roughness={0.08} toneMapped={false}/>
      </mesh>

      {/* Middle indigo torus */}
      <mesh rotation={[Math.PI/2,0,0]} position={[0,0.057,0]}>
        <torusGeometry args={[1.62,0.013,12,100]}/>
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={5.0} roughness={0.15} toneMapped={false}/>
      </mesh>

      {/* Animated gold inner dash ring */}
      <mesh ref={dashRingRef} rotation={[Math.PI/2,0,0]} position={[0,0.059,0]}>
        <torusGeometry args={[1.32,0.008,8,80]}/>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3.5} roughness={0.20} toneMapped={false}/>
      </mesh>

      {/* Bloom halo on floor */}
      <mesh ref={haloRef} rotation={[-Math.PI/2,0,0]} position={[0,-0.056,0]}>
        <ringGeometry args={[1.6,3.2,80]}/>
        <meshBasicMaterial color="#0077ff" transparent opacity={0.09}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>

      {/* Reflective floor plane */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.062,0]} receiveShadow>
        <planeGeometry args={[14,14]}/>
        <meshStandardMaterial color="#01010a" roughness={0.07} metalness={0.96}/>
      </mesh>

      {/* Neon blue under-light */}
      <pointLight position={[0,0.08,0]} intensity={4.0} distance={5.0} color="#00e5ff" decay={2}/>
    </group>
  );
};

/* ══════════════════════════════════════════════════════
   VOLUMETRIC LIGHT RAYS
══════════════════════════════════════════════════════ */
const LightRays = () => {
  const cone1Ref = useRef();
  const cone2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if(cone1Ref.current){
      cone1Ref.current.rotation.y = t * 0.11;
      cone1Ref.current.material.opacity = 0.048 + Math.sin(t*2.1)*0.016;
    }
    if(cone2Ref.current){
      cone2Ref.current.rotation.y = -t * 0.085;
      cone2Ref.current.material.opacity = 0.032 + Math.sin(t*1.7)*0.013;
    }
  });

  return (
    <group position={[0,0.85,0]}>
      <mesh ref={cone1Ref}>
        <cylinderGeometry args={[0.01,2.0,2.9,40,1,true]}/>
        <meshBasicMaterial color="#fef3c7" transparent opacity={0.048}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      <mesh ref={cone2Ref}>
        <cylinderGeometry args={[0.01,1.2,2.7,32,1,true]}/>
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.032}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
      {/* apex glow ball */}
      <mesh position={[0,-1.42,0]}>
        <sphereGeometry args={[0.20,16,16]}/>
        <meshBasicMaterial color="#fde68a" transparent opacity={0.42}
          blending={THREE.AdditiveBlending} depthWrite={false}/>
      </mesh>
    </group>
  );
};

/* ══════════════════════════════════════════════════════
   GOLDEN EMBERS (rising fireflies)
══════════════════════════════════════════════════════ */
const GoldenEmbers = ({ count = 260 }) => {
  const ref = useRef();

  // all arrays are captured in useMemo and used in useFrame closure — safe
  const { pos, spd, wob } = useMemo(() => {
    const pos = new Float32Array(count*3);
    const spd = new Float32Array(count);
    const wob = new Float32Array(count);
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2, r=Math.random()*2.1;
      pos[i*3]  =Math.cos(a)*r;
      pos[i*3+1]=-1.7+Math.random()*4.4;
      pos[i*3+2]=Math.sin(a)*r;
      spd[i]=0.005+Math.random()*0.013;
      wob[i]=Math.random()*Math.PI*2;
    }
    return { pos, spd, wob };
  }, [count]);

  useFrame(() => {
    if(!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for(let i=0;i<count;i++){
      arr[i*3+1] += spd[i];
      arr[i*3]   += Math.sin(arr[i*3+1]*2.6+wob[i])*0.0022;
      arr[i*3+2] += Math.cos(arr[i*3+1]*2.6+wob[i])*0.0022;
      if(arr[i*3+1] > 2.7){
        const a=Math.random()*Math.PI*2, r=Math.random()*1.9;
        arr[i*3]=Math.cos(a)*r; arr[i*3+1]=-1.7; arr[i*3+2]=Math.sin(a)*r;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
      </bufferGeometry>
      <pointsMaterial color="#fbbf24" size={0.050} transparent opacity={0.90}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation/>
    </points>
  );
};

/* ══════════════════════════════════════════════════════
   DUST MOTES
══════════════════════════════════════════════════════ */
const DustMotes = ({ count=320 }) => {
  const ref = useRef();
  const { pos } = useMemo(()=>{
    const pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      pos[i*3]=(Math.random()-0.5)*9;
      pos[i*3+1]=(Math.random()-0.5)*6;
      pos[i*3+2]=(Math.random()-0.5)*6;
    }
    return { pos };
  },[count]);

  useFrame(({ clock }) => {
    if(!ref.current) return;
    const arr=ref.current.geometry.attributes.position.array;
    const t=clock.getElapsedTime();
    for(let i=0;i<count;i++){
      arr[i*3]  +=Math.sin(t*0.25+i*0.6)*0.0007;
      arr[i*3+1]+=0.00055;
      arr[i*3+2]+=Math.cos(t*0.25+i*0.6)*0.0007;
      if(arr[i*3+1]>3.2) arr[i*3+1]=-3.0;
    }
    ref.current.geometry.attributes.position.needsUpdate=true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]}/>
      </bufferGeometry>
      <pointsMaterial color="#e8dfc8" size={0.013} transparent opacity={0.28}
        blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation/>
    </points>
  );
};

/* ══════════════════════════════════════════════════════
   DARK LIBRARY BACKDROP (canvas bokeh bookshelves)
══════════════════════════════════════════════════════ */
const LibraryBackdrop = () => {
  const tex = useMemo(()=>{
    const W=1024,H=512;
    const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
    const ctx=cv.getContext('2d');

    ctx.fillStyle='#03040e'; ctx.fillRect(0,0,W,H);

    // shelf rows
    for(let row=0;row<9;row++){
      const y=row*60;
      ctx.fillStyle='#14100a'; ctx.fillRect(0,y+52,W,8);
      let x=0;
      while(x<W){
        const bw=11+Math.random()*21, bh=20+Math.random()*32;
        ctx.fillStyle=Math.random()>0.5
          ?`hsl(${220+Math.random()*55},38%,${7+Math.random()*10}%)`
          :`hsl(${24+Math.random()*32},28%,${9+Math.random()*8}%)`;
        ctx.fillRect(x,y+52-bh,bw,bh);
        if(Math.random()>0.55){ ctx.fillStyle='rgba(180,130,12,0.24)'; ctx.fillRect(x,y+52-bh,1,bh); }
        x+=bw+1;
      }
    }

    // bokeh glow dots
    for(let i=0;i<110;i++){
      const bx=Math.random()*W, by=Math.random()*H, br=4+Math.random()*28;
      const gd=ctx.createRadialGradient(bx,by,0,bx,by,br);
      gd.addColorStop(0,Math.random()>0.55?'rgba(235,170,50,0.17)':'rgba(65,105,255,0.11)');
      gd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gd; ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill();
    }

    // vignette
    const vg=ctx.createRadialGradient(W/2,H/2,H*0.18,W/2,H/2,H*0.88);
    vg.addColorStop(0,'rgba(3,4,14,0)'); vg.addColorStop(1,'rgba(3,4,14,0.68)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    return new THREE.CanvasTexture(cv);
  },[]);

  return (
    <mesh position={[0,0.5,-6.2]}>
      <planeGeometry args={[26,14]}/>
      <meshBasicMaterial map={tex} depthWrite={false}/>
    </mesh>
  );
};

/* ══════════════════════════════════════════════════════
   CINEMATIC LIGHTING  (3-tier)
══════════════════════════════════════════════════════ */
const Lighting = () => (
  <>
    {/* TIER 1 – core warm light from inside open book */}
    <pointLight position={[0,0.4,0.65]} intensity={7.0} distance={7.5} color="#f59e0b" decay={2} castShadow
      shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    <pointLight position={[0,0.75,0.38]} intensity={3.2} distance={5.5} color="#fde68a" decay={2}/>

    {/* TIER 2 – neon cyan from pedestal ring */}
    <pointLight position={[0,-1.65,0]} intensity={4.5} distance={5.5} color="#00e5ff" decay={2}/>

    {/* TIER 3 – cool blue rim from back (separates books from dark BG) */}
    <directionalLight position={[0,4,-6]} intensity={0.65} color="#93c5fd"/>

    {/* Purple cinematic fill from side */}
    <directionalLight position={[-4,2,0.5]} intensity={0.85} color="#a855f7"/>

    {/* Very dark ambient */}
    <ambientLight intensity={0.10} color="#06041a"/>
  </>
);

/* ══════════════════════════════════════════════════════
   MAIN SCENE  (mouse parallax wrapper)
══════════════════════════════════════════════════════ */
const Scene = ({ mouseX, mouseY }) => {
  const groupRef = useRef();

  useFrame(() => {
    if(!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX.current*0.28, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY.current*0.16, 0.04);
  });

  return (
    <>
      <LibraryBackdrop/>

      <group ref={groupRef}>
        {/* PEDESTAL */}
        <Pedestal/>

        {/* BOOK STACK (3 antique hardbacks) */}
        <StackBook pos={[0,-1.46,0]} ry={ 0.12} color="#5c350a" accent="#d97706" title="ARCANA"  thick={0.28}/>
        <StackBook pos={[0,-1.16,0]} ry={-0.21} color="#1e1b4b" accent="#818cf8" title="COSMOS"  thick={0.24}/>
        <StackBook pos={[0,-0.90,0]} ry={ 0.09} color="#0c1a3b" accent="#60a5fa" title="MYTHOS"  thick={0.22}/>

        {/* OPEN BOOK – centred and floating above stack */}
        <OpenBook/>

        {/* LIGHT RAYS */}
        <LightRays/>

        {/* EMBERS + DUST */}
        <GoldenEmbers count={260}/>
        <DustMotes count={310}/>

        {/* 8 FALLING BOOKS */}
        {FALL_DATA.map((d,i) => <FallingBook key={i} d={d}/>)}
      </group>
    </>
  );
};

/* ══════════════════════════════════════════════════════
   ROOT CANVAS EXPORT
══════════════════════════════════════════════════════ */
const Book3D = () => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const fn = e => {
      mouseX.current =  (e.clientX/window.innerWidth)*2 - 1;
      mouseY.current = -(e.clientY/window.innerHeight)*2 + 1;
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <div style={{ width:'100%', height:'100%', minHeight:'560px', position:'relative', zIndex:5 }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.55,
        }}
        camera={{ position:[0,0.05,4.8], fov:40, near:0.1, far:40 }}
        style={{ background:'transparent' }}
      >
        <Lighting/>
        <Scene mouseX={mouseX} mouseY={mouseY}/>
      </Canvas>
    </div>
  );
};

export default Book3D;
