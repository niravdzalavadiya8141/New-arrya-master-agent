import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AgentDashboard from './components/AgentDashboard';
import NotificationBanner from './components/NotificationBanner';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [agents, setAgents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initial agent data fetch
    fetchAgents();

    // WebSocket listeners for real-time updates
    socket.on('agentUpdate', (data) => {
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === data.id ? { ...agent, ...data } : agent
        )
      );
    });

    socket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    });

    socket.on('syncAgents', (updatedAgents) => {
      setAgents(updatedAgents);
    });

    return () => {
      socket.off('agentUpdate');
      socket.off('newNotification');
      socket.off('syncAgents');
    };
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent">
            Virtual Agent Headquarters
          </h1>
          <p className="text-gray-300 text-lg">Marvel Universe Command Center</p>
        </header>
        
        <NotificationBanner notifications={notifications} />
        <AgentDashboard agents={agents} />
      </div>
    </div>
  );
}

export default App;