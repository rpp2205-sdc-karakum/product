import { check, sleep } from "k6";
import http from "k6/http";

const API_URL = "http://localhost:3000";


// hit the api with the target number of requests over the duration
export let options = {
  stages: [
    { target: 1, duration: "1s" },
    { target: 10, duration: "1s" },
    { target: 100, duration: "1s" },
    { target: 1000, duration: "30s" }
  ]
};

export default function() {

  let response = http.get(`${API_URL}/products/1`);

  check(response, {
    "status was 200": r => r.status == 200
  });

  sleep(1);
}