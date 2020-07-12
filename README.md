# What is Bigman

Bigman is a command-line collection runner for Postman. It is built on Newman with extra features to run collection folders dynamically.

## With Some assumptions

each collection will consist of two levels of folders:

```text
- Collection
  - First level folder (workflow group)
    - Second level folder (workflow)
    - Second level folder (workflow)
    - Second level folder (workflow)
    - Second level folder (workflow)
  - First level folder (workflow group)
    - Second level folder (workflow)
    - Second level folder (workflow)
    - Second level folder (workflow)
    - Second level folder (workflow)
```

## Installation

To run bigman, make sure that you have installed Node.js >= v12.

To install bigman you need to have NPM so if you installed Node.js you probably have NPM also installed with it.<br/>
`npm install bigman`

then set the environment variable **_POSTMANKEY_** that hold that value for **_Postman API key_** in **_.env_** file.

## Using Bigman

You can use bigman as Node.js module in your node project, like the example below:

```Javascript
const bigman = require('bigman');
const options = {
collectionName:"Project API",
workflowGroups: ["Web Application","Mobile Application"],
workflows: ["Login","profile"],
environment: "production",
variables: {},
};
bigman.runTest(options)
```

In this example the bigman will run collection **Project API** but only API requests in workflows **Login** & **profile** on selected workflow groups **Web Application** & **Mobile Application**
