import React from 'react';

class FmuMaxStepSizeComponent extends React.Component<FmuMaxStepSizeComponentProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { constraint, formGroup, editing } = this.props;

    const customTrackBy = (index: number, obj: any) => {
      return index;
    };

    return (
      <div>
        <div className="form-group">
          <label className="col-sm-12 control-label" style={{ textAlign: 'left' }}>
            Constrain Step Size to Maximum bound of FMUs
          </label>
        </div>
        <hr />
        <div className="form-horizontal">
          <div className="form-group">
            <div className="col-sm-9">
              <p className="form-control-static">Constraint enabled.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Define prop types for type checking
type FmuMaxStepSizeComponentProps = {
  constraint: any,
  formGroup: any,
  editing: boolean
};

export default FmuMaxStepSizeComponent;