import { Html } from "@react-three/drei";

function WeetjesCircles({ weetjes, setActiveWeetje }) {
  return (
    <>
      {weetjes.map((_, i, arr) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / arr.length) * 2 * Math.PI) * 2,
            0.3 + (i === 1 ? 1 : 0),
            Math.sin((i / arr.length) * 2 * Math.PI) * 2,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveWeetje(i);
          }}
        >
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="orange" transparent opacity={0.5} />
          <Html center zIndexRange={[-1, 0]} portal={null}>
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                pointerEvents: "none",
                textShadow: "0 0 5px #000",
                userSelect: "none",
                opacity: 1,
              }}
            ></span>
          </Html>
        </mesh>
      ))}
    </>
  );
}
export default WeetjesCircles;