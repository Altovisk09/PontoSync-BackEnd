const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const logger = require("morgan");
const initializeFirebase = require("./src/config/firebase/config")
const app = express();

dotenv.config();
initializeFirebase()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logger("combined"));

const userRoute = require('./src/routes/userRouter');

app.use('/users', userRoute);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
const PORT = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);

app.listen(PORT, () => {
    console.log(`Servidor aberto na porta: ${PORT}`);
});

