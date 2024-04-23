import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useFetch from "../../customHooks/useFetch";
import Edit from "../edit/edit";
import Pagination from "../pagination/pagination";
import Table from "../table/table";
import { useSnackbar } from "notistack";
import userimg from "../.././media/user-gear.3f58436e0da6510255f1.png";
import background from "../.././media/bg.61dd12a2f4a162384f58.jpg";

import { $ } from "react-jquery-plugin";

import "./home.css";
import Search from "../search/search";

const Home = () => {
  const [data] = useFetch();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [backupUsers, setBackupUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState([]);
  const [userToBeUpdated, setUserToBeUpdated] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (msg, variant) => {
    enqueueSnackbar(msg, {
      variant: variant,
      snackbarprops: 'data-role="alert"',
    });
  };

  const Logic = (currentPage) => {
    setCurrentPage(currentPage);
    let record = currentPage * 10;
    let limit = (currentPage + 1) * 10;
    const sliced = allUsers.slice(record, limit);
    setUsers([...sliced]);
  };

  const generateRange = () => {
    let arr = [];
    let limit = Math.ceil(allUsers.length / 10);
    for (let i = 1; i <= limit; i++) arr.push(i);
    setRange([...arr]);
  };

  const RemoveAllSelected = (data) => {
    const arr = allUsers.filter((user) => {
      return !data.includes(user.id);
    });
    setAllUsers([...arr]);
    showSnackbar("Records Deleted Successfully", "success");
  };

  const RemoveSelected = (id) => {
    const arr = allUsers.filter((user) => {
      return user.id !== id;
    });
    setAllUsers([...arr]);
    showSnackbar("Record Deleted Successfully", "success");
  };

  const UpdatePage = (toggleType) => {
    if (toggleType === "INCREMENT" && currentPage !== pageLimit - 1) {
      setCurrentPage(currentPage + 1);
    } else if (toggleType === "Home") setCurrentPage(0);
    else if (toggleType === "Last") setCurrentPage(pageLimit - 1);
    else {
      if (currentPage !== 0) setCurrentPage(currentPage - 1);
    }
  };

  const addFormatdata = (id) => {
    setUserToBeUpdated(id);
    $("#editModal").modal("show");
  };

  const updateUserData = (id, name, email, role) => {
    const arr = allUsers.map((user) => {
      if (user.id === id) {
        user.name = name;
        user.email = email;
        user.role = role;
      }
      return user;
    });
    setAllUsers([...arr]);
    setBackupUsers([...arr]);

    $("#editModal").modal("hide");
    showSnackbar("Record Updated Successfully", "success");
  };

  const getResponse = (data) => {
    if (data.trim().length === 0) {
      setAllUsers([...backupUsers]);
    } else {
      const regex = new RegExp(data, "i"); // Use "i" flag for case-insensitive matching
      let arr = allUsers.filter((user) => {
        return (
          user.name.toLowerCase().match(regex) ||
          user.email.toLowerCase().match(regex) ||
          user.role.toLowerCase().match(regex)
        );
      });
      setAllUsers([...arr]);
    }
  };

  useEffect(() => {
    setAllUsers([...data]);
    setBackupUsers([...data]);
    Logic(currentPage);
    let limit = Math.ceil(allUsers.length / 10);
    setPageLimit(limit);
    generateRange();
    setLoading(false);
  }, [data, currentPage]);

  useEffect(() => {
    Logic(currentPage);
    let limit = Math.ceil(allUsers.length / 10);
    setPageLimit(limit);
    generateRange();
    setLoading(false);
  }, [allUsers, currentPage]);

  return (
    <>
       <div>
        <nav className="navbar theme navbar-dark">
          <div className="container-fluid header">
            <button className="navbar-brand heading" onClick={() => window.location.reload()}>
              {/* Replace the <a> tag with a <button> */}
              <span>
                <img src={userimg} alt="User Gear" />
              </span>
              Admin UI
            </button>
          </div>
        </nav>
      </div>
      <div
        className="container mt-5  body "
        style={{ backgroundImage: `url(${background})` }}
      >
        {!loading && <Search getResponse={getResponse} />}

        {!loading && allUsers.length === 0 && (
          <div id="no_data">
            <h5 className="text-center">
              No data found
              <span>
                <i className="fa-regular fa-face-sad-tear"></i>
              </span>
            </h5>
          </div>
        )}

        {!loading && allUsers.length > 0 && (
          <div>
            <Table
              users={users}
              RemoveAllSelected={RemoveAllSelected}
              RemoveSelected={RemoveSelected}
              addFormatdata={addFormatdata}
            />

            <Pagination
              currentPage={currentPage}
              range={range}
              Logic={Logic}
              pageLimit={pageLimit}
              UpdatePage={UpdatePage}
            />
          </div>
        )}
        {createPortal(
          <Edit id={userToBeUpdated} updateUserData={updateUserData} />,
          document.getElementById("edit-portal")
        )}
      </div>
    </>
  );
};

export default Home;
