import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { FaUsers, FaUserTie, FaUserPlus } from 'react-icons/fa';
import '../style/dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalProviders: 0,
    newUsersToday: 0,
    newProvidersToday: 0,
    userGrowth: [],
    overallData: [],
    starUsers: 0,
    vipUsers: 0,
    premiumUsers: 0,
    starProviders: 0,
    vipProviders: 0,
    premiumProviders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-call-center-2.onrender.com/allusers');
        const users = response.data;

        console.log('Fetched Users:', users);

        const today = new Date().toISOString().split('T')[0];

        const isValidDate = (date) => {
          return !isNaN(Date.parse(date));
        };

        const newUsersToday = Object.values(users).filter(user => {
          const userDate = user.DateOfRegistration;
          if (isValidDate(userDate)) {
            const formattedDate = new Date(userDate).toISOString().split('T')[0];
            return formattedDate === today && user.TypeUser === "1";
          }
          return false;
        }).length;

        const newProvidersToday = Object.values(users).filter(user => {
          const userDate = user.DateOfRegistration;
          if (isValidDate(userDate)) {
            const formattedDate = new Date(userDate).toISOString().split('T')[0];
            return formattedDate === today && user.TypeUser === "2";
          }
          return false;
        }).length;

        const totalUsers = Object.values(users).filter(user => user.TypeUser === "1").length;
        const totalProviders = Object.values(users).filter(user => user.TypeUser === "2").length;

        // Count users based on TypeAccount (1: Star, 2: VIP, 3: Premium)
        const starUsers = Object.values(users).filter(user => user.TypeUser === "1" && user.TypeAccount === "1").length;
        const vipUsers = Object.values(users).filter(user => user.TypeUser === "1" && user.TypeAccount === "2").length;
        const premiumUsers = Object.values(users).filter(user => user.TypeUser === "1" && user.TypeAccount === "3").length;

        // Count providers based on TypeAccount (1: Star, 2: VIP, 3: Premium)
        const starProviders = Object.values(users).filter(user => user.TypeUser === "2" && user.TypeAccount === "1").length;
        const vipProviders = Object.values(users).filter(user => user.TypeUser === "2" && user.TypeAccount === "2").length;
        const premiumProviders = Object.values(users).filter(user => user.TypeUser === "2" && user.TypeAccount === "3").length;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const userGrowth = months.map(month => {
          const usersInMonth = Object.values(users).filter(user => {
            const userDate = user.DateOfRegistration;
            if (isValidDate(userDate)) {
              const dateObj = new Date(userDate);
              return months[dateObj.getMonth()] === month && user.TypeUser === "1";
            }
            return false;
          }).length;

          const providersInMonth = Object.values(users).filter(user => {
            const userDate = user.DateOfRegistration;
            if (isValidDate(userDate)) {
              const dateObj = new Date(userDate);
              return months[dateObj.getMonth()] === month && user.TypeUser === "2";
            }
            return false;
          }).length;

          return {
            name: month,
            users: usersInMonth,
            providers: providersInMonth,
          };
        });

        const overallData = [
          { name: 'Total Users', value: totalUsers },
          { name: 'Total Providers', value: totalProviders },
          { name: 'New Users Today', value: newUsersToday },
          { name: 'New Providers Today', value: newProvidersToday },
          { name: 'Star Users', value: starUsers },
          { name: 'VIP Users', value: vipUsers },
          { name: 'Premium Users', value: premiumUsers },
          { name: 'Star Providers', value: starProviders },
          { name: 'VIP Providers', value: vipProviders },
          { name: 'Premium Providers', value: premiumProviders },
        ];

        console.log('userGrowth Data:', userGrowth);
        console.log('overallData Data:', overallData);

        setData({
          totalUsers,
          totalProviders,
          newUsersToday,
          newProvidersToday,
          userGrowth,
          overallData,
          starUsers,
          vipUsers,
          premiumUsers,
          starProviders,
          vipProviders,
          premiumProviders,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
    <h1 className="dashboard-title">Dashboard</h1>
  
    {/* User Section */}
    <div className="user-section">
      <h2>Users</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUsers />
          </div>
          <div className="dashboard-card-info">
            <h3>Total Users</h3>
            <p>{data.totalUsers}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>New Users Today</h3>
            <p>{data.newUsersToday}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Star Users</h3>
            <p>{data.starUsers}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Premium plus</h3>
            <p>{data.vipUsers}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Premium Users</h3>
            <p>{data.premiumUsers}</p>
          </div>
        </div>
      </div>
    </div>
  
    {/* Provider Section */}
    <div className="provider-section">
      <h2>Providers</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserTie />
          </div>
          <div className="dashboard-card-info">
            <h3>Total Providers</h3>
            <p>{data.totalProviders}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>New Providers Today</h3>
            <p>{data.newProvidersToday}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Star Providers</h3>
            <p>{data.starProviders}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Premium plus</h3>
            <p>{data.vipProviders}</p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaUserPlus />
          </div>
          <div className="dashboard-card-info">
            <h3>Premium Providers</h3>
            <p>{data.premiumProviders}</p>
          </div>
        </div>
      </div>
    </div>
  
    {/* Graphs */}
    <div className="dashboard-graphs">
      <div className="dashboard-graph">
        <h3>Users and Providers Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.userGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="providers" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
  
      <div className="dashboard-graph">
        <h3>New Registrations Today</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: 'New Users', value: data.newUsersToday },
              { name: 'New Providers', value: data.newProvidersToday },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  
  );
};

export default Dashboard;
