import { Component } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'amplifyMFT';
  constructor(public media: ObservableMedia) {}
}
