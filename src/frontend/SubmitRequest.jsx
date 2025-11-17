import Button from "../components/ui/button";
import { Link } from 'react-router-dom';
import Input from "../components/ui/input";
import Label from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import Navbar from "../components/ui/Navbar";
import TextArea from "../components/ui/textarea";
import { getCurrentUser } from '../lib/auth';
import { createRequest } from '../lib/requests';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const requestTypes = [
  {
    label: "Barangay Clearance",
    description: "Certificate of good moral character and residency",
  },
  {
    label: "Certificate of Indigency",
    description: "Document certifying low-income status",
  },
  {
    label: "Business Permit",
    description: "Permit to operate a business in the barangay",
  },
  {
    label: "Complaint",
    description: "Report issues or violations in the community",
  },
  {
    label: "Aid Request",
    description: "Request for financial or material assistance",
  },
  {
    label: "Community Concern",
    description: "Report community issues or suggestions",
  },
];

export default function SubmitRequest() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [type, setType] = useState(requestTypes[0].label);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submittedRequest, setSubmittedRequest] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in first');
    try {
      const req = await createRequest({ title, description, type, priority }, user);
      // show success design instead of a plain alert
      setSubmittedRequest(req);
      // scroll to top so user sees confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Failed to submit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submittedRequest && (
          <div className="mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">Request Submitted</h3>
                    <p className="text-sm text-muted-foreground">Your request has been received and is now in the queue.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium">{submittedRequest.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference ID</p>
                    <p className="font-mono text-sm text-gray-800">{submittedRequest.id}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button onClick={() => navigate('/residentDashboard')}>Go to Dashboard</Button>
                  <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(submittedRequest.id); alert('Reference copied'); }}>Copy Reference</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <Link to="/residentDashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Submit New Request
          </h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to submit your barangay service request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Provide detailed information about your request to help us
                  process it efficiently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Request Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type *</Label>
                    <Select value={type} onValueChange={setType} className="border border-gray-300 rounded-md">
                      <SelectTrigger className="border-none">
                        <SelectValue placeholder="Select the type of request" />
                      </SelectTrigger>
                      <SelectContent>
                        {requestTypes.map((t, idx) => (
                          <SelectItem key={idx} value={t.label}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {requestTypes[0].description}
                    </p>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Request Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief title describing your request"
                      className="border border-gray-300 rounded-md"
                      value={title}
                      onChange={(e)=>setTitle(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <TextArea
                      id="description"
                      placeholder="Provide detailed information about your request, including any specific requirements or circumstances..."
                      rows={6}
                      className="border border-gray-300 rounded-md"
                      value={description}
                      onChange={(e)=>setDescription(e.target.value)}
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={priority} onValueChange={setPriority} className="border border-gray-300 rounded-md">
                      <SelectTrigger className="border-none">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait</SelectItem>
                        <SelectItem value="medium">Medium - Normal processing</SelectItem>
                        <SelectItem value="high">High - Needs attention</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediate attention required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" onClick={()=>window.history.back()}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestTypes.map((type, idx) => (
                  <div key={idx} className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-medium text-sm">{type.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Clearances:</span>
                    <span className="text-muted-foreground">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificates:</span>
                    <span className="text-muted-foreground">2-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Permits:</span>
                    <span className="text-muted-foreground">5-7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complaints:</span>
                    <span className="text-muted-foreground">1-3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Office Hours:</strong> Mon-Fri, 8AM-5PM
                  </p>
                  <p>
                    <strong>Phone:</strong> (02) 123-4567
                  </p>
                  <p>
                    <strong>Email:</strong> help@barangay.gov.ph
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
