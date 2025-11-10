import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../frontend/Register';
import SignIn from '../frontend/SignIn'
import SubmitRequest from '../frontend/SubmitRequest';
import ResidentDashboard from '../frontend/ResidentDashboard';
import StaffDashboard from '../frontend/StaffDashboard';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<SignIn />} />
  <Route path="/submit-request" element={<SubmitRequest />} />
      <Route path="/residentDashboard" element={<ResidentDashboard />} />
  <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;