import { useGLTF } from "@react-three/drei";

function TemboModel({ screenWidth, scale: propScale, ...props }) {
  const { scene } = useGLTF('./tembo.glb');

  // Fallback schaal als er geen scale-prop is
  const dynamicScale = screenWidth
    ? screenWidth < 600
      ? 0.15
      : screenWidth < 900
        ? 0.15
        : screenWidth < 1200
          ? 0.2
          : 0.25
    : 0.25;

  return (
    <primitive
      object={scene}
      scale={propScale ?? dynamicScale}
      {...props}
    />
  );
}

export default TemboModel;