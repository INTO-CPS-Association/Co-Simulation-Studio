import React, { useState} from 'react';
import { Panel, PanelType, PrimaryButton, Stack } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import './coe-page.css';  
import { useNavigate } from 'react-router-dom';

initializeIcons();


//---------COMPONENT---------------
const CoePage: React.FC = () => {
  //state variables
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();


  //---------FUNCTIONS----------------
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  //-------------STYLING----------------
  const panelStyles = {
    content: {
      padding: '20px 24px'
    },
    headerText: {
      fontWeight: 'bold'
    }
  };

  const buttonStyles = {
    root: {
      width: '100%',
      margin: '8px 0'
    }
  };


  //--------------RENDER------------------
  return (
    <div>
      {/*Open panel button */}
      <PrimaryButton className="openPanelButton" text="Menu" onClick={onOpen} />

      {/*Panel */}
      <Panel
        isOpen={isOpen}
        onDismiss={onClose}
        type={PanelType.smallFixedFar}
        headerText="Menu"
        styles={panelStyles}
      >
        <Stack tokens={{ childrenGap: 12 }}>
          {/*Configuration */}
          <PrimaryButton 
            styles={buttonStyles} 
            text="Configuration" 
            onClick={() => {
              // Handle Configuration Action
              navigate("/configuration");
              console.log("Configuration chosen");
              onClose();
            }} 
          />

          {/*Simulation */}
          <PrimaryButton 
            styles={buttonStyles} 
            text="Simulation" 
            onClick={() => {
              // Handle Simulation Action
              navigate("/simulation");
              console.log("Simulation chosen");
              onClose();
            }} 
          />
        </Stack>
      </Panel>
    </div>
  );
}

export default CoePage;



/* INSERT THIS INTO App.tsx FOR MANUAL TESTING

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  CoeConfiguration  from './coe/coe-configuration/coe-configuration';
import  CoeSimulation  from './coe/coe-simulation/coe-simulation';
import CoePage from './coe/coe-page/coe-page';


//---------COMPONENT---------------
export const App: React.FunctionComponent = () => {
  return (
    <Router>
      <div className="App">
        <h1> COE Page demo </h1>

        <Routes>
          <Route path="/configuration" element={<CoeConfiguration />} />
          <Route path="/simulation" element={<CoeSimulation />} />
          <Route path="/" element={<CoePage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
*/