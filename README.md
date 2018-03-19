# TDT4242 (exercise 2)

## An e-commerce app with customers and admins

Currently our group is hosting the latest version of this application on AWS, and it can be accesed [here](http://tdttest-dev.eu-west-1.elasticbeanstalk.com/)

### How to setup
If the above link is down (due to the project being finished) then you manually have to follow this set of steps:
  1. Clone this repo
  2. Make sure you have installed Node.js and can access this from some terminal (both "npm" and "node").
  3. Navigate into the root of our project and run "npm install" to install dependencies.
  4. Navigate into "/server" and run "node server.js" to start the server.
  5. Access the application by going accessing "localhost:3000" in your web browser.

If you would rather run this using Docker then follow this set of steps:
  1. Clone the repo, but make sure it is an archive
  2. Using docker (make sure you have this installed), navigate to the location of the archive.
  3. Build the image from the archive, i.e. "docker build -t IMAGE - < archive.tar.gz".
  4. Run the image you built using "docker run -p 3000:3000 IMAGE"
  5. Access the running instance by getting the ip ("docker inspect CONTAINER-ID") and connecting to this at port 3000.

### Requirements
Following are the two sets of use cases (which were how our requirements were specified) for the two iterations of this project.  

Iteration1:  
* As a user, I want to be able to create an account so that I can buy a product
* As a user, I want to be able to add interesting items to the cart and buy them later.
* As a user, I want to be able to search in items and add some filters on attributes of goods, like
filtering based on price, brand or material
* As a admin, I want to be able to be able to add new items to the e-commerce site
* As a admin, I want to be able to create sales with percentages and package deals (e.g., 3 for 2
deals)

Iteration2:  
* As a user, I want to be able to be able to choose the quantity I want of some item
* As a admin, I want to be able to be able to see & update the stocks of different items
* As a admin, I want to be able to send the users updates (e.g., order is accepted, item shipped
etc.)