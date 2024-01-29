import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ProductDetailsStyle.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [relatedProducts, setRelatedProducts] = useState();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      setError("Error fetching product details");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //Get Similar Products

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row mt-2">
        <div className="col-md-6" style={{ width: "24rem" }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            product && (
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                className="card-img-top"
                alt={product.name}
              />
            )
          )}
        </div>

        <div className="col-md-6">
          <h1 className="text-center">Product Details</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            product && (
              <>
                <h6>Name: {product.name}</h6>
                <h6>Description : {product.description}</h6>
                <h6>Price :₹ {product.price}</h6>{" "}
                {/* <h6>Price :₹ {product.price}</h6> */}
                <h6>Category : {product.category.name}</h6>
                <button className="btn btn-secondary ms-1">Add To Cart</button>
              </>
            )
          )}
        </div>
      </div>
      <hr />
      <div className="row container">
        <h3>Similar Products</h3>
        {/* {JSON.stringify(relatedProducts, null, 4)} */}
        <div className="d-flex flex-wrap">
          {relatedProducts?.length > 0 ? (
            relatedProducts?.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text">₹ {p.price}</p>
                  <button className="btn btn-secondary ms-1">
                    Add To Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="text-center">
                Sorry!! no more similar products....
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
