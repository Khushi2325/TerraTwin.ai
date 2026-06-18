import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';

function PlanetSphere({ forestScore }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Simple color logic based on forest score for MVP
  const isHealthy = forestScore > 50;
  const planetColor = isHealthy ? '#10b981' : '#f59e0b'; // Green vs Orange/Brown

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        color={planetColor} 
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

export default function TerraTwinWorld({ stats = { forest: 80, water: 70, air: 65, wildlife: 90 } }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-700 shadow-2xl">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <PlanetSphere forestScore={stats.forest} />
        
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={10} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
      
      {/* Overlay Stats */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2 p-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-600/50">
        <StatBadge label="Forest" value={stats.forest} color="text-emerald-400" />
        <StatBadge label="Water" value={stats.water} color="text-blue-400" />
        <StatBadge label="Air" value={stats.air} color="text-teal-300" />
        <StatBadge label="Wildlife" value={stats.wildlife} color="text-orange-400" />
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-xl font-bold ${color}`}>{value}/100</span>
    </div>
  );
}
