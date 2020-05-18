import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  // TODO: Add origin
  optionsSuccessStatus: 200
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
