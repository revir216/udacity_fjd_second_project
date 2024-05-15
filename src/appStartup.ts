import app from "./server";

const port = 3000;
app.listen(port, (): void => {
  console.log(`Server is running: http://localhost:${port}`);
});
