import React from "react";
import { shallow } from "enzyme";
import CoePage from "./coe-page";

describe("CoePage", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CoePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
