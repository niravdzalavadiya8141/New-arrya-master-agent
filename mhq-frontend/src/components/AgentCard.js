import React, { useState } from 'react';
import { Zap, Heart, Shield, Target, Clock, Activity } from 'lucide-react';

const AgentCard = ({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'standby': return 'text-yellow-400';
      case 'mission': return 'text-blue-400';
      case 'repair': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 border-green-500';
      case 'standby': return 'bg-yellow-900/30 border-yellow-500';
      case 'mission': return 'bg-blue-900/30 border-blue-500';
      case 'repair': return 'bg-red-900/30 border-red-500';
      default: return 'bg-gray-900/30 border-gray-500';
    }
  };

  return (
    <div 
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${getStatusBg(agent.status)}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-600 to-yellow-400 flex items-center justify-center">
          <img 
            src={agent.avatar} 
            alt={agent.name} 
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{agent.codename}</p>
        
        <div className={`text-sm font-semibold ${getStatusColor(agent.status)} mb-2`}>
          {agent.status.toUpperCase()}
        </div>

        <div className="flex justify-center space-x-2 mb-3">
          <div className="text-xs text-gray-400 flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            {agent.stats.health}%
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            {agent.stats.energy}%
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {agent.stats.shield}%
          </div>
        </div>

        {isExpanded && (
          <div className="animate-fadeIn">
            <div className="text-xs text-left mb-3">
              <div className="flex items-center mb-1">
                <Target className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-gray-300">Mission:</span>
                <span className="text-white ml-2">{agent.mission || 'None'}</span>
              </div>
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-gray-300">Last Activity:</span>
                <span className="text-white ml-2">{agent.lastActivity}</span>
              </div>
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-gray-300">Level:</span>
                <span className="text-white ml-2">{agent.level}</span>
              </div>
            </div>
            
            <div className="w-full border-t border-gray-600 pt-2">
              <div className="text-xs text-gray-300">
                {agent.description}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;