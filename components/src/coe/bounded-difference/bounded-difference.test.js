import React from "react";
import { shallow } from "enzyme";
import BoundedDifference from "./bounded-difference";

describe("BoundedDifference", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<BoundedDifference />);
    expect(wrapper).toMatchSnapshot();
  });
});