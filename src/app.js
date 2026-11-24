// App: crea Express y registra middlewares globales y routers (no se conecta a la base ni escucha un puerto).
import express from 'express';
import sessionsRouter from "./routes/sessions.router.js";
import eventsRouter from "./routes/events.router.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
// cookie-parser lee el header Cookie y lo convierte en el objeto req.cookies (sin él, req.cookies es undefined)
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).send('Health check passed!');
});

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

// este endpoint nos va a servir para gestionar actualizaciones de 
// usuarios
// app.use("/api/users", usersRouter);

export default app;