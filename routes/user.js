const express = require('express');
const userController = require("../controllers/user");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

// Routing component
const router = express.Router();

// Routes will be placed here

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);

//s43 Activity: Route for retrieving user details
router.get("/details", verify, userController.getProfile);

// Route for logging out
router.get("/logout", (req, res) => {
	// Destroys the session that stores the Google OAuth Client credentials
    // Allows for release of resources when the account information is no longer needed in the browser
	req.session.destroy(err => {
		if(err) {
			console.log('Error while destroying the session: ', err)
		} else {
			req.logout(() => {
				console.log('You are logged out');
				res.redirect('/')
			})
		}
	})
})

module.exports = router;