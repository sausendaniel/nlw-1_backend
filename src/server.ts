import express from "express";

const app = express();

const jsonReturn = {
  name: {
    first: "Daniel",
    last: "Sausen"
  },
  age: 21,
  company: "T-Systems do Brasil"
}

app.get("/users", (req, res) => {
  res.jsonp(jsonReturn)
});

app.listen(3000, () => console.log("Serving on port 3000."));
