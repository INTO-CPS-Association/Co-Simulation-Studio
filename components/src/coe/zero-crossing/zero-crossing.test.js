import React from "react";
import { shallow } from "enzyme";
import ZeroCrossing from "./zero-crossing";


describe("ZeroCrossing", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ZeroCrossing />);
    expect(wrapper).toMatchSnapshot();
  });
});
