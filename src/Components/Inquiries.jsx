import { MDBDataTableV5 } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../Axios/AxiosConfig";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useErrors } from "./ErrorContext";

const Inquiries = () => {
  const { addError } = useErrors();
  const [isloading] = useAxiosLoader();
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "Name",
        field: "Name",
      },
      {
        label: "Email",
        field: "Email",
      },
      {
        label: "Message",
        field: "Message",
        width: 200,
      },
      {
        label: "Is Answered",
        field: "IsAnswered",
      },
      {
        label: "Actions",
        field: "Actions",
        sort: "disabled",
      },
    ],
    rows: [],
  });

  useEffect(() => {
    getInquiries();
  }, []);

  const markAsAnswered = (id) => {
    axiosInstance
      .put(`/api/v1/inquiries/mark-as-answered/${id}`)
      .then((res) => {
        toast.success(res.data.message);
        getInquiries();
      })
      .catch((err) => {
        addError(err.response.data.message);
      });
  };

  const deleteInquiry = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/v1/inquiries/delete-by-id/${id}`)
          .then((res) => {
            toast.success(res.data.message);
            getInquiries();
          })
          .catch((err) => {
            addError(err.response.data.message);
          });
      }
    });
  };

  const getInquiries = () => {
    axiosInstance
      .get("/api/v1/inquiries/find-all")
      .then((res) => {
        const data = res.data;
        const rows = data.map((inquiry) => {
          return {
            Name: inquiry.name,
            Email: inquiry.email,
            Message: inquiry.message,
            IsAnswered: inquiry.isAnswered ? (
              <span className="badge badge-success">Yes</span>
            ) : (
              <span className="badge badge-danger">No</span>
            ),
            Actions: (
              <>
                <div className="row">
                  <div className="col">
                    {inquiry.isAnswered ? (
                      ""
                    ) : (
                      <Link
                        onClick={() => markAsAnswered(inquiry._id)}
                        className="btn btn-sm btn-primary"
                      >
                        Answered
                      </Link>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-sm btn-danger mt-2"
                      onClick={() => deleteInquiry(inquiry._id)}
                    >
                      Delete
                    </button>
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
        addError(err.response.data.message);
      });
  };

  return (
    <div className="card shadow">
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">Total Inquiries</h6>
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
  );
};

export default Inquiries;
