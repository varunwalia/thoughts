// const express = require('express');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./models/Schema/schema')
const graphqlResolver =require('./models/Resolvers/resolvers')
const isAuth = require('./middleware/middleware')


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(isAuth);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema ,
    rootValue: graphqlResolver ,
    graphiql: true,
  }),
);

const port = process.env.PORT || 8000;

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port , ()=>{
    console.log(`Port running on ${port}`)
});



