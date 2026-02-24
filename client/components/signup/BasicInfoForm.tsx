// src/components/signup/BasicInfoForm.tsx
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface BasicInfoFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export function BasicInfoForm({ formData, onChange, loading }: BasicInfoFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Your Details</h2>
      
      <div className="space-y-2">
        {/* Name */}
        <div className="relative">
          <User size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email address"
            className="w-full pl-8 pr-3 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full pl-8 pr-8 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="Confirm password"
            className="w-full pl-8 pr-8 py-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password hint */}
        {formData.password && formData.password.length < 6 && (
          <p className="text-xs text-amber-600">Password must be at least 6 characters</p>
        )}
        
        {/* Password match */}
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-xs text-red-600">Passwords don't match</p>
        )}
      </div>
    </div>
  );
}