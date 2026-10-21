import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private apiUrl = environment.apiUrl;
  private encryptor: JSEncrypt | null = null;
  private publicKeyLoaded = false;

  constructor(private http: HttpClient) {}

  private async loadPublicKey(): Promise<void> {
    if (this.publicKeyLoaded) {
      return;
    }

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/api/key/public`)
      );

      const base64Key = res.publicKey;
      const pemKey =
        '-----BEGIN PUBLIC KEY-----\n' +
        (base64Key.match(/.{1,64}/g) || []).join('\n') +
        '\n-----END PUBLIC KEY-----';

      this.encryptor = new JSEncrypt();
      this.encryptor.setPublicKey(pemKey);
      this.publicKeyLoaded = true;

      console.log('RSA public key loaded successfully');
    } catch (err) {
      console.error('Failed to load public key:', err);
      throw new Error('Cannot fetch RSA public key from backend');
    }
  }

  async encrypt(plainText: string): Promise<string> {
    await this.loadPublicKey();

    if (!this.encryptor) {
      throw new Error('Encryptor not initialized');
    }

    const encrypted = this.encryptor.encrypt(plainText);

    if (!encrypted) {
      throw new Error('Encryption failed - check public key');
    }

    return encrypted;
  }
}