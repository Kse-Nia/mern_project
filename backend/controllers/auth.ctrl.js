import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Veillez remplir tous les champs" });
  } else if (!email.match(emailRegex)) {
    return res.status(400).json({ error: "Email invalide" });
  } else if (password.length < 6) {
    return res.status(400).json({
      error: "Mot de passe trop court, il doit faire au moins 5 caractères",
    });
  }
  const imageFolder = path.join(__dirname, "..", "images"); // Image folder
  const images = fs.readdirSync(imageFolder);
  const avatar = images[Math.floor(Math.random() * images.length)]; // Random user avatar
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        avatar: avatar,
        password: hashedPassword,
      },
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ error: "Compte introuvable" });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ error: "Mauvais mot de passe" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Compte introuvable" });
  } else if (id !== req.user.id || req.user.role !== "admin") {
    return res.status(400).json({
      error: "Vous n'avez pas les droits utilisateurs pour supprimer ce compte",
    });
  } else {
    try {
      const user = await prisma.user.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
