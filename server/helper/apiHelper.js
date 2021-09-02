async function addToProductTransaction(productArray, transaction, con) {
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
        function (error, results, fields) {}
      );
    } catch (error) {
      return -1;
    }
  });
  return 0;
}

module.exports = {
  addToProductTransaction,
};
