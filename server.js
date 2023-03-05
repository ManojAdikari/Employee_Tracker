const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
     // MySQL username,
    user: 'root',
     // TODO: Add MySQL password
     password: 'saz@12345',

    database: 'test'
  },
  console.log(`Connected to the`+"`"+database+"`"+`database.`)
  );
  
  // execute will internally call prepare and query
  connection.execute(
    'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
    ['test mname', 53],
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
  
      // If you execute same statement again, it will be picked from a LRU cache
      // which will save query preparation time and give better performance
    }
  );





// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  