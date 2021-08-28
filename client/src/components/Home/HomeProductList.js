import React from "react";
import ProductCard from "./PoductCard";
import "./style/home.css";

function HomeProductList(props) {
  return (
    <div className="grid">
      {props.list.map((item, index) => (
        <ProductCard item={item} key={index}></ProductCard>
      ))}
    </div>
  );
}

export default HomeProductList;
