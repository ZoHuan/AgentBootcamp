export function getWeather(args: { city: string }) {
  return {
    city: args.city,
    temp: 28,
    condition: "晴天",
    humidity: "45%",
  };
}
