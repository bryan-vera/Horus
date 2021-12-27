import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Lector de codigo de barras
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
//HTTP
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from "@ionic-native/http/ngx";
//Geoubicacion
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
//Storage
import { IonicStorageModule } from '@ionic/storage-angular';
// import { Storage }
import { StorageService } from './services/storage.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { EstadosPedidoPipe } from './estados-pedido.pipe';
// import { ExpandableComponent } from './components/expandable/expandable.component';
import { ComponentsModule } from './components/components.module';
@NgModule({
  declarations: [AppComponent, EstadosPedidoPipe],
  entryComponents: [],
  imports: [
    BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,HttpClientModule,
    ComponentsModule,
    IonicStorageModule.forRoot(),
  // Specify ng-circle-progress as an import
  NgCircleProgressModule.forRoot({
    // set defaults here
    radius: 100,
    outerStrokeWidth: 16,
    innerStrokeWidth: 8,
    outerStrokeColor: "#78C000",
    innerStrokeColor: "#C7E596",
    animationDuration: 300,
  })],
  providers: [
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpService,
    LocationAccuracy,
    BackgroundGeolocation,
    Geolocation,
    LocalNotifications,
    HTTP,
    StorageService,
    ForegroundService,
    BackgroundMode,
    Diagnostic,
    OpenNativeSettings,
    Uid,
    AndroidPermissions,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
