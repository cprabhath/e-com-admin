import { useErrors } from "./ErrorContext";
import { useEffect, useState } from "react";

const ActionCenter = () => {
  const { errors, clearErrors } = useErrors();
  const [error, setError] = useState([]);
  const today = new Date();

  useEffect(() => {
    setError(errors);

    return () => {
      setError([]);
    };
  }, [errors]);

  const handleClearErrors = () => {
    clearErrors();
  };

  return (
    <li className="nav-item dropdown no-arrow mx-1">
      <a
        className="nav-link dropdown-toggle"
        id="alertsDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="fas fa-bell fa-fw"></i>
        {/* <!-- Counter - Alerts --> */}
        <span className="badge rounded-pill badge-notification bg-danger">
          {error.length == 0 ? "" : error.length}
        </span>
      </a>
      {/* <!-- Dropdown - Alerts --> */}
      <div
        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
        aria-labelledby="alertsDropdown"
      >
        <h6 className="dropdown-header">Action Center</h6>
        {error.length == 0 ? (
          <a className="dropdown-item d-flex align-items-center" href="#">
            <div className="mr-3">
              <div className="icon-circle bg-info">
                <i className="fas fa-exclamation-triangle text-white"></i>
              </div>
            </div>
            <div>
              <div
                className="small text-gray-500"
                style={{ fontStyle: "italic" }}
              >
                No issue founded!
              </div>
            </div>
          </a>
        ) : error.length == 0 ? (
          ""
        ) : (
          error.map((err, index) => (
            <div
              className="dropdown-item d-flex align-items-center mb-2"
              key={index}
            >
              <div className="mr-3">
                <div className="icon-circle bg-warning">
                  <i className="fas fa-exclamation-triangle text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">
                  {today.getDate() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getFullYear()}
                </div>
                <span className="font-weight-bold">{err}</span>
              </div>
              {error.length > 0 && (
                <button onClick={handleClearErrors} className="btn btn-sm btn-danger btn-circle">
                    X
                </button>
            )}
            </div>
          ))
        )}
      </div>
    </li>
  );
};

export default ActionCenter;
