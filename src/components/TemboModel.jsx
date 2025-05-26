import { useGLTF } from "@react-three/drei";

function TemboModel({ screenWidth, ...props }) {
  const { scene } = useGLTF('./tembo.glb');
  const scale = screenWidth < 600 ? 0.15 : screenWidth < 900 ? 0.15 : screenWidth < 1200 ? 0.2 : 0.25;
  return (
    <primitive object={scene} scale={scale} {...props} />
  );
}
export default TemboModel;
