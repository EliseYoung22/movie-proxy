const express = require('express');
const request = require('request');
const _ = require('lodash');
require('dotenv').config()


const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/movies', async (req, res) => {
  const titles = await new Promise((resolve, reject) => {
    request({ url: `https://tastedive.com/api/similar?q=frozen%2Cthe+greatest+showman&k=${process.env.TESTDIVE_KEY}&type=movies&limit=5` },
    async (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      const r = JSON.parse(body)
      const titlesOnly = r.Similar.Results.map(i => i.Name)
      resolve(titlesOnly)
    })
  })
  res.json(titles);
});

app.get('/movie-detail', async (req, res) => {
  const urlString = `http://www.omdbapi.com/?apikey=${process.env.OMBD_KEY}&t=` + req.query.title;
  request({url: urlString}, async (error, response, body) => {
    res.json(JSON.parse(body))
    return
  })

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// app.get('/movies', async (req, res) => {
//   const titles = await new Promise((resolve, reject) => {
//     request({ url: 'https://tastedive.com/api/similar?q=frozen%2Cthe+greatest+showman&k=398040-MovieMat-VV6PFEJQ&type=movies&limit=5' },
//     async (error, response, body) => {
//       if (error || response.statusCode !== 200) {
//         return res.status(500).json({ type: 'error', message: err.message });
//       }
//       const r = JSON.parse(body)
//       console.log(typeof r.Similar.Results)
//       // resolve(JSON.parse(body))
//       resolve(JSON.parse(body))
//     })
//   })
//   const newArr = titles.Similar.Results.map(async (item) => {
//     // Replace the spaces in movie names with '+' to work in the query for the OMDB API
//     const urlString = 'http://www.omdbapi.com/?apikey=4660e01d&t=' + item.Name.split(' ').join('+');
//     // Call the OMDB API to get the poster
//     const image = await getImage(urlString);
//     item.poster = image;
//     return Promise.all([item]);
//   });
//   const results = await Promise.all(newArr);
//   console.log(_.flatten(results))
//   let arr = [];
//   _.flatten(results).map((i) => {
//     arr.push(i)
//   })
//   console.log(arr, typeof arr)
//   res.json(_.flatten(results));
// });