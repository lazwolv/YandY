import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced sparkle particle with varied sizes and colors
function SparkleParticle({
  position,
  size,
  color,
  speed,
  intensity
}: {
  position: [number, number, number];
  size: number;
  color: string;
  speed: number;
  intensity: number;
}) {
  const sparkleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sparkleRef.current) {
      // Add gentle pulsing effect
      const pulse = Math.sin(clock.getElapsedTime() * speed * 2) * 0.3 + 0.7;
      sparkleRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={intensity}>
      <Sphere ref={sparkleRef} args={[size, 16, 16]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>
    </Float>
  );
}

export default function FloatingElements() {
  // Generate sparkle configurations
  const sparkles = Array.from({ length: 60 }).map((_, i) => {
    const colors = ['#8d60a9', '#a67dbd', '#6f4a87', '#bfa0d0', '#7a4f93'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = 0.03 + Math.random() * 0.08; // Varied sizes
    const randomSpeed = 2 + Math.random() * 3; // Varied speeds
    const randomIntensity = 1.5 + Math.random() * 2; // Varied float intensity

    return {
      key: i,
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      size: randomSize,
      color: randomColor,
      speed: randomSpeed,
      intensity: randomIntensity,
    };
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />
      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      {/* Additional soft lighting for sparkles */}
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#a67dbd" />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8d60a9" />

      {/* Enhanced sparkle particles */}
      {sparkles.map((sparkle) => (
        <SparkleParticle
          key={sparkle.key}
          position={sparkle.position}
          size={sparkle.size}
          color={sparkle.color}
          speed={sparkle.speed}
          intensity={sparkle.intensity}
        />
      ))}
    </>
  );
}
