import { Injectable } from '@angular/core';
import { messageHandler } from '@estruyf/vscode/dist/client';
import { from, Observable, of } from 'rxjs';


export class CoSimulationStudioApi {

  constructor() { }

  static httpGet<T>(url: string): Observable<T> {
    return from(messageHandler.request<T>("httpGet", { url }));
  }

  static async exists(path: string): Promise<boolean> {
    return await messageHandler.request<any>("exists", { path });
  }

  static async readdir(path: string): Promise<string[]> {
    return await messageHandler.request<any>("readdir", { path });
  }



  static async getSystemArchitecture(): Promise<string> {
    return await messageHandler.request<any>("getSystemArchitecture");
  }

  static async getSystemPlatform(): Promise<string> {
    return await messageHandler.request<any>("getSystemPlatform");
  }

  static async getConfiguration(section: string): Promise<any> {
    return await messageHandler.request<any>("getConfiguration", { section });
  }

  static async normalize(path: string): Promise<string> {
    return await messageHandler.request<any>("normalize", { path });
  }

  static async readFile(path: string): Promise<string> {
    return await messageHandler.request<any>("readFile", { path });
  }

  static async writeFile(path: string, content: string): Promise<void> {
    return await messageHandler.request<any>("writeFile", { path, content });
  }

  static async copyFile(source: string, target: string): Promise<void> {
    return await messageHandler.request<any>("copyFile", { source, target });
  }

  static async mkdir(path: string): Promise<void> {
    return await messageHandler.request<any>("mkdir", { path });
  }

}
