import mongoose, {Schema} from 'mongoose';

const SchoolSchema = new Schema({

    name: {
        type: String
    },

    authorizedDomains: [String]

});

const School = mongoose.model('School', SchoolSchema);
export default School;
