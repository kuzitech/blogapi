import * as express from 'express';
import * as bodyParser from 'body-parser';
import blogRoutes from './src/routes/blogRoutes';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(bodyParser.json());

app.use('/api', blogRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
