import { observable, action, makeObservable, computed } from "mobx";
import axios from "axios";

const serverApi = "http://localhost:8080";

export class ShoppingStore {
  constructor() {
    this.productsList = []; // this will display products in admin and home page
    this.cartList = []; // this is car list that we keep pushing
    this.recentList = []; // get recent sales
    this.topProductList = []; // get top 5 sold product
    this.topDistinctList = []; // get top distinct sold product
    this.itemCartCounter = {};
    this.productTransaction = [];
    makeObservable(this, {
      itemCartCounter: observable,
      getProducts: action,
      productsList: observable,
      productsListComputed: computed,
      recentList: observable,
      cartList: observable,
      topProductList: observable,
      deleteProduct: action,
      editProduct: action,
      createNewProduct: action,
      getTopProduct: action,
      totalCost: computed,
      getRecentSales: action,
      topDistinctList: observable,
      cartLength: computed,
    });
  }
  get productsListComputed() {
    return this.productsList;
  }
  getProducts = async () => {
    await axios
      .get(`${serverApi}/products`)
      .then((response) => {
        this.productsList = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getRecentSales = async () => {
    await axios
      .get(`${serverApi}/recentTransactions`)
      .then((response) => {
        this.recentList = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getTopDistinct = async () => {
    const top = 5;
    await axios
      .get(`${serverApi}/soldProducts?top=${top}&distinct=true`)
      .then((response) => {
        this.topDistinctList = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getTopProduct = async () => {
    const top = 5;
    await axios
      .get(`${serverApi}/soldProducts?top=${top}&distinct=false`)
      .then((response) => {
        this.topProductList = response.data;
      })
      .catch(function (error) {});
  };

  get cartLength() {
    return this.cartList.length;
  }

  get totalCost() {
    let total = 0;
    this.cartList.forEach((item) => {
      total += this.itemCartCounter[item.id] * item.price;
    });
    return total;
  }
  editProduct = async (product) => {
    await axios
      .put(`${serverApi}/products/${product.id}`, {
        product: product,
      })
      .then(async (response) => {
        await this.getProducts();
      })
      .catch(function (error) {});
  };

  createNewProduct = async (product) => {
    await axios
      .post(`${serverApi}/products`, {
        product: product,
      })
      .then(async (response) => {
        await this.getProducts();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  deleteProduct = async (product) => {
    await axios
      .delete(`${serverApi}/products/${product.id}`)
      .then(async (response) => {
        await this.getProducts();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  addNewTransaction = async (total) => {
    const productArray = this.productTransaction;
    await this.addTransaction(total, productArray);
    await this.getProducts();
    this.cartList = [];
    this.cartDistinctList = [];
  };

  addToCart = (item) => {
    const found = this.cartList.find((i) => i.id === item.id);
    // check if item exist
    if (found === undefined) {
      this.itemCartCounter[item.id] = 1;
    } else {
      this.itemCartCounter[item.id] += 1;
    }
    if (found === undefined) {
      this.cartList.push(item);
    }
    this.productTransaction.push(item.id);
    console.log(" found is ", found);
  };

  removeFromCart = (id) => {
    this.cartList = this.cartList.filter((item) => {
      return item.id !== id;
    });
  };

  addTransaction = async (total, productArray) => {
    return await axios
      .post(`${serverApi}/transactions`, {
        data: { total: total, productArray: productArray },
      })
      .then(async (response) => {
        console.log(response);
        const transactionID = response.data.id;
        return transactionID;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  updateProductTransaction = async (productArray, transaction) => {
    await axios
      .post(`${serverApi}/product_transactions`, {
        data: { productArray, transaction },
      })
      .then(async (response) => {
        await this.getProducts();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

export default ShoppingStore;
