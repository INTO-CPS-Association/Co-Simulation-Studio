import * as React from 'react';
import { Stack, Text, Link, TextField, Separator, SpinButton, StackItem } from '@fluentui/react';
import { FontWeights, IStackTokens, IStackStyles, ITextStyles, ISpinButtonStyles } from '@fluentui/react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';
import './App.css';


const boldStyle: Partial<ITextStyles> = { 
  root: { 
    fontWeight: FontWeights.semibold,
  }
};
const stackTokens: IStackTokens = { childrenGap: 15 };
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

let conceptData = require("./example.json");

export enum Type {
  INT,
  NAT,
  NAT1,
  FLOAT,
  CHAR,
  STRING,
  BOOL,
  DATE,
  LIST,
  UNDEFINED,
};

let typeLookUp: { [key: string]: Type } = {
  'int'         : Type.INT,
  'integer'     : Type.INT,
  'nat'         : Type.NAT,
  'positive int': Type.NAT,
  'float'       : Type.FLOAT,
  'real'        : Type.FLOAT,
  'char'        : Type.CHAR,
  'character'   : Type.CHAR,
  'string'      : Type.STRING,
  'bool'        : Type.BOOL,
  'boolean'     : Type.BOOL,
  'date'        : Type.DATE,
  'list'        : Type.LIST,
  'array'       : Type.LIST,
  'undefined'   : Type.UNDEFINED,
  'null'        : Type.UNDEFINED,
  'void'        : Type.UNDEFINED,
  ''            : Type.UNDEFINED,
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

function ciEquals(a: string, b: string) {
  return typeof a === 'string' && typeof b === 'string'
      ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
      : a === b;
};

function getType(p: any): Type {
  const typeName: string = p.type.toLowerCase()
  let type: Type = typeLookUp[typeName.toLowerCase()]

  if (type !== Type.UNDEFINED) {
    return type
  }
  
  const valueType: string = p.value.typeOf.toLowerCase()
  type = typeLookUp[valueType]

  return type
};

// read json schema, possibly write to an interface/type
// make stack structure
// read title and type of concept
// loop through elements in json and create stack items from them
// insert type icons?
// listen for changes
// update output json
// add remove/insert property
// type dropdown?

export const Form: React.FunctionComponent = () => {

  const [concepts, setConcepts] = React.useState<Concept[]>(getConcepts(conceptData))
  const [selectedConcept, setSelectedConcept] = React.useState<Concept>(concepts[0])
  const [conceptOptions, setConceptOptions] = React.useState<IChoiceGroupOption[]>([]);
  const [selectedKey, setSelectedKey] = React.useState<string>('1');

  React.useEffect(() => {
    let options: IChoiceGroupOption[] = []
    for (let i = 0; i < concepts.length; i++) {
      options.push({ key: (i+1).toString(), text: ('Concept ' + (i+1).toString()) })    
    }
    setConceptOptions([...options])
  }, [])

  const handleConceptChange = React.useCallback((ev?: React.SyntheticEvent<HTMLElement>, option?: IChoiceGroupOption) => {
    if (option === undefined) { return }
    setSelectedKey(option.key)
    setSelectedConcept(concepts[+option.key - 1])
  }, [])

  function ConceptView(c: Concept) {
    let isReadOnly = true
    let stackItems: Array<JSX.Element> = [];
    for (let i = 0; i < Object.keys(c).length; i++) {
      const p: Property = c.properties[i];
      stackItems.push(<ConceptProperty key={p.name} {...p}/>)
    }
    return (
      <div>
        <TextField readOnly={isReadOnly} borderless value={ c.name + ": " + c.type }/>
        <Stack enableScopedSelectors tokens={stackTokens} styles={stackStyles}>
          { stackItems }
        </Stack>
      </div>
    );
  }
  
  function ConceptProperty(p: Property, isReadOnly: boolean = true) {
    return (
      <Stack enableScopedSelectors tokens={stackTokens} styles={stackStyles} horizontal>
        <Stack.Item>
          <TextField readOnly={isReadOnly} borderless value={p.typeName}/>
        </Stack.Item>
        <Stack.Item>
          <TextField readOnly={isReadOnly} borderless value={p.name}/>
        </Stack.Item>
        <Stack.Item>
          <TextField readOnly={isReadOnly} borderless value={p.value}/>
        </Stack.Item>
      </Stack>
    )
  }
  
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

  return (
    <div>
      <ConceptChoiceGroup />
      <p></p>
      <Separator></Separator>
      <ConceptView {...selectedConcept}/>
      <Separator></Separator>
    </div>
  );
};

function getProperty(p: any): Property {
  let property = {} as Property
  property.name = p.name
  property.typeName = p.type
  property.type = getType(p)
  property.value = p.value
  return property 
}

function getProperties(ps: Array<any>): Property[] {
  let properties: Property[] = []
  ps.forEach((p: any) => {
    const property = getProperty(p)
    properties.push(property)
  });
  return properties
}

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