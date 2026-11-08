import app from './src/app.js';
import { config } from './src/config/config.js';
import { connectDB } from './src/config/database.js';

await connectDB();

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});
