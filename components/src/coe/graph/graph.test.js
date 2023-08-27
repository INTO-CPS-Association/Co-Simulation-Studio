import React from "react";
import { shallow } from "enzyme";
import Graph from "./graph";

describe("Graph", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Graph />);
    expect(wrapper).toMatchSnapshot();
  });
});
