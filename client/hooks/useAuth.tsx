import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ========== UPDATED TYPES ==========
export type UserType = 'planner' | 'subject_teacher' | 'class_teacher' | 'hod' | 'headteacher' | 'deputy';

export interface SubjectAssignment {
  subject: string;
  classes: string[]; // class names like "Grade 8A"
}

export interface TeacherDetails {
  subjects: SubjectAssignment[];
  isClassTeacher?: boolean;
  classTeacherOf?: string; // class name if they are class teacher
  department?: string; // for HoDs
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  teacherDetails?: TeacherDetails;
  isApproved: boolean; // false for teachers/HoDs until planner approves
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string; // planner ID who approved
}

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, userType: UserType, teacherDetails?: TeacherDetails) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========== UPDATED AUTH LISTENER WITH APPROVAL HANDLING ==========
  useEffect(() => {
    console.log('🔥 Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('🔄 Auth state changed:', firebaseUser?.email || 'No user');
      
      if (firebaseUser) {
        try {
          // Check localStorage first for immediate data
          const storedUser = localStorage.getItem('kalaboboarding_user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id === firebaseUser.uid) {
              console.log('📦 Using stored user data for:', parsedUser.email, 'type:', parsedUser.userType);
              
              // Check approval status for teacher roles
              if (!parsedUser.isApproved && ['subject_teacher', 'class_teacher', 'hod'].includes(parsedUser.userType)) {
                console.log('⏳ User pending approval');
              }
              
              setUser(parsedUser);
              setIsLoading(false);
              return;
            }
          }

          // If no stored data, fetch from Firestore with retry
          console.log('📥 Fetching user data from Firestore for:', firebaseUser.uid);
          let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          // Retry once if document doesn't exist (for signup case)
          if (!userDoc.exists()) {
            console.log('⏳ User document not found, waiting 1 second and retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          }
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Map Firestore data to User type
            const newUser: User = {
              id: firebaseUser.uid,
              email: userData.email,
              name: userData.name,
              userType: userData.userType,
              teacherDetails: userData.teacherDetails || undefined,
              isApproved: userData.isApproved || false,
              createdAt: userData.createdAt,
              approvedAt: userData.approvedAt,
              approvedBy: userData.approvedBy
            };
            
            console.log('✅ Firestore data found, user type:', newUser.userType, 'approved:', newUser.isApproved);
            
            // Store in localStorage for persistence
            localStorage.setItem('kalaboboarding_user', JSON.stringify(newUser));
            setUser(newUser);
          } else {
            console.error('❌ User document not found in Firestore after retry');
            await signOut(auth);
            localStorage.removeItem('kalaboboarding_user');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
          await signOut(auth);
          localStorage.removeItem('kalaboboarding_user');
          setUser(null);
        }
      } else {
        console.log('👋 No Firebase user, clearing state');
        localStorage.removeItem('kalaboboarding_user');
        setUser(null);
      }
      
      setIsLoading(false);
      console.log('🏁 Auth state update complete');
    });

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // ========== UPDATED SIGNUP WITH APPROVAL LOGIC ==========
  const signup = async (
    email: string,
    password: string,
    name: string,
    userType: UserType,
    teacherDetails?: TeacherDetails
  ) => {
    try {
      console.log('🚀 Starting signup for:', email, 'type:', userType);
      
      // Determine if account needs approval (teachers and HoDs need approval)
      const needsApproval = ['subject_teacher', 'class_teacher', 'hod'].includes(userType);
      
      // 1. Create user in Firebase Authentication
      console.log('🔐 Creating Firebase auth user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase auth user created:', userCredential.user.uid);
      
      // 2. Create user object immediately
      const now = new Date().toISOString();
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        name,
        userType,
        teacherDetails,
        isApproved: !needsApproval, // Auto-approve planners, head, deputy
        createdAt: now,
        ...(!needsApproval && { approvedAt: now }) // Set approvedAt if auto-approved
      };
      
      // 3. Store in localStorage FIRST so auth listener can use it
      localStorage.setItem('kalaboboarding_user', JSON.stringify(newUser));
      
      // 4. Store additional user data in Firestore
      const userData = {
        email,
        name,
        userType,
        teacherDetails: teacherDetails || null,
        isApproved: !needsApproval,
        createdAt: now,
        ...(!needsApproval && { approvedAt: now })
      };
      
      console.log('💾 Saving to Firestore with data:', userData);
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('✅ Firestore document saved');
      
      // 5. Set user state immediately
      setUser(newUser);
      
      console.log('🎉 Signup complete for user:', newUser.email, 'type:', newUser.userType, 'approved:', newUser.isApproved);
      
      return Promise.resolve();
      
    } catch (error: any) {
      console.error('💥 Signup error:', error.code, error.message);
      
      // Clean up: If Firebase auth succeeded but Firestore failed
      if (auth.currentUser?.email === email) {
        try {
          console.log('🧹 Cleaning up orphaned auth user');
          await signOut(auth);
        } catch (cleanupError) {
          console.error('Failed to cleanup orphaned user:', cleanupError);
        }
      }
      
      // Clear localStorage on error
      localStorage.removeItem('kalaboboarding_user');
      
      // Provide user-friendly error messages
      let errorMessage = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered. Please use a different email or sign in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password signup is not enabled. Please contact support.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Check your Firestore security rules.';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
  };

  // ========== UPDATED LOGIN WITH APPROVAL CHECK ==========
  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting login for:', email);
      
      console.log('🔐 Calling Firebase signInWithEmailAndPassword...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase auth successful for:', userCredential.user.uid);
      
      // Fetch user data from Firestore
      console.log('📥 Fetching user data from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        console.error('❌ User document not found in Firestore');
        await signOut(auth);
        localStorage.removeItem('kalaboboarding_user');
        return Promise.reject(new Error('User data not found. Please contact support.'));
      }
      
      const userData = userDoc.data();
      
      // Map Firestore data to User type
      const loggedInUser: User = {
        id: userCredential.user.uid,
        email: userData.email,
        name: userData.name,
        userType: userData.userType,
        teacherDetails: userData.teacherDetails || undefined,
        isApproved: userData.isApproved || false,
        createdAt: userData.createdAt,
        approvedAt: userData.approvedAt,
        approvedBy: userData.approvedBy
      };
      
      console.log('✅ Login successful, user type:', loggedInUser.userType, 'approved:', loggedInUser.isApproved);
      
      // Check if user is approved (for teacher roles)
      if (!loggedInUser.isApproved && ['subject_teacher', 'class_teacher', 'hod'].includes(loggedInUser.userType)) {
        console.log('⏳ User pending approval');
        // Still store user but they'll be redirected to pending page by ProtectedRoute
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('kalaboboarding_user', JSON.stringify(loggedInUser));
      
      // Set user state immediately for fast redirect
      setUser(loggedInUser);
      
      console.log('🏁 Login process complete');
      
      return Promise.resolve();
      
    } catch (error: any) {
      console.error('💥 Login error:', error.code);
      
      // Clear localStorage on error
      localStorage.removeItem('kalaboboarding_user');
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Account disabled. Please contact support.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
  };

  // ========== LOGOUT (unchanged) ==========
  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      await signOut(auth);
      localStorage.removeItem('kalaboboarding_user');
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('💥 Logout error:', error);
      return Promise.reject(new Error(error.message || 'Logout failed. Please try again.'));
    }
  };

  const value: AuthContextType = {
    user,
    userType: user?.userType || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}