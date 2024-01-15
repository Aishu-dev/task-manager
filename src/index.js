const express = require('express');
require("./db/mongoose");
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('Get sequest is disabled');
//     }else{
//         next();
//     }
//     console.log(req.method, req.path);

// });

// app.use((req, res, next) => {
//     res.status(503).send('Site is under maintenance mode!');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up and running on port', port);
});