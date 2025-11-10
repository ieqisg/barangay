import { Card, CardHeader, CardContent, CardDescription } from './ui/card';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  submitted: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  'under-review': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'in-progress': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'pending-info': { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  resolved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
};

export default function RequestCard({ request }) {
  const status = statusConfig[request.status] || statusConfig.submitted;
  const StatusIcon = status.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-sm">{request.title}</h3>
            <CardDescription className="mt-1">
              {request.description.substring(0, 100)}
              {request.description.length > 100 ? '...' : ''}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">{request.status.replace('-', ' ')}</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}