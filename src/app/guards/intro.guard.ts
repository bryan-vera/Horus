import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

export const INTRO_KEY = 'intro-vista';
@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router: Router,
    private storage: Storage) { 
      this.storage.create();
    }

  
  async ngOnInit() {
  }

  async canLoad(): Promise<boolean>{ 
    const introVisto = await this.storage.get(INTRO_KEY); 
    if (introVisto ) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl:true });
      return false;
    }
  }
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
}
