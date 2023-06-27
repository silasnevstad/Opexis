import React from 'react';
import { UserProvider } from './context/UserContext';
import { UIProvider } from './context/UIContext';
import { ProjectProvider } from './context/ProjectContext';
import './styles/App.css';
import AppContent from './components/AppContent';

function App() {
  return (
    <UserProvider>
      <UIProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </UIProvider>
    </UserProvider>
  );
}

export default App;
