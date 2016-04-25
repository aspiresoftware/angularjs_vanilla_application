This is vanilla nagular project structure. It is common structure which you can use to any project for kick starting.

It has model based approached, all the models are placed inside 'model' folder of app.

Common templtaed are created using directives, so that you can use the same directive without modifying core functionality. All the common directives with templated are placed inside component folder of src.

For starting project, go to project directory and perform below steps :

* Change module name in build.js file at line no:27, it should be same as the module name used in the application.
* Then perform below commands.
    * npm install
    * bower install
    * gulp build
    * gulp inject
    * gulp serve

For setting up git hook

* ln -s ../../hooks/git/pre-commit .git/hooks/pre-commit

For production use 'gulp serve --production' in place of gulp serve.

Use 'gulp clean' for cleaning .temp and dist folder.

For creating war use 'gulp war' command.

For deploying war to server :
change server path in config.js file of gulp folder, and then perform 'gulp deploy', this will deploy the war file to the server.

For pagespeed, use 'gulp mobile' and 'gulp desktop' for checking site's speed score.
