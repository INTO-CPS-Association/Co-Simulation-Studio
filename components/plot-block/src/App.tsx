import React from "react";
import { VegaLite, createClassFromSpec, VisualizationSpec } from "react-vega";
import "./App.css";
import { action } from "@storybook/addon-actions";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { useBoolean } from "@fluentui/react-hooks";
import { useId } from "@fluentui/react-hooks";
import { PanelColorPicker } from "./ColorPicker";
import { DropdownBasic, SpecDropdown } from "./Dropdown";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import * as hc from "./Hardcoded";
import * as API from "./APIcalls";
import { JsonModal } from "./Modal";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { Label, Pivot, PivotItem } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PivotLargeExample } from "./Pivot";
import { isDisabled } from "@testing-library/user-event/dist/utils";

initializeIcons();

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
      data: hc.data1,
      info: "",
      spec: hc.spec1,
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

    if (spec === hc.spec1) {
      this.setState({ spec: hc.spec2 });
    } else if (spec === hc.spec2) {
      this.setState({ spec: hc.spec3 });
    } else if (spec === hc.spec3) {
      this.setState({ spec: hc.spec4 });
    } else if (spec === hc.spec4) {
      this.setState({ spec: hc.spec1 });
    } else {
      this.setState({ spec: hc.spec1 });
    }
  }

  public UpdateSpec(NewSpec: string) {

    if (NewSpec === 'bar') {
      this.setState({ spec: hc.spec1});
    } else if (NewSpec === 'point') {
      this.setState({ spec: hc.spec3 });
    } else if (NewSpec === 'line') {
      this.setState({ spec: hc.spec4 });
    } else {
      this.setState({ spec: hc.spec1 });
      console.log(this.state)
    }
    
  }

  handleUpdateData() {
    const { data } = this.state;
    action("update data")(data);
    if (data === hc.data1) {
      this.setState({ data: hc.data2 });
    } else if (data === hc.data2) {
      this.setState({ data: hc.data1 });
    }
  }

  buttonStyles = { root: { marginRight: 8 } };

  Pivoting: React.FunctionComponent = () => {
    const { spec } = this.state;
    const jsonBar = require('./assets/BarChart.json')
    const jsonLine = require('./assets/LinePlot.json')
    //const jsonPie = require('./assets/PieChart.json')
    const jsonScatter = require('./assets/ScatterPlot.json')
    var defval = ""
    if (spec === hc.spec1) {
      defval = jsonBar;
      console.log(defval)
    } else if (spec === hc.spec2) {
      defval = jsonBar;
      console.log(defval)
    } else if (spec === hc.spec3) {
      defval = jsonScatter;
      console.log(defval)
    } else if (spec === hc.spec4) {
      defval = jsonLine;
      console.log(defval)
    }
    const textFieldId = useId("anInput");
    const [InputDisabled, setInputDisabled] = useBoolean(true);
    return (
      <div>
        <Pivot aria-label="Large Link Size Pivot Example" linkSize="large">
          <PivotItem headerText="Properties">
          <Label htmlFor={textFieldId}>Chart type</Label>
          <TextField id={textFieldId} />
          <Label htmlFor={textFieldId}>Rename x-axis</Label>
          <TextField id={textFieldId} />
          <Label htmlFor={textFieldId}>Rename y-axis</Label>
          <TextField id={textFieldId} />
          <br />
          <Stack>
            <DefaultButton type="button" onClick={this.handleUpdateData}>
              Update dataset
            </DefaultButton>
            <br />
            <DefaultButton type="button" onClick={this.handleToggleSpec}>
              Toggle Orientation
            </DefaultButton>
          </Stack>
          <PanelColorPicker />
          </PivotItem>
          <PivotItem headerText="Source">
            <TextField
              label="Json specification"
              multiline rows={15}
              autoAdjustHeight
              //disabled={InputDisabled}
              
              defaultValue={defval}
              styles={{
                fieldGroup: {
                  borderRadius: 0,
                  border: "0px solid transparent",
                  background: "#252526",
                },
                field: {
                  color: "#FFFFFF",
                },
              }}
            />
            {/*
            <DefaultButton type="button" onClick={setInputDisabled}>
              Edit
            </DefaultButton>
            */}
            
          </PivotItem>
        </Pivot>
      </div>
    );
  };
  
  PanelLight: React.FunctionComponent = () => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    
    /*
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
    */
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
          /*
          onRenderFooterContent={onRenderFooterContent}
          isFooterAtBottom={true}
          */
          customWidth="500px"
          type={PanelType.custom}
        >
          <SpecDropdown demoInstance={this}/>
          <br />
          <this.Pivoting />
          <br />
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
            width="100px"
            height="20px"
          />
        </div>
        <h3>
          <code>&lt;VegaLite&gt;</code> React Component
        </h3>
        Compiled plot:
        <pre>{spec.description}</pre>
        <VegaLite data={data} spec={spec} />
        <this.PanelLight />
      </div>
    );
  }
}
