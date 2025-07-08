const bcrypt = require("bcrypt")
const prisma = require("../models/prismaClient")
const jwt = require("jsonwebtoken")

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("NODE_ENV:", process.env.NODE_ENV);

const hashPasswords = async(plainTextPassword) =>{
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds)
    return hash
}

const comparePasswords = async(plainTextPassword, hashedPassword) =>{
    return bcrypt.compare(plainTextPassword, hashedPassword)
}

exports.login = async(req,res)=>{
    try {
        
        const {username, password} = req.body;

        if (!username) return res.status(401).send("Username required!")
        if (!password) return res.status(401).send("Password required!")


        const user = await prisma.User.findFirst({
            where: {userName: username}
        })

        if (!user) return res.status(401).send("User not found!")

        const isMatch = await comparePasswords(password, user.password)

        if (isMatch) {
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    userName: user.userName,
                    role: user.role 
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.status(200).json({ 
                message: "Login successful", 
                token: token,
                user: { 
                    id: user.id, 
                    userName: user.userName, 
                    email: user.email ,
                    role: user.role
                }
            });        
        }
        
        if (!isMatch) return res.status(401).send("Invalid credentials")

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Error during login")
    }

}

exports.createAdmin = async(req,res)=>{
  const { username, email, password, adminSecret } = req.body;
  
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).send("Endpoint not available");
  }

  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).send("Invalid admin secret");
  }

  try {
    const hashedPassword = await hashPasswords(password)
    const user = await prisma.User.create({ 
        data: {
            userName: username, 
            email,  
            password: hashedPassword,
            provider: "local",
            role: "ADMIN" 
        } 
    });

    res.status(201).json({
      message: "Admin user successfully created",
      user: { 
        id: user.id, 
        userName: user.userName, 
        email: user.email, 
        role: user.role }
    })

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Error creating admin user")
  }
}

exports.signup = async(req,res)=>{
  const { username, email, password } = req.body;

  try {

    const hashedPassword = await hashPasswords(password)
    const user = await prisma.User.create({ 
        data: {
            userName: username, 
            email,  
            password: hashedPassword,
            provider: "local",
        } 
    });
    console.log(user)

    res.status(201).send("User successfully created")

  } catch (error) {
    console.log(error.message)
    res.status(500).send("Error creating user")
  }
}


