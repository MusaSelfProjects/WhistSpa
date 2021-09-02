const express = require("express");
const mysql = require("mysql");
const dayjs = require("dayjs");

const awsConfig = require("../../config/dataBase.json");
const ddl = require("../../config/ddl.json");
addToProductTransaction =
  require("../../helper/apiHelper").addToProductTransaction;

const router = express.Router();
//===============connection to aws ===============================
const con = mysql.createConnection({
  host: awsConfig.host,
  user: awsConfig.user,
  password: awsConfig.password,
});

//======================connection to amazon database and creating table if not exist==================
con.connect(function (err) {
  if (err) {
    console.log(" error in connect");
    throw err;
  }

  console.log(" connected to AWS !");
  con.query("CREATE DATABASE IF NOT EXISTS shoopingdb;");
  con.query("USE shoopingdb;");

  //=============create product table============================
  con.query(ddl.productsTable, function (error, results, fields) {});
  //=============create transaction table============================

  con.query(ddl.transactionsTable, function (error, results, fields) {
    // console.log(" transaction", results);
  });
  //=============create product_transaction table============================

  con.query(ddl.productsTransactions, function (error, results, fields) {
    // console.log(" product_transaction", results);
  });

  // con.end();
});

//============================product crud operation===================================
router.get("/products", function (req, res) {
  con.query("SELECT *  FROM products;", function (error, results, fields) {
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
             ?,
             ?,
             ?,
             ?,
             ?)
        `,
      [null, product.title, product.price, product.description, product.image],

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
  title=?,
  description=?,
  price=?,
  image=?
  WHERE id = ?;
  `,
    [
      product.title,
      product.description,
      product.price,
      product.image,
      req.params.id,
    ],
    function (error, results, fields) {
      if (error) {
        res.status(404);
      } else {
        res.status(200);
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
  where id= ? 

  `,
    [req.params.id],
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
  const top = parseInt(req.query.top);

  const distinct = req.query.distinct;
  if (distinct == "true") {
    con.query(
      `
        select  product_id, count(product_id) as count , p.title as product_name
        from (
          select distinct pt.product_id, pt.transaction_id
          from product_transaction as pt 
          group by pt.transaction_id
          
          ) as pt , products as p
           where pt.product_id=p.id
           group by  product_id
           order by count desc,product_id
            limit  ${top};
    `,

      function (error, results, fields) {
        res.send(results);
      }
    );
  } else if (distinct == "false") {
    con.query(
      `
        select  product_id, count(product_id) as count, p.title as product_name
           from product_transaction as pt, products as p
           where pt.product_id=p.id
           group by product_id
           order by count desc, product_id
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

router.get("/productTransactions", function (req, res) {
  con.query(
    "select * from product_transaction",
    function (error, results, fields) {
      res.send(results);
    }
  );
});

router.get("/transactions", function (req, res) {
  con.query(
    `SELECT * FROM transaction `,
    function (error, results, fields) {
      res.send(transaction);
    }
  );
});

router.get("/recentTransactions", function (req, res) {
  con.query(
    `SELECT SUM(amount) as amount, date 
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
