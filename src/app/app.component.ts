import { Component, Injectable } from '@angular/core';

import { defineCustomElements, addTheme } from 'corporate-ui-dev';
import { theme as scania } from 'scania-theme';

defineCustomElements(['c-navigation', 'c-header', 'c-theme', 'c-footer', 'c-content']);
addTheme(scania);


@Injectable({
  providedIn: 'root',
})
@Component({
  selector: '#app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
