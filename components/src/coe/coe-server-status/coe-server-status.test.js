import React from "react";
import { shallow } from "enzyme";
import CoeServerStatus from "./coe-server-status";

describe("CoeServerStatus", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CoeServerStatus />);
    expect(wrapper).toMatchSnapshot();
  });
});
