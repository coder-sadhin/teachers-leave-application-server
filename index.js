const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

// this is test route 
app.get('/', (req, res) => {
    res.send('Teachers-leave-application Successfully run');
})


// this is for verify token 
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('UnAuthorized Access')
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            console.log('Problem on token')
            return res.status(403).send({ Massage: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next()
    })
}

// this is mongodb conection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bbbtstv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// this is conection start to mongodb 
async function run() {
    try {
        const usersCollection = client.db("teachers_leave_application").collection("usersCollection");
        // this all are collections 
        const computerCollection = client.db("teachers_leave_application").collection("computerCollection");
        const civilCollection = client.db("teachers_leave_application").collection("civilCollection");
        const electricalCollection = client.db("teachers_leave_application").collection("electricalCollection");
        const mechanicalCollection = client.db("teachers_leave_application").collection("mechanicalCollection");
        const electronicsCollection = client.db("teachers_leave_application").collection("electronicsCollection");
        const powerCollection = client.db("teachers_leave_application").collection("powerCollection");
        const electromedicalCollection = client.db("teachers_leave_application").collection("electromedicalCollection");
        const mechatronicsCollection = client.db("teachers_leave_application").collection("mechatronicsCollection");
        const leavesCollection = client.db("teachers_leave_application").collection("leavesCollection");
        // all are department teacher and employ data collection 



        // this is for create user api 
        app.post('/createUser', async (req, res) => {
            const user = req.body;
            const userInfo = {
                email: user.email,
                title: user.title,
                department: user.department,
                shift: user.shift
            }
            const addUser = await usersCollection.insertOne(userInfo)
            const department = user.department;
            if (department === "civil") {
                const result = await civilCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "electrical") {
                const result = await electricalCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "mechanical") {
                const result = await mechanicalCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "computer") {
                const result = await computerCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "electronics") {
                const result = await electronicsCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "power") {
                const result = await powerCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "electromedical") {
                const result = await electromedicalCollection.insertOne(user);
                res.send(result);
            }
            else if (department === "mechatronics") {
                const result = await mechatronicsCollection.insertOne(user);
                res.send(result);
            }
            else {
                res.status(401).json("Unauthorized Access")
            }
        })

        // this is for userinfo 
        app.get('/userInfo', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query);
            const department = user.department;
            const qry = {
                email: email,
                department: department
            }
            if (department === "civil") {
                const result = await civilCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "electrical") {
                const result = await electricalCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "mechanical") {
                const result = await mechanicalCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "computer") {
                const result = await computerCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "electronics") {
                const result = await electronicsCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "power") {
                const result = await powerCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "electromedical") {
                const result = await electromedicalCollection.findOne(qry);
                res.send(result);
            }
            else if (department === "mechatronics") {
                const result = await mechatronicsCollection.findOne(qry);
                res.send(result);
            }
            else {
                res.status(401).json("Unauthorized Access")
            }
        })

        // this is check userType Api for validate dashboard
        // this is for genarate your token 
        app.post('/token', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const info = await usersCollection.findOne(query);
            const token = jwt.sign(info, process.env.ACCESS_TOKEN)
            res.send({ token })
        })
    }
    finally {

    }

}
run().catch(console.log);




// this is command screen show 
app.listen(port, () => console.log('Server is running', port));