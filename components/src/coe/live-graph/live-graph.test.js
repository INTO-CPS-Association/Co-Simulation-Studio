import React from "react";
import { shallow } from "enzyme";
import LiveGraph from "./live-graph";

describe("LiveGraph", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<LiveGraph />);
    expect(wrapper).toMatchSnapshot();
  });
});
