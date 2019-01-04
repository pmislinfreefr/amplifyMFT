import { Injectable } from '@angular/core';

export interface MenuItem {
  name: string; // String that will be displayed in the menu
  separator?: boolean; // Add a separator after this menu item
  icon?: string; // icon to be displayed
  link?: string; // relative link (for routerLink)
  url?: string; // absolute link
}

const MENUITEMS = [
  { name: 'Home', icon: 'home', link: 'home', separator: true },
  { name: 'Create a new flow', icon: 'create', link: 'flowCreate' },
  { name: 'List the flows', icon: 'view_list', link: 'flowList' },
  { name: 'Manage applications', icon: 'perm_data_setting', link: 'applicationList' },
  { name: 'Manage partners', icon: 'view_headline', link: 'partnerList' },
  { name: 'No icon', link: 'partnerList' },
];

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  constructor() {}
  getMenuitem(): MenuItem[] {
    return MENUITEMS;
  }
}
