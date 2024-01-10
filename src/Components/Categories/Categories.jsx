import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Categories = () => {
  const [isloading] = useAxiosLoader();
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Name",
        field: "name",
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

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = () => {
    axiosInstance
      .get("/api/v1/categories/find-all")
      .then((res) => {
        const data = res.data;
        const rows = data.map((category) => {
          return {
            name: category.name,
            description: category.description,
            create: new Date(category.createdAt).toLocaleDateString(),
            update: new Date(category.updatedAt).toLocaleDateString(),
            actions: (
              <>
                <Link
                  to={`/dashboard/edit-category/${category._id}`}
                  className="btn btn-sm btn-primary me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="btn btn-sm btn-danger"
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
  };


  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/v1/categories/delete-by-id/${id}`)
          .then((res) => {
            toast.success(res.data.message);
            fetchAllCategories();
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
          Total Categories
        </h6>
        <Link to="/dashboard/add-categories" className="btn btn-sm btn-primary">
          Add Category
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

export default Categories;
