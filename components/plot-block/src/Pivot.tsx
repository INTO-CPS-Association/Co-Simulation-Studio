import * as React from "react";
import { Label, Pivot, PivotItem } from "@fluentui/react";
import { TextField } from "@fluentui/react/lib/TextField";
import Demo from "./App"

export const PivotLargeExample = () => (
  <div>
    <Pivot aria-label="Large Link Size Pivot Example" linkSize="large">
      <PivotItem headerText="Properties">
        <Label>Pivot #1</Label>
      </PivotItem>
      <PivotItem headerText="Source">
        <TextField
          label="Json specification"
          multiline
          autoAdjustHeight
          disabled

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
      </PivotItem>
    </Pivot>
  </div>
);
