import React, { useState, useEffect } from 'react';

const UISwitch: React.FC = () => {
  const [isNewUI, setIsNewUI] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem('enable_new_ui') === 'true';
    setIsNewUI(savedPreference);
  }, []);

  const toggleUI = () => {
    const newUIState = !isNewUI;
    setIsNewUI(newUIState);
    localStorage.setItem('enable_new_ui', newUIState.toString());
    
    // 刷新页面以应用更改
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleUI}
        className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg ${
          isNewUI 
            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        <span className="mr-2">{isNewUI ? '新界面' : '旧界面'}</span>
        <div className="relative w-10 h-5 bg-gray-300 rounded-full transition-colors duration-300">
          <div 
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              isNewUI ? 'transform translate-x-5' : 'translate-x-0.5'
            }`}
          ></div>
        </div>
      </button>
    </div>
  );
};

export default UISwitch;