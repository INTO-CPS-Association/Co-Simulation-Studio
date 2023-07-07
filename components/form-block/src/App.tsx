import * as React from 'react';
import { Stack, TextField, Separator, SpinButton, StackItem, ITextProps, Label, ILabelStyles } from '@fluentui/react';
import { DatePicker, IDatePickerStyles } from '@fluentui/react';
import { Checkbox, ICheckboxStyles } from '@fluentui/react';
import { FontWeights, IStackTokens, IStackStyles, ITextStyles, ITextFieldStyles, ISpinButtonStyles } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { FontIcon, IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ActionButton, IButtonStyles } from '@fluentui/react/lib/Button';
import './App.css';

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
const boldStyle: Partial<ITextStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
  }
};
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
const checkboxStyle: Partial<ICheckboxStyles> = {
  root: {
    height: 27,
    boxSizing: 'border-box'
  }
}

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

// update output json
// add remove/insert property

// Main function component for the Form Block
export const Form: React.FunctionComponent = () => {
  const [concepts, setConcepts] = React.useState<Concept[]>(getConcepts(conceptData))
  const [selectedConcept, setSelectedConcept] = React.useState<number>(0)
  const [conceptOptions, setConceptOptions] = React.useState<IChoiceGroupOption[]>([]);
  const [selectedKey, setSelectedKey] = React.useState<string>('1');
  const [inEditMode, setInEditMode] = React.useState<boolean>(false);

  // Initializes the options of the choice group
  React.useEffect(() => {
    let options: IChoiceGroupOption[] = []
    for (let i = 0; i < concepts.length; i++) {
      options.push({ key: (i+1).toString(), text: ('Concept ' + (i+1).toString()) })
    }
    setConceptOptions([...options])
  }, [concepts])

  // Handles change of concept from the choice group
  const handleConceptChange = React.useCallback((ev?: React.SyntheticEvent<HTMLElement>, option?: IChoiceGroupOption) => {
    if (option === undefined) { return }
    setSelectedKey(option.key)
    setSelectedConcept(+option.key - 1)
    setInEditMode(false)
  }, []);

  const handleEditClicked = React.useCallback(() => {
    setInEditMode(!inEditMode)
  }, [inEditMode]);

  const handleDownloadClicked = React.useCallback(() => {
    const conceptJSON = JSON.stringify(conceptToJSON(concepts[selectedConcept]), null, 2);
    const file = new Blob([conceptJSON], {type: 'application/json'});
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = (concepts[selectedConcept].name).replace(" ", "_") + ".json";
    document.body.appendChild(element);
    element.click();
  }, [concepts, selectedConcept]);

  const getModifiedConceptsNewValue = React.useCallback((newValue: any, key: number) => {
    const modifiedConcepts = concepts.map((c) => {
      if (c === concepts[selectedConcept]) {
        c.properties.map((p) => {
          if (p.name === concepts[selectedConcept].properties[key].name) {
            p.value = newValue
          }
          return p
      })
      }
      return c
    })
    return modifiedConcepts
  }, [concepts, selectedConcept])

  // TODO: Convert handlers to a single one if possible  
  const handleTextPropertyValueChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, key: number) => 
  {
    ev.preventDefault()
    const newValue = (ev.currentTarget as HTMLTextAreaElement).value
    const modifiedConcepts = getModifiedConceptsNewValue(newValue, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewValue]);

  const handleSpinButtonPropertyValueChange = React.useCallback(
    (ev: React.SyntheticEvent<HTMLElement, Event>, key: number, newValue?: string) => 
  {
    ev.preventDefault()
    if (newValue === undefined) { return }
    let newNumberValue: number = Number(newValue)
    if (concepts[selectedConcept].properties[key].type !== Type.FLOAT) {
      newNumberValue = Number(newNumberValue.toPrecision(1))
    }
    const modifiedConcepts = getModifiedConceptsNewValue(newNumberValue, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewValue]);

  const handleCheckboxPropertyValueChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, key: number, checked?: boolean) => 
  {
    if (ev === undefined) { return }
    const state = (ev.target as HTMLInputElement).checked
    const modifiedConcepts = getModifiedConceptsNewValue(state, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewValue]);

  const handleDatePickerPropertyValueChange = React.useCallback((date: Date | null | undefined, key: number) => 
  {
    if (date === undefined) { return }
    const modifiedConcepts = getModifiedConceptsNewValue(date, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewValue]);

  // Returns the item stack for the selected concept
  function ConceptView() {
    return (
      <div>
        <Stack enableScopedSelectors tokens={propertyStackTokens} styles={propertyStackStyles} horizontal>
          <StackItem align='center'>
            <FontIcon 
              aria-label={getTypeIcon(concepts[selectedConcept].type).iconName}
              iconName={getTypeIcon(concepts[selectedConcept].type).iconName}
              className={classNames.concept}
            />
          </StackItem>
          <StackItem align='center'>
            <Label styles={conceptLabelStyles}>{concepts[selectedConcept].name}</Label>
          </StackItem>
        </Stack>
        <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles}>
          {(concepts[selectedConcept].properties).map(p => (
            <div key={p.id}>
              <Stack enableScopedSelectors tokens={propertyStackTokens} styles={horizontalStackStyles} horizontal verticalAlign='center'>
                <StackItem align='baseline'>
                  <FontIcon
                    aria-label={getTypeIcon(p.type).iconName}
                    iconName={getTypeIcon(p.type).iconName}
                    className={classNames.property}
                  />
                </StackItem>
                <StackItem align='center'>
                  <TextField
                    readOnly
                    borderless
                    value={p.name}
                    styles={nameFieldStyle} 
                  />
                </StackItem>
                <StackItem align='center'>
                  {ValueField(p)}
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
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }), newValue
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
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }), newValue
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
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }), newValue
              ) }
            />
          )
        case Type.FLOAT:
          return (
            <SpinButton
              styles={spinButtonStyles}
              defaultValue={p.value}
              step={0.1}
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }), newValue
              ) }
            />
          )
        case Type.BOOL:
          return (
            <Checkbox
              styles={checkboxStyle}
              defaultChecked={p.value}
              onChange={ (ev, checked) => handleCheckboxPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }, checked)
              ) }
            />
          )
        case Type.DATE:
          return (
            <DatePicker
              styles={datePickerStyles}
              value={p.value}
              onSelectDate={ (date) => handleDatePickerPropertyValueChange(
                date, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) })
              ) }
            />
          )
        default:
          return (
            <TextField
              styles={textFieldStyles}
              readOnly={!inEditMode}
              borderless={!inEditMode}
              value={p.value}
              onChange={ (ev) => handleTextPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) })
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
              value={dateMDY}
            />
          )
        default:
          return (
            <TextField
              styles={textFieldStyles}
              readOnly={!inEditMode}
              borderless={!inEditMode}
              value={(p.value).toString()}
            />
          )
      }
    }    
  }
  
  // Returns the choice group with the available concepts
  function ConceptChoiceGroup() {  
    return (
      <div>
        <ChoiceGroup
          selectedKey={selectedKey} 
          options={conceptOptions}
          onChange={handleConceptChange} 
          label={"Select a component to view"}
        />
      </div>
    )
  }
  
  // Main return
  return (
    <div>
      <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles}>
        <StackItem align='stretch'>
          <ConceptChoiceGroup />
        </StackItem>
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

function getConcepts(JSONObjects: Array<any>): Concept[] {
  let concepts: Concept[] = []
  JSONObjects.forEach(c => {
    const concept = {} as Concept
    concept.name = c.name
    concept.typeName = c.type
    concept.type = getConceptType(c.type)
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

function conceptToJSON(c: Concept): any {
  const conceptJSON = {
    name: c.name,
    type: c.typeName,
    properties: [] as any[]
  }
  
  c.properties.forEach(p => {
    const propertyJSON = {
      name: p.name,
      type: p.typeName,
      value: p.value
    }
    conceptJSON.properties.push(propertyJSON)
  });

  console.log(JSON.stringify(conceptJSON))

  return conceptJSON
}