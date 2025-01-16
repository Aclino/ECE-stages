import mongoose, {Schema} from 'mongoose';

const PromotionSchema = new Schema({

    name: {
        type: String
    },


});

const Promotion = mongoose.model('Promotion', PromotionSchema);
export default Promotion;
