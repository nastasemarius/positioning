import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'reports', loadChildren: () => import(`./reports/reports.module`).then(m => m.ReportsModule) },
  { path: 'map', loadChildren: () => import(`./map/map.module`).then(m => m.MapModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
