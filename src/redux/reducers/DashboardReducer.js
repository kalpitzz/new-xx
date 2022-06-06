const DashboardReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_DASHBOARD_DATA":
      return { ...state, dashboardData: action.payload };
    default:
      return state;
  }
};

export default DashboardReducer;
