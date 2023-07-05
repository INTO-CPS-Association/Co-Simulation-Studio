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

const options: IChoiceGroupOption[] = [
  { key: '1', text: 'Concept 1' },
  { key: '2', text: 'Concept 2' },
  { key: '3', text: 'Concept 3'},
];

let conceptData = [
  require("./example.json"),
  require("./example.json"),
  require("./example.json")
];

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
  typeName: string
  type: Type,
  value: any
};

type Concept = Array<Property>;

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

let selectedConcept: number = 0;

export const App: React.FunctionComponent = () => {

  const concepts: Array<Concept> = getConcepts(conceptData)

  return (
    <div>
      <ConceptChoiceGroup />
      <Separator></Separator>
      <ConceptProperty {...concepts[0][0]}/>
      <Separator></Separator>
    </div>
  );
};

function ConceptPanel(c: Concept) {

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
  const [selectedKey, setSelectedKey] = React.useState<string>('1');

  const handleConceptChange = React.useCallback((ev?: React.SyntheticEvent<HTMLElement>, option?: IChoiceGroupOption) => {
    if (option === undefined) { return }
    setSelectedKey(option.key)
    selectedConcept = +option.key - 1
  }, [])

  return (
  <ChoiceGroup
      selectedKey={selectedKey} 
      options={options} 
      onChange={handleConceptChange} 
      label={"Select a concept " + selectedConcept}
  />
  )
}

function getProperty(p: any): Property {
  let property = {} as Property
  property.name = p.name
  property.typeName = p.type
  property.type = getType(p)
  property.value = p.value
  return property
}

function getConcept(c: Array<any>): Concept {
  let concept: Array<Property> = []
  c.forEach((p: any) => {
    const property = getProperty(p)
    concept.push(property)
  });
  return concept
}

function getConcepts(JSONObjects: Array<any>): Array<Concept> {
  let concepts: Array<Concept> = []
  JSONObjects.forEach(c => {
    const concept = getConcept(c)
    concepts.push(concept)
  });
  return concepts
};

function getConceptMarkUp() {
  return
}