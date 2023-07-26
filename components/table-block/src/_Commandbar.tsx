// -------------------------------IMPORTS -------------------------------
import React from 'react';
import { DetailsList, IColumn, Selection} from '@fluentui/react/lib/DetailsList';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { useBoolean } from '@fluentui/react-hooks';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { IComboBoxOption, IComboBoxStyles, VirtualizedComboBox, IComboBox } from '@fluentui/react';
import { IconButton, DefaultButton, PrimaryButton, IButtonStyles} from '@fluentui/react/lib/Button';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { FormEvent} from 'react';
import {IDetailsListBasicExampleItem} from './DetailsList'

//-------------------------COMANDBAR COMPONENT 
//function to pass the the coomandbar component
type CommandbarProps = {
    _deleteRow: () => void
    filter_columns: IColumn[] 
    multSearch: (data: any) => void
    savetemplate:() =>void
    savedtemplates: IDetailsListBasicExampleItem[]
  };
  
  
  //create commandbart which can add or remove
  export const CommandBar_: React.FunctionComponent<CommandbarProps> = ({_deleteRow , filter_columns, multSearch, savetemplate, savedtemplates}) => {    
  // ------------------------ADD functionallity ---------------------
  
  const Add = ()  :void => {
    console.log('addButton')
  }
  const ComboBox_saved_templates: React.FunctionComponent = () => {
      
    
    const options: IComboBoxOption[] = []
    
    if(savedtemplates !== undefined){
    for(let i = 0; i < savedtemplates.length; i++){
      options.push({key: savedtemplates[i].Id, 
                    text: savedtemplates[i].Id.toString()})
    }
    }
    return (
      <VirtualizedComboBox
        label="Select template"
        allowFreeform
        autoComplete="on"
        options={options}
        dropdownMaxWidth={200}
        useComboBoxAsMenuWidth
        onChange={autofilltemplate}
      />
    );
    }
  const [templateId, setTemplateId] = React.useState<any>();
  const [templateType, setTemplateType] = React.useState<any>();
  const [templatePpu, setTemplatePpu] = React.useState<any>();
  const [templateName, setTemplateName] = React.useState<any>();
  
  //function to autofil on template selection
  const autofilltemplate = (event: FormEvent<IComboBox>, option?: IComboBoxOption | undefined, index?: number | undefined, value?: string | undefined ): void => {
    let selectedtemplate = undefined
    for(let i = 0; i < savedtemplates.length; i++)
    {
      if(savedtemplates[i].Id === option?.key){
        selectedtemplate = savedtemplates[i]
      }
    }
    setTemplateId(selectedtemplate?.Id)
    setTemplateType(selectedtemplate?.Type)
    setTemplatePpu(selectedtemplate?.Ppu)
    setTemplateName(selectedtemplate?.Name)
  };
    //create combobox to select type when adding
    const ComboBox_type: React.FunctionComponent = () => {
      const GetOptions = () => {
        const options: IComboBoxOption[] = [
          {
          key: `Extends`,
          text: `Extends`
          },
          {
          key: 'Uses',
          text: 'Uses'
          }
        ]
        return options;
      }
      const options = GetOptions();
      return (
        <VirtualizedComboBox
          label="Select type"
          allowFreeform
          autoComplete="on"
          options={options}
          dropdownMaxWidth={200}
          useComboBoxAsMenuWidth
          defaultValue={templateType}
        />
      );
    };
    //creates the textfield to contain ppu
    
    const TextField_ppu: React.FunctionComponent = () => {
      const [TextFieldValue, setTextFieldValue] = React.useState(templatePpu);
      const onChangeFirstTextFieldValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
          setTextFieldValue(newValue || '');
        },
        [],
      );

      console.log(TextFieldValue)
      return (
          <TextField
            label="Ppu"
            value={TextFieldValue}
            onChange={onChangeFirstTextFieldValue}
          />
      );
    };
    //create textfield to contain name 
    const TextField_name: React.FunctionComponent = () => {
      const [TextFieldValue, setTextFieldValue] = React.useState(templateName);
      const onChangeFirstTextFieldValue = React.useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
          setTextFieldValue(newValue || '');
        },
        [],
      );
      return (
          <TextField
            label="Name"
            value={TextFieldValue}
            //Textfieldvalue contains the prefix. need to set up constaints for prefix format.
            onChange={onChangeFirstTextFieldValue}
          />
          
      );
    };
  
  // ----------------------Sort on multiple collums funtionallity-------------------
    
    //set options 
    const options_columns: IDropdownOption[] = []
    for(let i = 0; i<filter_columns.length; i++){
      options_columns.push({key: filter_columns[i].key, text: filter_columns[i].name})
    }
    const sort_columns: IDropdownOption[] = [
      {
        key: "ASC", 
        text: "ASC"
      },
      {
        key: 'DESC',
        text: 'DESC'
      }
    ];
  
    //panel variables 
    const [isOpenSort, { setTrue: openSortPanel, setFalse: dismissSortPanel }] = useBoolean(false);
    const [isOpenAdd, { setTrue: openAddPanel, setFalse: dismissAddPanel }] = useBoolean(false);
    const [selectedcolumn, setSelectedcolumn] = React.useState<string[]>([]);
    const [selectedSortorder, setSelectedSortorder] = React.useState<string[]>([]);
    const [indexcounter, setindex] = React.useState<number>(0);
    const [data, setData] = React.useState<any>([{ column: 'Id', sortorder: 'ASC', index: indexcounter}]);
     //create the two options and assign onClick functions.
    const _items: ICommandBarItemProps[] = [
      {
        key: 'addItem',
        text: 'Add',
        iconProps: { iconName: 'Add' },
        onClick: () => openAddPanel()
      },
      {
          key: 'removeRow',
          text: 'Remove',
          iconProps: { iconName: 'Remove'},
          onClick: () => _deleteRow()
      },
      {
          key: 'MulSort',
          text: 'Sort on muliple collums',
          iconProps: { iconName: 'Filter'},
          onClick: () => openSortPanel()
      },
      {
          key: 'Saverow',
          text: 'Save row for template',
          iconProps: { iconName: 'Save'},
          onClick: () => savetemplate()
  
      }  
    ];
  // -------------------------THE SORT TABLE ------------------------------------
  
    //Set table collums
    
    let _columns: IColumn[] = [
      { key: 'ColumnSort', name: 'ColumnSort', fieldName: 'ColumnSort', minWidth: 100, maxWidth: 200, isResizable: true,
        onRender: (item) => (
          <Dropdown
            options={options_columns}
            styles={{ dropdown: { width: 150 } }}
            defaultSelectedKey={getdefaultkeysColumn(item)}
            onChange = {(event, option) => onChangecolumn(event, option, item)}
          />
        ), },
      { key: 'SortOrder', name: 'SortOrder', fieldName: 'SortOrder', minWidth: 100, maxWidth: 200, isResizable: true,
        onRender: (item) => (
          <Dropdown
            options={sort_columns}
            defaultSelectedKey={getdefaultkeysSortOrder(item)}
            styles={{ dropdown: { width: 150 } }}
            onChange={(event, option) => onChangeSortOrder(event, option, item)}
            
          />
        ),
    },
    ];
    const getdefaultkeysSortOrder = (items: any): string[] => {
      return data[items.index].sortorder
    }
    const getdefaultkeysColumn = (items: any): string[] => {
      return data[items.index].column
    }
    const addrow = (data: any) => {
      setindex(indexcounter + 1)
       
       data.push({column: "Id", sortorder: 'ASC', index: indexcounter+1})
       setData(data)
    }
    const _table = <DetailsList
      items = {data}
      columns={_columns}
      />
  
    //panel renderes
    const onRenderFooterContentSort = React.useCallback(
      () => (
        <div>
          <DefaultButton onClick={dismissSortPanel}>Back</DefaultButton>
        </div>
      ),
      [dismissSortPanel],
      );
    const onRenderFooterContentAdd = React.useCallback(
      () => (
        <div>
          <DefaultButton onClick={Add}>Add</DefaultButton>
          <DefaultButton onClick={dismissAddPanel}>Back</DefaultButton>
        </div>
      ),
      [dismissAddPanel],
      );

      const onChangecolumn = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, item?: any): void => {
        
        if(option !== undefined && item !== undefined)
        {
          data[item.index].column = option.key
        }
      };
      const onChangeSortOrder = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, item?: any): void => {
        if(option !== undefined  && item !== undefined){
          data[item.index].sortorder = option.key
        }
      };
  
    // ---------------------------------------RETURN CONTENT --------------------------------
    return (
  
      <div>
        <CommandBar items={_items} />
        <>
        <Panel
          //add panel 
          isLightDismiss
          isOpen={isOpenAdd}
          onDismiss={dismissAddPanel}
          headerText="Add row to table"
          onRenderFooterContent={onRenderFooterContentAdd}
          isFooterAtBottom={true}
          customWidth='500px'
          type={PanelType.custom}
          >
          <ComboBox_saved_templates/>
          <ComboBox_type/>
          <TextField_ppu/>
          <TextField_name/>
          </Panel>

          <Panel
          //sort panel 
            isLightDismiss
            isOpen={isOpenSort}
            onDismiss={dismissSortPanel}
            headerText="Sort on multiple rows"
            onRenderFooterContent={onRenderFooterContentSort}
            isFooterAtBottom={true}
            customWidth='500px'
            type={PanelType.custom}
          >
          {_table}
            <DefaultButton 
            label='Save'
            text='Save'
            onClick={() => {multSearch(data)}}
            />
            <DefaultButton 
            label='Add new '
            text='Add new'
            onClick={() => {addrow(data)}}
            />
          </Panel>
        </>
      </div>
    )
    }