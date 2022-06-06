const setDashboardData = (data) => {
  return {
    type: "SET_DASHBOARD_DATA",
    payload: data,
  };
};

const exportDefault = {
  setDashboardData,
};

export default exportDefault;
