import { Injectable } from '@angular/core';
import Settings from '../classes/settings';
import IntoCpsApp from '../classes/into-cps-app';

export { SettingKeys } from "../classes/setting-keys";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings?: Settings;

  constructor() {
    this.settings = IntoCpsApp.getInstance()?.getSettings();
  }

  get(key: string) {
    return this.settings?.getSetting(key);
  }
}
