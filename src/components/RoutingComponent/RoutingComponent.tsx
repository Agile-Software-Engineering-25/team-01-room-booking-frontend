import Buildings from '@pages/Building/Buildings.tsx';
import { Route, Routes } from 'react-router';
import Rooms from '@pages/Room/Rooms.tsx';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/buildings" element={<Buildings />} />
      <Route path="/rooms" element={<Rooms />} />
    </Routes>
  );
};

export default RoutingComponent;
