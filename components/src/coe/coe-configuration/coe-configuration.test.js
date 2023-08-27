import React from "react";
import { shallow } from "enzyme";
import CoeConfiguration from "./coe-configuration";

describe("CoeConfiguration", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CoeConfiguration />);
    expect(wrapper).toMatchSnapshot();
  });
});
