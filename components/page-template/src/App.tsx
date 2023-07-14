import React from 'react';
import startTemplates from './Data/InitialPages.json';                // Import initial pages
import startProjects from './Data/UserProjectsExample.json';              // Import initial projects
import HomePage from './Components/HomePage';                         // Import HomePage component
import ProjectPage from './Components/ProjectPage';
import '@fluentui/react/dist/css/fabric.css';                         // Import Fluent UI styles
import { BrowserRouter as Router,  Routes, Route, Navigate } from 'react-router-dom';
import { Pivot, PivotItem, mergeStyles  } from '@fluentui/react';
import { PagesProvider } from './Components/PageProvider';
 

/*------------------------APP COMPONENT-------------------------*/
export const App: React.FC = () => {

  // Define your custom styles here
  const pivotStyles = mergeStyles({
    textAlign: 'right',

  });

  //--------------------RENDERING--------------------
  return (
    <Router>
      <PagesProvider initialTemplates={startTemplates} initialProjects={startProjects}>
      <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home/*" element={
              <div className={pivotStyles}>

              <Pivot>
                <PivotItem headerText="Home">
                  <HomePage />
                </PivotItem>

                <PivotItem headerText="Projects">
                  <Navigate to="/projects" replace />
                </PivotItem>

                <PivotItem headerText="Settings">
                  {/*add route path for settings*/} 
                </PivotItem>
              </Pivot>
              </div>
            } />

            <Route path="/projects/*" element={
              <div className={pivotStyles}>

              <Pivot>
                <PivotItem headerText="Home">
                  <Navigate to="/home" replace />
                </PivotItem>

                <PivotItem headerText="Projects">
                  <ProjectPage />
                </PivotItem>

                <PivotItem headerText="Settings">
                  {/*add route path for settings*/} 
                </PivotItem>
              </Pivot>
              </div>
           } />
          </Routes>
      </PagesProvider>
    </Router>
  );
};
