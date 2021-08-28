import { React, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { observer, inject } from "mobx-react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

import { Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

// import Card from "./CardProduct";
const ItemModal = inject("ShoppingStore")(
  observer((props) => {
    const [item, setItem] = useState({
      title: "",
      image: "",
      price: 0,
      description: "",
    });
    const handleClick = (e) => {
      const name = e.target.name;
      //   props.ShoppingStore[name](props.item);// this wile be used for both handle

      console.log(props.item.id, "clicked");
    };
    useEffect(() => {
      if (props.showCreate) {
        return;
      }
      setItem(props.item);
    }, []);
    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      console.log(" name value ", name, value);
      setItem((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      console.log(props.item.id, "clicked");
    };

    const handleUpdate = () => {
      props.ShoppingStore.editProduct(item);
      props.handleModalChange();
    };

    const handleCreate = () => {
      Swal.fire({
        title: "Uploading...",
        html: "Please wait...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          await props.ShoppingStore.createNewProduct(item);
          Swal.hideLoading();
        },
      });
      props.handleModalChange();
    };
    const handleCancel = () => {
      props.handleModalChange();
    };
    return (
      <div>
        <Modal show={props.show} onHide={props.handleModalChange}>
          <Modal.Header>
            {props.showCreate ? (
              <Modal.Title>{"add New Item"} </Modal.Title>
            ) : (
              <Modal.Title>{"Item Selected"} </Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body>
            <div>
              <Card>
                <Form.Control
                  name="title"
                  value={item.title}
                  size="lg"
                  type="text"
                  placeholder="Enter Title "
                  onChange={handleChange}
                />

                <Card.Body>
                  <Image className="product-image" src={item.image} fluid />
                  <Form.Control
                    name="image"
                    value={item.image}
                    size="lg"
                    type="text"
                    placeholder="paste image  url"
                    onChange={handleChange}
                  />

                  <div>
                    <br></br>
                    <Row>
                      <Col>
                        <Form.Control
                          name="price"
                          value={item.price}
                          size="sm"
                          type="number"
                          onChange={handleChange}
                          placeholder="enter price"
                        />
                      </Col>
                      <Col>
                        <span>$</span>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
                <Card.Text>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label></Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={item.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="enter description"
                    />
                  </Form.Group>
                </Card.Text>
              </Card>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {props.showCreate ? (
              <Button
                variant="success"
                name="createItem"
                onClick={handleCreate}
              >
                create New Item
              </Button>
            ) : (
              <Button
                variant="success"
                name="editProduct"
                onClick={handleUpdate}
              >
                Save
              </Button>
            )}
            <Button variant="danger" name="cancel" onClick={handleCancel}>
              cancel
            </Button>{" "}
          </Modal.Footer>
        </Modal>
      </div>
    );
  })
);

export default ItemModal;
