import React, { useEffect, useContext, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Button from "./Button";
import unknownPerson from "../assets/images/unknownPerson.png";
import axios from "../axiosConfig";
import NavbarItems from "./NavbarItems";
import DepartmentContext from "../context/DepartmentContext";
import LoggedInContext from "../context/LoggedInContext";

const Header = () => {
  const { pathname } = useLocation();
  const { setSelectedDepartment } = useContext(DepartmentContext);
  const { LoggedIn, setLoggedIn } = useContext(LoggedInContext);
  const [username, setUsername] = useState("My Profile");
  const [logoutTriggered, setLogoutTriggered] = useState(false);

  useEffect(() => {
    axios
      .get(axios.defaults.baseURL + "/api/auth/authMiddleware")
      .then((response) => {
        if (response.status === 200) {
          setLoggedIn(true);
          setUsername(response.data.firstName + " " + response.data.lastName);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, [pathname, logoutTriggered]);

  const handleLogout = () => {
    axios
      .post(axios.defaults.baseURL + "/api/auth/logout")
      .then((response) => {
        if (response.status === 200) {
          setLogoutTriggered(true);
        }
      })
      .catch(() => {
        setLogoutTriggered(false);
      });
  };

  const handleSelectChange = (event) => {
    if (event.target.value === "logout") {
      handleLogout();
    }
  };

  const handleSelect = (value) => {
    setSelectedDepartment(value);
    console.log("Selected Department:", value);
  };

  return (
    <header className="h-[10vh] overflow-hidden drop-shadow-sm w-screen shadow-lg bg-[#263237]  flex items-center z-50 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
      <div className="p-5 flex justify-between w-full items-center">
        <Link to="/home">
          <div className=" text-2xl font-bold text-[#1db8cd]">
            ExamPrep Central
          </div>
        </Link>
        {(pathname === "/studyMaterials" ||
          pathname === "/previousYearQuestions") && (
          <NavbarItems onSelect={handleSelect} />
        )}
        {LoggedIn ? (
          <div className="relative flex gap-2 items-center">
            {/* Username clickable area */}
            <div className="hover:underline cursor-pointer text-[#1db8cd]">
              <select
                onChange={handleSelectChange}
                className="bg-transparent text-[#1db8cd] cursor-pointer appearance-none "
              >
                <option value="default" hidden>
                  {username}
                </option>
                <option value="logout">Logout</option>
              </select>
            </div>

            {/* Profile picture clickable area */}
            <div className="h-[8vh] aspect-square border-2 border-[#808080] rounded-full">
              <img
                src={unknownPerson}
                alt="Profile"
                className="w-full cursor-pointer"
              />
              <select
                onChange={handleSelectChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              >
                <option value="default" hidden>
                  {username}
                </option>
                <option value="logout">Logout</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login">
              <Button
                name="Login"
                type={pathname === "/login" ? "primary" : "secondary"}
              />
            </Link>
            <Link to="/signup">
              <Button
                name="Sign up"
                type={pathname === "/signup" ? "primary" : "secondary"}
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
