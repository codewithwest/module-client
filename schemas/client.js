import { Schema, model } from 'mongoose';
const clientSchema = new Schema({
    id: Number,
    username: String,
    email: String,
    organisation: String,
    token: String,
    created_at: String,
    updated_at: String,
    last_login: String,
    last_ip: String,
    account_active: Boolean
});

var Client = model('Client', clientSchema);
export default Client