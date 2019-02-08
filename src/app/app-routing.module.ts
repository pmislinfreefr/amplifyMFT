import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ApplicationComponent } from './application/application/application.component';
import { FlowcreateComponent } from './flow/flowcreate/flowcreate.component';
import {FlowlistComponent} from './flow/flowlist/flowlist.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'applicationList', component: ApplicationComponent },
  { path: 'flowCreate', component: FlowcreateComponent },
  { path: 'flowList', component: FlowlistComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
