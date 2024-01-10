import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import Loader from "./Components/Loader";

// Auth Routes
const Login = lazy(() => import("./Components/Login"));
const ForgetPassword = lazy(() => import("./Components/ForgetPassword"));
const ResetPassword = lazy(() => import("./Components/Users/ResetPassword"));
const Dashboard_Details = lazy(() =>
  import("./Components/Dashboard/DashboardDetails")
);

// Dashboard Routes
const Dashboard = lazy(() => import("./Components/Dashboard"));
const Users = lazy(() => import("./Components/Users/Users"));
const Categories = lazy(() => import("./Components/Categories/Categories"));
const Brands = lazy(() => import("./Components/Brands/Brands"));
const Products = lazy(() => import("./Components/Products/Products"));
const Orders = lazy(() => import("./Components/Orders/Orders"));
const Inquiries = lazy(() => import("./Components/Inquiries"));
const Profile = lazy(() => import("./Components/Profile"));
const Settings = lazy(() => import("./Components/Settings"));
const AccountActivated = lazy(() => import("./Components/AccountActivated"));

// Add Routes
const AddUser = lazy(() => import("./Components/Users/AddUser"));
const AddCategories = lazy(() =>
  import("./Components/Categories/AddCategories")
);
const AddBrands = lazy(() => import("./Components/Brands/AddBrands"));
const AddProducts = lazy(() => import("./Components/Products/AddProducts"));
const DailyReport = lazy(() => import("./Components/Reports/DailyReport"));
const MonthlyReport = lazy(() => import("./Components/Reports/MonthlyReport"));
const YearlyReport = lazy(() => import("./Components/Reports/YearlyReport"));

function App() {
  const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
    return children;
  };

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
        <Route
          path="/reset-password/:token/:email"
          element={<ResetPassword />}
        ></Route>
        <Route path="/account-activated/:token" element={<AccountActivated />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard_Details />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="brands" element={<Brands />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          <Route path="add-user" element={<AddUser />} />
          <Route path="add-categories" element={<AddCategories />} />
          <Route path="add-brands" element={<AddBrands />} />
          <Route path="add-products" element={<AddProducts />} />

          <Route path="update-user/:id" element={<AddUser />} />
          <Route path="edit-category/:id" element={<AddCategories />} />
          <Route path="edit-brands/:id" element={<AddBrands />} />
          <Route path="edit-product/:id" element={<AddProducts />} />

          <Route path="daily-report" element={<DailyReport />}></Route>
          <Route path="monthly-report" element={<MonthlyReport />}></Route>
          <Route path="yearly-report" element={<YearlyReport />}></Route>
        </Route>

        <Route path="*" element={<Login />}></Route>
      </Routes>
      <ToastContainer className="toast-position" position="top-right" />
    </Suspense>
  );
}

export default App;
