
USE  shoopingdb;

select * from transaction;


CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(80),
    price INT,
    description TEXT,
    image TEXT

);


USE  shoopingdb;
CREATE TABLE transaction(
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount INT,
    date DATETIME
);

use shoopingdb 
CREATE TABLE product_transaction(
     product_id INT,
    transaction_id INT,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE ,
    FOREIGN KEY(transaction_id) REFERENCES transaction(id) 
);