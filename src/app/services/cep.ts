import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';

import { Cep } from '../models/cep';
@Injectable({
  providedIn: 'root',
})

export class CepService {
  private http = inject(HttpClient);
  buscarCep(cep: string) {
    return this.http.get<Cep>(`https://viacep.com.br/ws/${cep}/json/`).pipe(retry(2));
  }
}
