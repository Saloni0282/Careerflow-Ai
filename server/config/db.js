import mongoose from 'mongoose';
// import dns from 'node:dns';

// // Force Node to use Google's DNS servers
// dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const uri =
            process.env.MONGO_URI ||
            'mongodb+srv://shalu:shalu@cluster0.tmtrslh.mongodb.net/careerflow-ai?retryWrites=true&w=majority&appName=Cluster0';

        await mongoose.connect(uri);

        console.log('[MongoDB] Connected');
    } catch (error) {
        error.context = 'MongoDB Connection Error';
        throw error;
    }
};

export default connectDB;