import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";

const Orders = () => {

  const [isloading] = useAxiosLoader();
  const [fullName , setfullName] = useState('')
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Order ID",
        field: "order_id",
      },
      {
        label: "Full Name",
        field: "Name",
      },
      {
        label: "Total",
        field: "total",
      },
      {
        label: "Products",
        field: "products",
      },
      {
        label: "Status",
        field: "status",
      },
      {
        label: "Created at",
        field: "create",
        sort: "disabled",
      },
      {
        label: "Action",
        field: "action",
        sort: "disabled",
      },
    ],
    rows: [],
  });

  useEffect(() => {
    fetchAllOrders();
  }, [fullName]);

  
  const fetchAllOrders = () => {
    axiosInstance
      .get("/api/v1/orders/find-all")
      .then((res) => {
        const data = res.data;
        axiosInstance
      .get(`/api/v1/users/find-one/${data[0].userID}`)
      .then((res) => {
        setfullName(res.data.message.fullName)
      })
      .catch((err) => {
        console.log(err);
      });
        const rows = data.map((order) => {
          return {
            order_id: order.orderID,
            Name: fullName,
            total: order.totalCost,
            products: order.products.map((product, index) => {
              return (
                <div className="d-flex align-items-center" key={index}>
                  <p className="mb-0 ms-2">{product.name}</p>
                  <p className="mb-0 ms-2">{product.quantity}</p>
                </div>
              );
            }),
            status: order.status === "Pending" ? 
              <span className="badge badge-warning">Pending</span>
             : 
              <span className="badge badge-success">Approved</span>
            ,
            create: new Date(order.createdAt).toLocaleDateString(),
            action: (
              <>
                <button
                  disabled={order.status == "Approved" ? true : false}
                  className="btn btn-sm btn-danger"
                  onClick={() => handle_Order(order._id)}
                >
                  Approve
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
        console.log(err);
      });
  }

  const handle_Order = (id) => {
    axiosInstance
      .put(`/api/v1/orders/update/${id}`, { status: "Approved" })
      .then((res) => {
        toast.success(res.data.message);
        fetchAllOrders();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  return (
    <>
    <div className="card shadow" style={{ marginTop:"-500px" }}>
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <Link to="/dashboard"><i className="fas fa-arrow-left"></i> </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          Orders
        </h6>
        <div>

        </div>
       
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
  )
}

export default Orders