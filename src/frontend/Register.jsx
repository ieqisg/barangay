import { useState } from "react";
import { Building, Eye, EyeClosed } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import Label from "../components/ui/label";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../lib/auth';

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    role: "resident", // Set default role
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const navigate = useNavigate();

  // We'll rely on built-in HTML validation for required fields. For the custom
  // Select component (role) we add a hidden input (below) so native validation
  // can cover it as well.

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Set default role if none selected
    const submissionData = {
      ...formData,
      role: formData.role || 'resident'
    };

    // Required field check (excluding confirmPassword as it's not sent to the server)
    ['firstName', 'lastName', 'email', 'contactNumber', 'address', 'password'].forEach((key) => {
      if (!submissionData[key]) {
        validationErrors[key] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email address";
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    // Password length check
    if (formData.password && formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(validationErrors);

    // Only proceed if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      console.log('Submitting registration with data:', submissionData);
      
      // call mock register which will auto-login the user on success
      register(submissionData)
        .then((safeUser) => { 
          console.log('Registration successful', safeUser);
          // prefer the returned user's role (stored server-side), fallback to submission data
          const role = (safeUser && safeUser.role) || submissionData.role;
          if (role === 'staff') navigate('/staff');
          else navigate('/residentDashboard');
        })
        .catch((err) => {
          console.error('Registration failed:', err);
          alert(err.message || 'Unable to register. Please try again.');
          setErrors({ ...validationErrors, submit: err.message });
        });
    } else {
      console.log('Form has validation errors:', validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Barangay Request System
          </h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Fill in your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`border-2 ${
                      errors.firstName ? "border-red-500" : "border-gray-400"
                    } rounded-md`}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`border-2 ${
                      errors.lastName ? "border-red-500" : "border-gray-400"
                    } rounded-md`}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border-2 ${
                    errors.email ? "border-red-500" : "border-gray-400"
                  } rounded-md`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  placeholder="09xxxxxxxxx"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`border-2 ${
                    errors.contactNumber ? "border-red-500" : "border-gray-400"
                  } rounded-md`}
                  required
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm">{errors.contactNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`border-2 ${
                    errors.address ? "border-red-500" : "border-gray-400"
                  } rounded-md`}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select
                  value={formData.role || 'resident'}
                  onValueChange={(val) =>
                    setFormData({ ...formData, role: val })
                  }
                >
                  <SelectTrigger
                    className={`border-2 ${
                      errors.role ? "border-red-500" : "border-gray-400"
                    } rounded-md`}
                  >
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="staff">Barangay Staff</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`border-2 ${
                      errors.password ? "border-red-500" : "border-gray-400"
                    } rounded-md pr-12`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeClosed className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`border-2 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-400"
                  } rounded-md`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Register;
