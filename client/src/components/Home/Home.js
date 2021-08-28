import { React } from "react";
import { observer, inject } from "mobx-react";
import { Row } from "react-bootstrap";

import Cart from "./Cart";
import "./style/home.css";
import HomeProductList from "./HomeProductList";
const Home = inject("ShoppingStore")(
  observer((props) => {
    return (
      <div>
        <div className="btn-con">
          <Cart cartList={props.ShoppingStore.cartList}></Cart>
        </div>

        <Row>
          {" "}
          <HomeProductList list={props.list}> </HomeProductList>
        </Row>
      </div>
    );
  })
);

export default Home;
