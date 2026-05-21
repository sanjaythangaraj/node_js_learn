const express = require('express');
const app = express();
const userRoutes = require('./routes/users');


app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
}); 