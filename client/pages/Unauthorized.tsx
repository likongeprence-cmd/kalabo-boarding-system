// src/pages/Unauthorized.tsx
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Shield, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <Layout className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} className="text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            Please contact your school administrator if you believe this is an error.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}