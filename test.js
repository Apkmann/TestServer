const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require("http");
const fs = require("fs");
const pass = encodeURIComponent("Aswath22@data");
const uri = `mongodb+srv://mohammedaswath141:${pass}@cluster0.54i4ysr.mongodb.net/Hospital?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    //connecting to MongoDB
    startHttpServer();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function startHttpServer() {
  http.createServer(async (req, res) => {
    if (req.url === '/') {
      try {
        const database = client.db("Hospital");
        const collection = database.collection("Departments");

        const doc = await collection.find({}).toArray();
        const t = doc.map(da => `
          <tr>
            <td>${da.id}</td>
            <td>${da.Equipment_name}</td>
            <td>${da.Serial}</td>
          </tr>
        `).join('');

        fs.readFile('index.html', function (err, data) {
          if (err) {
            console.error("Error reading HTML file:", err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          } else {
            const htmlContent = data.toString().replace('<!-- Placeholder for table rows -->', t);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlContent);
            res.end();
          }
        });
      } catch (error) {
        console.error("Error processing request:", error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    }
  }).listen(3000);
}

run().catch(console.dir);
