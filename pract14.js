import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db("collegeDB");

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes("students")) {
      await db.createCollection("students");
      console.log(" DDL: 'students' collection created");
    } else {
      console.log(" DDL: 'students' collection already exists");
    }

    await db.collection("students").createIndex({ name: 1 });
    console.log(" DDL: Index created on 'name' field");

    const students = db.collection("students");

    await students.deleteMany({});
    console.log(" DML: Old student records cleared");

    await students.insertMany([
      { name: "Naina", course: "BCA", age: 21 },
      { name: "Riya", course: "B.Tech", age: 22 },
      { name: "Aman", course: "BBA", age: 20 },
      { name: "Simran", course: "BCA", age: 22 }
    ]);
    console.log(" DML: Students inserted successfully");

    await students.updateOne({ name: "Naina" }, { $set: { course: "MCA" } });
    console.log(" DML: Updated Naina’s course to MCA");

    await students.deleteOne({ name: "Riya" });
    console.log(" DML: Deleted Riya’s record");

    const allStudents = await students.find().toArray();
    console.log(" Students after DML:");
    console.table(allStudents.map(s => ({
      Name: s.name,
      Course: s.course,
      Age: s.age
    })));

    const adminDB = client.db("admin");

    try {
      await adminDB.command({
        createUser: "collegeUser",
        pwd: "securePass123",
        roles: [{ role: "readWrite", db: "collegeDB" }],
      });
      console.log(" DCL: User 'collegeUser' created successfully");
    } catch (err) {
      if (err.codeName === "Location51003") {
        console.log(" DCL: User 'collegeUser' already exists, skipping creation");
      } else {
        throw err;
      }
    }

    console.log(" All DDL, DML & DCL operations completed successfully!");

  } catch (err) {
    console.error(" Error:", err);
  } finally {
    await client.close();
    console.log(" Connection closed");
  }
}

run();
