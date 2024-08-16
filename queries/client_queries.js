// import generate_token from "../middleware/generate_auth_token.js";
import generate_token from "@codewithwest/module-knight-trainer/middleware/generate_auth_token.js";
import DbConnection from "@codewithwest/module-db-connections/providers/connection.js";
import Client from "../schemas/client.js";

class ClientQueries extends DbConnection {
    /**
    * This is an async function that adds users into the db
    * @param {Object} data data object to be used for user registration
    * @param {MongoDbCollection} collection collection connected to from the database
    * @returns return User Data Schema in object format {}
    */
    async register_client(data, collection = this.db_collection) {
        try {
            var my_collection = await this.get_collection(collection)
            let check_email = await my_collection?.find({ email: data?.email.toLowerCase() })?.toArray()

            // console.log("existing email", data.email)
            if (check_email?.length == 1) { //  If User Email Exist return the exits message to /Register
                if (check_email) return {
                    error: 'Email already exists! 😊',
                    meesage: 'You already have credentials to access product✅, or contact owner for access✈️',
                    contact: "✉westdynamics.tech@gmail.com"
                }
            } else if (check_email?.length > 1) {
                for (let obj in check_email) {
                    obj > 0 ?? await my_collection?.deleteOne(check_email[obj])
                }
                // console.log('Done Deleting Duplicates')
            } else {
                var date_time = new Date()

                var last_user = await this.get_last_collection_value_by_id()

                data['token'] = generate_token(data) ?? ''
                data['created_at'] = date_time.toLocaleString()
                data['id'] = last_user[0] ? parseInt(last_user[0].id + 1) : 1
                data['updated_at'] = date_time.toLocaleString()
                let client = new Client(data);// Re-Route to /Login
                await my_collection.insertOne(client)

                return client
            }
        } catch (error) {
            return new Error(error)
        }
    }
    /**
     * 
     * @param {Object} data email/username from data email used to look up the object in the collection
     * @param {MongoDbCollection} collection collection connected to from the database
     * @returns 
     */
    // Route to Authenticate User and Generate JWT
    async get_client_data(data, collection = this.db_collection) {
        const client = await this.find_by_email_or_user_name(data?.toLowerCase(), collection);

        if (client) {
            // Generate JWT with user ID
            return client
        } else {
            return 'Invalid credentials'
        }
    }

    async update_client(data, filter_value, collection = this.db_collection) {
        var my_collection = await this.get_collection(collection)
        let check_email = await my_collection?.find({ email: data?.email.toLowerCase() }).toArray()
        let updated_client
        if (check_email?.length == 0) { //  If User Email Exist return the exits message to /Register
            if (check_email) return {
                error: "Invalid input 😊",
                meesage: 'You do not have credentials to access product✅, or contact owner for access ✈️',
                contact: "✉westdynamics.tech@gmail.coms"
            }
        } else if (check_email?.length > 1) {
            for (let obj in check_email) {
                obj > 0 ?? await my_collection?.deleteOne(check_email[obj])
            }
            console.log('Done Deleting Duplicates')
        } else {
            var client_data = check_email[0]
            var date_time = new Date()
            client_data['updated_at'] = date_time.toLocaleString()
            client_data['token'] = generate_token(client_data) ?? ''
            try {
                updated_client = await my_collection?.findOneAndUpdate({ email: filter_value.toLowerCase() }, { $set: client_data })

            } catch (error) {
                console.log(error)
            }
            return updated_client
        }
    }
}

export default ClientQueries