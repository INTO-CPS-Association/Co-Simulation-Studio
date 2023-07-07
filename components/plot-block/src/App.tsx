import React from "react";
import { VegaLite, createClassFromSpec, VisualizationSpec } from "react-vega";
import "./App.css";
//import { IndividualCommandBarButtonWrapper } from './CoachmarkCommandBar';
import { action } from "@storybook/addon-actions";

import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { useBoolean } from "@fluentui/react-hooks";
import { Label } from "@fluentui/react/lib/Label";
import { TextField } from "@fluentui/react/lib/TextField";
import { useId } from "@fluentui/react-hooks";
import { PanelColorPicker } from "./ColorPicker";
import { DropdownBasicExample } from "./Dropdown";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";

const data1 = {
  myData: [
    { a: "A", b: 20 },
    { a: "B", b: 34 },
    { a: "C", b: 55 },
    { a: "D", b: 19 },
    { a: "E", b: 40 },
    { a: "F", b: 34 },
    { a: "G", b: 91 },
    { a: "H", b: 78 },
    { a: "I", b: 25 },
  ],
  fields: [{ 1: "a", 2: "b" }],
};

// Second data set to illustrate how data can be updated using buttons
const data2 = {
  myData: [
    { a: "A", b: 28 },
    { a: "B", b: 55 },
    { a: "C", b: 43 },
    { a: "D", b: 91 },
    { a: "E", b: 81 },
    { a: "F", b: 53 },
    { a: "G", b: 19 },
    { a: "H", b: 87 },
    { a: "I", b: 52 },
  ],
};

//Vertical bar plot
const spec1: VisualizationSpec = {
  data: { name: "myData" },
  description: "A simple bar chart with embedded data.",
  encoding: {
    x: { field: "a", type: "ordinal" },
    y: { field: "b", type: "quantitative" },
    color: { value: "#f5d0d0" },
  },
  mark: "bar",
};

/*Horizontal bar plot*/
const spec2: VisualizationSpec = {
  data: { name: "myData" },
  description: "A simple bar chart with embedded data.",
  encoding: {
    x: { field: "b", type: "quantitative" },
    y: { field: "a", type: "ordinal" },
  },
  mark: "bar",
};

//funtion that takes string json path and value
//update spec from path based on user chosen value

//ts plot component that handles general customizations which is then passed

//setmark function
//pass string through spec to mark

//update encoding

const BarChart = createClassFromSpec({ mode: "vega-lite", spec: spec1 });

const code1 = `<VegaLite data={this.state.data} spec={this.state.spec} />`;

const code2 = `const BarChart = ReactVegaLite.createClassFromLiteSpec(spec1);
<BarChart data={this.state.data} />`;

type State = {
  data: Record<string, unknown>;
  info: string;
  spec: VisualizationSpec;
};

export default class Demo extends React.PureComponent<{}, State> {
  handlers: {
    hover: (...args: unknown[]) => void;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      data: data1,
      info: "",
      spec: spec1,
    };

    this.handleHover = this.handleHover.bind(this);
    this.handleToggleSpec = this.handleToggleSpec.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handlers = { hover: this.handleHover };
  }

  handleHover(...args: any[]) {
    action("hover", {
      limit: 5,
    })(args);
    this.setState({
      info: JSON.stringify(args),
    });
  }

  handleToggleSpec() {
    const { spec } = this.state;
    action("toggle spec")(spec);
    if (spec === spec1) {
      this.setState({ spec: spec2 });
    } else {
      this.setState({ spec: spec1 });
    }
  }

  handleUpdateData() {
    const { data } = this.state;
    action("update data")(data);
    if (data === data1) {
      this.setState({ data: data2 });
    } else if (data === data2) {
      this.setState({ data: data1 });
    }
  }

  handleUpdateAxis() {
    //Write function that obtains the data from the input fields and edits the spec to correlate.
  }

  buttonStyles = { root: { marginRight: 8 } };

  PanelLight: React.FunctionComponent = () => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
      useBoolean(false);
    const textFieldId = useId("anInput");
    const onRenderFooterContent = React.useCallback(
      () => (
        <div>
          <PrimaryButton onClick={dismissPanel} styles={this.buttonStyles}>
            Save
          </PrimaryButton>
          <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
        </div>
      ),
      [dismissPanel]
    );

    return (
      <div>
        <br />
        <br />
        <DefaultButton text="Options" onClick={openPanel} />
        <Panel
          isLightDismiss
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          headerText="Options"
          onRenderFooterContent={onRenderFooterContent}
          isFooterAtBottom={true}
          customWidth="500px"
          type={PanelType.custom}
        >
          <Label htmlFor={textFieldId}>Data source</Label>
          <TextField id={textFieldId} />
          <Label htmlFor={textFieldId}>Chart type</Label>
          <TextField id={textFieldId} />
          <Label htmlFor={textFieldId}>Rename x-axis</Label>
          <TextField id={textFieldId} />
          <Label htmlFor={textFieldId}>Rename y-axis</Label>
          <TextField id={textFieldId} />
          <br />
          <Stack>
            <DefaultButton type="button" onClick={this.handleUpdateData}>
              Rename axises
            </DefaultButton>
            <br />
            <DefaultButton type="button" onClick={this.handleUpdateData}>
              Update dataset
            </DefaultButton>
            <br />
            <DefaultButton type="button" onClick={this.handleToggleSpec}>
              Toggle Orientation
            </DefaultButton>
          </Stack>

          <br />
          <br />
          <br />
          <br />
          <DropdownBasicExample />
          <PanelColorPicker />
        </Panel>
      </div>
    );
  };

  render() {
    const { data, spec, info } = this.state;

    return (
      <div>
        <div style={{ float: "right" }}>
          <iframe
            title="star"
            src="https://ghbtns.com/github-btn.html?user=vega&repo=react-vega&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="100px"
            height="20px"
          />
        </div>
        {/*
        <button type="button" onClick={this.handleToggleSpec}>
          Toggle Spec
        </button>
        */
        /*
        <button type="button" onClick={this.handleUpdateData}>
          Update data
        </button>
        */}
        <h3>
          <code>&lt;VegaLite&gt;</code> React Component
        </h3>
        Compiled bar plot:
        <pre>{code1}</pre>
        <VegaLite data={data} spec={spec} />
        <this.PanelLight />
        <h3>
          <code>ReactVegaLite.createClassFromLiteSpec()</code>
        </h3>
        A reusable component created using:
        <pre>{code2}</pre>
        <BarChart data={data} />
        {info}
      </div>
    );
  }
} /*signalListeners={this.handlers} This is inserted after the creation of the plots in line 147 & 153 to enable the buttons*/
