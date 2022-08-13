/* eslint-disable no-unused-vars */
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const { jobModel, companyModel } = require("../script/dbSchemaModel");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const express = require("express");

const app = express();
AdminBro.registerAdapter(AdminBroMongoose);

const run = async () => {
  const connection = await mongoose.connect("mongodb://localhost:27017/myDB", {
    useNewUrlParser: true,
  });
  const adminBro = new AdminBro({
    databases: [connection],
    resources: [
      {
        resource: companyModel,
        options: {
          listProperties: ["companyName", "logo", "industry"],
          name: "Company Details",
          properties: {
            about: { type: "richtext" },
          },
        },
      },
      {
        resource: jobModel,
        options: {
          listProperties: [
            "jobTitle",
            "industry",
            "companyName",
            "location",
            "vacancy",
          ],
          name: "Company Details",
        },
      },
    ],
    rootPath: "/admin",
    branding: {
      // logo: "https://i.pinimg.com/474x/f7/99/20/f79920f4cb34986684e29df42ec0cebe.jpg",
      companyName: "MyCareerExplorer",
    },
  });

  const ADMIN = {
    email: "admin@example.com",
    password: "admin123",
  };
  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: "admin-bro",
    cookiePassword: "my-secret-password-for-my-application",
    authenticate: async (email, password) => {
      if (email === ADMIN.email && password === ADMIN.password) {
        return ADMIN;
      } else {
        return null;
      }
    },
  });
  app.use(adminBro.options.rootPath, router);
  app.listen(8080, () => console.log("AdminBro is under localhost:8080/admin"));
};

run();
