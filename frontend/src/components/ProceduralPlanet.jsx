import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── GLSL NOISE DEFINITION ──
const noiseGLSL = `
// Description : Array and textureless GLSL 2D/3D/4D noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
`;

// ── EARTH SHADER ──
const planetVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const planetFragmentShader = `
uniform float uTime;
uniform float uHealth; // 0.0 (barren) to 1.0 (flourishing)
uniform vec3 uLightDir;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

${noiseGLSL}

void main() {
  vec3 normPos = normalize(vPosition);
  
  // Calculate continent elevations using fractional Brownian motion noise
  float elevation = fbm(normPos * 2.2 + vec3(0.0, 0.0, uTime * 0.02));
  
  // Base colors
  vec3 finalColor = vec3(0.0);
  float isLand = 0.0;
  
  if (elevation < -0.05) {
    // Deep Ocean
    float depth = smoothstep(-0.6, -0.05, elevation);
    vec3 deepWater = vec3(0.01, 0.05, 0.2);
    vec3 shallowWater = vec3(0.05, 0.22, 0.45);
    finalColor = mix(deepWater, shallowWater, depth);
  } else {
    // Land
    isLand = 1.0;
    float landElevation = smoothstep(-0.05, 0.5, elevation);
    
    // Dynamic land coloring based on health
    // HEALTHY state (emerald forests, rich grasslands, white peaks)
    vec3 forestColor = vec3(0.03, 0.35, 0.16);
    vec3 landColor = vec3(0.06, 0.48, 0.22);
    vec3 peakColor = vec3(0.9, 0.95, 0.92);
    
    // UNHEALTHY / BARREN state (dry sand, parched brown mud, dead volcanic cracks)
    vec3 deadBase = vec3(0.38, 0.26, 0.2);
    vec3 deadDry = vec3(0.55, 0.45, 0.35);
    vec3 toxicCracks = vec3(0.75, 0.3, 0.15); // Glowing dry red/orange cracks
    
    // Interpolate biome based on elevation
    vec3 healthyLand = mix(landColor, forestColor, landElevation);
    if (landElevation > 0.7) {
      healthyLand = mix(healthyLand, peakColor, (landElevation - 0.7) / 0.3);
    }
    
    // Cracked dry land on barren
    float crackPattern = snoise(normPos * 15.0);
    vec3 barrenLand = mix(deadBase, deadDry, landElevation);
    if (crackPattern > 0.6) {
      barrenLand = mix(barrenLand, toxicCracks, 0.8);
    }
    
    // Mix healthy vs barren based on uHealth
    finalColor = mix(barrenLand, healthyLand, uHealth);
  }

  // Lighting calculations
  vec3 normNormal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  
  // Diffuse shading
  float diffuse = max(dot(normNormal, lightDir), 0.0);
  
  // Specular sheen on oceans
  float specular = 0.0;
  if (isLand < 0.5) {
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Simple orthographic viewer approximation
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(normNormal, halfDir), 0.0);
    specular = pow(specAngle, 32.0) * 0.8;
  }
  
  // Ambient lighting
  vec3 ambient = finalColor * 0.15;
  
  // City lights on the dark side of the planet
  float darkSide = max(dot(normNormal, -lightDir), 0.0);
  darkSide = smoothstep(0.1, 0.8, darkSide); // threshold dark side
  float cityGlowNoise = snoise(normPos * 30.0);
  float cityDetail = snoise(normPos * 80.0);
  float cityPresence = smoothstep(0.4, 0.6, cityGlowNoise) * smoothstep(0.2, 0.8, cityDetail);
  
  // Cities glow gold, only on land and only on the dark side
  // Barren planets have dim, flickering red city lights, healthy has warm amber lights
  vec3 cityLightColor = mix(vec3(0.9, 0.3, 0.05), vec3(0.1, 0.8, 0.9), uHealth); // neon cyan if super healthy!
  cityLightColor = mix(vec3(0.9, 0.6, 0.1), cityLightColor, 0.5); // gold-amber mix
  vec3 cityLights = cityLightColor * cityPresence * darkSide * 2.2 * isLand;
  
  // Combine all lights
  vec3 litColor = ambient + finalColor * diffuse + vec3(specular) * diffuse + cityLights;
  
  // Soft rim shading
  float rim = 1.0 - max(dot(normNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  rim = pow(rim, 4.0);
  litColor += mix(vec3(0.1, 0.8, 0.5), vec3(0.0, 0.4, 0.9), uHealth) * rim * diffuse * 0.6;
  
  gl_FragColor = vec4(litColor, 1.0);
}
`;

// ── CLOUDS SHADER ──
const cloudsVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudsFragmentShader = `
uniform float uTime;
uniform vec3 uLightDir;
uniform float uHealth;

varying vec3 vNormal;
varying vec3 vPosition;

${noiseGLSL}

void main() {
  vec3 normPos = normalize(vPosition);
  
  // Clouds float in standard noise
  float cloudNoise = fbm(normPos * 1.8 + vec3(uTime * 0.04, 0.0, uTime * 0.03));
  
  // Threshold to make distinct clouds
  float cloudAlpha = smoothstep(0.1, 0.6, cloudNoise);
  
  // Limit cloud cover based on health (unhealthy planets have thin/wispy grey clouds or yellow smog)
  vec3 cloudColor = mix(vec3(0.7, 0.65, 0.55), vec3(0.96, 0.98, 1.0), uHealth); // grey/acid smog vs clean white clouds
  
  // Lighting
  vec3 normNormal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDir);
  float diffuse = max(dot(normNormal, lightDir), 0.0);
  
  vec3 finalCloud = cloudColor * (diffuse + 0.25);
  
  // Fade out clouds slightly near edges to look soft
  float edgeFade = max(dot(normNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  cloudAlpha *= smoothstep(0.0, 0.15, edgeFade);
  
  gl_FragColor = vec4(finalCloud, cloudAlpha * 0.45);
}
`;

// ── ATMOSPHERE HALO SHADER ──
const atmosphereVertexShader = `
varying vec3 vNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
uniform float uHealth;
varying vec3 vNormal;

void main() {
  // Atmospheric glow using fresnel-like effect
  float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 6.0);
  
  // Healthy planet has a beautiful emerald/teal glow, sick planet is red/dusty amber
  vec3 glowColor = mix(vec3(0.65, 0.25, 0.1), vec3(0.08, 0.78, 0.52), uHealth);
  
  gl_FragColor = vec4(glowColor, intensity * 0.85);
}
`;

function PlanetSpheres({ health }) {
  const planetRef = useRef();
  const cloudsRef = useRef();
  
  const healthNormalized = health / 100;

  // Set light direction
  const lightDir = useMemo(() => new THREE.Vector3(5, 3, 5).normalize(), []);

  // Set initial uniform states
  const planetUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHealth: { value: healthNormalized },
    uLightDir: { value: lightDir }
  }), [healthNormalized, lightDir]);

  const cloudsUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHealth: { value: healthNormalized },
    uLightDir: { value: lightDir }
  }), [healthNormalized, lightDir]);

  const atmosphereUniforms = useMemo(() => ({
    uHealth: { value: healthNormalized }
  }), [healthNormalized]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Rotate planet mesh
    if (planetRef.current) {
      planetRef.current.rotation.y = elapsed * 0.015;
      planetRef.current.material.uniforms.uTime.value = elapsed;
      planetRef.current.material.uniforms.uHealth.value = healthNormalized;
    }
    
    // Rotate clouds slightly faster and opposite
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = -elapsed * 0.025;
      cloudsRef.current.rotation.x = elapsed * 0.005;
      cloudsRef.current.material.uniforms.uTime.value = elapsed;
      cloudsRef.current.material.uniforms.uHealth.value = healthNormalized;
    }
  });

  return (
    <group>
      {/* 1. Main Planet Mesh */}
      <mesh ref={planetRef} scale={2.8}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={planetUniforms}
        />
      </mesh>

      {/* 2. Clouds Layer (slightly larger sphere) */}
      <mesh ref={cloudsRef} scale={2.84}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={cloudsVertexShader}
          fragmentShader={cloudsFragmentShader}
          uniforms={cloudsUniforms}
          transparent={true}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Atmosphere Edge Glow (blended additively) */}
      <mesh scale={3.05}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosphereUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
        />
      </mesh>
    </group>
  );
}

export default function ProceduralPlanet({ health = 80, showStars = true, autoRotate = true }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {showStars && (
          <Stars 
            radius={150} 
            depth={60} 
            count={7000} 
            factor={6} 
            saturation={0.5} 
            fade 
            speed={0.4} 
          />
        )}
        
        <PlanetSpheres health={health} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
