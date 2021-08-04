require('dotenv').config({ path: './config/.env' });
const express = require('express');
const invoiceRouter = require('./routes/invoice');
const userRouter = require('./routes/user');
const User = require('./models/user');
const { logger } = require("./logger/logger");
const app = express();
require('./db/mongoose');
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRouter);
app.use('/api/invoice', invoiceRouter);

logger.log('info', '**** server started ****')
User.initialCheck().then(() => {
    app.listen(port, () => {
        logger.log('info', `Server is Listening on port ${port}`)
        console.log(`Server is Listening on port ${port}`);
    });
});
