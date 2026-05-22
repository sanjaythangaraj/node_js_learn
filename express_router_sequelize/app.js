const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
}); 