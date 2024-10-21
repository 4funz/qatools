import { MongoClient } from 'mongodb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Read the request body

  const uri = process.env.MONGODB_URI; // MongoDB Atlas connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("env_selecter");
    const collection = database.collection("envs");

    const result = await collection.insertOne({
      selectedLabels: body.selectedLabels,
      selectedThemeValues: body.selectedThemeValues,
      deployInput: body.deployInput,
      timestamp: new Date(),
    });

    return { success: true, insertedId: result.insertedId };
  } catch (error) {
    console.error('Error inserting data: ', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
});
