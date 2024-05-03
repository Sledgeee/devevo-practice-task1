/** @format */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
  env: {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  },
};
