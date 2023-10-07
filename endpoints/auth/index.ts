import express from "express";
import { db } from "../../data/db";
import { users } from "../../data/schema";
import jwt from "jsonwebtoken";

const auth = express.Router();

// auth.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!user) {
//       return res.status(400).json({
//         error: "issue signing in",
//       });
//     }

//     if (!valid) {
//       return res.status(400).json({
//         error: "issue signing in",
//       });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET as string);

//     return res.json({
//       email: user.email,
//       id: user.id,
//       token,
//     });
//   } catch (e: any) {
//     return res.status(500).json({
//       error: e.message,
//     });
//   }
// });

auth.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    const hash = await Bun.password.hash(password);

    const userData = {
      email,
      first_name,
      last_name,
      hash,
    };

    const user = await db.insert(users).values(userData).returning({
      id: users.id,
      email: users.email,
      first_name: users.first_name,
      last_name: users.last_name,
      created_at: users.created_at,
      updated_at: users.updated_at,
    });

    return res.status(200).json(user);
  } catch (e: any) {
    res.status(500).json({
      error: e.message,
    });
  }
});

export default auth;
