import connectDB from "./config/db";
import app from "./app";

const PORT=3000;

const startserver=async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};
startserver();
export default app;
console.log("MONGO_URI FROM ENV:");
console.log(process.env.MONGO_URI);

