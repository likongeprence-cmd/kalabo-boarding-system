import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { 
  ProtectedRoute, 
  AdminRoute, 
  TeacherRoute, 
  HoDRoute, 
  ClassTeacherRoute, 
  SubjectTeacherRoute,
  ApprovalAwareRoute 
} from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PendingApproval from "./pages/PendingApproval";
import Unauthorized from "./pages/Unauthorized";

// Admin/Management Pages (Planner, Headteacher, Deputy)
import AdminDashboard from "./pages/AdminDashboard";
import ClassManagement from "./pages/admin/ClassManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import ReportCards from "./pages/admin/ReportCards";
import AdminResultsAnalysis from "./pages/admin/AdminResultsAnalysis";
import PendingApprovals from "./pages/admin/PendingApprovals"; // New page for planner to approve teachers

// Teacher Pages (All teaching staff)
import TeacherDashboard from "./pages/TeacherDashboard";
import AttendanceTracking from "./pages/teacher/AttendanceTracking";
import ResultsEntry from "./pages/teacher/ResultsEntry";
import TeacherResultsAnalysis from "./pages/teacher/TeacherResultsAnalysis";

// HoD Specific Pages
import DepartmentPerformance from "./pages/hod/DepartmentPerformance";
import DepartmentTeachers from "./pages/hod/DepartmentTeachers";

// Class Teacher Specific Pages
import DailyAttendance from "./pages/class-teacher/DailyAttendance";
import ClassPerformance from "./pages/class-teacher/ClassPerformance";

// Subject Teacher Specific Pages
import SubjectPerformance from "./pages/subject-teacher/SubjectPerformance";
import MyTimetable from "./pages/subject-teacher/MyTimetable";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PWAInstallPrompt />
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/pending-approval" element={<PendingApproval />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ========== ADMIN/MANAGEMENT ROUTES (Planner, Headteacher, Deputy) ========== */}
            <Route path="/dashboard/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/dashboard/admin/classes" element={
              <AdminRoute>
                <ClassManagement />
              </AdminRoute>
            } />
            
            <Route path="/dashboard/admin/teachers" element={
              <AdminRoute>
                <TeacherManagement />
              </AdminRoute>
            } />
            
            <Route path="/dashboard/admin/report-cards" element={
              <AdminRoute>
                <ReportCards />
              </AdminRoute>
            } />
            
            <Route path="/dashboard/admin/results-analysis" element={
              <AdminRoute>
                <AdminResultsAnalysis />
              </AdminRoute>
            } />
            
            {/* Planner-only route for approving teachers */}
            <Route path="/dashboard/admin/pending-approvals" element={
              <ProtectedRoute allowedRoles={['planner']}>
                <PendingApprovals />
              </ProtectedRoute>
            } />

            {/* ========== TEACHER BASE ROUTES (All teachers - redirects based on role) ========== */}
            <Route path="/dashboard/teacher" element={
              <ApprovalAwareRoute>
                <TeacherDashboard />
              </ApprovalAwareRoute>
            } />

            {/* ========== SHARED TEACHER ROUTES (Available to all teaching staff) ========== */}
            <Route path="/dashboard/teacher/attendance" element={
              <TeacherRoute>
                <AttendanceTracking />
              </TeacherRoute>
            } />
            
            <Route path="/dashboard/teacher/results-entry" element={
              <TeacherRoute>
                <ResultsEntry />
              </TeacherRoute>
            } />
            
            <Route path="/dashboard/teacher/results-analysis" element={
              <TeacherRoute>
                <TeacherResultsAnalysis />
              </TeacherRoute>
            } />

            {/* ========== HOD SPECIFIC ROUTES ========== */}
            <Route path="/dashboard/hod/department-performance" element={
              <HoDRoute>
                <DepartmentPerformance />
              </HoDRoute>
            } />
            
            <Route path="/dashboard/hod/department-teachers" element={
              <HoDRoute>
                <DepartmentTeachers />
              </HoDRoute>
            } />

            {/* ========== CLASS TEACHER SPECIFIC ROUTES ========== */}
            <Route path="/dashboard/class-teacher/daily-attendance" element={
              <ClassTeacherRoute>
                <DailyAttendance />
              </ClassTeacherRoute>
            } />
            
            <Route path="/dashboard/class-teacher/class-performance" element={
              <ClassTeacherRoute>
                <ClassPerformance />
              </ClassTeacherRoute>
            } />

            {/* ========== SUBJECT TEACHER SPECIFIC ROUTES ========== */}
            <Route path="/dashboard/subject-teacher/subject-performance" element={
              <SubjectTeacherRoute>
                <SubjectPerformance />
              </SubjectTeacherRoute>
            } />
            
            <Route path="/dashboard/subject-teacher/my-timetable" element={
              <SubjectTeacherRoute>
                <MyTimetable />
              </SubjectTeacherRoute>
            } />

            {/* ========== CATCH-ALL ROUTE ========== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);