import { Injectable } from '@angular/core';
import { CoSimulationStudioApi } from 'src/app/api';

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
