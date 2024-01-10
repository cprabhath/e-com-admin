import { useOutletContext } from "react-router-dom";
import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useErrors } from "../ErrorContext";

defaults.responsive = true;

const DashboardDetails = () => {
  const { productsCount } = useOutletContext();
  const { usersCount } = useOutletContext();
  const { inquiriesCount } = useOutletContext();
  const { pendingOrdersCount } = useOutletContext();
  const { income } = useOutletContext();
  const [totalIncome, settotalIncome] = useState("");
  const [cost, setCost] = useState("");
  const [netProfit, setNetProfit] = useState("");
  const [currency, setCurrency] = useState("");
  const [isloading] = useAxiosLoader();
  const { addError } = useErrors();

  useEffect(() => {
    axiosInstance
    .get("/api/v1/settings/find-all")
    .then((res) => {
      if (res.data.message.length > 0) {
        setCurrency(res.data.message[0].systemCurrency);
        if(currency !== ""){
          calculateTotalIncome();
        }
      }else{
        setCurrency("");
        toast.error("No settings found. Please configure settings");
        addError("No settings found. Please configure settings");
      }
    })
    .catch((err) => {
      toast.error(err.message);
    });
  }, [income.data]);

 
  const calculateTotalIncome = () => {
    let totalIncome = 0;
    let totalExpenses = 0;
    if (income.data) {
      income.data.map((data) => {
        totalIncome += data.income;
        totalExpenses += data.expense;
      });
    }

    const netProfit = totalIncome - totalExpenses;
    const formattedNetProfit = netProfit.toLocaleString("en-US", {
      style: "currency",
      currency: currency,
    });

    const formattedIncome = totalIncome.toLocaleString("en-US", {
      style: "currency",
      currency: currency,
    });

    const formattedExpenses = totalExpenses.toLocaleString("en-US", {
      style: "currency",
      currency: currency,
    });

    settotalIncome(formattedIncome);
    setCost(formattedExpenses);
    setNetProfit(formattedNetProfit);
  }

  return (
    <div>
      {/* <!-- Page Heading --> */}
      <div className="d-sm-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>
      {/* <!-- Content Row --> */}
      <div className="row">
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-dark shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-dark text-uppercase mb-1">
                    {parseInt(netProfit.replace(/[^-0-9.]/g, "")) < 0
                      ? "Total Lost"
                      : "Net Profit"}
                  </div>
                  {isloading ? (
                    <div className="spinner-border text-dark" role="status">
                      {" "}
                    </div>
                  ) : parseInt(netProfit.replace(/[^-0-9.]/g, "")) < 0 ? (
                    <div className="h5 mb-0 font-weight-bold text-danger">
                      {netProfit}
                    </div>
                  ) : (
                    <div className="h5 mb-0 font-weight-bold text-success">
                      {netProfit}
                    </div>
                  )}
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Income
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {isloading ? (
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        {" "}
                      </div>
                    ) : totalIncome == 0 ? (
                      0
                    ) : (
                      totalIncome
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Total Expences
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {isloading ? (
                      <div className="spinner-border text-danger" role="status">
                        {" "}
                      </div>
                    ) : cost == 0 ? (
                      0
                    ) : (
                      cost
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bill fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Products
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {isloading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        {" "}
                      </div>
                    ) : productsCount == 0 ? (
                      0
                    ) : (
                      productsCount
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dolly fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    No of Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {isloading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        {" "}
                      </div>
                    ) : usersCount == 0 ? (
                      0
                    ) : (
                      usersCount
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Earnings (Monthly) Card Example --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Pending Orders
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                      {isloading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        {" "}
                      </div>
                    ) : pendingOrdersCount == 0 ? (
                      0
                    ) : (
                      pendingOrdersCount
                    )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Pending Inquiries Card Example --> */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Inquiries
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {isloading ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      />
                    ) : inquiriesCount == 0 ? (
                      0
                    ) : (
                      inquiriesCount
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-comments fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Content Row --> */}
      <div className="row">
        {/* <!-- Area Chart --> */}
        <div className="col-xl-8 col-lg-7">
          <div className="card border-left-primary shadow mb-4">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Earnings Overview
              </h6>
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              {isloading ? (
                "We're loading your data. Please wait.."
              ) : income ? (
                <Line
                  data={{
                    labels: income.data.map((data) => data.label),
                    datasets: [
                      {
                        label: "Revenue",
                        data: income.data.map((data) => data.income),
                        backgroundColor: "#064FF0",
                        borderColor: "#064FF0",
                      },
                      {
                        label: "Cost",
                        data: income.data.map((data) => data.expense),
                        backgroundColor: "#FF3030",
                        borderColor: "#FF3030",
                      },
                    ],
                  }}
                  options={{
                    elements: {
                      line: {
                        tension: 0.5,
                      },
                    },
                  }}
                ></Line>
              ) : "We're generating your reports. Please wait.."
            }
            </div>
          </div>
        </div>
        {/* <!-- Pie Chart --> */}
        <div className="col-xl-4 col-lg-5">
          <div className="card border-left-primary shadow mb-4">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Open Orders and Inquiries Tracking
              </h6>
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2">
                <Doughnut
                  data={{
                    labels: ["Pending Orders", "Inquiries"],
                    datasets: [
                      {
                        data: [pendingOrdersCount, inquiriesCount],
                        backgroundColor: [
                          "rgb(255, 99, 132)",
                          "rgb(54, 162, 235)",
                          "rgb(255, 205, 86)",
                        ],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                ></Doughnut>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}
    </div>
  );
};

export default DashboardDetails;
