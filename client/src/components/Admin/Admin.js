import { React, useEffect } from "react";
import ProductsList from "./ProductsList";
import { observer, inject } from "mobx-react";

const Admin = inject("ShoppingStore")(
  observer((props) => {
    const fetchData = async () => {
      await props.ShoppingStore.getProducts();
    };
    useEffect(() => {
      fetchData();
    }, []);

    return (
      <div>
        <ProductsList
          productsList={props.ShoppingStore.productsListComputed}
        ></ProductsList>
      </div>
    );
  })
);

export default Admin;
