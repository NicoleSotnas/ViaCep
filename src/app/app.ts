import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService } from './services/cep';
import { Cep } from './models/cep';
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private cepService = inject(CepService);
  cepControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]);
  endereco = signal<Cep | null>(null);
  loading = signal(false);
  erro = signal('');
  buscar() {
    if (this.cepControl.invalid) {
      this.erro.set('Digite um CEP válido com 8 números.');
      return;
    }
    this.loading.set(true);
    this.erro.set('');
    this.endereco.set(null);
    const cep = this.cepControl.value!;

    // Faz a requisição para a API de CEP
    this.cepService.buscarCep(cep).subscribe({
      //next -> a resposta da API foi recebida com sucesso
      next: (resposta) => {
        this.loading.set(false); //Parar de exibir a mensagem de aguardando resposta do servidor

        //Verifica se a API retornou um erro de usuário que digitou um cep inexistente (CEP não encontrado)
        if (resposta.erro) {
          this.erro.set('CEP não encontrado.');
          return;
        }

        // Exibe o endereço completo retornado pela API (cep existente)
        this.endereco.set(resposta);
      },
      // error -> ocorreu algum erro na requisição
      error: () => {
        this.loading.set(false);//Parar de exibir a mensagem de aguardando resposta do servidor
        
        this.erro.set('Erro ao consultar API.'); // =Exibe uma mensagem de erro para o usuário
      },
    });
  }
}
