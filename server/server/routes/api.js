const express = require("express");
const mysql = require("mysql");
const dayjs = require("dayjs");

addToProductTransaction =
  require("../../helper/apiHelper").addToProductTransaction;

const router = express.Router();

const con = mysql.createConnection({
  host: "database-1-instance-1.cmbt88lb332q.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "piece0632541",
});

//======================connection to amazon database and creating table if not exist==================
con.connect(function (err) {
  if (err) throw err;

  console.log(" connected to AWS !");

  con.query("CREATE DATABASE IF NOT EXISTS shoopingdb;");
  con.query("USE shoopingdb;");

  //=============create product table============================
  con.query(
    `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(80),
    price INT,
    description TEXT,
    image TEXT

);`,
    function (error, results, fields) {}
  );
  //=============create transaction table============================

  con.query(
    `CREATE TABLE IF NOT EXISTS transaction(
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount INT,
    date DATETIME
);
`,
    function (error, results, fields) {
      // console.log(" transaction", results);
    }
  );
  //=============create product_transaction table============================

  con.query(
    ` CREATE TABLE IF NOT EXISTS product_transaction(
  product_id INT,
 transaction_id INT,
 FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE ,
 FOREIGN KEY(transaction_id) REFERENCES transaction(id) 
);
`,
    function (error, results, fields) {
      // console.log(" product_transaction", results);
    }
  );

  // con.end();
});

//============================product crud operation===================================
router.get("/products", function (req, res) {
  const top = req.query.top;
  const distinct = req.query.distinct;

  con.query(`SELECT * FROM products;`, function (error, results, fields) {
    res.send(results);
    if (error) {
      console.log(error);
    }
  });
});
router.post("/products", function (req, res) {
  const { product } = req.body;

  try {
    con.query(
      `
        INSERT INTO products
         VALUES(
             ${null},
            '${product.title}',
            ${product.price},
             '${product.description}',
            '${product.image}'
            )
        `,

      function (error, results, fields) {
        res.status(201);
        res.send("added ok ");
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.put("/products/:id", function (req, res) {
  const { product } = req.body;
  con.query(
    `
  UPDATE products
  SET
  title='${product.title}',
  description='${product.description}',
  price=${product.price},
  image='${product.image}'
  WHERE id = ${req.params.id};

  `,
    function (error, results, fields) {
      if (error) {
        res.status(404);
      } else {
        res.send("updated");
      }
    }
  );
});

router.delete("/products/:id", function (req, res) {
  con.query(
    `
  delete 
  from products
  where id=${req.params.id} 

  `,
    function (error, results, fields) {
      if (error) {
        res.status(404);
      } else {
        res.status(204);
        res.send(" deleted");
      }
    }
  );
});

router.get("/soldProducts", function (req, res) {
  const top = req.query.top;
  const distinct = req.query.distinct;
  console.log(" dist", distinct);
  if (distinct == "true") {
    console.log(" distinct");
    con.query(
      `
      
        select  product_id, count(product_id) as count , p.title as product_name
  
        from (select  distinct pt.product_id,pt.transaction_id
          from product_transaction as pt 
          group by pt.transaction_id
          
          ) as pt , products as p
           where pt.product_id=p.id
           group by  product_id
           order by count desc
            limit ${top}
    `,
      function (error, results, fields) {
        res.send(results);
      }
    );
  } else if (distinct == "false") {
    console.log(" not  distinct");

    con.query(
      `
        
        select  product_id, count(product_id) as count ,p.title as product_name
           from product_transaction as pt , products as p
           where pt.product_id=p.id
           group by product_id
           order by count desc
            limit ${top}
  
    `,
      function (error, products, fields) {
        res.send(products);
      }
    );
  }
});

//=========================  Transaction ========================================================
router.post("/transactions", function (req, res) {
  const productArray = req.body.data.productArray;
  const amount = req.body.data.total;
  const currentDate = dayjs(new Date()).format("YYYY-MM-DDThh:mm");

  try {
    con.query(
      `
        INSERT INTO transaction
         VALUES(
             ${null},
            ${amount},
            '${currentDate}'
            )
        `,
      async function (error, results, fields) {
        const transactionId = results.insertId;
        await addToProductTransaction(productArray, transactionId, con);
        res.status(201);
        res.send("ok");
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/product_transactions", function (req, res) {
  const productArray = req.body.data.productArray;
  const transaction = req.body.data.transaction;
  productArray.forEach((item) => {
    try {
      con.query(
        `
          INSERT INTO product_transaction
           VALUES(
               ${item},
              ${transaction}
              )
          `,
        function (error, results, fields) {
          if (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
});

router.get("/product_transactions", function (req, res) {
  con.query(
    "select * from product_transaction",
    function (error, results, fields) {
      res.send(results);
    }
  );
});

router.get("/transactions", function (req, res) {
  con.query(
    `SELECT * FROM transaction 
`,
    function (error, results, fields) {
      res.send(transaction);
    }
  );
});

router.get("/recentTransaction", function (req, res) {
  con.query(
    `SELECT SUM(amount) as amount,  date 
       FROM transaction as t
              group by date(t.date)
     
      `,

    function (error, transaction, fields) {
      let filter = transaction.map((t) => ({
        date: dayjs(t.date).format("DD/MM/YYYY"),
        amount: t.amount,
      }));
      res.send(filter);
    }
  );
});

module.exports = router;
