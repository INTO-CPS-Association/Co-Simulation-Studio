import * as React from 'react';
import { Stack, TextField, Separator, SpinButton, StackItem, Label, ILabelStyles } from '@fluentui/react';
import { DatePicker, IDatePickerStyles } from '@fluentui/react';
import { Checkbox, ICheckboxStyles } from '@fluentui/react';
import { FontWeights, IStackTokens, IStackStyles, ITextFieldStyles, ISpinButtonStyles } from '@fluentui/react';
import { FontIcon, IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ActionButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import './App.css';

/*
 * Styling, icons, etc.
 */

initializeIcons();

const propertyFieldHeight: number = 40
const propertyFieldWidth: number = 250

const propertyTypeIconClass = mergeStyles({
  fontSize: 16,
  height: 16,
  width: 16,
  margin: '8px 2px',
});
const conceptTypeIconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '8px 2px',
});
const classNames = mergeStyleSets({
  property: [{ color: '#a5a4a1' }, propertyTypeIconClass],
  concept: [{ color: '#202020' }, conceptTypeIconClass]
});
const editIcon: IIconProps = { iconName: 'Edit' };
const downloadIcon: IIconProps = { iconName: 'Download' };
const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    fontWeight: FontWeights.semibold,
    width: propertyFieldWidth,
    height: propertyFieldHeight,
  }
};
const nameFieldStyle: Partial<ITextFieldStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
    opacity: 0.7,
    width: propertyFieldWidth,
    height: propertyFieldHeight,
  }
};
const propertyStackTokens: IStackTokens = { childrenGap: 5 };
const conceptStackTokens: IStackTokens = { childrenGap: 5 };
const stackStyles: Partial<IStackStyles> = {
  root: {
    width: '960px',
    margin: '10 auto',
    textAlign: 'center',
    color: '#605e5c',
    maxwidth: '200px',
  },
};
const propertyStackStyles: Partial<IStackStyles> = {
  root: {
    width: '960px',
    margin: '10 auto',
    textAlign: 'center',
    color: '#605e5c',
    maxwidth: '200px',
    minHeight: '60px'
  },
};
const horizontalStackStyles: Partial<IStackStyles> = {
  root: {
    width: '960px',
    margin: '10',
    textAlign: 'center',
    color: '#605e5c',
    maxwidth: '200px',
  },
};
const spinButtonStyles: Partial<ISpinButtonStyles> = { 
  root: { 
    width: propertyFieldWidth,
    height: propertyFieldHeight
  } 
};
const editButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: '#4c4c4c',
    fontWeight: 'semibold'
  }
};
const datePickerStyles: Partial<IDatePickerStyles> = {
  root: {
    width: propertyFieldWidth,
    height: propertyFieldHeight
  }
}
const conceptLabelStyles: Partial<ILabelStyles> = {
  root: {
    fontSize: 18
  }
};
const checkboxStyles: Partial<ICheckboxStyles> = {
  root: {
    height: 27,
    boxSizing: 'border-box'
  }
}
const dropdownStyles: Partial<IDropdownStyles> = { 
  dropdown: { 
    width: 400,
    fontWeight: FontWeights.semibold,
    borderColor: '#4c4c4c',
    fontSize: 22,
    textAlign: 'left',
  },
  title: {
    borderColor: 'transparent',
  },
};

const conceptData = require("./example.json");

enum Type {
  INT,
  NAT,
  NAT1,
  FLOAT,
  CHAR,
  STRING,
  BOOL,
  DATE,
  LIST,
  SIMULATION,
  ALGORITHM,
  UNDEFINED,
};

const typeLookUp: { [key: string]: Type } = {
  'INT'         : Type.INT,
  'INTEGER'     : Type.INT,
  'NAT'         : Type.NAT,
  'POSITIVE INT': Type.NAT,
  'NAT1'         : Type.NAT1,
  'FLOAT'       : Type.FLOAT,
  'REAL'        : Type.FLOAT,
  'NUMBER'      : Type.FLOAT,
  'CHAR'        : Type.CHAR,
  'CHARACTER'   : Type.CHAR,
  'STRING'      : Type.STRING,
  'BOOL'        : Type.BOOL,
  'BOOLEAN'     : Type.BOOL,
  'DATE'        : Type.DATE,
  'LIST'        : Type.LIST,
  'ARRAY'       : Type.LIST,
  'ALGORITHM'   : Type.ALGORITHM,
  'SIMULATION'  : Type.SIMULATION,
  'UNDEFINED'   : Type.UNDEFINED,
  'NULL'        : Type.UNDEFINED,
  'VOID'        : Type.UNDEFINED,
  ''            : Type.UNDEFINED,
};

// For available icons:
// https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
const iconLookUp: { [key in Type]: IIconProps } = {
  [Type.INT]          : { iconName: 'NumberSymbol' },
  [Type.NAT]          : { iconName: 'NumberSymbol' },
  [Type.NAT1]         : { iconName: 'NumberSymbol' },
  [Type.FLOAT]        : { iconName: 'NumberSymbol' },
  [Type.CHAR]         : { iconName: 'FontColorA' },
  [Type.STRING]       : { iconName: 'FontColorA' },
  [Type.BOOL]         : { iconName: 'CheckMark' },
  [Type.DATE]         : { iconName: 'DateTime' },
  [Type.LIST]         : { iconName: 'CheckListText' },
  [Type.SIMULATION]   : { iconName: 'BoxPlaySolid' },
  [Type.ALGORITHM]    : { iconName: 'DrillDown' },
  [Type.UNDEFINED]    : { iconName: 'UnknownSolid' },
};

interface Property {
  id: number,
  name: string,
  typeName: string,
  type: Type,
  value: any
};

interface Concept {
  name: string,
  typeName: string,
  type: Type,
  properties: Property[]
}

// Concept instance interface
// Uses string array for owner concept name of properties to allow for multiple concepts to own an identical property 
interface ConceptInstance {
  conceptName: string,
  properties: {names: string[], property: Property}[]
}

// TODO: Change implementation to differentiate between concept and a concept instance
// Have drop down to change concept type on the instance
// Update the properties in the instance to the properties in the schema, but keep the
// data of the properties not present in the new schema

// Main function component for the Form Block
export const Form: React.FunctionComponent = () => {
  const [concepts, setConcepts] = React.useState<Concept[]>(getConcepts(conceptData))
  const [selectedConcept, setSelectedConcept] = React.useState<number>(0)
  const [conceptInstance, setConceptInstance] = React.useState<ConceptInstance>(getConceptInstance(concepts[selectedConcept]))
  const [conceptOptions, setConceptOptions] = React.useState<IDropdownOption[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
  const [inEditMode, setInEditMode] = React.useState<boolean>(false);

  // Initializes the options of the dropdown
  React.useEffect(() => {
    let options: IDropdownOption[] = []
    for (let i = 0; i < concepts.length; i++) {
      options.push({ key: (i+1).toString(), text: (concepts[i].name) })
    }
    setConceptOptions([...options])
    setSelectedItem(conceptOptions[0])
  }, [concepts])

  // Handles change of concept from the dropdown
  const handleConceptChange = React.useCallback((ev?: React.SyntheticEvent<HTMLElement>, item?: IDropdownOption) => {
    if (item === undefined) { return }
    setSelectedItem(item)
    setSelectedConcept(+item.key - 1)
    setInEditMode(false)

    const c = concepts[+item.key - 1]
    let modifiedConceptInstance = conceptInstance
    modifiedConceptInstance.conceptName = c.name
    // Check if the properties already exist 
    if (
      (modifiedConceptInstance.properties !== undefined) && (Object.values(modifiedConceptInstance.properties).some(
        p => {
          return p.names.some(
            n => n === c.name  // Returns true if the concept was already loaded
          )
        }))
    ) {
      // Do nothing if the concept has already been loaded before
    } else {
      let pis = modifiedConceptInstance.properties;
      // If not, load the concept properties to the instance
      for (let i = 0; i < c.properties.length; i++) {
        const p = c.properties[i];

        // Check if a property with same name and type already exists in another loaded concept
        const existingIndex = Object.values(pis).findIndex(
          pi => {
            return (pi.property.name === p.name && pi.property.type === p.type)
          })
        if (existingIndex !== -1) {
          // If it does, append the concept name to the owner names of the property 
          pis[existingIndex].names.push(c.name)
        } else {
          // If not, add the property separately
          pis.push({names: [c.name], property: p})
        }
      }
      modifiedConceptInstance.properties = pis
    }
    setConceptInstance(modifiedConceptInstance)
  }, [conceptInstance, concepts]);

  // Handle switching between read and write
  const handleEditClicked = React.useCallback(() => {
    setInEditMode(!inEditMode)
  }, [inEditMode]);

  // Handle download
  const handleDownloadClicked = React.useCallback(() => {
    const instanceFilteredProperties = conceptInstance.properties.filter(p => p.names.some(n => n === conceptInstance.conceptName))
    const ci = conceptInstance
    ci.properties = instanceFilteredProperties
    const conceptJSON = JSON.stringify(conceptToJSON(ci), null, 2);
    const file = new Blob([conceptJSON], {type: 'application/json'});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = (conceptInstance.conceptName).replace(" ", "_") + ".json";
    document.body.appendChild(element);
    element.click();
  }, [conceptInstance]);

  // Handle updating value of concept instance
  const setModifiedConceptInstance = React.useCallback((newValue: any, key: number) => {
    const modifiedConceptInstanceProperties = conceptInstance.properties.map((p) => {
      if (p.property.name === conceptInstance.properties[key].property.name) {
        p.property.value = newValue
      }
      return p
    })
    let modifiedConceptInstance = conceptInstance
    modifiedConceptInstance.properties = modifiedConceptInstanceProperties
    setConceptInstance(modifiedConceptInstance)

  }, [conceptInstance])

  // Handler for change in Text Fields
  const handleTextValueChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, key: number) => 
  {
    ev.preventDefault()
    const newValue = (ev.currentTarget as HTMLTextAreaElement).value
    setModifiedConceptInstance(newValue, key)
  }, [setModifiedConceptInstance]);

  // Handler for change in Spin Buttons
  const handleSpinButtonValueChange = React.useCallback(
    (ev: React.SyntheticEvent<HTMLElement, Event>, key: number, newValue?: string) => 
  {
    ev.preventDefault()
    if (newValue === undefined) { return }
    let newNumberValue: number = Number(newValue)
    if (conceptInstance.properties[key].property.type !== Type.FLOAT) {
      newNumberValue = Number(newNumberValue.toPrecision(1))
    }
    setModifiedConceptInstance(newNumberValue, key)
  }, [setModifiedConceptInstance, conceptInstance]);

  // Handler for change in Checkboxes
  const handleCheckboxValueChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, key: number, checked?: boolean) => 
  {
    if (ev === undefined) { return }
    const state = (ev.target as HTMLInputElement).checked
    setModifiedConceptInstance(state, key)
  }, [setModifiedConceptInstance]);

  // Handler for change in Date Pickers
  const handleDatePickerValueChange = React.useCallback((date: Date | null | undefined, key: number) => 
  {
    if (date === undefined) { return }
    setModifiedConceptInstance(date, key)
  }, [setModifiedConceptInstance]);

  // Returns the item stack for the selected concept
  function ConceptView() {
    return (
      <div>
        <Stack enableScopedSelectors tokens={propertyStackTokens} styles={propertyStackStyles} horizontal>
          <StackItem align='center'>
            <FontIcon 
              // TODO: Make types and icons specifically for concepts (temporarily set to SIMULATION)
              aria-label={getTypeIcon(Type.SIMULATION).iconName}
              iconName={getTypeIcon(Type.SIMULATION).iconName}
              className={classNames.concept}
            />
          </StackItem>
          <StackItem align='center'>
            <ConceptDropdown />
          </StackItem>
        </Stack>
        <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles}>
          {(conceptInstance.properties.filter(
            p => p.names.some(n => n === conceptInstance.conceptName))).map(
              p => (
                <div key={conceptInstance.conceptName + "_" + p.property.name}>
                  <Stack enableScopedSelectors tokens={propertyStackTokens} styles={horizontalStackStyles} horizontal verticalAlign='center'>
                    <StackItem align='baseline'>
                      <FontIcon
                        aria-label={getTypeIcon(p.property.type).iconName}
                        iconName={getTypeIcon(p.property.type).iconName}
                        className={classNames.property}
                      />
                    </StackItem>
                    <StackItem align='center'>
                      <TextField
                        readOnly
                        borderless
                        value={p.property.name}
                        styles={nameFieldStyle} 
                      />
                    </StackItem>
                    <StackItem align='center'>
                      {ValueField(p.property)}
                    </StackItem>
                  </Stack>
                </div>
          ))}
        </Stack>
      </div>
    );
  }

  function ValueField(p: Property) {
    if (inEditMode) {
      switch (p.type) {
        case Type.INT:
          return (
            <SpinButton
              styles={spinButtonStyles}
              defaultValue={p.value}
              step={1}
              onChange={ (ev, newValue) => handleSpinButtonValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) }), newValue
              ) }
            />
          )
        case Type.NAT:
          return (
            <SpinButton
              styles={spinButtonStyles}
              defaultValue={p.value}
              step={1}
              min={0}
              onChange={ (ev, newValue) => handleSpinButtonValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) }), newValue
              ) }
            />
          )
        case Type.NAT1:
          return (
            <SpinButton
              styles={spinButtonStyles}
              defaultValue={p.value}
              step={1}
              min={1}
              onChange={ (ev, newValue) => handleSpinButtonValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) }), newValue
              ) }
            />
          )
        case Type.FLOAT:
          return (
            <SpinButton
              styles={spinButtonStyles}
              defaultValue={p.value}
              step={0.1}
              onChange={ (ev, newValue) => handleSpinButtonValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) }), newValue
              ) }
            />
          )
        case Type.BOOL:
          return (
            <Checkbox
              styles={checkboxStyles}
              defaultChecked={p.value}
              onChange={ (ev, checked) => handleCheckboxValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) }, checked)
              ) }
            />
          )
        case Type.DATE:
          return (
            <DatePicker
              styles={datePickerStyles}
              value={p.value}
              onSelectDate={ (date) => handleDatePickerValueChange(
                date, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) })
              ) }
            />
          )
        default:
          return (
            <TextField
              styles={textFieldStyles}
              readOnly={!inEditMode}
              borderless={!inEditMode}
              defaultValue={p.value}
              onChange={ (ev) => handleTextValueChange(
                ev, conceptInstance.properties.findIndex((element) => { return (element.property.name === p.name) })
              ) }
            />
          )
      }
    } else {
      switch (p.type) {
        case Type.DATE:
          const date: string[] = p.value.toString().split(" ")
          const dateMDY: string = [date[1], date[2], date[3]].join(" ")
          return (
            <TextField
              styles={textFieldStyles}
              readOnly={!inEditMode}
              borderless={!inEditMode}
              defaultValue={dateMDY}
            />
          )
        default:
          return (
            <TextField
              styles={textFieldStyles}
              readOnly={!inEditMode}
              borderless={!inEditMode}
              defaultValue={(p.value).toString()}
            />
          )
      }
    }    
  }
  
  // Returns the dropdown with the available concepts
  function ConceptDropdown() {  
    return (
      <div>
        <Dropdown
          selectedKey={selectedItem ? selectedItem.key : undefined}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={handleConceptChange}
          placeholder="Select an option"
          options={conceptOptions}
          styles={dropdownStyles}
        />
      </div>
    )
  }
  
  // Main return
  return (
    <div>
      <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles}>
        <Separator></Separator>
        <StackItem>
          { ConceptView() }
        </StackItem>
        <StackItem align='end'>
          <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles} horizontal horizontalAlign='end'>
            <StackItem align='end'>
              <ActionButton 
                iconProps={editIcon} 
                onClick={handleEditClicked}
                marginWidth={100}
                marginHeight={100}
                styles={editButtonStyles}
              >
                {inEditMode ? 'Save changes' : 'Edit properties'}
              </ActionButton>
            </StackItem>
            <StackItem align='end'>
              <ActionButton 
                iconProps={downloadIcon} 
                onClick={handleDownloadClicked}
                marginWidth={100}
                marginHeight={100}
                styles={editButtonStyles}
              >
                Download .json
              </ActionButton>
            </StackItem>
          </Stack>
        </StackItem>
        <Separator></Separator>
      </Stack>
    </div>
  );
};

/*
 * Utility functions for reading the concepts and their properties
*/

function getConceptInstance(c: Concept): ConceptInstance {
  let ci = {} as ConceptInstance
  ci.conceptName = c.name
  ci.properties = []

  for (let i = 0; i < c.properties.length; i++) {
    const p = c.properties[i];
    const pi: {names: string[], property: Property} = {names: [c.name], property: p}
    ci.properties.push(pi)
  }
  return ci
}

function getConcepts(JSONObjects: Array<any>): Concept[] {
  let concepts: Concept[] = []
  JSONObjects.forEach(c => {
    const concept = {} as Concept
    concept.name = c.name
    concept.typeName = c.type
    // concept.type = getConceptType(c.type)
    concept.type = Type.SIMULATION
    concept.properties = getProperties(c.properties) 
    concepts.push(concept)
  });
  return concepts
};

function getProperties(ps: Array<any>): Property[] {
  let properties: Property[] = []
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    const property = getProperty(p, i)
    properties.push(property)
  }
  return properties
};

function getProperty(p: any, i: number): Property {
  let property = {} as Property
  property.id = i
  property.name = p.name
  property.typeName = p.type
  property.type = getPropertyType(p)
  if (property.type === Type.DATE) {
    const [month, day, year] = p.value.split('/');
    const date = new Date(+year, +month - 1, +day);
    property.value = date
  } else {
    property.value = p.value
  }
  return property
};

function getPropertyType(p: any): Type {
  const typeName: string = p.type.toUpperCase()
  let type: Type = typeLookUp[typeName]

  if (type !== Type.UNDEFINED) {
    return type
  }
  
  const valueType: string = p.value.typeOf.toUpperCase()
  type = typeLookUp[valueType]

  if (type === undefined) {
    type = Type.UNDEFINED
  }

  return type
};

function getConceptType(t: string): Type {
  const typeName: string = t.toUpperCase()
  let type: Type = typeLookUp[typeName]

  return type
};

function getTypeIcon(t: Type): IIconProps {
  let icon = iconLookUp[t]
  if (icon === undefined) {
    icon = iconLookUp[Type.UNDEFINED]
  }
  return icon;
}

// Function for converting the concept instance to JSON
function conceptToJSON(c: ConceptInstance): any {
  const conceptJSON = {
    name: c.conceptName,
    properties: [] as any[]
  }
  
  c.properties.forEach(p => {
    const propertyJSON = {
      name: p.property.name,
      type: p.property.typeName,
      value: p.property.value
    }
    conceptJSON.properties.push(propertyJSON)
  });

  return conceptJSON
}