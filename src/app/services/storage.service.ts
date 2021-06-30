import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  public _storage: Storage | null = null;

  constructor(private storage: Storage) {
    console.log('Your storage provider is working here !');
    this.init();
    console.log('Your storage provider is working here !');
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  async set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  async getID():Promise<any> { 
    return this._storage?.get('codigoUsuario');
  }
}