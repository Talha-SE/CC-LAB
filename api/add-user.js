const { MongoClient, ServerApiVersion } = require('mongodb');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get data from request body
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // MongoDB connection string - try environment variable first, then fallback
    const uri = process.env.MONGODB_URI || 
      "mongodb+srv://rtalhaonline:NEhS7yVaNhDui0mc@cluster0.rkuo4yk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Create a MongoClient with proper options
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });

    console.log("Attempting to connect to MongoDB Atlas...");
    
    // Connect to MongoDB
    await client.connect();
    
    console.log("Connected to MongoDB Atlas");
    
    // Access the database and collection
    const database = client.db("studentsDB");
    const collection = database.collection("users");
    
    // Create document to insert
    const document = {
      name,
      email,
      timestamp: new Date()
    };
    
    // Insert the document
    const result = await collection.insertOne(document);
    
    console.log(`Document inserted with _id: ${result.insertedId}`);
    
    // Close the connection
    await client.close();
    
    // Return success response
    return res.status(200).json({ 
      message: "User added successfully!", 
      id: result.insertedId.toString() 
    });
    
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({ 
      message: "Failed to add user to database", 
      error: error.message 
    });
  }
};
