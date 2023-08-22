import { Component, OnInit } from '@angular/core';
import { DefaultButton, DropdownMenuItemType } from '@fluentui/react';
import ReactExample from './react-example';

@Component({
  selector: 'app-react-example',
  templateUrl: './react-example.component.html',
  styleUrls: ['./react-example.component.scss']
})
export class ReactExampleComponent {

  // example direct use of fluent ui button
  defaultButton = DefaultButton;
  defaultButtonProps = {
    text: "Standard",
    onClick: () => {
      alert('Clicked');
    },
    allowDisabledFocus: true,
    disabled: false
  }

  methodtest()
  {
    return true;
  }
  // example custom react component
  testComponent = ReactExample;
  testProps = {
    name: 'Hello World',
    x: this,
    stackTokens: { childrenGap: 20 },
    options: [
      { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
      { key: 'apple', text: 'Apple' },
      { key: 'banana', text: 'Banana' },
      { key: 'orange', text: 'Orange', disabled: true },
      { key: 'grape', text: 'Grape' },
      { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
      { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
      { key: 'broccoli', text: 'Broccoli' },
      { key: 'carrot', text: 'Carrot' },
      { key: 'lettuce', text: 'Lettuce' },
    ],
    dropdownStyles: {
      dropdown: { width: 300 },
    }
  }

}
