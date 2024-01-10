import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Brands = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Image",
        field: "image",
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
        label: "Description",
        field: "description",
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
    fetchAll()
  }, []);

  const fetchAll = () => {
    axiosInstance
      .get("/api/v1/brands/find-all")
      .then((res) => {
        const data = res.data;
        const rows = data.map((brand) => {
          return {
            image: (
              <img
                src={brand.imageUrl}
                alt="Brand"
                className="img-fluid"
                style={{ width: "35px" }}
              />
            ),
            name: brand.name,
            description: brand.description,
            create: new Date(brand.createdAt).toLocaleDateString(),
            update: new Date(brand.updatedAt).toLocaleDateString(),
            actions: (
              <>
                <Link
                  to={`/dashboard/edit-brands/${brand._id}`}
                  className="btn btn-sm btn-primary me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(brand._id)}
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
        toast.error(err.response.data.message);
      });
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this brand again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/v1/brands/delete-by-id/${id}`)
          .then((res) => {
            toast.success(res.data.message);
            fetchAll()
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    });
  };

    return (
      <>
      <div className="card shadow">
        <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <Link to="/dashboard"><i className="fas fa-arrow-left"></i> </Link>
          <h6 className="m-0 font-weight-bold text-primary">
            Total Brands
          </h6>
          <Link to="/dashboard/add-brands" className="btn btn-sm btn-primary">
            Add Brand
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
    )
  }
  
  export default Brands