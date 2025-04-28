import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { World } from './components/World';
import { Clouds } from './components/Clouds';

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [0, 15, 20],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
      >
        <Sky 
          sunPosition={[100, 20, 100]} 
          turbidity={10}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
        />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <World />
        <Clouds />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
}

export default App