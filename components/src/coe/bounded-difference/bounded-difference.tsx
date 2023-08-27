import React, { useState } from 'react';
import { DefaultButton, ComboBox, PrimaryButton, IComboBox, IComboBoxOption } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';


//used for icons 
initializeIcons();


//define probs
interface BoundedDifferenceProps {
    constraint: any;          // Using any for now. Can be refined later.
    ports: Array<string>;     // Assuming ports is an array of strings. Adjust as necessary.
    formGroup: any;           // Replace with the correct type
    editing: boolean;
}


//--------------------COMPONENT-------------------//
const BoundedDifferenceComponent: React.FC<BoundedDifferenceProps> = ({ constraint, ports, formGroup, editing }) => {
  //state variables   
  const [selectedPorts, setSelectedPorts] = useState<string[]>(constraint.ports || []);

    //------------------FUNCTIONS-------------------//
    const addPort = () => {
        setSelectedPorts(prevPorts => [...prevPorts, ports[0]]);
    }

    const removePort = (index: number) => {
      setSelectedPorts(prevPorts => prevPorts.filter((_, i) => i !== index));
    }
  

    const onPortChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number) => {
      if (option && typeof index !== 'undefined') {
          const updatedPorts = [...selectedPorts];
          updatedPorts[index] = option.key as string;  
          setSelectedPorts(updatedPorts);
      }
  }
  

    //---------------RENDER-------------------//
    return (
      <div className="form-horizontal" style={{ border: '1px solid #e1e1e1', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>Ports</label>
          
          {/* Add functionality */}
          {editing && <PrimaryButton onClick={addPort} text="Add" style={{ marginLeft: '10px' }} />}
          
          {/*Display ports */}
          {selectedPorts.map((port, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
              <ComboBox
                options={ports.map(p => ({ key: p, text: p }))}
                selectedKey={port}
                onChange={(_, option) => onPortChange(_, option, index)}
                disabled={!editing}
                styles={{ root: { flex: 1, marginRight: '10px' } }}
              />

              {/* Remove functionality  */}
              {editing && <DefaultButton iconProps={{ iconName: 'Trash' }} onClick={() => removePort(index)} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
  

export default BoundedDifferenceComponent;


/* USE FOR MANUAL TESTING 
export const App: React.FC = () => {
  const sampleConstraint = {
    id: '12345',
    ports: ['port1', 'port2'],
    abstol: 0.1,
    reltol: 0.1,
    safety: 0.5,
    skipDiscrete: true,
  };

  const samplePorts = ['port1', 'port2', 'port3'];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Bounded Difference Component Demo</h1>
      <BoundedDifferenceComponent
        constraint={sampleConstraint}
        ports={samplePorts}
        formGroup={{}}
        editing={true}
      />
    </div>
  );
}

*/