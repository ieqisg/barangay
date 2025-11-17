import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../frontend/Register';
import SignIn from '../frontend/SignIn'
import SubmitRequest from '../frontend/SubmitRequest';
import ResidentDashboard from '../frontend/ResidentDashboard';
import StaffDashboard from '../frontend/StaffDashboard';
import RequireAuth from './RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/submit-request" element={
        <RequireAuth>
          <SubmitRequest />
        </RequireAuth>
      } />
      <Route path="/residentDashboard" element={
        <RequireAuth>
          <ResidentDashboard />
        </RequireAuth>
      } />
      <Route path="/staff" element={
        <RequireAuth>
          <StaffDashboard />
        </RequireAuth>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;