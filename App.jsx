import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';

export function App() {
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(
        window.location.pathname === '/admin' || window.location.hash === '#admin'
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
  };

  const openSurprise = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
  };

  return (
    <div className="w-full min-h-screen">
      {isAdminView ? (
        <Admin onBackToSurprise={openSurprise} />
      ) : (
        <Home onOpenAdmin={openAdmin} />
      )}
    </div>
  );
}

export default App;
