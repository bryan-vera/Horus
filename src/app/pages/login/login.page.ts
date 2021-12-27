import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { AlertController, LoadingController } from '@ionic/angular'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      Username: ['', [Validators.required, Validators.minLength(3)]],
      Password: ['000', [Validators.required, Validators.minLength(3)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (user) => {
          let role = user['rol'];
          if (role == "VISITADOR") {
            await loading.dismiss();
            this.router.navigateByUrl('/tablinks', { replaceUrl: true });
          } else if (role == "PICKING") {
            await loading.dismiss();
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          } else {
            await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Login incorrecto',
              message: user.error.error,
              buttons: ['OK'],
            });
            await alert.present();
          }
        },
        async err=>{
          await loading.dismiss();
            const alert = await this.alertController.create({
              header: 'Login incorrecto',
              message: err.error.error,
              buttons: ['OK'],
            });
            await alert.present();
        }
        
        
        );
  }

  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

}
