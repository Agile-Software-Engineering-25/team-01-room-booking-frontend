import Buildings from '@pages/Building/Buildings.tsx';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Buildings />} />
    </Routes>
  );
};

export default RoutingComponent;
