# percorra-maps-ionic-firebase
Projeto com objetivo de usar google api para formar rotas entre varias localidades, com autentificação com firebase

### Projeto pode ser acessado pelo link: [https://percorra.richardmartins.com/](https://percorra.richardmartins.com/)

### Como rodar

Dependencias:
* node (minha versão 8.9.1)
* npm (minha versão 6.4.1)
* ionic (minha versão 4.6.0)

Adaptações:
* Para o banco de dados firebase funcionar, você deve criar um projeto firebase
* Pegar o json de autentificação e colar na linha 25 do arquivo src/app/app.module.ts

exemplo: 
> export const firebaseConfig = {
    apiKey: "AAAAAAAAAAAAAAAAAA",
    authDomain: "AAAAAAAA.firebaseapp.com",
    databaseURL: "https://AAAAAAAA.firebaseio.com",
    projectId: "AAAAAAAAAA-1111111",
    storageBucket: "AAAAAAAAA-111111.appspot.com",
    messagingSenderId: "111111111111111"
}

* git clone
* npm i
* ionic serve
* seja feliz
