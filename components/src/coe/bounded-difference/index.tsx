import React from 'react';
import ReactDOM from 'react-dom';
import  BoundedDifferenceComponent  from './bounded-difference';

const App: React.FC = () => {
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
    <div>
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

ReactDOM.render(<App />, document.getElementById('root'));
