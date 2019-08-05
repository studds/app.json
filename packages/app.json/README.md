# @app.json/cli

Capture what your app needs to be deployed and run.

## Status

This is early, POC-stage code. Lot's more to be still done! But please, get in
touch if this looks promising, I'd love to hear about your use-case.

## What is app.json?

`app.json` is a file for storing:

-   The environment variables your app needs
-   The components (eg. microservices) that make up your app and the environment variables they need
-   External dependencies (WIP)

## Installation

```
npm install --save-dev @app.json/cli
```

## Usage

`ajx init`: create an empty `app.json` file
`ajx dotenv`: generate a `.env` file based on an `app.json` file
`ajx generate`: generate an `app.json` file based on an CloudFormation `template.yaml` file
`ajx ts`: generate an config.ts file based on an `app.json` file

### config.ts

One aim of this project is to make sure we're only using environment variables defined
in our `app.json` file. For CloudFormation projects, we also need to make sure
these are defined appropriately in template.yaml.

`config.ts` is a file we generate that allows us to access the environment variables
we've defined, as well as accessing all the environment variables for a component,
in a type-safe way.

Hence, our proposed workflow is:

1. Add environment variables to `template.yaml`
1. Generate `app.json` from `template.yaml`
1. Generate `config.ts` from `app.json`
1. Import the environment variables for a specific component from `config.ts`

## Future direction

This is a POC which is very tightly bound up in my own immediate needs. The aim is to:

1. Add a plugin architecture to the CLI
1. Move all the CloudFormation stuff to a plugin

## Inspiration

This is inspired by Heroku's `app.json` file, but abstracted away from the Heroku
specifics. This `app.json` is intended as a general-purpose file for capturing
what an app needs to be deployed and run.
