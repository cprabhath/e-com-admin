import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Users = () => {
  const [isloading] = useAxiosLoader();
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Image",
        field: "image",
      },
      {
        label: "Name",
        field: "Name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Position",
        field: "Position",
      },
      {
        label: "Email",
        field: "Email",
      },
      {
        label: "Email Verified",
        field: "Email_verified",
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
    fetchAllUsers();
  }, []);

  const fetchAllUsers = () => {
    axiosInstance
      .get("/api/v1/users/find-all")
      .then((res) => {
        const data = res.data.message;
        const rows = data.map((user) => {
          return {
            image: (
              <img
                src={user.imageUrl}
                alt="user"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            ),
            Name: user.fullName,
            Position: user.role,
            Email: user.email,
            Email_verified:
              user.emailVerified == true ? (
                <span className="badge badge-success">Verified</span>
              ) : (
                <span className="badge badge-danger">Not Verified</span>
              ),
            create: new Date(user.createdAt).toLocaleDateString(),
            action: (
              <>
                <div className="row">
                  <div className="col-auto">
                    <Link
                      to={`/dashboard/update-user/${user._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Edit
                    </Link>
                    <Link
                      onClick={(e) => handleDelete(e, user._id)}
                      className="btn btn-sm btn-danger ml-2"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
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

  const handleDelete = (e,id) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/v1/users/delete/${id}`)
          .then((res) => {
            toast.success(res.data.message);
            fetchAllUsers();
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
            Total System Users
          </h6>
          <Link to="/dashboard/add-user" className="btn btn-sm btn-primary">
            Add User
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

export default Users;
