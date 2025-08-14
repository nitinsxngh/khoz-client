'use client';

import React from 'react';

interface CustomNamesFormProps {
  customName: string;
  selectedCustomNames: string[];
  useCustomNames: boolean;
  useAdvancedEmails: boolean;
  isDarkTheme: boolean;
  onCustomNameChange: (name: string) => void;
  onAddCustomName: () => void;
  onRemoveCustomName: (name: string) => void;
  onToggleCustomName: (name: string) => void;
  onUseCustomNamesChange: (use: boolean) => void;
  onUseAdvancedEmailsChange: (use: boolean) => void;
}

const CustomNamesForm: React.FC<CustomNamesFormProps> = ({
  customName,
  selectedCustomNames,
  useCustomNames,
  useAdvancedEmails,
  isDarkTheme,
  onCustomNameChange,
  onAddCustomName,
  onRemoveCustomName,
  onToggleCustomName,
  onUseCustomNamesChange,
  onUseAdvancedEmailsChange
}) => {
  const sanitizeCustomName = (name: string): string => {
    return name.replace(/[<>]/g, '').substring(0, 20);
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeCustomName(e.target.value);
    onCustomNameChange(sanitizedValue);
  };

  const handleAddCustomName = () => {
    if (customName.trim() && !selectedCustomNames.includes(customName.trim())) {
      onAddCustomName();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomName();
    }
  };

  const quickAddNames = ['john', 'jane', 'admin', 'info', 'contact', 'support', 'sales', 'help', 'team', 'user'];

  return (
    <div className="space-y-4">
      {/* Advanced Email Generation Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useAdvancedEmails}
              onChange={(e) => onUseAdvancedEmailsChange(e.target.checked)}
              className={`w-4 h-4 rounded focus:ring-2 transition-all duration-300 ${
                isDarkTheme 
                  ? 'text-orange-500 bg-gray-800 border-gray-700 focus:ring-orange-500' 
                  : 'text-blue-600 bg-gray-50 border-gray-300 focus:ring-blue-600'
              }`}
            />
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>Advanced generation</span>
          </div>
          {useAdvancedEmails && (
            <span className={`text-xs px-2 py-1 rounded ${
              isDarkTheme ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-600'
            }`}>
              Extended
            </span>
          )}
        </div>
        <p className={`text-xs ${
          isDarkTheme ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {useAdvancedEmails 
            ? 'Generate all possible combinations including dots, hyphens, and numbers'
            : 'Generate basic email formats (firstname@domain, lastname@domain, etc.)'
          }
        </p>
      </div>

      {/* Custom Names Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useCustomNames}
              onChange={(e) => onUseCustomNamesChange(e.target.checked)}
              className={`w-4 h-4 rounded focus:ring-2 transition-all duration-300 ${
                isDarkTheme 
                  ? 'text-orange-500 bg-gray-800 border-gray-700 focus:ring-orange-500' 
                  : 'text-blue-600 bg-gray-50 border-gray-300 focus:ring-blue-600'
              }`}
            />
            <span className={`text-sm font-medium ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>Custom names</span>
          </div>
          {useCustomNames && (
            <span className={`text-xs px-2 py-1 rounded ${
              isDarkTheme ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-600'
            }`}>
              {selectedCustomNames.length} selected
            </span>
          )}
        </div>
        
        {useCustomNames && (
          <div className={`space-y-3 p-3 rounded-lg border border-dashed transition-all duration-300 backdrop-blur-sm ${
            isDarkTheme ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-300/50 bg-gray-50/80'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={handleCustomNameChange}
                onKeyPress={handleKeyPress}
                className={`flex-1 border rounded-lg px-3 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm backdrop-blur-sm ${
                  isDarkTheme 
                    ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500/50' 
                    : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-600 focus:border-blue-600/50'
                }`}
                placeholder="Add custom name"
                maxLength={20}
              />
              <button
                type="button"
                onClick={handleAddCustomName}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm shadow-lg ${
                  isDarkTheme 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
              >
                Add
              </button>
            </div>
            
            {selectedCustomNames.length > 0 && (
              <div className="space-y-2">
                <label className={`block text-xs font-medium ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                }`}>Selected names:</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCustomNames.map((name) => (
                    <div
                      key={name}
                      className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-xs transition-all duration-300 backdrop-blur-sm ${
                        isDarkTheme 
                          ? 'bg-gray-800/50 border-gray-700/50 text-gray-300' 
                          : 'bg-white/80 border-gray-300/50 text-gray-600'
                      }`}
                    >
                      <span>{name}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveCustomName(name)}
                        className={`transition-colors duration-200 ${
                          isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-600'
              }`}>Quick add:</label>
              <div className="flex flex-wrap gap-1.5">
                {quickAddNames
                  .filter(name => !selectedCustomNames.includes(name))
                  .map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onToggleCustomName(name)}
                    className={`px-2 py-1 border rounded-lg text-xs transition-all duration-300 backdrop-blur-sm ${
                      isDarkTheme 
                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600/50' 
                        : 'bg-white/80 border-gray-300/50 text-gray-600 hover:bg-gray-100/80 hover:border-gray-400/50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomNamesForm; 