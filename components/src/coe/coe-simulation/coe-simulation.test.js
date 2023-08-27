import React from "react";
import { shallow } from "enzyme";
import CoeSimulation from "./coe-simulation";

describe("CoeSimulation", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CoeSimulation />);
    expect(wrapper).toMatchSnapshot();
  });
});
