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

To install bigman you need to have NPM so if you installed Node.js you probably have NPM also installed with it.

`npm install bigman`

then set the environment variable **_POSTMANKEY_** that hold that value for **_Postman API key_** in **_.env_** file.

## Using Bigman

You can use bigman as Node.js module in your node project, like the example below:

```Javascript
const bigman = require('bigman');
const options = {
collectionName:"Project API",
wfGroups: ["Web Application","Mobile Application"],
workflows: ["Login","profile"],
environment: "production",
variables: {},
};
bigman.runTest(options)
```

In this example the bigman will run collection **Project API** but only API requests in workflows **Login** & **profile** on selected workflow groups **Web Application** & **Mobile Application**, here below the collection structure:

```text
- Collection name: Project API
  - First level folder name: Web Application (workflow group)
    - Second level folder name: Login (workflow)
    - Second level folder name: Dashbaord
    - Second level folder name: profile
  - First level folder name: Mobile Application (workflow group)
    - Second level folder name: Login (workflow)
    - Second level folder name: profile
    - Second level folder name: Home page
```

**Note:**

- folders' names are case sensitive so "login" and "Login" are different in Bigman.
- First level folders' names should be unique, otherwise, some functions will not work as expected.

## Bigman API Reference

1. **runTest** function accept an object of these properties:

   - collectionName : The postman collection name which is mandatory/required.
   - wfGroups: The first level folder name or an array of first level folders names, it is optional and default value is [] that means bigman will run over all first level folders.
   - workflows: The second level folder name or an array of second-level folders names, it is optional and the default value is [] that means Bigman will run over all second-level folders for a selected wfGroup/wfGroups based on the wfGroups passed parameter,
   - environment: The name of environment to run Bigman over, it is optional and default value _dev_ if this environment name doesn't exists Bigman will throw an error with the message _"The environment name is not valid/exists"_
   - variables: It is an object of different variables that you can pass to set in environment variables to run your test. if it contained already exists variables that will overwrite the existing ones or it will add new variables if not exists, you can pass the variable as simple property key: value or complex variable as object property like key: Object, by the end of test these variables will be persisted in the selected environment. It is optoinal & the default value is {}.

2. **listCollections** function returns an array of objects each object represents a collection data which are _id, name, owner,uid_ for that collection.
3. **listEnvironments** function returns an array of objects each object represents an environment data which are _id, name, owner,uid_ for that collection.
4. **getEnvironmentUID** function returns an UID for the passed envirnment name if it is exists or it will throw an error with the message _"The environment name is not valid/exists"_
5. **setEnvironmentVars** function it takes two parameters the first is the environment name the second is the Object of variables. You can use this function adding/overwrite variables values in the selected environment that passed as the first parameter.The return from this function is environment data that has been passed to it. Here below an example how to call this function:

   ```javascript
   const { setEnvironmentVars } = require("bigman");
   const newVariables = {
     simpleVar: "simpleValue",
     complexVar: { key1: "value1", key2: "value2" },
   };

   setEnvironmentVars("dev", newVariables);
   ```

6. **listWFGroups** function it takes the collection name as parameter and return an array of first level folders names (workflow Groups) for that collection.
7. **listWorkflows** function it takes the workflow group name as a parameter and iterates overall collections and for the first collection that has this workflow group name(first level folder name), it goes through it and returns an object of two properties collectionID with value of the UID for the found collction and array of second-level folders names (workflows) for that collection.
