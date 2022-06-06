import "./sidebar.css";
import { userDiv } from "../topnav/TopNav";
import { Link } from "react-router-dom";
import list from "./Sidebar_Items";
import logo from "../../assets/images/logo.png";
import mobile_logo from "../../assets/images/logo_trail.png";

const Sidebar = (props) => {
  let sidebar = document.querySelector(".sidebar");
  let sidebar_wrapper = document.querySelector(".sidebar_wrapper");
  let sidebar_list = [];
  let role = localStorage.getItem("role");

  if (role === "Admin") {
    sidebar_list = list.Admin;
  }
  if (role === "DISP") {
    sidebar_list = list.Admin;
  }
  if (role === "DM") {
    sidebar_list = list.Admin;
  }
  if (role === "D") {
    sidebar_list = list.Admin;
  }
  if (role === "TL") {
    sidebar_list = list.Admin;
  }
  if (role === "DO") {
    sidebar_list = list.Admin;
  }
  if (role === "CO") {
    sidebar_list = list.Admin;
  }

  const manage_wrapper = () => {
    if (!sidebar.classList.contains("close"))
      sidebar_wrapper.classList.remove("display_none");
    else sidebar_wrapper.classList.add("display_none");
  };
  const SideBarToggle = () => {
    let arrow = document.querySelectorAll(".arrow");

    for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
      });
    }
    sidebar.classList.toggle("close");
    manage_wrapper();
  };

  const SideBarClose = () => {
    SideBarToggle();
    manage_wrapper();
  };

  const sideBarItems = (items, key) => {
    return (
      <li key={key}>
        <div className="iocn-link">
          <Link to={`${items.url}`}>
            <i className={`bx ${items.icon}`}></i>

            <span className="link_name">{items.menu_name}</span>
          </Link>

          {items.sub_menu && <i className="bx bxs-chevron-down arrow"></i>}
        </div>

        {items.menu_name != null && (
          <ul className="sub-menu">
            <li>
              <div className="link_name">
                <Link to={"#"}>{items.menu_name}</Link>
              </div>
            </li>

            {items.sub_menu &&
              items.sub_menu.map((sub_item, i) => (
                <li key={i}>
                  <Link to={`${sub_item.url}`}>{sub_item.name}</Link>
                </li>
              ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div className="sidebar_wrapper display_none" onClick={SideBarClose} />
      <div className="sidebar close">
        <div className="logo-details">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <span className="logo_name">METRO TMS</span>
        </div>
        <div onClick={SideBarToggle} className="hamburgerMenu">
          <img
            src="images/hamburger_icon.png"
            className="bx bx-menu"
            alt=""
          ></img>
        </div>
        <ul className="nav-links">
          {sidebar_list.map((item, i) => sideBarItems(item, i))}
        </ul>
      </div>

      <div className="mobile-topnav">
        <img
          src="images/hamburger_icon.png"
          alt=""
          className="hiddenBuger-img"
          onClick={SideBarToggle}
        />
        <img
          src={mobile_logo}
          alt="mobile_logo"
          className="mobile-topnav-logo"
        />
        <div className="hiddenBurger-user">{userDiv()}</div>
      </div>
    </>
  );
};

export default Sidebar;
