import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { URI } from "../../../constants";
import moment from "moment";
import ReactPaginate from "react-paginate";
import loader from "../../../assets/loaderMobile.gif";

const prevIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="16"
    viewBox="0 0 21 16"
    fill="none"
  >
    <g opacity="0.5">
      <path
        d="M19.7852 8.21708H1.00054M1.00054 8.21708L8.04477 1.17285M1.00054 8.21708L8.04477 15.2613"
        stroke="white"
        stroke-width="1.17404"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
);

const nextIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="16"
    viewBox="0 0 21 16"
    fill="none"
  >
    <path
      d="M1.21484 8.21708H19.9995M19.9995 8.21708L12.9552 1.17285M19.9995 8.21708L12.9552 15.2613"
      stroke="#F5F5F5"
      stroke-width="1.17404"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Activity = () => {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);
  const [pageCount] = useState(0);
  const [activityDetails, setActivityDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { customerId } = useSelector((state) => state.ChangeState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const __getAuthToken = async () => {
    window.sessionStorage.clear();
    window.history.forward();
    window.location.pathname = "/";
  };

  const __errorCheck = (__error) => {
    if (__error.response) {
      if (__error.response.status === 400) {
        __getAuthToken();
      }
    }
  };

  const compareDates = (a, b) => {
    const parseDate = (dateString) => {
      if (dateString === "today") {
        return new Date();
      } else if (dateString === "yesterday") {
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      } else {
        return new Date(dateString);
      }
    };

    const dateA = parseDate(a);
    const dateB = parseDate(b);

    return dateB - dateA;
  };

  const itemsPerPage = 7;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Convert your activityDetails object into an array of activities
  const activitiesArray = Object.keys(activityDetails)
    .sort(compareDates)
    .reduce((acc, key) => {
      const activities = activityDetails[key];
      return activities.length > 0
        ? acc.concat([{ date: key }, ...activities])
        : acc;
    }, []);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = activitiesArray.slice(startIndex, endIndex);

  const getTransfer = async () => {
    // setIsLoading(true);
    // await axios
    //   .get(
    //     URI.getActivity + customerId,
    //     {
    //       headers: headers,
    //     }
    //   )
    //   .then((response) => {
    //     if (response.data.status === 200 || response.data.status === 201) {
    //       let arr = [];
    //       setActivityDetails(response.data.data);
    //       Object.keys(response.data.data)
    //         .sort(compareDates)
    //         .forEach((key) => {
    //           return arr.push(response.data.data[key]);
    //         });
    //       setTimeout(() => {
    //         setIsLoading(false);
    //       }, 1000);
    //     } else {
    //       setIsLoading(false);
    //       setActivityDetails([]);
    //     }
    //   })
    //   .catch(function (error) {
    //     __errorCheck(error);
    //   });
  };

  React.useEffect(() => {
    // getTransfer();
  }, []);

  const __getPaginationView = () => {
    if (activityDetails && activityDetails !== null) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center float-end gap-3 ps-2 pe-5 small">
            <ReactPaginate
              nextLabel={nextIcon}
              onPageChange={handlePageChange}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(activitiesArray.length / itemsPerPage)}
              previousLabel={prevIcon}
              pageClassName="page-item modItem"
              pageLinkClassName="page-link modLink"
              previousClassName="page-item modItem"
              previousLinkClassName="page-link modLink"
              nextClassName="page-item modItem"
              nextLinkClassName="page-link modLink"
              breakLabel="..."
              breakClassName="page-item modItem"
              breakLinkClassName="page-link modLink"
              containerClassName={
                "pagination modPag " +
                (Math.ceil(pageCount) < 5 ? "w-5" : "w-20")
              }
              activeClassName="active"
              renderOnZeroPageCount={null}
              forcePage={currentPage}
            />
          </div>
        </div>
      );
    }
  };
  console.log("paginated", paginatedActivities);

  return (
    <main className="settingsRightSecActivity d-flex justify-content-center mx-auto">
      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-content-center h-auto">
            <img src={loader} alt="loader" width={200} />
          </div>
        ) : (
          <>
            {paginatedActivities.length === 0 ? (
              <div className="d-flex justify-content-center mt-4 fs-3">
                No activity yet
              </div>
            ) : (
              paginatedActivities.map((item) => {
                if (item.date) {
                  return (
                    <div key={item.date} className="my-3">
                      <h6 style={{ color: "#00F0FF", fontSize: "1.2vw" }}>
                        {/^[0-9]*$/.test(item.date.replace(/-/g, ""))
                          ? moment(item.date, "MM-DD-YYYY").format(
                              "MMM D, YYYY"
                            )
                          : item.date.charAt(0).toUpperCase() +
                            item.date.slice(1)}
                      </h6>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="text-white mt-2 my-2"
                      key={item.custActvtyDetId}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontSize: "1vw",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{item.activityTitle}</span>
                        <span>{item.createdDate}</span>
                      </div>
                      <span
                        style={{
                          color: "rgba(245, 245, 245, 0.8)",
                          fontSize: "0.9vw",
                        }}
                      >
                        {item.activityDesc}
                      </span>
                      <hr />
                    </div>
                  );
                }
              })
            )}
          </>
        )}
      </div>
      <div style={{ height: "5%", marginTop: "2%" }}>
        {__getPaginationView()}
      </div>
    </main>
  );
};

export default Activity;
