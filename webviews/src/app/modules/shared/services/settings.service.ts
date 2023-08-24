import { Injectable } from '@angular/core';
import Settings from '../classes/settings';
import IntoCpsApp from '../classes/into-cps-app';
import { CoSimulationStudioApi } from 'src/app/api';

export { SettingKeys } from "../classes/setting-keys";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
 
  constructor() {
  }

  async get(key: string) {
    return await CoSimulationStudioApi.getConfiguration(key);
  }
}
