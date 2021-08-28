import { observer, inject } from "mobx-react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React, useEffect } from "react";

import NavBar from "./components/NavBar";

const App = inject("ShoppingStore")(
  observer((props) => {
    const fetchData = async () => {
      await props.ShoppingStore.getProducts();
    };
    useEffect(() => {
      fetchData();
    }, []);

    return (
      <div>
        <NavBar list={props.ShoppingStore.productsListComputed}></NavBar>
      </div>
    );
  })
);

export default App;
