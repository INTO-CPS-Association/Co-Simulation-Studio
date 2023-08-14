import React from "react";
import { shallow } from "enzyme";
import CoeLaunch from "./coe-launch";

describe("CoeLaunch", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CoeLaunch />);
    expect(wrapper).toMatchSnapshot();
  });
});
