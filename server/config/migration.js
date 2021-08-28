const axios = require("axios");

const mysql = require("mysql");

const LIMIT = 20;
//==========connecting to my aws database
const con = mysql.createConnection({
  host: "database-1-instance-1.cmbt88lb332q.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "piece0632541",
});

function getDummyProducts() {
  const res = axios
    .get(`https://fakestoreapi.com/products?limit=${LIMIT}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // handle error
    });
  return res;
}

function filterDummyData(arr) {
  return arr.map((item) => {
    return {
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.image,
    };
  });
}

async function migrateDummyData(arr) {
  arr.forEach((item) => {
    try {
      con.query(
        `
  INSERT INTO shoopingdb.products VALUES (null,
    '${item.title}',
    ${item.price},
    '${item.description}'
    ,'${item.image}')
  `,
        function (error, results, fields) {
          console.log(results);
          if (error) console.log(error);
        }
      );
    } catch (error) {}
  });
}

function createTransactionTable() {
  try {
    sequelize
      .query(
        `
          CREATE TABLE transaction(
            id INT AUTO_INCREMENT PRIMARY KEY,
            amount INT,
            date DATETIME
        )
  `
      )
      .then(function ([items, metadata]) {});
  } catch (error) {
    res.status(400).send(error.message);
  }
}

function createProductTransactionTable() {
  try {
    sequelize
      .query(
        `
      CREATE TABLE product_transaction(
        product_id INT,
       transaction_id INT,
       FOREIGN KEY(product_id) REFERENCES products(id),
       FOREIGN KEY(transaction_id) REFERENCES transaction(id)
    )
  `
      )
      .then(function ([items, metadata]) {});
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const tempArray = getDummyProducts();

tempArray.then((res) => {
  const filtered = filterDummyData(res);
  migrateDummyData(filtered);
});
