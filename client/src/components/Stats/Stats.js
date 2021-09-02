import { React, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Container, Row, Col } from "react-bootstrap";
import BoxList from "./BoxList";

import "./style/stats.css";

const Stats = inject("ShoppingStore")(
  observer((props) => {
    useEffect(() => {
      fetchData();
    }, []);

    const fetchData = () => {
      props.ShoppingStore.getRecentSales();
      props.ShoppingStore.getTopProduct();
      props.ShoppingStore.getTopDistinct();
    };
    return (
      <div>
        <Container className="stats-container">
          <br></br>
          <Row>
            <Col>
              <BoxList
                showRecentTransaction={true}
                list={props.ShoppingStore.recentList}
                title="recent sales"
              ></BoxList>
            </Col>
            <Col>
              <BoxList
                list={props.ShoppingStore.topProductList}
                title="top five"
              ></BoxList>
            </Col>
            <Col>
              <BoxList
                list={props.ShoppingStore.topDistinctList}
                title="top distinct five"
              ></BoxList>
            </Col>
          </Row>
        </Container>
      </div>
    );
  })
);

export default Stats;
