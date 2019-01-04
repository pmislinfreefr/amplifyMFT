import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemsService } from '../../services/menu-items.service';

@Component({
  selector: 'app-sidnavbar',
  templateUrl: './sidnavbar.component.html',
  styleUrls: ['./sidnavbar.component.scss'],
})
export class SidnavbarComponent implements OnInit {
  constructor(public menuItems: MenuItemsService) {}

  ngOnInit() {}
}
