Functionality
- View all urls
- View a url
- Add a url
- Remove a url
- Edit/Update a url

Data Structure
  Use Object, ie. 
  { "shortURL_A": "www.longurla.com",
    "shortURL_B": "www.longurlb.com", }

Actions
- showAllURLS = (urls) => { return urls }
- showOneURL = (urls, key) => { return urls[key] }
- addOneURL = (urls, newURL) => { const newKey = Math.floor(Math.random() * 30) 
                                  urls[newKey] = newURL }
- editURL = (urls, key, newURL) => { urls[key] = newURL }
- removeURL = (urls, key) => { delete url[key] }

Events CRUD
- Create => POST => addOneURL
- Read => GET => showOneURL or showAllURLS
- Update => PUT => editURL
- Delete => DELETE => removeURL

Routes & Events
- GET/urls => showAllURLS (Read)
- GET/urls/:url_id => showOneURL (Read)
- POST/urls => addOneURL (Create)
- POST/urls/:url_id/update => editURL (Update) This route needs the url id and  a string with the new url value
- POST/urls/:url_id/delete => removeURL (Delete)


// create actions (may use later when implement more complex assignments)

// const showAllURLS = (urls) => {
//   return urls;
// };

// const showOneURL = (urls, key) => {
//   if(urls[key]) {
//     return urls[key];
//   } else {
//     return null;
//   }
// };

// const addOneURL = (urls, newURL) => {
//   urls[newKey()] = newURL;
// }

// const removeURL = (urls, key) => {
//   delete url[key];
// };

// const editURL = (urls, key, newURL) => {
//   urls[key] = newURL;
// };


// For checking the contents as JSON object
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/urlDB', (req, res) => {
  res.json(urlDatabase);
});

app.get('/SpecificDB', (req, res) => {
  res.json(urlsForUser(req.session.user_id, urlDatabase));
});