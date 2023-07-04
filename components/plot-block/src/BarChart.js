import React, { PropTypes } from 'react';
import {createClassFromSpec} from 'react-vega';

export default createClassFromSpec('BarChart', {
  "description": "A simple bar chart with embedded data.",
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
});