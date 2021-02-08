This is the front end for the fullstack final project in the ZTM Complete Web Dev course.  I didn't fork this from Andrei's repo, as I built it step by step, taking my time to puzzle over the code myself as I worked through the course.

Smart Brain connects to Clarifai, an image recognition API.  When the user submits a URL to an image, Clarifai returns coordinates for any faces that it detected in the submission.  Smart brain uses the returned data to draw a box around the face in the image.  

Smart Brain also features a secure login and registration system.

Currently I've got the back end code in a hidden repo until I can remove a pesky API key from the git history...
