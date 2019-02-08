import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuItemsService } from './services/menu-items.service';
import { SidnavbarComponent } from './layout/sidnavbar/sidnavbar.component';
import { ApplicationService } from './services/application.service';
import { UiService } from './common/uiservice';
import { ApplicationComponent } from './application/application/application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlowService } from './services/flow/flow.service';
import { FlowlistComponent } from './flow/flowlist/flowlist.component';
import { FlowcreateComponent } from './flow/flowcreate/flowcreate.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SidnavbarComponent,
    ApplicationComponent,
    FlowlistComponent,
    FlowcreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MenuItemsService, ApplicationService, UiService, FlowService],
  bootstrap: [AppComponent],
})
export class AppModule {}
