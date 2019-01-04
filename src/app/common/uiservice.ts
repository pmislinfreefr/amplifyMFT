import { Injectable, Component, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs';

@Injectable()
export class UiService {
  constructor(private snackBar: MatSnackBar) {}
  /*
   * Method: showMsg
   * Parameters:
   *    message: message to display
   *    action: label to put in the button which will close the SnackBar
   *    cssClass: will apply the css class 'snack-'+ cssClass. The css classes for error and info are describe in _uicomponents.scss
   *    config: allow to specify your own snackBar config
   *  Description:
   *    Will display a snackBar (messages which will appear for a preset duration, 7s by default)
   */
  showMsg(
    message: string,
    action = 'Close',
    cssClass = 'info',
    config?: MatSnackBarConfig
  ) {
    this.snackBar.open(
      message,
      action,
      config || {
        duration: 70000,
        panelClass: 'snack-' + cssClass,
      }
    );
  }
}
