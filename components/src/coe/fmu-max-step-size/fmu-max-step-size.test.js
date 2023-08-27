import React from "react";
import { shallow } from "enzyme";
import FmuMaxStepSize from "./fmu-max-step-size";

describe("FmuMaxStepSize", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<FmuMaxStepSize />);
    expect(wrapper).toMatchSnapshot();
  });
});
