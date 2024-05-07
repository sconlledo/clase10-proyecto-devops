import express from "express";
import fs from 'fs';

import { dividir, multiplicar, restar, sumar } from "./calcular.js";

const app = express();

const ambiente = process.env.AMBIENTE || "desconocido";
const apiKey = process.env.API_KEY || '';

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hola mundo");
});

app.post("/calcular", (req, res) => {
  const operacion = req.body;
  if (operacion.operacion === "add") {
    return res.send({ resultado: sumar(operacion.num1, operacion.num2) });
  } else if (operacion.operacion === "min") {
    return res.send({ resultado: restar(operacion.num1, operacion.num2) });
  } else if (operacion.operacion === "div") {
    return res.send({ resultado: dividir(operacion.num1, operacion.num2) });
  } else if (operacion.operacion === "mul") {
    return res.send({ resultado: multiplicar(operacion.num1, operacion.num2) });
  }
  return res.send({ resultado: "hola mundo" });
});

app.get("/info", (req, res) => {
  res.send(`El ambiente actual es: ${ambiente}`);
});


app.get("/api", (req, res) => {
  const miVariable = fs.readFileSync(apiKey, 'utf8');
  res.send(`El apiKey es: ${miVariable}`);
});

export default app;