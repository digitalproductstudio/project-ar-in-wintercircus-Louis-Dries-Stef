import { useGLTF } from "@react-three/drei";

function TemboModel({ screenWidth, scale: propScale, ...props }) {
  const { scene } = useGLTF('./tembo.glb');

  // Fallback schaal als er geen scale-prop is
  const scale = screenWidth < 600 ? 0.15 : screenWidth < 900 ? 0.15 : screenWidth < 1200 ? 0.2 : 0.25;

  return (
    <primitive
      object={scene}
      scale={propScale ?? scale}
      {...props}
      position={[0, -0.5, 0]}
      rotation={[0, 2.7, 0]}
    />
  );
}

export default TemboModel;