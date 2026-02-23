import mongoose from "mongoose";

async function mongoDbConnect(url) {
  return mongoose.connect(url);
}

export { mongoDbConnect };
