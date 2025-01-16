import mongoose, {Schema} from 'mongoose';

const GroupSchema = new Schema({

    name: {
        type: String
    },

    promotion: {

    },

    school: {

    },

    homeworks: {

    },


    authorizedDomains: [String]

});

const Group = mongoose.model('Group', GroupSchema);
export default Group;
