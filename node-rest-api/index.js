const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./database');
const swaggerUi = require('swagger-ui-express');  
const swaggerSpec = require('./swagger'); 

const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todolist');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true  
}));


connectDB(); 


app.use('/api/user', userRoutes);
app.use('/api/todos', todoRoutes);


app.use("/todolist/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Todo List Management API",  
}));

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
