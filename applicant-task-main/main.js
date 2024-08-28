import "./style.css";

// Step 2 - Time Validation [/]
function isValidTime(time) {
  // Only for checking of the value
  // const valid = /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/.test(time) &&
  //   time !== "00:00:00" &&
  //   time !== "23:59:59";
  // console.log(`Time: ${time}, IsValid: ${valid}`);

  return /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/.test(time) &&
    time !== "00:00:00" &&
    time !== "23:59:59";
}

// Step 2 - Total Time Sorting [/]
function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

// Step 3 - Get the fastest time [/]
function getFastestSplits(results) {
  const fastestSplits = {};

  results.forEach((result) => {
    result.splits.forEach((split) => {
      if (isValidTime(split.time)) {
        if (!fastestSplits[split.name] || timeToSeconds(split.time) < timeToSeconds(fastestSplits[split.name].time)) {
          fastestSplits[split.name] = {
            time: split.time,
            athlete: `${result.first_name} ${result.last_name}`,
          };
        }
      }
    });
  });

  // console.log(fastestSplits);

  // Just to show the overall fastest athlete (Extra information)
  const fastestTotal = results
    .filter(result => isValidTime(result.total_time))
    .reduce((fastest, current) =>
      !fastest || timeToSeconds(current.total_time) < timeToSeconds(fastest.total_time)
        ? current
        : fastest
      , null);

  if (fastestTotal) {
    fastestSplits['overall_total'] = {
      time: fastestTotal.total_time,
      athlete: `${fastestTotal.first_name} ${fastestTotal.last_name}`
    };
  }


  return fastestSplits;
}

// function fetchResults() {
//   return fetch(
//     "https://core.xterraplanet.com/api/application-task/cee4389b-1668-4e39-b500-3572f0982b09"
//   );
// }

// Step 1 - Try Catch [/]
function fetchResults() {
  return fetch("https://core.xterraplanet.com/api/application-task/cee4389b-1668-4e39-b500-3572f0982b09")
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      alert("Failed to fetch data: Please refresh");
      console.error(error);
    });
}


function renderResultsWithSplits(data) {
  const wrapper = document.querySelector("#table-body");
  wrapper.innerHTML = "";

  const fastestSplits = getFastestSplits(data);

  data
    .filter((result) => isValidTime(result.total_time))
    .sort((a, b) => timeToSeconds(a.total_time) - timeToSeconds(b.total_time))
    .forEach((result) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${result.first_name}</td>
        <td>${result.last_name}</td>
        <td>${result.gender}</td>
        <td>${result.division}</td>
        <td>${result.nationality}</td>
        <td>${result.total_time}</td>
      `;

      result.splits.forEach((split) => {
        if (fastestSplits[split.name]?.time === split.time) {
          row.innerHTML += `<td style="color: green; font-weight: bold;">${split.time} (Fastest)</td>`;
        } else {
          row.innerHTML += `<td>${split.time}</td>`;
        }
      });

      wrapper.appendChild(row);
    });
}

function renderFastestTimes(fastestSplits) {
  const wrapper = document.querySelector("#fastest-times-body");
  wrapper.innerHTML = "";

  const splits = ['swim_time', 'bike_time', 'run_time', 'overall_total'];
  splits.forEach(splitName => {
    if (fastestSplits[splitName]) {
      const split = fastestSplits[splitName];
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${splitName.replace('_', ' ').toUpperCase()}</td>
        <td>${split.time}</td>
        <td>${split.athlete}</td>
      `;
      wrapper.appendChild(row);
    }
  });
}

fetchResults().then((data) => {
  if (data) {
    renderResultsWithSplits(data);
    const fastestSplits = getFastestSplits(data);
    renderFastestTimes(fastestSplits);
  }
});

// const wrapper = document.querySelector("#table-body");

// fetchResults().then((resp) => {
//   resp.json().then((data) => {
//     data.forEach((result) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
// <td>${result.first_name}</td>
// <td>${result.last_name}</td>
// <td>${result.gender}</td>
// <td>${result.division}</td>
// <td>${result.nationality}</td>
// <td>${result.total_time}</td>
//       `;
//       wrapper.appendChild(row);
//     });
//   });
// });