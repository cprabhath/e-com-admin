import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Products = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Image",
        field: "image",
      },
      {
        label: "Brand",
        field: "brand",
      },
      {
        label: "Name",
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Price",
        field: "price",
      },
      {
        label: "Qty On Hand",
        field: "qtyOnHand",
      },
      {
        label: "Created at",
        field: "create",
        sort: "disabled",
      },
      {
        label: "Updated At",
        field: "update",
        sort: "disabled",
      },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
      },
    ],
    rows: [],
  });
  const [isloading] = useAxiosLoader();

  useEffect(() => {
    axiosInstance
      .get("/api/v1/products/find-all")
      .then((res) => {
        const data = res.data;
        const rows = data.map((product) => {
          return {
            image: (
              <img
                src={product.imageUrls[0].url}
                alt="Product"
                className="img-fluid"
                style={{ width: "50px" }}
              />
            ),
            brand: product.brand,
            name: product.name,
            price: product.price,
            qtyOnHand: product.qtyOnHand,
            create: new Date(product.createdAt).toLocaleDateString(),
            update: new Date(product.updatedAt).toLocaleDateString(),
            actions: (
              <>
                <Link
                  to={`/dashboard/edit-product/${product._id}`}
                  className="btn btn-sm btn-primary me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </>
            ),
          };
        });
        setDatatable((prevState) => {
          return { ...prevState, rows };
        });
      })
      .catch((err) => {
        if(err.message){
          toast.error(err.message);
        }else{
          toast.error(err.response.data.message);
        }
      });
  }, []);

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/v1/products/delete-by-id/${id}`)
          .then((res) => {
            toast.success(res.data.message);
            window.location.reload();
          })
          .catch((err) => {
            if(err.message){
              toast.error(err.message);
            }else{
              toast.error(err.response.data.message);
            }
          });
      }
    })
  }

  return (
    <>
      <div className="card shadow">
        <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <Link to="/dashboard"><i className="fas fa-arrow-left"></i> </Link>
          <h6 className="m-0 font-weight-bold text-primary">
            Total Products
          </h6>
          <Link to="/dashboard/add-products" className="btn btn-sm btn-primary">
            Add Product
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {isloading ? (
              <div className="spinner-border text-primary" role="status"></div>
            ) : (
              <MDBDataTableV5
                hover
                entriesOptions={[5, 20, 25]}
                entries={5}
                pagesAmount={4}
                data={datatable}
                searchTop
                searchBottom={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
