// import mongoose, {model, Schema} from "mongoose"

// mongoose.connect("mongodb+srv://abhinavchauhan593:8v!ar2vDHubv!4A@cluster0.04khaj8.mongodb.net/second_brain");
// const UserSchema = new Schema({
//     username: {type: String , unique: true, required: true},
//     password: {type: String , required: true},

// })

// export const UserModel = model("User",UserSchema)


// const ContentSchema = new Schema({
//     title: String,
//     link: String,
//     tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
//     userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
// })
// export const ContentModel = model("Content", ContentSchema)

// const LinkSchema = new Schema({
//     hash: String,
//     userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true}
// })
// export const LinkModel = model("Links",LinkSchema)



import mongoose, {model, Schema} from "mongoose"

mongoose.connect("mongodb+srv://abhinavchauhan593:8v!ar2vDHubv!4A@cluster0.04khaj8.mongodb.net/second_brain");

// Add connection event listeners for debugging
mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('❌ Disconnected from MongoDB');
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://abhinavchauhan593:8v!ar2vDHubv!4A@cluster0.04khaj8.mongodb.net/second_brain")
    .then(() => console.log('✅ MongoDB connection initiated'))
    .catch(err => console.error('❌ MongoDB connection failed:', err));

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}, // ✅ Removed unique: true
})

export const UserModel = model("User", UserSchema)

const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const ContentModel = model("Content", ContentSchema)

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true}
})

export const LinkModel = model("Links", LinkSchema)
