const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const departmentCollection = client.db("teachers_leave_application").collection("departmentCollection");
        const leaveCategori = client.db("teachers_leave_application").collection("leaveCategori");
        // const leavesCollection = client.db("teachers_leave_application").collection("leavesCollection");
        // all are department teacher and employ data collection 

        const ciPandingApproved = client.db("teachers_leave_application").collection("ciPandingApproved");
        // this is for leave storeage 
        const leaveApplicationStoreForAdmin = client.db("teachers_leave_application").collection("leaveApplicationStoreForAdmin");
        const leaveApplicationStoreForVP = client.db("teachers_leave_application").collection("leaveApplicationStoreForVP");
        // if teacher then come here 
        const leaveApplicationStoreForCI = client.db("teachers_leave_application").collection("leaveApplicationStoreForCI");
        // if staph comes here 
        const leaveApplicationStoreForCearTekar = client.db("teachers_leave_application").collection("leaveApplicationStoreForCearTekar");
        const leaveApplicationStoreForAll = client.db("teachers_leave_application").collection("leaveApplicationStoreForAll");
        const creditsCollections = client.db("teachers_leave_application").collection("creditsCollections");

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
            // console.log(email);
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query);
            // console.log(user);
            const department = user?.department;
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









        // this is for leave application 
        app.post('/applyLeave', async (req, res) => {
            const dataInfo = req.body;
            const title = dataInfo.title;
            if (title === "Chief Instructor" || title === "caretaker") {
                const result = await leaveApplicationStoreForVP.insertOne(dataInfo);
            }
            else if (title === "instructor") {
                const result = await leaveApplicationStoreForCI.insertOne(dataInfo);
            }
            else if (title === "employee") {
                const result = await leaveApplicationStoreForCearTekar.insertOne(dataInfo);
            }
            else {
                res.json('Wrong Information')
            }
            const result = await leaveApplicationStoreForAll.insertOne(dataInfo);
            res.send(result)
        });

        // this is for manage leave 
        app.get('/manageLeave', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const result = await leaveApplicationStoreForAll.find(query).toArray();
            res.send(result);
        })

        // this is for pending application view
        app.get('/pendingLeave', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query);
            // console.log(user);
            if (user.title === "Chief Instructor") {
                const status = "pending";
                const query = {
                    department: user.department,
                    shift: user.shift,
                    status: status
                }
                const result = await leaveApplicationStoreForCI.find(query).toArray();
                res.send(result);
            } else if (user.title === "Caretaker") {
                const status = "pending";
                const query = {
                    department: user.department,
                    shift: user.shift,
                    status: status
                }
                const result = await leaveApplicationStoreForCearTekar.find(query).toArray();
                res.send(result);
            } else if (user.title === "subSuperAdmin" || user.title === "superAdmin") {
                const status = "pending";
                const query = {
                    status: status
                }
                const result = await leaveApplicationStoreForVP.find(query).toArray();
                res.send(result);
            } else {
                res.json("Action Not Completed")
            }
        })

        // this is for approved history 
        app.get('/approvedLeave', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query);
            // console.log(user);
            const status = "approved";
            if (user.title === "Chief Instructor") {
                const query = {
                    department: user.department,
                    shift: user.shift,
                    status: status
                }
                const result = await leaveApplicationStoreForCI.find(query).toArray();
                res.send(result);
            } else if (user.title === "Caretaker") {
                const query = {
                    department: user.department,
                    shift: user.shift,
                    status: status
                }
                const result = await leaveApplicationStoreForCearTekar.find(query).toArray();
                res.send(result);
            } else if (user.title === "subSuperAdmin" || user.title === "superAdmin") {
                const query = {
                    status: status
                }
                const result = await leaveApplicationStoreForVP.find(query).toArray();
                res.send(result);
            } else {
                res.json("Action Not Completed")
            }
        })

        // this is for admin approved leave application 
        app.put('/AdminApprovedLeave', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const filter = {
                _id: ObjectId(id)
            }
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: 'approved' },
            }
            const updateDoc2 = {
                $set: { status: 'approved', passed: 'Your Application Approved' },
            }
            const result = await leaveApplicationStoreForVP.updateOne(filter, updateDoc, options);
            const result2 = await leaveApplicationStoreForAll.updateOne(filter, updateDoc2, options);
            res.send(result2);
        })

        // this is for ci to vp or principal 
        app.put('/ciToAdmin', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const filter = {
                _id: ObjectId(id)
            }
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: 'approved' },
            }
            const updateDoc2 = {
                $set: { passed: 'Approved by CI, waiting for Admin Approved' },
            }
            const selectLeave = await leaveApplicationStoreForCI.findOne(filter);
            const result = await leaveApplicationStoreForVP.insertOne(selectLeave);
            const userUpdate = await leaveApplicationStoreForAll.updateOne(filter, updateDoc2, options);
            const result1 = await leaveApplicationStoreForCI.updateOne(filter, updateDoc, options);
            res.send(result1);
        })

        // this is for caretaker to vp or principal 
        app.put('/ctToAdmin', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const filter = {
                _id: ObjectId(id)
            }
            const options = { upsert: true };
            const updateDoc = {
                $set: { status: 'approved' },
            }
            const updateDoc2 = {
                $set: { passed: 'Approved by Caretaker, waiting for Admin Approved' },
            }
            const selectLeave = await leaveApplicationStoreForCearTekar.findOne(filter);
            const result = await leaveApplicationStoreForVP.insertOne(selectLeave);
            const userUpdate = await leaveApplicationStoreForAll.updateOne(filter, updateDoc2, options);
            const result1 = await leaveApplicationStoreForCearTekar.updateOne(filter, updateDoc, options);
            res.send(result1);
        })































        // this is for admin action 
        app.get('/allDepartment', async (req, res) => {
            const result = await departmentCollection.find({}).toArray();
            res.send(result);
        })

        app.post('/addDepartment', async (req, res) => {
            const data = req.body;
            // console.log(data);
            const query = {
                d_name: data.d_name
            }
            const find = await departmentCollection.findOne(query);
            if (find) {
                return res.json("Department Already Exist")
            }
            const result = await departmentCollection.insertOne(data);
            res.send(result)
        })

        app.get('/leaveCategoris', async (req, res) => {
            const result = await leaveCategori.find({}).toArray();
            res.send(result);
        })

        app.post('/addLeave', async (req, res) => {
            const data = req.body;
            console.log(data)
            const result = await leaveCategori.insertOne(data);
            res.send(result)
        })

        app.post('/deleteLeave', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await leaveCategori.deleteOne(query);
            res.send(result)
        })

        app.get('/approvedLeave', async (req, res) => {
            const result = await leaveApplicationStoreForAdmin.find({}).toArray();
            res.send(result);
        })

        app.get('/ciPending', async (req, res) => {
            const result = await ciPandingApproved.find({}).toArray();
            res.send(result);
        });


    

        // cradits api 
        // this is for creditInfo application
        app.post('/credits', async (req, res) => {
            const credit = req.body;
            const result = await creditsCollections.insertOne(credit);
            res.send(result);
            console.log(result)
        });

        // get credits data
        app.get('/credits', async (req, res) => {
            const query = {};
            const result = await creditsCollections.find(query).toArray();
            res.send(result);
        });

        // get credit data with id
        app.get('/credit/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await creditsCollections.findOne(filter);
            res.send(result);
        });








        // this is for typeuse 
        app.get('/checkuser/type', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const findUser = await usersCollection.findOne(query);
            // console.log(findUser);
            if (findUser.title === "superAdmin") {
                res.json("superAdmin")
            }
            else if (findUser.title === "subSuperAdmin") {
                res.json("subSuperAdmin")
            }
            else if (findUser.title === "Chief Instructor" || findUser === "Caretaker") {
                res.json("admin")
            }
            else {
                res.json("user")
            }
        });


        // All delete method process is here
        app.delete('/leaveCategory/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await leaveCategori.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }

}
run().catch(console.log);




// this is command screen show 
app.listen(port, () => console.log('Server is running', port));