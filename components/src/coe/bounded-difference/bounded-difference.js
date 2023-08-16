import React, { useState } from 'react';
import { DefaultButton, Dropdown, IconButton } from '@fluentui/react';


//--------------COMPONENT-----------------//
const BoundedDifference = ({ constraint, ports, formGroup, editing }) => {
  //state variables
  const [localPorts, setLocalPorts] = useState(constraint.ports);

  //------------------FUNCTIONS------------------//
  const addPort = () => {
    setLocalPorts(prevPorts => [...prevPorts, ports[0]]);
    updatePortValidation();
  };

  const removePort = (index) => {
    setLocalPorts(prevPorts => prevPorts.filter((_, i) => i !== index));
    updatePortValidation();
  };

  const onPortChange = (output, index) => {
    const newPorts = [...localPorts];
    newPorts[index] = JSON.parse(output);
    setLocalPorts(newPorts);
    updatePortValidation();
  };

  const updatePortValidation = () => {
    //Implement later
  };


  //------------------RENDER------------------//
  return (
    <div>
      {localPorts.map((port, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Dropdown
            options={ports.map(p => ({ key: JSON.stringify(p), text: `${p.instance}` }))}
            selectedKey={JSON.stringify(port)}
            onChange={(event, item) => item && onPortChange(item.key, index)}
          />
          <DefaultButton
               text="Remove Port"
               onClick={() => removePort(index)}
               style={{ marginLeft: '10px' }}
          />
        </div>
      ))}
      <button onClick={addPort}>Add Port</button>
    </div>
  );
};

export default BoundedDifference;


/* DISPLAY IN APP.TSX

export const App: React.FunctionComponent = () => {
  // Dummy data
  const someConstraint = {
    ports: [
      { instance: 'Port 1', scalar: 'Scalar1' },
      { instance: 'Port 2', scalar: 'Scalar2' }
    ]
  };

  const somePorts = [
    { instance: 'Port 1', scalar: 'Scalar1' },
    { instance: 'Port 2', scalar: 'Scalar2' },
    { instance: 'Port 3', scalar: 'Scalar3' },
    { instance: 'Port 4', scalar: 'Scalar4' }
  ];

  const someFormGroup = {}; // This is simplified, as real form data would likely be more complex

  const someEditingFlag = true;

  return (
    <div className="App">
      <BoundedDifference
        constraint={someConstraint}
        ports={somePorts}
        formGroup={someFormGroup}
        editing={someEditingFlag}
      />
    </div>
  );
}
*/