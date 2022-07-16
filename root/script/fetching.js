import fetch from "node-fetch";

// eslint-disable-next-line require-jsdoc
function getData() {
  fetch("http://localhost:3000/industry")
    .then((response) => response.json())
    .then((data) => console.log(data));
}

getData();
