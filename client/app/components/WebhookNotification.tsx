'use client';

import React from 'react';

interface WebhookNotificationProps {
  webhookResponse: any;
  mode: 'auto';
  isDarkTheme: boolean;
}

const WebhookNotification: React.FC<WebhookNotificationProps> = ({ webhookResponse, mode, isDarkTheme }) => {
  if (!webhookResponse || mode !== 'auto') {
    // Show a helpful message for single domain processing
    if (mode === 'auto' && !webhookResponse) {
      return (
        <div className={`border-2 rounded-xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50' 
            : 'bg-gradient-to-br from-blue-50/80 to-white/80 border-blue-200/50'
        }`}>
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              isDarkTheme 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : 'bg-gradient-to-br from-blue-600 to-blue-700'
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${
                isDarkTheme ? 'text-white' : 'text-gray-900'
              }`}>Ready to Discover</h3>
              <p className={`text-sm mt-1 ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-600'
              }`}>Click "Explore Emails" to automatically discover company leadership and generate email addresses.</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              isDarkTheme 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-blue-100/80 text-blue-700 border border-blue-200/50'
            }`}>
              Ready
            </div>
          </div>
          
          {/* Action Section */}
          <div className={`mt-4 p-3 rounded-lg backdrop-blur-sm ${
            isDarkTheme 
              ? 'bg-gray-700/30 border border-gray-600/30' 
              : 'bg-blue-50/50 border border-blue-200/30'
          }`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-xs ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-600'
              }`}>
                The system will automatically search for company leadership data when you submit the form.
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Parse the AI response
  let parsedData = null;
  try {
    if (webhookResponse.output) {
      // Parse clean JSON directly (no markdown code blocks)
      parsedData = JSON.parse(webhookResponse.output);
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  return (
    <div className={`border-2 rounded-xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50' 
        : 'bg-gradient-to-br from-blue-50/80 to-white/80 border-blue-200/50'
    }`}>
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700'
        }`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>Discovery Complete</h3>
          <p className={`text-sm mt-1 ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          }`}>Company leadership data has been retrieved and is ready for email exploration.</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
          isDarkTheme 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-green-100/80 text-green-700 border border-green-200'
        }`}>
          ✓ Ready
        </div>
      </div>
      
      {/* Data Display Section */}
      {parsedData && (
        <div className={`p-5 rounded-xl border ${
          isDarkTheme 
            ? 'bg-gray-700/50 border-gray-600/50' 
            : 'bg-white/80 border-gray-200/70 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${
              isDarkTheme ? 'bg-blue-400' : 'bg-blue-600'
            }`}></div>
            <h4 className={`text-sm font-semibold ${
              isDarkTheme ? 'text-gray-200' : 'text-gray-800'
            }`}>Leadership Team</h4>
          </div>
          
          <div className="space-y-3">
            {Object.entries(parsedData)
              .filter(([position, name]) => name && String(name).trim() !== '')
              .map(([position, name]) => (
                <div key={position} className={`p-4 rounded-lg border ${
                  isDarkTheme 
                    ? 'bg-gray-600/30 border-gray-600/30 hover:bg-gray-600/40' 
                    : 'bg-gray-50/80 border-gray-200/50 hover:bg-gray-100/80'
                } transition-all duration-200`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkTheme 
                        ? 'bg-gray-600/50 text-gray-300' 
                        : 'bg-gray-200/70 text-gray-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm ${
                        isDarkTheme ? 'text-gray-200' : 'text-gray-800'
                      }`}>{position}</div>
                      <div className={`text-xs mb-2 ${
                        isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      }`}>Leadership Position</div>
                      <div className={`text-sm font-semibold break-words ${
                        isDarkTheme ? 'text-white' : 'text-gray-900'
                      }`}>
                        {String(name)}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 mt-1 ${
                      isDarkTheme 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-green-100/80 text-green-700 border border-green-200'
                    }`}>
                      ✓
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {/* Action Section */}
      <div className={`mt-4 p-3 rounded-lg backdrop-blur-sm ${
        isDarkTheme 
          ? 'bg-gray-700/30 border border-gray-600/30' 
          : 'bg-blue-50/50 border border-blue-200/30'
      }`}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-xs ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Click "Explore Emails" to discover professional email addresses for the team members.
          </span>
        </div>
      </div>
    </div>
  );
};

export default WebhookNotification; 