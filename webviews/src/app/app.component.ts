import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { messageHandler } from '@estruyf/vscode/dist/client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  view?: string;

  constructor(private router: Router) {
    this.view = window.document.body.getAttribute("data-view") ?? undefined;

    /*
    messageHandler.request<any>("GET_DATA").then((data: any) => {
      console.log(data);
    });
    */
  }

  ngAfterViewInit(): void {

  }

  get path(): string {
    return window.document.body.getAttribute("data-path") ?? ""; 
  }

}
