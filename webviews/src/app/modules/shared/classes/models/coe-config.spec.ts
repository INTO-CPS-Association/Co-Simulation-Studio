import { CoSimulationConfig } from '../configuration/co-simulation-config';
import { CoeConfig } from './coe-config';

describe('CoeConfig', () => {
  it('should create an instance', () => {
    expect(new CoeConfig(new CoSimulationConfig())).toBeTruthy();
  });
});
