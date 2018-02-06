import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';

import { AngularFireModule } from 'angularfire2';
//import { AngularFirestoreModule } from 'angularfire2/firestore';
//import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { DevicesComponent } from './devices';
import { MyMaterialModule } from './my-material.module';
import { PushNotificationModule } from '../components/push-notification';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DevicesComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MyMaterialModule,
    PushNotificationModule,
    routing,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
