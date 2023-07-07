import * as React from 'react';
import { Stack, TextField, Separator, SpinButton, StackItem, ITextProps, Label, ILabelStyles, PartialTheme, Checkbox, DatePicker } from '@fluentui/react';
import { FontWeights, IStackTokens, IStackStyles, ITextStyles, ISpinButtonStyles } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { FontIcon, IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ActionButton, IButtonStyles } from '@fluentui/react/lib/Button';
import './App.css';

initializeIcons();

const boldStyle: Partial<ITextStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
  }
};
const grayStyle: Partial<ITextStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
    opacity: 0.7
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
const horizontalStackStyles: Partial<IStackStyles> = {
  root: {
    width: '960px',
    margin: '10',
    textAlign: 'center',
    color: '#605e5c',
    maxwidth: '200px',
  },
};
const spinButtonStyles: Partial<ISpinButtonStyles> = { spinButtonWrapper: { width: 75 } };
const editButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: '#4c4c4c',
    fontWeight: 'semibold'
  }
};
const conceptLabelStyles: Partial<ILabelStyles> = {
  root: {
    fontSize: 18
  }
};
// const editButtonTheme: PartialTheme = {
//   font: {''}
// };

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

const iconClass = mergeStyles({
  fontSize: 16,
  height: 16,
  width: 16,
  margin: '8px 2px',
});

const classNames = mergeStyleSets({
  grey: [{ color: '#a5a4a1' }, iconClass],
});

const editIcon: IIconProps = { iconName: 'Edit' };

// For available icons:
// https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
const iconLookUp: { [key in Type]: string } = {
  [Type.INT]          : "NumberSymbol",
  [Type.NAT]          : "NumberSymbol",
  [Type.NAT1]         : "NumberSymbol",
  [Type.FLOAT]        : "NumberSymbol",
  [Type.CHAR]         : "FontColorA",
  [Type.STRING]       : "FontColorA",
  [Type.BOOL]         : "CheckMark",
  [Type.DATE]         : "DateTime",
  [Type.LIST]         : "CheckListText",
  [Type.SIMULATION]   : "Play",
  [Type.ALGORITHM]    : "DrillDown",
  [Type.UNDEFINED]    : "StatusCircleQuestionMark",
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
  type: Type,
  properties: Property[]
}

// listen for changes
// update output json
// add remove/insert property
// type dropdown?

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

  const getModifiedConceptsNewName = React.useCallback((newName: string, key: number) => {
    const modifiedConcepts = concepts.map((c) => {
      if (c === concepts[selectedConcept]) {
        c.properties.map((p) => {
          if (p.name === concepts[selectedConcept].properties[key].name) {
            p.name = newName
          }
          return p
      })
      }
      return c
    })
    return modifiedConcepts
  }, [concepts, selectedConcept])

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

  const handlePropertyNameChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, key: number) => 
  {
    ev.preventDefault()
    const newValue = (ev.currentTarget as HTMLTextAreaElement).value
    const modifiedConcepts = getModifiedConceptsNewName(newValue, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewName]);
  
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
    const modifiedConcepts = getModifiedConceptsNewValue(+newValue, key)
    setConcepts(modifiedConcepts)
  }, [getModifiedConceptsNewValue]);

  const handleCheckboxPropertyValueChange = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, key: number, checked?: boolean) => 
  {
    if (ev === undefined) { return }
    ev.preventDefault()
    if (checked === undefined) { return }
    console.log(checked)
    // const newValue = (ev.currentTarget as HTMLTextAreaElement).value
    const modifiedConcepts = getModifiedConceptsNewValue(checked, key)
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
        <Stack enableScopedSelectors tokens={propertyStackTokens} styles={stackStyles} horizontal>
          <StackItem>
            <FontIcon 
              aria-label={getTypeIcon(concepts[selectedConcept].type)}
              iconName={getTypeIcon(concepts[selectedConcept].type)}
              className={classNames.grey}
            />
          </StackItem>
          <StackItem>
            <Label styles={conceptLabelStyles}>{concepts[selectedConcept].name}</Label>
          </StackItem>
        </Stack>
        <Stack enableScopedSelectors tokens={conceptStackTokens} styles={stackStyles}>
          {(concepts[selectedConcept].properties).map(p => (
            <div key={p.id}>
              <Stack enableScopedSelectors tokens={propertyStackTokens} styles={horizontalStackStyles} horizontal>
                <StackItem>
                  <FontIcon
                    aria-label={getTypeIcon(p.type)}
                    iconName={getTypeIcon(p.type)}
                    className={classNames.grey}
                  />
                </StackItem>
                <StackItem>
                  <TextField
                    readOnly={!inEditMode}
                    borderless={!inEditMode}
                    value={p.name}
                    styles={grayStyle}
                    onChange={ (ev) => handlePropertyNameChange(
                      ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) })
                    ) }
                  />
                </StackItem>
                <StackItem>
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
              defaultValue={p.value}
              step={1.0}
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }, newValue)
              ) }
            />
          )
        case Type.NAT:
          return (
            <SpinButton
              defaultValue={p.value}
              step={1.0}
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }, newValue)
              ) }
            />
          )
        case Type.NAT1:
          return (
            <SpinButton
              defaultValue={p.value}
              step={1.0}
              min={0}
              onChange={ (ev, newValue) => handleSpinButtonPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }, newValue)
              ) }
            />
          )
        case Type.FLOAT:
          return (
            <SpinButton
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
              checked={p.value}
              onChange={ (ev, checked) => handleCheckboxPropertyValueChange(
                ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) }, checked)
              ) }
            />
          )
        case Type.DATE:
          return (
            <DatePicker
              // dateTimeFormatter={}
              value={p.value}
              onSelectDate={ (date) => handleDatePickerPropertyValueChange(
                date, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) })
              ) }
              // onChange={ (ev) => handleDatePickerPropertyValueChange(
              //   ev, concepts[selectedConcept].properties.findIndex((element) => { return (element.name === p.name) })
              // ) }
            />
          )
        default:
          return (
            <TextField
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
              readOnly={!inEditMode}
              borderless={!inEditMode}
              value={dateMDY}
            />
          )
        default:
          return (
            <TextField
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

function getTypeIcon(t: Type): string {
  let icon = iconLookUp[t]
  if (icon === undefined) {
    icon = 'StatusCircleQuestionMark'
  }
  return icon;
}