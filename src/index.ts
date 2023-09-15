import express from 'express';
import * as bodyParser from 'body-parser';
import blogRoutes from './routes/blogRoutes';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import * as path from 'path';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
dotenv.config();
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use('/api', blogRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
