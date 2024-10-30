import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebase/db';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenExpiration');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [navigate]);

  const checkTokenExpiration = useCallback(() => {
    const expirationTime = localStorage.getItem('authTokenExpiration');
    if (expirationTime && Date.now() > expirationTime) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const expirationTime = Date.now() + 3600 * 1000; // 1 hour expiration

        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenExpiration', expirationTime);

        setIsAuthenticated(true);
        fetchUserInfo(user);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      const expiresIn = 3600 * 1000; // 1 hour
      const expirationTime = Date.now() + expiresIn;

      localStorage.setItem('authToken', token);
      localStorage.setItem('authTokenExpiration', expirationTime);

      setIsAuthenticated(true);
      fetchUserInfo(user);
      navigate('/');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    }
  };

  const registerAdmin = async (email, password, additionalData) => {
    if (!auth.currentUser) {
      toast.error('Error: No authenticated user found.');
      return;
    }

    const currentUserEmail = auth.currentUser.email;
    const currentUserPassword = prompt('Please enter your password to confirm before adding a new user:');
    if (!currentUserPassword) {
      toast.error('You must enter your password to register a new admin.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await set(ref(db, `users/${newUser.uid}`), {
        email: newUser.email,
        role: additionalData.role,
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        createdAt: new Date().toISOString(),
      });

      toast.success('New admin added successfully!');

      await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
      setIsAuthenticated(true);
      fetchUserInfo(auth.currentUser);
      navigate('/register-admin');
    } catch (error) {
      console.error('Error registering admin:', error);
      toast.error('Error registering admin: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout, registerAdmin }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
