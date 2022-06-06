// Syntax for Menu List

// {
//     icon: "bx-{Here name of icon}",                                  Box Icon Search from - https://boxicons.com/cheatsheet
//     menu_name: "Menu Name",
//     url: "#####",
//     sub_menu: [{name: "Sub_menu_name" ,url: "###"}],
// }

let Sidebar_Items = {
  Admin: [
    {
      icon: "bxs-dashboard bx-sm",
      menu_name: "Dashboard",
      url: "/",
    },
    {
      icon: "bxs-package bx-sm",
      menu_name: "Loads",
      url: "/loadTable",
    },
    {
      icon: "bxs-navigation bx-sm",
      menu_name: "Dispatch",
      url: "/dispatchtable",
    },

    {
      icon: "bxs-id-card bx-sm",
      menu_name: "Address Book",
      url: "/AddressBook",
    },

    {
      icon: "bxs-truck bx-sm",
      menu_name: "Equipments",
      url: "/equipment",
    },
  ],
  CO: [
    {
      icon: "bx-grid-alt bx-sm",
      menu_name: "Dashboard",
      url: "/",
      sub_menu: [
        { name: "Dashboard 1" },
        { name: "Dashboard 2" },
        { name: "Dashboard 3" },
      ],
    },

    {
      icon: "bxs-box bx-sm",
      menu_name: "Loads",
      url: "/loadTable",
    },
    {
      icon: "bxs-truck bx-sm",
      menu_name: "Dispatch",
      url: "/dispatchtable",
    },
    {
      icon: "bx-user-circle bx-sm",
      menu_name: "Accounts",
      url: "#",
    },
    {
      icon: "bxs-message bx-sm",
      menu_name: "Email Log",
      url: "#",
    },
    {},
    {
      icon: "bxs-id-card bx-sm",
      menu_name: "Address Book",
      url: "/AddressBook",
    },
    {
      icon: "bxs-report bx-sm",
      menu_name: "Documentation",
      url: "#",
    },
    {
      icon: "bx-shape-circle bx-sm",
      menu_name: "Equipments",
      url: "/equipment",
    },
    {
      icon: "bxs-bar-chart-square bx-sm",
      menu_name: "Reports",
      url: "#",
    },
  ],
  DISP: [
    {
      icon: "bx-grid-alt bx-sm",
      menu_name: "Dashboard",
      url: "/",
      sub_menu: [
        { name: "Dashboard 1" },
        { name: "Dashboard 2" },
        { name: "Dashboard 3" },
      ],
    },
    {
      icon: "bxs-box bx-sm",
      menu_name: "Loads",
      url: "/loadTable",
    },
    {
      icon: "bxs-truck bx-sm",
      menu_name: "Dispatch",
      url: "/dispatchtable",
    },
    {
      icon: "bx-user-circle bx-sm",
      menu_name: "Accounts",
      url: "#",
    },
    {
      icon: "bxs-message bx-sm",
      menu_name: "Email Log",
      url: "#",
    },
    {},
    {
      icon: "bxs-id-card bx-sm",
      menu_name: "Address Book",
      url: "/AddressBook",
    },
    {
      icon: "bxs-report bx-sm",
      menu_name: "Documentation",
      url: "#",
    },
    {
      icon: "bx-shape-circle bx-sm",
      menu_name: "Equipments",
      url: "/equipment",
    },
    {
      icon: "bxs-bar-chart-square bx-sm",
      menu_name: "Reports",
      url: "#",
    },
  ],

  DM: [
    {
      icon: "bx-grid-alt bx-sm",
      menu_name: "Dashboard",
      url: "/",
      sub_menu: [
        { name: "Dashboard 1" },
        { name: "Dashboard 2" },
        { name: "Dashboard 3" },
      ],
    },
    {
      icon: "bxs-box bx-sm",
      menu_name: "Loads",
      url: "/loadTable",
    },
    {
      icon: "bxs-truck bx-sm",
      menu_name: "Dispatch",
      url: "/dispatchtable",
    },
    {
      icon: "bx-user-circle bx-sm",
      menu_name: "Accounts",
      url: "#",
    },
    {
      icon: "bxs-message bx-sm",
      menu_name: "Email Log",
      url: "#",
    },
    {},
    {
      icon: "bxs-id-card bx-sm",
      menu_name: "Address Book",
      url: "/AddressBook",
    },
    {
      icon: "bxs-report bx-sm",
      menu_name: "Documentation",
      url: "#",
    },
    {
      icon: "bx-shape-circle bx-sm",
      menu_name: "Equipments",
      url: "/equipment",
    },
    {
      icon: "bxs-bar-chart-square bx-sm",
      menu_name: "Reports",
      url: "#",
    },
  ],

  Driver: [
    {
      icon: "bx-grid-alt bx-sm",
      menu_name: "Driver",
      url: "/",
      sub_menu: [
        { name: "Driver 1" },
        { name: "Dashboard 2" },
        { name: "Dashboard 3" },
      ],
    },
  ],
};

export default Sidebar_Items;
