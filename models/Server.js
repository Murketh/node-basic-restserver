const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { databaseConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      uploads: "/api/uploads",
    };

    // Database connection
    this.connectDatabase();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDatabase() {
    await databaseConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Read and parse of body
    this.app.use(express.json());

    // Public directory
    this.app.use(express.static("public"));

    // Upload files
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.users, require("../routes/users"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log(`Server running on PORT ${this.PORT}`);
    });
  }
}

module.exports = Server;
