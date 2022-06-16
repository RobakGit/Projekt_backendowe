import express from "express";
import { PrismaClient } from "@prisma/client";
import pdf from "pdf-creator-node";
import fs from "fs";

const prisma = new PrismaClient();
const app = express();

var template = fs.readFileSync("template.html", "utf8");

var options = {
  format: "A4",
  orientation: "portrait",
  border: "10mm",
};

var document = {
  html: template,
  data: {
    user: {},
    data: {},
  },
  path: "./bills/",
  type: "stream",
};

app.get("/generate/:id", async (req, res, next) => {
  const { id } = req.params;
  const payment = await prisma.payments.findMany({ where: { uid: id }, select: { uid: true, amount: true, user: true, updatedAt: true } });
  const access = await prisma.access.findMany({ where: { payments: { uid: id } } });
  console.log(payment[0].updatedAt.toISOString());
  console.log(access);

  document.data.user = { name: payment[0].user.firstName, surrname: payment[0].user.lastName };
  document.data.data = {
    netto: payment[0].amount * 0.77,
    brutto: payment[0].amount,
    paymentDate: payment[0].updatedAt.toISOString().slice(0, 10),
    vat: payment[0].amount * 0.23,
    accessStart: access[0].createdAt.toISOString().slice(0, 10),
    accessEnd: access[0].endedAt.toISOString().slice(0, 10),
  };
  document.path += `${id}.pdf`;

  pdf
    .create(document, options)
    .then(result => {
      result.pipe(res);
    })
    .catch(error => {
      res.status(500);
      res.send("Something went wrong");
    });
});

const server = app.listen(3002);
