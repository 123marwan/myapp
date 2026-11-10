const { loadEnv } = require("./src/infrastructure/config/env");
const { connectDatabase } = require("./src/infrastructure/database/mongoose");
const { createApp } = require("./src/main/app");

async function bootstrap() {
  try {
    const config = loadEnv();
    await connectDatabase(config.mongoUri);

    const app = createApp(config);
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

bootstrap();