import { React, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { observer, inject } from "mobx-react";

const RecentTransaction = inject("ShoppingStore")(
  observer((props) => {
    return (
      <div>
        <ListGroup>
          <ListGroup.Item active>recent sales </ListGroup.Item>
          {props.list.map((item, index) => (
            <ListGroup.Item key={index}>
              {item.date} <span>-</span> {item.amount} <span>$</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  })
);

export default RecentTransaction;
