'use strict';

var series = require('../src/series');

module.exports = function(program, next) {
  program
    .command('backup <source>')
    .description('Backup a server. Source may be the project name on form.io or the full url to any project on a server such as https://test.form.io or https://form.io/project/{projectId}')
    .option('--src-key [key]', 'The API Key to provide to the source form')
    .option('--src-username [username]', 'The source username to authenticate with')
    .option('--src-password [password]', 'The source password')
    .action(series([
      require('../src/authenticate')({
        src: 0,
        dst: -1
      }),
      require('../src/backup')
    ], next));
};
