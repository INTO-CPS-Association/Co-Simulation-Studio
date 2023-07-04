import { Stack, Text, Link, FontWeights, IStackTokens, IStackStyles, ITextStyles, TextField, Separator, SpinButton, ISpinButtonStyles } from '@fluentui/react';
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

let data = require("./example.json");

export const App: React.FunctionComponent = () => {
  return (
    <div>
      <Separator></Separator>
      <Stack enableScopedSelectors tokens={stackTokens} styles={stackStyles}>
        <Stack.Item>
          <TextField label="ID" defaultValue={data[0].id} styles={boldStyle}/>
        </Stack.Item>
        <Stack.Item>
          <TextField label="Type" defaultValue={data[0].type} styles={boldStyle}/>
        </Stack.Item>
        <Stack.Item>
          <TextField label="Name" defaultValue={data[0].name} styles={boldStyle}/>
        </Stack.Item>
        <Stack.Item>
          <SpinButton label="PPU" defaultValue={data[0].ppu} styles={styles}/>
        </Stack.Item>
      </Stack>
      <Separator></Separator>
    </div>
  );
}