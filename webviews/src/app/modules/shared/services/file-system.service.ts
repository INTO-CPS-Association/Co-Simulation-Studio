import { Injectable, NgZone } from '@angular/core';
import { CoSimulationStudioApi } from 'src/app/api';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(private zone: NgZone) {
  }

  copyFile(source: string, target: string): Promise<void> {
    return CoSimulationStudioApi.copyFile(source, target);
  }

  mkdir(path: string): Promise<void> {
    return CoSimulationStudioApi.mkdir(path);
  }

  readFile(path: string): Promise<string> {
    return CoSimulationStudioApi.readFile(path);
  }

  writeFile(path: string, content: string): Promise<void> {
    return CoSimulationStudioApi.writeFile(path, content);
  }

}
