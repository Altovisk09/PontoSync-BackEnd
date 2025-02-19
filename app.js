        const express = require("express");
        const cookieParser = require("cookie-parser");
        const dotenv = require("dotenv");
        const jwt = require("jsonwebtoken");
        const logger = require("morgan");
        const initializeFirebase = require("./src/config/firebase/config");
        const cors = require('cors');
        
        const app = express();

        dotenv.config();
        initializeFirebase();

        const corsOptions = {
            origin: ['http://localhost:5173', 'https://pontosync.vercel.app'],
            credentials: true,
        };
        
        
        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());
        app.use(logger("combined"));
        app.use(cors(corsOptions));

        const authRoutes = require('./src/routes/authRoutes');
        const userRoutes = require('./src/routes/userRoutes');
        const employeeRoutes = require('./src/routes/employeeRoutes');
        // const reportRoutes = require('./src/routes/reportRoutes');
        const agencyRoutes = require('./src/routes/agencyRoutes');

        app.use('/', authRoutes);
        app.use('/api/user', userRoutes);
        app.use('/api/employees', employeeRoutes);
        // app.use('/api/reports', reportRoutes);
        app.use('/api/agencies', agencyRoutes);

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

