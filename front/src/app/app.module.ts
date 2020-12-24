import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CategoryTableComponent} from './category-table/category-table.component';
import {MainViewComponent} from './main-view/main-view.component';
import {HttpClientModule} from "@angular/common/http";
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
	declarations: [
		AppComponent,
		CategoryTableComponent,
		MainViewComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		ScrollingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
