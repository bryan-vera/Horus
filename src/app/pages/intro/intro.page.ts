import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

export const INTRO_KEY = 'intro-vista';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides)slides: IonSlides;

  constructor(private router: Router,
    private storage: Storage) { }

  ngOnInit() {
    this.storage.create();
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    await this.storage.set(INTRO_KEY, 'true');
    this.router.navigateByUrl('/login');
  }

}
