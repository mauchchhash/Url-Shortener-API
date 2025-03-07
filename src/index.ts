import app from "./createApp";

const PORT = process?.env?.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
