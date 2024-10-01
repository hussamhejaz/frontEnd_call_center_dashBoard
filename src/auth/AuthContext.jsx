// src/auth/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebase/db'; // Ensure correct path
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Monitor auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        fetchUserInfo(user); // Fetch additional user info from Realtime Database
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user info from the Realtime Database
  const fetchUserInfo = async (user) => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setCurrentUser(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Register new admin and store details in Firebase Authentication and Realtime Database
  const registerAdmin = async (email, password, additionalData) => {
    if (!auth.currentUser) {
      toast.error('Error: No authenticated user found.');
      return;
    }

    // Ask for the current user's password to confirm before adding a new admin
    const currentUserEmail = auth.currentUser.email;
    const currentUserPassword = prompt('Please enter your password to confirm before adding a new user:');
    if (!currentUserPassword) {
      toast.error('You must enter your password to register a new admin.');
      return;
    }

    try {
      // Step 1: Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user; // The new admin created

      // Step 2: Store additional admin details in Firebase Realtime Database
      await set(ref(db, `users/${newUser.uid}`), {
        email: newUser.email,
        role: additionalData.role, // Role can be 'admin' or 'superAdmin'
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        createdAt: new Date().toISOString(),
      });

      toast.success('New admin added successfully!');

      // Step 3: Sign the original admin back in after registering the new admin
      await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
      setIsAuthenticated(true);
      fetchUserInfo(auth.currentUser);
      navigate('/register-admin');
    } catch (error) {
      console.error('Error registering admin:', error);
      toast.error('Error registering admin: ' + error.message);
    }
  };

  // User login function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      fetchUserInfo(auth.currentUser); // Fetch the logged-in user's info from Realtime Database
      navigate('/');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    }
  };

  // User logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout, registerAdmin }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
