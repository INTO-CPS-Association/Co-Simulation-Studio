import React, { useState } from 'react';
import { Checkbox, ComboBox, DefaultButton, TextField } from '@fluentui/react';
import { BoundedDifferenceConstraint } from 'src/app/modules/shared/classes/co-simulation-config';



//-----------INTERFACES-----------------
interface FormErrors {
	required?: boolean;
	notUnique?: string;
	invalidLength?: boolean;
	notUniquePorts?: boolean;
	invalidNumberAbstol?: boolean;
	invalidNumberReltol?: boolean;
	invalidNumberSafety?: boolean;
}
  
  interface Port {
	instance: {
	  fmu: {
		name: string;
	  };
	  name: string;
	  scalarVariable: {
		name: string;
	  };
	};
  }
  
  

  //----------------COMPONENT-----------------
export default function BoundedDifferenceReactComponent(props: any) {
	//state variables 
	const [formErrors, setFormErrors] = useState<FormErrors>({}); 
	const [constraint, setConstraint] = useState(props.constraint);
	const [editing, setEditing] = useState<boolean>(props.editing); //for testing if editing works - remove later 



	//-----------FUNCTIONS-----------------
	const handleIdChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		if (newValue !== undefined) {
			setConstraint((prevState: BoundedDifferenceConstraint) => ({ ...prevState, id: newValue }));
		}
	}

	const handleAbstolChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		if (newValue !== undefined) {
			setConstraint((prevState: BoundedDifferenceConstraint) => ({ ...prevState, abstol: newValue }));
		}
	}

	const handleReltolChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		if (newValue !== undefined) {
			setConstraint((prevState: BoundedDifferenceConstraint) => ({ ...prevState, reltol: newValue }));
		}
	}

	const handleSafetyChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		if (newValue !== undefined) {
			setConstraint((prevState: BoundedDifferenceConstraint) => ({ ...prevState, safety: newValue }));
		}
	}

	const handleSkipDiscreteChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, isChecked?: boolean) => {
		if (isChecked !== undefined) {
			setConstraint((prevState: BoundedDifferenceConstraint) => ({ ...prevState, skipDiscrete: isChecked }));
		}
	}


	//----------------RENDER-----------------
	return (
		<div className="form-horizontal">

			{/* Start/Stop Editing button (REMOVE LATER) */}	
			<button onClick={() => setEditing(!editing)}>
				{editing ? "Stop Editing" : "Start Editing"}
			</button>

	
			{/* ID text field */}
			<div className="form-group">
				<label className="col-sm-3 control-label">ID</label>
				<div className="col-sm-9">
					{
						editing ? 
						<TextField value={constraint.id} onChange={handleIdChange} /> 
						:
						<span>{constraint.id}</span>
					}
					{formErrors.required && <span className="alert alert-danger">This field is required.</span>}
					{formErrors.notUnique && formErrors.notUnique === props.constraint.id && <span className="alert alert-danger">ID is not unique.</span>}
				</div>
			</div>

			{/* Ports text field */}
				<div className="form-group">
				<label className="col-sm-3 control-label">
					Ports
					{props.editing && <DefaultButton text="+" onClick={props.probs.addPort()} />}
				</label>
				<div className="col-sm-9">
					{
						props.ports.map((port: Port, index: number) => (
							<div key={index}>
								{
									editing ?
									<ComboBox 
										selectedKey={`${port.instance.fmu.name}.${port.instance.name}.${port.instance.scalarVariable.name}`}
										options={props.ports.map((output: Port) => ({
											key: `${output.instance.fmu.name}.${output.instance.name}.${output.instance.scalarVariable.name}`,
											text: `${output.instance.fmu.name}.${output.instance.name}.${output.instance.scalarVariable.name}`
										}))}
										onChange={(e, selectedItem) => props.props.onPortChange(e, selectedItem, index)}
									/>
									:                        
									<span>{`${port.instance.fmu.name}.${port.instance.name}.${port.instance.scalarVariable.name}`}</span>
								}
								{
									props.editing && props.constraint.ports.length > 1 && <DefaultButton text="-" onClick={() => props.props.removePort(port)} />}
							</div>
						))
					}
					{formErrors.invalidLength && <span className="alert alert-danger alert-standalone">1 or more ports are required.</span>}
					{formErrors.notUniquePorts && <span className="alert alert-danger">Ports are not unique.</span>}
				</div>
			</div>

			{/* Absolute Tolerance text field */}
			<div className="form-group">
				<label className="col-sm-3 control-label">Absolute Tolerance</label>
				<div className="col-sm-9">
					{
						editing ? 
						<TextField value={constraint.abstol} onChange={handleAbstolChange} />
						:
						<span>{constraint.abstol}</span>
					}
					{formErrors.invalidNumberAbstol && <span className="alert alert-danger">Only numbers are allowed.</span>}
				</div>
			</div>

			{/* Relative Tolerance text field */}
			<div className="form-group">
				<label className="col-sm-3 control-label">Relative Tolerance</label>
				<div className="col-sm-9">
					{
						editing ? 
						<TextField value={constraint.reltol} onChange={handleReltolChange}/>
						:
						<span>{constraint.reltol}</span>
					}
					{formErrors.invalidNumberReltol && <span className="alert alert-danger">Only numbers are allowed.</span>}
				</div>
			</div>
	
			{/* Safety text field */}
			<div className="form-group">
				<label className="col-sm-3 control-label">Safety</label>
				<div className="col-sm-9">
					{
						editing ? 
						<TextField value={constraint.safety} onChange={handleSafetyChange}/>
						:
						<span>{constraint.safety}</span>
					}
					{formErrors.invalidNumberSafety && <span className="alert alert-danger">Only numbers are allowed.</span>}
				</div>
			</div>


			{/* Skip discrete text field */}
            <div className="form-group">
                <label className="col-sm-3 control-label">Skip Discrete</label>
                <div className="col-sm-9">
                    <Checkbox 
                        checked={constraint.skipDiscrete} 
                        disabled={!editing} 
                        onChange={(e, isChecked) => setConstraint({ ...constraint, skipDiscrete: isChecked })} 
                    />
                </div>
            </div>
		</div>
	);
}
