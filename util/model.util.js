module.exports = {
    getModel: async (collectionName) => {
        const poomdb = await require('../util/mongodb.util');
        var model;
        await poomdb
            .model('schemas' + Number.parseInt(Math.random() * 100000), new poomdb.Schema({name: String}), 'schemas')
            .findOne({name: collectionName}, (err, collData) => {
                if(err) throw err;
                const schema = JSON.parse(JSON.stringify(collData)).definition;
                model = poomdb.model(collectionName + Number.parseInt(Math.random() * 100000), new poomdb.Schema(schema), collectionName);
            }
        );
        return model;
    }
}