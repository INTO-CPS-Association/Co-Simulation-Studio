import * as React from 'react';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import Demo from './App';
import * as API from "./APIcalls";
import * as hc from "./Hardcoded";
import { getAllSelectedOptions } from '@fluentui/react';

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};
const specOptions = API.FetchJsonAssets(hc.spec1, hc.spec2, hc.spec3, hc.spec4)

const SpecOptions: IDropdownOption[] = [
  { key: 'specHeader', text: 'Available specs', itemType: DropdownMenuItemType.Header },
  { key: specOptions[0], text: specOptions[1]},
  { key: specOptions[2], text: specOptions[3]},
  { key: specOptions[4], text: specOptions[5]},
  { key: specOptions[6], text: specOptions[7]},
  

  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'ExamplesHeader', text: 'Hardcoded examples', itemType: DropdownMenuItemType.Header },
  { key: 'spec1', text: 'BarChart'},
  { key: 'spec2', text: 'LineChart' },
  { key: 'spec3', text: 'PieChart'},
  { key: 'spec4', text: 'PiePlot' },
];

const onChangeHandler = (event: React.FormEvent<HTMLDivElement>, selection: any, demoInstance: Demo) => {
  console.log('selection: ', selection);
  demoInstance.UpdateSpec(selection.text)
}

type SpecDropdownProps = {
  demoInstance: Demo;
}

export const SpecDropdown: React.FunctionComponent<SpecDropdownProps> = ({demoInstance}) => {
  
  return (
    <Stack tokens={stackTokens} horizontal>
      <Dropdown
        placeholder="Select an option"
        label="Choose a chart specification"
        options={SpecOptions}
        styles={dropdownStyles}
        onChange={(event, selection) => onChangeHandler(event, selection, demoInstance)}
      />
      {/*<DefaultButton onClick={}>View</DefaultButton>*/}
    </Stack>
  );
};

//COLOR PICKER DROPDOWN
const options: IDropdownOption[] = [
    { key: 'datasetsHeader', text: 'Available datasets', itemType: DropdownMenuItemType.Header },
    { key: 'a', text: 'A' },
    { key: 'b', text: 'B' },

    { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
    { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
    { key: 'orange', text: 'Orange', disabled: true },
    { key: 'grape', text: 'Grape' },
];

const stackTokens: IStackTokens = { childrenGap: 20 };

export const DropdownBasic: React.FunctionComponent = () => {
  return (
    <Stack tokens={stackTokens}>
      <Dropdown
        placeholder="Select an option"
        label="Choose dataset to color"
        options={options}
        styles={dropdownStyles}
      />
    </Stack>
  );
};






/*
          <Dropdown
        label="Disabled example with defaultSelectedKey"
        defaultSelectedKey="broccoli"
        options={options}
        disabled={true}
        styles={dropdownStyles}
      />

      <Dropdown
        placeholder="Select options"
        label="Multi-select uncontrolled example"
        defaultSelectedKeys={['apple', 'banana', 'grape']}
        multiSelect
        options={options}
        styles={dropdownStyles}
      />
*/