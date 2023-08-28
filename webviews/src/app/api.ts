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

  static async join(...paths: string[]): Promise<string> {
    return await messageHandler.request<any>("join", { paths });
  }

  static async sep(): Promise<string> {
    return await messageHandler.request<any>("sep");
  }

  static async runDse(): Promise<void> {
    return await messageHandler.request<any>("runDse");
  }

  

  static async getFmusPath(): Promise<string> {
    return await messageHandler.request<any>("getFmusPath");
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

  static async mkdir(path: string, options?: any): Promise<void> {
    return await messageHandler.request<any>("mkdir", { path, options });
  }

  static async showMessageBox(options: any): Promise<void> {    
    return await messageHandler.request<any>("showMessageBox", { options });
  }

  static async env(): Promise<any> {    
    return await messageHandler.request<any>("env");
  }

  static async isAbsolute(path: string): Promise<boolean> {
    return await messageHandler.request<any>("isAbsolute", { path });
  }

  static async isFile(path: string): Promise<boolean> {
    return await messageHandler.request<any>("isFile", { path });
  }

  static async sync(path: string): Promise<void> {
    return await messageHandler.request<any>("sync", { path });
  }

  
  static async getCoeProcess(): Promise<string> {
    return await messageHandler.request<any>("getCoeProcess");
  }

  

  static async spawn(command: string, args: string[], options?: any): Promise<any> {
    return await messageHandler.request<any>("spawn", { command, args, options });
  }

  static async openPath(path: string): Promise<void> {
    return await messageHandler.request<any>("openPath", { path });
  }  

  static async unref(pid: any): Promise<any> {
    return await messageHandler.request<any>("unref", { pid });
  }

  static async getRootFilePath(): Promise<string> {
    return await messageHandler.request<any>("getRootFilePath");
  }

  static async isRunning(pid: any): Promise<boolean> {
    return await messageHandler.request<any>("isRunning", { pid });
  }

  static async unwatchFile(path: string): Promise<void> {
    return await messageHandler.request<any>("unwatchFile", { path });
  }

  static async fileSize(path: string): Promise<number> {
    return await messageHandler.request<any>("fileSize", { path });
  }

  static async resolve(...paths: string[]): Promise<string> {
    return await messageHandler.request<any>("resolve", { paths });
  }
  
  static async move(oldPath: string, newPath: string): Promise<void> {
    return await messageHandler.request<any>("move", { oldPath, newPath });
  }

  static async readJson(path: string, options?: any): Promise<any> {
    return await messageHandler.request<any>("readJson", { path, options });
  }

  static async unlink(path: string): Promise<void> {
    return await messageHandler.request<any>("unlink", { path });
  }

  static async relative(from: string, to: string): Promise<string> {
    return await messageHandler.request<any>("relative", { from, to });
  }

  static async basename(path: string, suffix?: string): Promise<string> {
    return await messageHandler.request<any>("basename", { path, suffix });
  }

  static async isDirectory(path: string): Promise<boolean> {
    return await messageHandler.request<any>("isDirectory", { path });
  }

  static async dirname(path: string): Promise<string> {
    return await messageHandler.request<any>("dirname", { path });
  }



}
