import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatToolbarModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatIconModule],
  exports: [CommonModule, MatButtonModule, MatToolbarModule, MatIconModule],
})
export class MaterialModule {}
