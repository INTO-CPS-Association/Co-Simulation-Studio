import * as React from 'react';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
    //{ key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
    { key: 'a', text: 'A' },
    { key: 'b', text: 'B' },

    //{ key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
    //{ key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
    //{ key: 'orange', text: 'Orange', disabled: true },
    //{ key: 'grape', text: 'Grape' },
];

const stackTokens: IStackTokens = { childrenGap: 20 };

export const DropdownBasicExample: React.FunctionComponent = () => {
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