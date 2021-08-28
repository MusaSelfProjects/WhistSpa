import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { observer, inject } from "mobx-react";

import "./style/cart-item.css";
const CartItem = inject("ShoppingStore")(
  observer((props) => {
    const handleRemove = (id) => {
      props.ShoppingStore.removeFromCart(props.item.id);
    };
    return (
      <div>
        <Container>
          <Row className="item-container">
            <Col xs={5} className="text-item">
              <p> item :{props.item.title}</p>
              item price:
              {props.item.price} $
            </Col>
            <Col xs={5} className="img-item">
              {<Image className="img-product" src={props.item.image}></Image>}
            </Col>
            <Col xs={2}>
              QTY:<h3>{props.ShoppingStore.itemCartCounter[props.item.id]} </h3>
            </Col>
            {
              // <Col className="delete-btn">
              //     <Button onClick={handleRemove} variant="danger">
              //       remove
              //     </Button>
              // </Col>
            }
          </Row>
          <Row className="btn-delete">
            {
              // <Button onClick={handleRemove} variant="danger">
              //   remove
              // </Button>
            }
          </Row>
        </Container>
      </div>
    );
  })
);

export default CartItem;
