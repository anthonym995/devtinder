const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Ensure this path points to your User model file
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);

// Replace this with process.env.MONGO_URI in production
const URL = "mongodb+srv://anthony:Esw7GPSbu7bp0Oq0@devtinder.mtjqzxs.mongodb.net/devTinder";

const generateFakeUsers = async (count = 50) => {
  const users = [];

  // We will assign a standard password for all fake users so you can log into them if needed
  const standardPassword = "Tinder@123";
  const hashedPassword = await bcrypt.hash(standardPassword, 10);

  for (let i = 0; i < count; i++) {
    // 1. Generate a random gender mapping to your schema ["male", "female", "other"]
    const gender = faker.helpers.arrayElement(["male", "female"]);

    // 2. Generate names based on gender
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);

    // 3. Generate Profile picture URL
    const pictureNumber = faker.number.int({ min: 1, max: 99 });
    const photoUrl = `https://randomuser.me/api/portraits/${gender === "male" ? "men" : "women"}/${pictureNumber}.jpg`;

    // 4. Generate random tech skills
    const possibleSkills = [
      "JavaScript",
      "Node.js",
      "React",
      "MongoDB",
      "Express",
      "Python",
      "Java",
      "HTML",
      "CSS",
      "AWS",
    ];
    const skills = faker.helpers.arrayElements(possibleSkills, faker.number.int({ min: 2, max: 5 }));

    // 5. Construct the user object matching your schema
    users.push({
      firstName,
      lastName,
      emailId: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: hashedPassword,
      age: faker.number.int({ min: 18, max: 65 }),
      gender,
      photoUrl,
      about: faker.person.bio(),
      skills,
    });
  }

  return users;
};

const seedDB = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(URL);
    console.log("Connected successfully!");

    console.log("Generating fake users...");
    const fakeUsers = await generateFakeUsers(50);

    console.log("Inserting users into the database...");

    // We use validateBeforeSave: false because the bcrypt hash might not pass
    // your custom validator.isStrongPassword() check in the schema.
    await User.insertMany(fakeUsers, { validateBeforeSave: false });

    console.log("🎉 Successfully added 50 random users to the database!");
  } catch (error) {
    console.error("❌ Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Run the seed function
seedDB();
