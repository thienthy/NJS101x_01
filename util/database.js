const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://thienthy:thienthy91@cluster0.ouuxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    )
        .then(client => {
            console.log('Connect!');
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = mongoConnect;
