import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { messageHandler } from '@estruyf/vscode/dist/client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  
constructor(private router: Router) {

}

  ngAfterViewInit(): void {
  }

  coe() {
    this.router.navigateByUrl("/coe");
  }

  dse() {
    this.router.navigateByUrl("/dse");
  }

  mm() {
    this.router.navigateByUrl("/mm");
  }

}
