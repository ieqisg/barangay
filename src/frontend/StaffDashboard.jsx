import { useEffect, useState } from 'react';
import Navbar from '../components/ui/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import Button from '../components/ui/button';
import { getAllRequests, updateRequestStatus, assignHandler, getNotifications, onRequests } from '../lib/requests';
import { getCurrentUser } from '../lib/auth';
import RequestCard from '../components/RequestCard';

export default function StaffDashboard() {
  const user = getCurrentUser();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setRequests(getAllRequests());
    const unsub = onRequests((r) => setRequests(r));
    return () => unsub();
  }, []);

  const filtered = requests.filter(r => filter === 'all' ? true : r.status === filter);

  const setStatus = async (id, status) => {
    await updateRequestStatus(id, status, user?.email || 'staff');
  };

  const handleAssign = async (id) => {
    await assignHandler(id, user?.id || 'staff01');
  };

  const stats = {
    total: requests.length,
    submitted: requests.filter(r=>r.status==='submitted').length,
    inProgress: requests.filter(r=>r.status==='in-progress').length,
    completed: requests.filter(r=>r.status==='completed' || r.status==='resolved').length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Staff - Request Queue</h1>
          <p className="text-sm text-gray-600">Manage incoming requests and update statuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submitted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <select className="border rounded p-2" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="in-progress">In Progress</option>
            <option value="pending-info">Pending Info</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <div key={r.id}>
              <RequestCard request={r} />
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => setStatus(r.id, 'under-review')}>Under Review</Button>
                <Button size="sm" onClick={() => setStatus(r.id, 'in-progress')}>Start</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(r.id, 'completed')}>Complete</Button>
                <Button size="sm" variant="ghost" onClick={() => handleAssign(r.id)}>Assign to me</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
