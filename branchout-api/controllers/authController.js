const bcrypt = require("bcrypt");
const prisma = require("../models/prismaClient");
const jwt = require("jsonwebtoken");

const hashPasswords = async (plainTextPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
};

const comparePasswords = async (plainTextPassword, hashedPassword) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) return res.status(401).json({ error: "Username is required" });
    if (!password) return res.status(401).json({ error: "Password is required" });

    const user = await prisma.User.findFirst({
      where: { username: username },
    });

    if (!user) return res.status(401).json({ error: "No account found with this username" });

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error occurred. Please try again." });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Basic validation
    if (!username) return res.status(400).json({ error: "Username is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    // Check if user already exists
    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ error: "Username already taken" });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already registered" });
      }
    }

    const hashedPassword = await hashPasswords(password);
    const user = await prisma.User.create({
      data: {
        username,
        email,
        password: hashedPassword,
        provider: "local",
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        provider: user.provider,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.log(error.message);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'username') {
        return res.status(409).json({ error: "Username is already taken" });
      } else if (field === 'email') {
        return res.status(409).json({ error: "Email is already registered" });
      } else {
        return res.status(409).json({ error: "Account with this information already exists" });
      }
    }
    
    res.status(500).json({ error: "Failed to create account. Please try again." });
  }
};

// ... rest of your exports remain the same

exports.createAdmin = async (req, res) => {
  const { username, email, password, adminSecret } = req.body;

  if (process.env.NODE_ENV === "production") {
    return res.status(404).send("Endpoint not available");
  }

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).send("Invalid admin secret");
  }

  try {
    const hashedPassword = await hashPasswords(password);
    const user = await prisma.User.create({
      data: {
        username: username,
        email,
        password: hashedPassword,
        provider: "local",
        role: "ADMIN",
      },
    });

    res.status(201).json({
      message: "Admin user successfully created",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error creating admin user");
  }
};


exports.clerkSync = async (req, res) => {
  const { clerkId, email, username } = req.body;

  console.log("🔄 Received clerkSync request:", { clerkId, email, username });

  try {
    // Check if user already exists
    const existingUser = await prisma.User.findFirst({
      where: { clerkId: clerkId },
    });

    if (existingUser) {
      console.log("✅ User already exists in database:", existingUser.id);
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // Create new user with Clerk data
    const user = await prisma.User.create({
      data: {
        clerkId: clerkId,
        username: username,
        email: email,
        provider: "clerk",
        role: "USER",
      },
    });

    console.log("✅ New user created in database:", user.id);

    res.status(201).json({
      message: "User synced successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        clerkId: user.clerkId,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error syncing user");
  }
};
