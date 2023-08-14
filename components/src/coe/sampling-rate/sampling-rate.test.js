import React from "react";
import { shallow } from "enzyme";
import SamplingRate from "./sampling-rate";

describe("SamplingRate", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<SamplingRate />);
    expect(wrapper).toMatchSnapshot();
  });
});
