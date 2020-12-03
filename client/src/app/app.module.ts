import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UploadModule } from './upload/upload.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FileFolderComponent } from './file-folder/file-folder.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { MatCardModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FileFolderComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    UploadModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AppRoutingModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
