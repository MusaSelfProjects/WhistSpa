import { React, useState } from "react";
import ProductItem from "./ProductItem";
import { observer, inject } from "mobx-react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./style/productList.css";

import ItemModal from "./ItemModal";

const tableColumns = ["title", "price", "description", "img", "option"];
const ProductsList = inject("ShoppingStore")(
  observer((props) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [showCreate, setShowCreate] = useState(false);

    const handleModalChange = () => {
      if (showCreate) {
        setShowCreate(!showCreate);
      }
      setShowModal(!showModal);
    };
    const handleSelectedItem = (item) => {
      setSelectedItem(item);
    };
    const handleAddNewProduct = () => {
      setShowCreate(!showCreate);
      handleModalChange();
    };

    return (
      <div>
        <Button
          onClick={handleAddNewProduct}
          variant="primary"
          className="sticky-top"
        >
          add new product
        </Button>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr className="keys-column">
              {tableColumns.map((d) => (
                <td key={d}>{d}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.productsList.map((item, index) => (
              <ProductItem
                key={index}
                item={item}
                handleSelectedItem={handleSelectedItem}
                handleModalChange={handleModalChange}
              ></ProductItem>
            ))}
          </tbody>
        </Table>
        {showModal ? (
          <ItemModal
            showCreate={showCreate}
            show={showModal}
            item={selectedItem}
            handleModalChange={handleModalChange}
          ></ItemModal>
        ) : null}
      </div>
    );
  })
);

export default ProductsList;
