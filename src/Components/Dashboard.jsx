import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios/AxiosConfig";
import Swal from "sweetalert2";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DateTime from "./Dashboard/DateAndTime";
import ActionCenter from "./ActionCenter";
import { useErrors } from "./ErrorContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  useEffect(() => {
    getProdcuts();
    getUsers();
    getInquiries();
    getIncome();
    getPendingOrders();
    setUserName(localStorage.getItem("UserName"));
    setImage(localStorage.getItem("image"));
  }, []);

  const { addError } = useErrors();
  const navigate = useNavigate();

  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [income, setIncome] = useState(0);
  const [usename, setUserName] = useState("");
  const [image, setImage] = useState("");

  const Logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout from system",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel",
      confirmButtonText: "Yes, Logout",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/");
      }
    });
  };

  const getProdcuts = async () => {
    await axiosInstance
      .get("/api/v1/products/count")
      .then((res) => {
        setProductsCount(res.data);
      })
      .catch((err) => {
        if (err.request.readyState === 4) {
          localStorage.clear();
          navigate("/");
          toast.error(
            "Sorry! We need to do some maintenance. Please try again in a few minutes"
          );
          return;
        }
        addError([`${err.response.data.message}, please refresh the page`]);
      });
  };

  const getUsers = async () => {
    await axiosInstance
      .get("/api/v1/users/count")
      .then((res) => {
        setUsersCount(res.data);
      })
      .catch((err) => {
        addError([`${err.response.data.message}, please refresh the page`]);
      });
  };

  const getInquiries = async () => {
    await axiosInstance
      .get("/api/v1/inquiries/get-daily-inquiry-count")
      .then((res) => {
        setInquiriesCount(res.data.dailyCount);
      })
      .catch((err) => {
        addError([`${err.response.data.message}, please refresh the page`]);
      });
  };

  const getIncome = async () => {
    await axiosInstance
      .get("/api/v1/reports/get-yearly-report")
      .then((res) => {
        setIncome(res.data);
      })
      .catch((err) => {
        addError([`${err.response.data.message}, please refresh the page`]);
      });
  };

  const getPendingOrders = async () => {
    await axiosInstance
      .get("/api/v1/orders/count")
      .then((res) => {
        setPendingOrdersCount(res.data);
      })
      .catch((err) => {
        addError([`${err.response.data.message}, please refresh the page`]);
      });
  }

  return (
    <div id="page-top">
      <div id="wrapper">
        {/* <!-- Sidebar --> */}
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          {/* <!-- Sidebar - Brand --> */}
          <a
            className="sidebar-brand d-flex align-items-center justify-content-center"
            href="#"
          >
            <div className="sidebar-brand-text mx-3">Happy Shop Admin </div>
          </a>

          {/* <!-- Divider --> */}
          <hr className="sidebar-divider my-0" />

          {/* <!-- Nav Item - Dashboard --> */}
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span className=" fw-bold">Dashboard</span>
            </Link>
          </li>

          {/* <!-- Divider --> */}
          <hr className="sidebar-divider" />

          {/* <!-- Heading --> */}
          <div className="sidebar-heading">Interface</div>

          {/* <!-- Nav Item - Pages Collapse Menu --> */}
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Orders"
              aria-expanded="true"
              aria-controls="Orders"
            >
              <i className="fas fa-fw fa-cart-plus"></i>
              <span className=" fw-bold">Orders Management</span>
            </a>
            <div
              id="Orders"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/orders">
                  All orders
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="true"
              aria-controls="collapseTwo"
            >
              <i className="fas fa-fw fa-user"></i>
              <span className=" fw-bold">Customer Management</span>
            </a>
            <div
              id="collapseTwo"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/users">
                  All Customer
                </Link>
                <Link className="collapse-item" to="/dashboard/add-user">
                  Add User
                </Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Inquiry"
              aria-expanded="true"
              aria-controls="Inquiry"
            >
              <i className="fas fa-fw fa-comments"></i>
              <span className=" fw-bold">Inquiry Management</span>
            </a>
            <div
              id="Inquiry"
              className="collapse"
              aria-labelledby="Inquiry"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/inquiries">
                  All Inquiries
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Category"
              aria-expanded="true"
              aria-controls="Category"
            >
              <i className="fas fa-fw fa-boxes-alt"></i>
              <span className=" fw-bold">Category Management</span>
            </a>
            <div
              id="Category"
              className="collapse"
              aria-labelledby="Category"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/categories">
                  All Categories
                </Link>
                <Link className="collapse-item" to="/dashboard/add-categories">
                  Add Category
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Brands"
              aria-expanded="true"
              aria-controls="Brands"
            >
              <i className="fas fa-fw fa-award"></i>
              <span className=" fw-bold">Brands Management</span>
            </a>
            <div
              id="Brands"
              className="collapse"
              aria-labelledby="Brands"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/brands">
                  All Brands
                </Link>
                <Link className="collapse-item" to="/dashboard/add-brands">
                  Add Brands
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Products"
              aria-expanded="true"
              aria-controls="Products"
            >
              <i className="fas fa-fw fa-archive"></i>
              <span className=" fw-bold">Products Management</span>
            </a>
            <div
              id="Products"
              className="collapse"
              aria-labelledby="Products"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/products">
                  All Products
                </Link>
                <Link className="collapse-item" to="/dashboard/add-products">
                  Add Products
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Reports"
              aria-expanded="true"
              aria-controls="Reports"
            >
              <i className="fas fa-fw fa-chart-bar"></i>
              <span className=" fw-bold">Reports</span>
            </a>
            <div
              id="Reports"
              className="collapse"
              aria-labelledby="Reports"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/daily-report">
                  Daily Reports
                </Link>
                <Link className="collapse-item" to="/dashboard/monthly-report">
                  Monthly Reports
                </Link>
                <Link className="collapse-item" to="/dashboard/yearly-report">
                  Yearly Reports
                </Link>
              </div>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#"
              data-toggle="collapse"
              data-target="#Settings"
              aria-expanded="true"
              aria-controls="Settings"
            >
              <i className="fas fa-fw fa-gear"></i>
              <span className=" fw-bold">Settings</span>
            </a>
            <div
              id="Settings"
              className="collapse"
              aria-labelledby="Settings"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Components</h6>
                <Link className="collapse-item" to="/dashboard/settings">
                  Settings
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* <!-- End of Sidebar --> */}

        {/* <!-- Content Wrapper --> */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* <!-- Main Content --> */}
          <div id="content">
            {/* <!-- Topbar --> */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <DateTime />
              {/* <!-- Sidebar Toggle (Topbar) --> */}
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>

              {/* <!-- Topbar Navbar --> */}
              <ul className="navbar-nav ml-auto">
                {/* <!-- Nav Item - Alerts --> */}
                <ActionCenter />

                <div className="topbar-divider d-none d-sm-block"></div>

                {/* <!-- Nav Item - User Information --> */}
                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small fw-bold">
                      {usename}
                    </span>
                    <img className="img-profile rounded-circle"  src={image} />
                  </a>
                  {/* <!-- Dropdown - User Information --> */}
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <Link className="dropdown-item" to="/dashboard/profile">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </Link>
                    <button className="dropdown-item" onClick={() => Logout()}>
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </button>
                  </div>
                </li>
              </ul>
            </nav>
            {/* <!-- End of Topbar --> */}
          </div>
          <div className="container-fluid">
            <Outlet
              context={{ productsCount, usersCount, inquiriesCount, income, pendingOrdersCount }}
            />
          </div>
          {/* <!-- End of Main Content -->

        <!-- Footer --> */}
          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Happy Shop | Admin 2023</span>
              </div>
            </div>
          </footer>
          {/* <!-- End of Footer --> */}
        </div>
        {/* <!-- End of Content Wrapper --> */}
      </div>
      {/* <!-- End of Page Wrapper -->

<!-- Scroll to Top Button--> */}
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>
    </div>
  );
};

export default Dashboard;
