import Buildings from '@pages/Building/Buildings.tsx';
import { Route, Routes } from 'react-router';
import Rooms from '@pages/Room/Rooms.tsx';
import Bookings from '@pages/Booking/Bookings.tsx';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/buildings" element={<Buildings />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/bookings" element={<Bookings />} />
    </Routes>
  );
};

export default RoutingComponent;
