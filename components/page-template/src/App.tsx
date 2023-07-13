import React from 'react';
import startTemplates from './Data/InitialPages.json';                // Import initial pages
import startProjects from './Data/UserProjectsExample.json';              // Import initial projects
import HomePage from './Components/HomePage';                         // Import HomePage component
import '@fluentui/react/dist/css/fabric.css';                         // Import Fluent UI styles
import { BrowserRouter as Router } from 'react-router-dom';

/*------------------------APP COMPONENT-------------------------*/
export const App: React.FC = () => {

  return (
    <div> 
      <Router>
        <HomePage pages={startTemplates} projects={startProjects} />
      </Router>
    </div>
  );
};


