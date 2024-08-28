import "./style.css";

function fetchResults() {
  return fetch(
    "https://core.xterraplanet.com/api/application-task/cee4389b-1668-4e39-b500-3572f0982b09"
  );
}

const wrapper = document.querySelector("#table-body");

fetchResults().then((resp) => {
  resp.json().then((data) => {
    data.forEach((result) => {
      const row = document.createElement("tr");
      row.innerHTML = `
<td>${result.first_name}</td>
<td>${result.last_name}</td>
<td>${result.gender}</td>
<td>${result.division}</td>
<td>${result.nationality}</td>
<td>${result.total_time}</td>
      `;
      wrapper.appendChild(row);
    });
  });
});
