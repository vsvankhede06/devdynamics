import React, { useState, useEffect } from "react";
// import "./ActivityDashboard.css"; // Create a CSS file for styling

const ActivityDashboard = () => {
  const [userActivity, setUserActivity] = useState(null);

  useEffect(() => {
    fetch("https://run.mocky.io/v3/4e2457c2-f470-4486-8bfc-eacd5fb1f4d3")
      .then((response) => response.json())
      .then((json) => {
        console.log("Fetched data:", json);
        setUserActivity(json.data.AuthorWorklog);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const calculateSummaryStatistics = (user) => {
    const total = user.totalActivity.reduce(
      (sum, activity) => sum + activity.value,
      0,
    );
    const avgDaily = total / user.dayWiseActivity.length;
    return { total, avgDaily };
  };

  return (
    <div>
      <h1>User Activity</h1>
      <div className="card-container">
        {userActivity?.rows.map((user) => {
          const { total, avgDaily } = calculateSummaryStatistics(user);
          return (
            <div key={user.name} className="card-inner">
              <h2>{user.name}</h2>
              <div>
                <h3>Summary Statistics</h3>
                <p>Total Activity: {total}</p>
                <p>Average Daily Activity: {avgDaily.toFixed(2)}</p>

                <h3>Total Activity</h3>
                <ul>
                  {user.totalActivity.map((activity) => (
                    <li
                      key={activity.name}
                      style={{
                        color: userActivity.activityMeta.find(
                          (meta) => meta.label === activity.name,
                        )?.fillColor,
                      }}
                    >
                      <div
                        className="bar"
                        style={{
                          width: `${activity.value * 2}px`,
                          backgroundColor: userActivity.activityMeta.find(
                            (meta) => meta.label === activity.name,
                          )?.fillColor,
                        }}
                      ></div>
                      {activity.name}: {activity.value}
                    </li>
                  ))}
                </ul>

                <h3>Day-wise Activity</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.dayWiseActivity.map((day) => (
                      <React.Fragment key={day.date}>
                        <tr>
                          <td rowSpan={day.items.children.length}>
                            {day.date}
                          </td>
                          <td>{day.items.children[0].label}</td>
                          <td>{day.items.children[0].count}</td>
                        </tr>
                        {day.items.children.slice(1).map((item) => (
                          <tr key={item.label}>
                            <td>{item.label}</td>
                            <td>{item.count}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityDashboard;
