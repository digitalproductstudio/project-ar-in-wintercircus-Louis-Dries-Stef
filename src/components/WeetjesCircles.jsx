import { Html } from "@react-three/drei";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";

function WeetjesCircles({ weetjes }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [touchedIndex, setTouchedIndex] = useState(null);

  // AFSTAND TUSSEN TEMBO EN DE WEETJES 
  const orbitRadius = 1;

  // HOOGTE
  const heightOffset = 0;

  useFrame((state) => {
    state.camera.lookAt(0, 0, 0);
  });

  const handleInteraction = (index) => {
    setHoveredIndex(index);
    setTouchedIndex(index);
  };

  return (
    <>
      {weetjes.map((weetje, i, arr) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / arr.length) * 2 * Math.PI) * orbitRadius,
            heightOffset,
            Math.sin((i / arr.length) * 2 * Math.PI) * orbitRadius,
          ]}
          onPointerDown={() => handleInteraction(i)}
          onPointerUp={() => {
            setHoveredIndex(null);
            setTouchedIndex(null);
          }}
          onPointerOver={() => handleInteraction(i)}
          onPointerOut={() => {
            setHoveredIndex(null);
            setTouchedIndex(null);
          }}
          scale={(hoveredIndex === i || touchedIndex === i) ? 1.2 : 1}
        >
          {/* <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color={(hoveredIndex === i || touchedIndex === i) ? "#FFA500" : "#FF8C00"}
            transparent
            opacity={(hoveredIndex === i || touchedIndex === i) ? 0.8 : 0.5}
            emissive={(hoveredIndex === i || touchedIndex === i) ? "#FFA500" : "#000000"}
            emissiveIntensity={(hoveredIndex === i || touchedIndex === i) ? 0.5 : 0}
          /> */}
          <Html center zIndexRange={[-1, 0]} portal={null}>
            <span
            >

            </span>
          </Html>
        </mesh>
      ))}
    </>
  );
}

export default WeetjesCircles;