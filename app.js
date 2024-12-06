const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;


// Middleware json parse
app.use(express.json());

// Endpoint convert currency
app.post("/convert", async (req, res) => {
  const { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Please provide 'from', 'to', and 'amount'" });
  }

  try {
    const response = await axios.get(`${process.env.BASE_URL}/convert?access_key=${process.env.ACCESS_KEY}`, {
      params: { from, to, amount },
    });

    if (response.data && response.data.result !== undefined) {
      return res.json({
        from,
        to,
        amount,
        result: response.data.result,
        rate: response.data.info.rate,
      });
    }

    res.status(500).json({ error: "Failed to fetch conversion data." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error occured while fetching data." });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to Currency Converter API!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});