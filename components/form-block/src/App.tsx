import * as React from 'react';
import { Stack, TextField, Separator, SpinButton, StackItem } from '@fluentui/react';
import { FontWeights, IStackTokens, IStackStyles, ITextStyles, ISpinButtonStyles } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
import './App.css';

initializeIcons();

const boldStyle: Partial<ITextStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
  }
};

const stackTokens: IStackTokens = { childrenGap: 10 };
const stackStyles: Partial<IStackStyles> = {
  root: {
    width: '960px',
    margin: '20 auto',
    textAlign: 'center',
    color: '#605e5c',
    maxwidth: '200px',
  },
};

const styles: Partial<ISpinButtonStyles> = { spinButtonWrapper: { width: 75 } };

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
  grey: [{ color: 'black' }, iconClass],
});

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
  [Type.SIMULATION]   : "PlaySolid",
  [Type.ALGORITHM]    : "DrillDown",
  [Type.UNDEFINED]    : "StatusCircleQuestionMark",
};

interface Property {
  name: string,
  typeName: string,
  type: Type,
  value: any
};

interface Concept {
  name: string,
  type: string,
  properties: Property[]
}

// insert type icons?
// listen for changes
// update output json
// add remove/insert property
// type dropdown?

// Main function component for the Form Block
export const Form: React.FunctionComponent = () => {
  const [concepts, setConcepts] = React.useState<Concept[]>(getConcepts(conceptData))
  const [selectedConcept, setSelectedConcept] = React.useState<Concept>(concepts[0])
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
    setSelectedConcept(concepts[+option.key - 1])
  }, [concepts])

  // Returns the item stack for the selected concept
  function ConceptView(c: Concept) {
    let stackItems: Array<JSX.Element> = [];
    for (let i = 0; i < Object.keys(c.properties).length; i++) {
      const p: Property = c.properties[i];
      stackItems.push(<ConceptProperty key={p.name} {...p}/>)
    }
    return (
      <div>
        <TextField readOnly borderless value={ c.name + ": " + c.type }/>
        <Stack enableScopedSelectors tokens={stackTokens} styles={stackStyles}>
          { stackItems }
        </Stack>
      </div>
    );
  }
  
  // Returns a single concept property as a horizontal item stack
  function ConceptProperty(p: Property, isReadOnly: boolean = true) {
    // console.log(getTypeIcon(p.type))
    return (
      <Stack enableScopedSelectors tokens={stackTokens} styles={stackStyles} horizontal>
        <StackItem>
          <FontIcon aria-label={getTypeIcon(p.type)} iconName={getTypeIcon(p.type)} className={classNames.grey} />
        </StackItem>
        <StackItem>
          <TextField readOnly={isReadOnly} borderless value={p.name}/>
        </StackItem>
        <StackItem>
          <TextField readOnly={isReadOnly} borderless value={p.value}/>
        </StackItem>
      </Stack>
    )
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
      <ConceptChoiceGroup />
      <Separator></Separator>
      <ConceptView {...selectedConcept}/>
      <Separator></Separator>
    </div>
  );
};

function getConcepts(JSONObjects: Array<any>): Concept[] {
  let concepts: Concept[] = []
  JSONObjects.forEach(c => {
    const concept = {} as Concept
    concept.name = c.name
    concept.type = c.type
    concept.properties = getProperties(c.properties) 
    concepts.push(concept)
  });
  return concepts
};

function getProperties(ps: Array<any>): Property[] {
  let properties: Property[] = []
  ps.forEach((p: any) => {
    const property = getProperty(p)
    properties.push(property)
  });
  return properties
};

function getProperty(p: any): Property {
  let property = {} as Property
  property.name = p.name
  property.typeName = p.type
  property.type = getType(p)
  property.value = p.value
  return property 
};

function getType(p: any): Type {
  const typeName: string = p.type.toUpperCase()
  let type: Type = typeLookUp[typeName]

  console.log("Type name: " + typeName + "\nType: " + type)

  if (type !== Type.UNDEFINED) {
    return type
  }
  
  const valueType: string = p.value.typeOf.toUpperCase()
  type = typeLookUp[valueType]

  return type
};

function getTypeIcon(t: Type): string {
  // console.log("Type: ", t)
  return iconLookUp[t];
}