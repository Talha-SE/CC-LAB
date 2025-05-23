const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== "POST")
    return res.status(405).send("Only POST allowed");

  const { name, email } = req.body;
  
  // Add the database name to the URI
  const uri = process.env.MONGODB_URI || "mongodb+srv://rtalhaonline:NEhS7yVaNhDui0mc@cluster0.rkuo4yk.mongodb.net/studentsDB?retryWrites=true&w=majority&appName=Cluster0";

  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully");
    
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    const result = await collection.insertOne({ name, email, timestamp: new Date() });
    console.log("Document inserted:", result.insertedId);
    
    res.status(200).json({ message: "User added successfully!" });
  } catch (err) {
    console.error("MongoDB Error:", err);
    res.status(500).json({ message: "Internal server error: " + err.message });
  } finally {
    await client.close();
  }
};
