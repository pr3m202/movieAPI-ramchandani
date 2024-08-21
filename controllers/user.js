const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require('../auth')
const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {

	// Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    
    // If all needed requirements are achieved
    } else {

		// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
	    // Uses the information from the request body to provide all the necessary information
		let newUser = new User({
			firstName: req.body.firstName,
			lastName:  req.body.lastName,
			email:  req.body.email,
			// 10 salt rounds
			password: bcrypt.hashSync( req.body.password, 10),
			mobileNo:  req.body.mobileNo
		})
		// Saves the created user to our database
		return newUser.save()
		.then((result) => res.status(201).send(result))
		.catch(err => errorHandler(err, req, res));	
	}
}


module.exports.loginUser = (req, res) => {

	if(req.body.email.includes("@")){
		return User.findOne({email:  req.body.email})
		.then(result => {

			// User does not exist
			if(result === null) {

				return res.status(404).send({ message: 'No email found' });

			//If user exists
			} else {

				// Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
	            // The "compareSync" method is used to compare a non encrypted password from the login form to the encrypted password retrieved from the database and returns "true" or "false" value depending on the result
				const isPasswordCorrect = bcrypt.compareSync( req.body.password, result.password);

				if (isPasswordCorrect) {

					// Generates an access token
	                // Uses the "createAccessToken" method defined in the "auth.js" file
					return res.status(201).send({ 
						message: 'User logged in successfully',
						access: auth.createAccessToken(result)
					});

				// Passwords do not match
				} else {
					return res.status(401).send({ message: 'Incorrect email or password' });
				}
			}
		})
		.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).send({ message: 'Invalid email format' })
	}
}

module.exports.getProfile = (req, res) => {
	// console.log(reqBody)
    return User.findById(req.user.id)
    .then(user => {

    	if(!user) {
    		// if no user is found, send a message 'User not found'.
            return res.status(404).send({ message: 'User not found' })

        // if the user is found, return the user.
    	} else {
	        user.password = "";
	        return res.status(200).send(user);   		
    	}
    })
    .catch(err => errorHandler(err, req, res));
};
