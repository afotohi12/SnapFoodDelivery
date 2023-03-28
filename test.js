const signup = async (req, res, next) => {
    try {
      const { name, family, age, address, userName, email, password, confirmPassword, phoneNumber } = req.body;
  
      await signupSchema.validate({ name, family, age, address, userName, email, password, confirmPassword, phoneNumber }, { abortEarly: false });
  
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
  
      const existingUser = await userModel.findOne({
        $or: [{ userName }, { email }, { phoneNumber }],
      }, { userName: 1, email: 1, phoneNumber: 1 });
  
      if (existingUser) {
        if (existingUser.userName === userName) {
          throw new Error("Username already exists");
        }
  
        if (existingUser.email === email) {
          throw new Error("Email already exists");
        }
  
        if (existingUser.phoneNumber === phoneNumber) {
          throw new Error("Phone number already exists");
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await userModel.create({
        name,
        family,
        age,
        address,
        userName,
        email,
        phoneNumber,
        password: hashedPassword,
      });
  
      res.status(201).json({ success: true, message: "User created" });
    } catch (error) {
      next({ status: 400, message: error.message });
    }
  };