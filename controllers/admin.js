/*==========================
 * Admin
 *
 * @description: Have a simpler way of dealing with manipulations in the database
 * @author: Government of Canada; @duboisp; @GormFrank
 * @version: 1.0
 *
 * addTopic
 * updateTopic
 * deleteTopic
 * confirmSubs
 * validateTemplateConfig
 * Send a test email confirmation email to the specified email address
 ===========================*/

//
// Remove subscription of unconfirmed email
//
// @return; a HTTP redirection
// @description: To ease testing
//
/* This function was for dev, firstly designed in subscription controller. */
exports.removeUnconfirmEmail = ( req, res, next ) => {

	// Request param: email, confirmCode
	const { subscode, email } = req.params;
		
	dbConn.collection( "subsConfirmed" ).findOneAndDelete( { email: email, subscode: subscode } ).catch( () => {} );
	
	dbConn.collection( "subsUnconfirmed" )
		.findOneAndDelete( { email: email, subscode: subscode } )
		.then( ( docSubs ) => {

			// update topics
			dbConn.collection( "topics" ).updateOne( 
			{ _id: docSubs.value.topicId },
			{
				$pull: {
					subs: email
				}
			});

			// Redirect to Generic page to confirm the email is removed
			res.redirect( "https://canada.ca/en.html" );

		} ).catch( () => {
			res.redirect( "https://canada.ca/fr.html" );
		});
};

