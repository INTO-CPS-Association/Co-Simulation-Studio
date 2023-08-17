import React from 'react';

class FmuMaxStepSizeComponent extends React.Component<FmuMaxStepSizeComponent_props> {
  render() {
    const { constraint, formGroup, editing } = this.props;

    const customTrackBy = (index: number, obj: any) => {
      return index;
    };

    return (
      <div className="app-fmu-max-step-size">
        {}
      </div>
    );
  }
}

// Define prop types for type checking
type FmuMaxStepSizeComponent_props = {
  constraint: any, //FIXME type is imported from 'src/app/modules/shared/classes/co-simulation-config'
  formGroup: any, //type should be formgroup 
  editing: boolean
};

export default FmuMaxStepSizeComponent;