# Notifications

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).


## Setup 
Run `firebase use --add`
choose notifications-homolog
when prompted, choose to use `homolog` as alias


Run `firebase use --add`
choose notifications-prod
when prompted, choose to use `prod` as alias


## Deploy
Run `firebase login` in the first deploy.


## Deploy Homolog
RUn `firebase use homolog`
Run `ng build --dev`
Run `firebase deploy --only hosting` for deploy frontend project.

Run `firebase deploy --only functions` for deploy backend project.

## Deploy Prod
Run `firebase use prod`
Run `ng build --prod`
Run `firebase deploy --only hosting` for deploy frontend project.
Run `firebase deploy --only functions` for deploy backend project.

## logs
Run `firebase functions:logs` 


