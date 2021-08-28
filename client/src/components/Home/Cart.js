import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { observer, inject } from "mobx-react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import CartItem from "./CartItem";
import "./style/cart.css";
const Cart = inject("ShoppingStore")(
  observer((props) => {
    const handlePay = () => {
      props.ShoppingStore.addNewTransaction(props.ShoppingStore.totalCost);
    };

    return (
      <div className="my-cart">
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Cart Items {props.ShoppingStore.cartLength}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {props.cartList.map((item, index) => (
              <Dropdown.Item key={index + "click"} href="#/action-1">
                <CartItem item={item} key={index}></CartItem>
              </Dropdown.Item>
            ))}
            {}
            {
              <Dropdown.Item key="total" href="#">
                <Row>
                  <Col>
                    <Button onClick={handlePay} variant="primary" size="lg">
                      pay
                    </Button>
                  </Col>
                  <Col>
                    <Row className="pay-area">
                      <Col sm={3}>
                        <span> total:</span>{" "}
                      </Col>
                      <Col sm={3}>
                        {" "}
                        <span>{props.ShoppingStore.totalCost} </span> $
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Dropdown.Item>
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  })
);

export default Cart;
