import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
/*
	{
		path: "coe",
		loadChildren: () => import('./modules/coe/coe.module').then(m => m.CoeModule)
	},
	{
		path: "dse",
		loadChildren: () => import('./modules/dse/dse.module').then(m => m.DseModule)
	},
	{
		path: "mm",
		loadChildren: () => import('./modules/mm/mm.module').then(m => m.MmModule)
	},
	{
		path: "shared",
		loadChildren: () => import('./modules/shared/shared.module').then(m => m.SharedModule)
	},
	{
		path: "sigver",
		loadChildren: () => import('./modules/sigver/sigver.module').then(m => m.SigverModule)
	}
	*/
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
