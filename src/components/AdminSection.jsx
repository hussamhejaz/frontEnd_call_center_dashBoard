import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database'; // Firebase methods for accessing Realtime Database
import { db } from '../firebase/db'; // Import your Firebase database instance
import '../style/AdminSection.css'; // Optional: Add some styling

const AdminSection = () => {
  const [admins, setAdmins] = useState([]); // State to hold the list of admins
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state in case fetching fails

  // Fetch admins from Firebase Realtime Database
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminsRef = ref(db, 'users'); // Reference to the users node
        const snapshot = await get(adminsRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const adminsList = Object.keys(usersData)
            .map(uid => usersData[uid])
            .filter(user => user.role === 'admin' || user.role === 'superAdmin'); // Filter by role

          setAdmins(adminsList); // Set the filtered admins
        } else {
          setAdmins([]); // If no admins found, set an empty array
        }
      } catch (error) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false); // Stop loading once fetching is done
      }
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return <div>Loading admins...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (admins.length === 0) {
    return <div>No admins found</div>;
  }

  return (
    <div className="admin-section-container">
      <h2>Admin Section</h2>
      <p>Here is a list of all admin and super admin users.</p>

      <div className="admin-list">
        {admins.map((admin, index) => (
          <div key={index} className="admin-card">
            <h3>{admin.firstName} {admin.lastName}</h3>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Role:</strong> {admin.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSection;
