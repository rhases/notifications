// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyArB_C3XliF16k67zT-pBSwmFoJ9jeihNM',
    authDomain: 'notifications-homolog.firebaseapp.com',
    databaseURL: 'https://notifications-homolog.firebaseio.com',
    projectId: 'notifications-homolog',
    storageBucket: 'notifications-homolog.appspot.com',
    messagingSenderId: '684146341663'
  },
  rhasesAuthServiceHost: 'https://auth.homolog.api.rhases.com.br',
  loginUrl: 'http://parceiro.rhases.com.br/notificacoes'
};
