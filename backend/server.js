const { getEnv } = require("./src/config/env");
const { connectDatabase } = require("./src/config/db");
const { createApp } = require("./src/app");

async function bootstrap() {
  try {
    const config = getEnv();
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