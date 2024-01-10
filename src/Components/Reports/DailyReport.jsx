import { axiosInstance, useAxiosLoader } from "../../Axios/AxiosConfig";
import { useEffect, useState } from "react";
import { defaults } from "chart.js/auto";
import { Line, Doughnut, Pie } from "react-chartjs-2";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

defaults.responsive = true;

const DailyReport = () => {
  const [data, setData] = useState([]);
  const [isloading] = useAxiosLoader();

  useEffect(() => {
    getMonthlyReport();
  }, []);

  const getMonthlyReport = () => {
    console.log("getMonthlyReport");
    axiosInstance
      .get("/api/v1/reports/get-daily-report")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
    <div className="d-sm-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0 text-gray-800">Daily Report</h1>
      </div>
    <div className="card border-left-primary shadow mb-4">
    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
    <Link to="/dashboard"><i className="fas fa-arrow-left"></i> </Link>
      <h6 className="font-weight-bold text-primary">Summery</h6>
      <div>{""}</div>
    </div>
      {/* <!-- Card Header - Dropdown --> */}
      {
        isloading ? "Please wait.. we're generating your reports" : (
          <div className="row p-3">
        {/* <!-- Area Chart --> */}
        <div className="col-xl-8 col-lg-7">
          <div className="mb-4 border">
            {/* <!-- Card Header - Dropdown --> */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Earnings</h6>
            </div>
            {/* <!-- Card Body --> */}
            <div className="card-body">
              <Line
                data={{
                  labels: data.map((data) => data.label),
                  datasets: [
                    {
                      label: "Income",
                      data: data.map((data) => data.income),
                      backgroundColor: "#064FF0",
                      borderColor: "#064FF0",
                    },
                    {
                      label: "Expense",
                      data: data.map((data) => data.expense),
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
            </div>
          </div>
        </div>
        {/* <!-- Pie Chart --> */}
        <div className="col-xl-4 col-lg-5">
          <div className="mb-4 border">
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
                        data: [2, 0],
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
        )
      }
    </div>

    <div className="card border-left-primary shadow mb-4">
    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 className="font-weight-bold text-primary">Income and expences</h6>
    </div>
      {/* <!-- Card Header - Dropdown --> */}
      {
        isloading ? "Please wait.. we're generating your reports" : (
          <div className="row p-3">        
        {/* <!-- Pie Chart --> */}
        {data.map((chart, index) => (
          <div key={index} className="col-xl-3 col-lg-5">
          <div className="mb-4 border">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                {chart.label}
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2">
                <Pie
                  data={{
                    labels: ["Income", "Expence"],
                    datasets: [
                      {
                        data: [chart.income, chart.expense],
                        backgroundColor: [
                          "rgb(255, 99, 21)",
                          "rgb(54, 162, 235)",
                          "rgb(255, 205, 86)",
                        ],
                        hoverOffset: 4,
                      },
                    ],
                  }}
                ></Pie>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
        )
      }
    </div>
    </>
  );
};

export default DailyReport;
