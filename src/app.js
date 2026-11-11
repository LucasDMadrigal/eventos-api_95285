import express from 'express';
import sessionsRouter from "./routes/sessions.router.js";
import eventsRouter from "./routes/events.router.js";

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).send('Health check passed!');
});

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

// este endpoint nos va a servir para gestionar actualizaciones de 
// usuarios
// app.use("/api/users", usersRouter);

export default app;