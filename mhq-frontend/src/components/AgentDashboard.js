import React from 'react';
import AgentCard from './AgentCard';

const AgentDashboard = ({ agents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default AgentDashboard;