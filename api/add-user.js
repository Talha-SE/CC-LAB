const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return res.status(500).json({ message: "MongoDB URI not configured" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("studentsDB");
    const collection = db.collection("users");

    await collection.insertOne({ name, email, timestamp: new Date() });
    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
};
