import fn from 'knex';


export const connectionInfo = {
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'b50b00284d04e4',
  password: '67d87193',
  database: 'heroku_acc8baa13741fee'
};

const knex = fn({
  client: 'mysql2',
  connection: connectionInfo,
  pool: { min: 0, max: 10 }
});


export default knex;