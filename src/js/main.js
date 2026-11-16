import "../scss/main.scss";

//Get the dashboard data from "/public/data.json"
const fetchData = async () => {
  try {
    const response = await fetch("/data.json");

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};

//Get activity cards
const activityCards = document.querySelectorAll(".activity-card");

//Get the timeframe buttons
const timeframeButtons = document.querySelectorAll(".time-frame-btn");

// previous period descriptions
const previousPeriodLabels = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

//Render activity data
const renderDashboard = (data, timeframe) => {
  activityCards.forEach((card) => {
    //get the activity name from the HTML
    const activityName = card.dataset.activity;

    //Find matching activity in the JSON data
    const activity = data.find((item) => item.title === activityName);

    if (!activity) return;

    //Get the current and previous hours
    const { current, previous } = activity.timeframes[timeframe];

    //Update the HTML elements
    card.querySelector(".activity-card__hours").textContent = `${current}hrs`;
    card.querySelector(".activity-card__previous").textContent =
      `${previousPeriodLabels[timeframe]} - ${previous}hrs`;
  });
};

//handle timeframe button clicks
const handleTimeframeChange = (data) => {
  timeframeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      //get the selected timeframe
      const selectedTimeframe = button.dataset.timeframe;

      //update the active button
      timeframeButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      //render dashboard with selected timeframe
      renderDashboard(data, selectedTimeframe);
    });
  });
};

//Initialize the dashboard
const initDashboard = async () => {
  const data = await fetchData();

  if (!data) return;

  // display weekly data by default
  renderDashboard(data, "weekly");

  //enable timeframe button interactions
  handleTimeframeChange(data);
};

initDashboard();
