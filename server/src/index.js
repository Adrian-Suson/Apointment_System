import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "./config/initializeDb.js";
import config from "./config/api.js";
import adminRoutes from "./routes/adminRoutes.js";
import appointmentsRoutes from "./routes/appointmentsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import schedulesRoutes from "./routes/scheduleRoutes.js";
import doctorSpecialtiesRoutes from "./routes/doctorSpecialtiesRoutes.js";
import purposesRoutes from "./routes/purposesRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import childRoutes from "./routes/child_infoRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js"
import prenatalInfoRoutes from "./routes/prenatal_infoRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors(config.corsOptions));
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "frame-ancestors": ["'self'", `${config.API}`],
      "default-src": ["'self'", `${config.API}`],
      "img-src": ["'self'", "data:", "blob:"],
      "media-src": ["'self'", "data:", "blob:"],
      "object-src": ["'none'"],
    },
  })
);

// Route Middleware
app.use("/", adminRoutes);
app.use("/", appointmentsRoutes);
app.use("/", usersRoutes);
app.use("/", doctorRoutes);
app.use("/", schedulesRoutes);
app.use("/", doctorSpecialtiesRoutes);
app.use("/", purposesRoutes);
app.use("/", queueRoutes);
app.use("/", childRoutes);
app.use("/", announcementRoutes);
app.use("/", prenatalInfoRoutes);

app.use(
  "/profile_pictures",
  express.static(path.join(__dirname, "..", "assets"))
);

// Error Handling Middleware (Optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred." });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
