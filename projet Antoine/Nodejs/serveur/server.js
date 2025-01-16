import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import debug from 'debug'; // variable d'environnement : DEBUG=*,-express:*   -> - pour exclure tout ce qui commence par express
import db from './database';
import './src/auth/auth';
import AuthRouter from './src/auth/auth.router';
import DashboardRouter from './src/dashboard/dashboard.router';
import UserRouter from './src/user/user.router';
import SchoolRouter from './src/school/school.router';

const log = debug('server');

db.connect(function () {
    const app = express();
    app.set('port', process.env.PORT || 3000);
    app.set('host', process.env.HOST || 'localhost');
    app.use(helmet());
    app.use(compression());
    app.use(cors({
        "origin": [/localhost:808[0-9]$/],
        "methods": "GET,POST,PUT,DELETE,HEAD,PATCH,OPTIONS",
        "allowedHeaders": 'X-Requested-With,Origin,Content-Type,Accept,Authorization',
        "credentials": false
    }));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        req.data = {};
        next();
    });

    app.use('/auth', AuthRouter);
    app.use('/api/dashboard', DashboardRouter);
    app.use('/api/users', UserRouter);
    app.use('/api/schools', SchoolRouter);

    app.use(express.static(__dirname + '/public'));

    app.use(function (req, res, next) {
        next(404);
    });

    app.use(function logErrors(err, req, res, next) {
        debug(err);
        next(err)
    });

    app.use(function (err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        let message = null;
        let errors = [];
        let status = 500;

        switch (typeof err) {
            case "string":
                message = err;
                break;
            case "number":
                status = err;
                break;
            case "object":
                message = err.message || err.msg || message;
                errors = (err.errors && err.errors instanceof Array ? err.errors : (err.error ? [err.error] : errors));
                status = err.status || status;
                break;
        }

        if (!message && !errors.length) {
            res.sendStatus(status);
        } else {
            res.status(status);
            res.format({
                'text/plain': function () {
                    res.send(message + (message && errors.length ? ' - ' : '') + errors.join(' - '));
                },
                'text/html': function () {
                    res.send(`<!doctype><html><head><title>${message}</title></head><body><p>${message}</p><p>${errors.join('<br>')}</p></body></html>`); // TODO
                },
                'application/json': function () {
                    const o = {};
                    if (message) {
                        o.message = message;
                    }
                    if (errors.length) {
                        o.errors = errors;
                    }
                    res.json(o);
                },
                'default': function () {
                    res.sendStatus(406);
                }
            });
        }
    });

    app.listen(app.get('port'), app.get('host'), function () {
        log(`Server listening on port : ${app.get('port')}.`);
    });
});
