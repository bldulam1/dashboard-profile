## Introduction ##

Clarity is an application that can be used as a platform for

* Storing the location of files collected during Data Collection
* Associating meta data for files
* Perform processes for files such as
    * File conversion
    * Data Extraction
    * Data Visualization
* Perform KPI Analysis
* Store database for
    * Test Catalogs
    * Files in Isilon
    * Tasks/Operations
    * KPI Results

## Structure ##

Clarity is composed of three main directories, namely **react**, **main-server** and **worker**.
 
The structure of Clarity is inspired by a restaurant concept. 
A restaurant is run mainly by some waiters and some chefs. 
In Clarity, the waiters are the main-servers and the chefs are the workers.

* **React**

    This contains the code for the front-end. The compiled version of react is used by the main-server to respond to the clients “/” request.
    

* **main-server**  

    This contains the code for the main back-end API or Master Server.
    A main-server is directly connected to the database of the entire app. 
    Its main role is to respond to the requests of the clients and the workers.
    All the requests are done through REST API and websockets for real time communication.
    

* **worker** 

    This contains the code for the service workers. 
    A worker’s main role is to perform specialized backend operations like directory mapping,
    SIMS, CVW Conversion, and other processes that has command line APIs. 
    This kind of server is responsible for all the heavylifting in the backend.
    

## Installation ##
All tools required during installation are available at 

    V:\JP01\DataLake\Common_Write\ClarityResources\Installers

The following tools are the required tools to run Clarity.
* Git
* Nodejs
* MongoDB


## Clarity Setup ##
Before the installation, clone the repository into your workspace(directory)

    cd <workspace location>
    git clone http://de01-gitlab01.corp.int/clarity/clarity2.0.git

At this point you will have a folder named clarity2.0 inside your workspace. 
Then you can install all the packages in each subfolders.
The recommended terminal for all the commands below is Powershell. 
It is available both in Linux and Windows systems


* react

    `cd react; npm install; `

* main-server

    `cd main-server; npm install; `

* worker 

    `cd worker; npm install; `
    

## Environments ## 
Currently there are only two environments used in the code, the production and development environments.

**Development**

This is the environment that's on your computer. 
Here is where you'll do all of your code updates.
It is where all of your commits and branches live along with those of other developers.
The development environment is usually configured differently from the environment that users work in.

The following is the script to run in the development mode in each subfolder (react, main-server, worker)

    npm start
    
**Production**

This is the environment in the main server. 
The latest stable version of the project is running in this environment.
Before you deploy your code in the production environment, make sure that all your codes are working. 
The following are the scripts in running the codes in main-server and worker in production mode

    npm run prod
 
For the react subfolder, you can create a bundled HTML, CSS, JS scripts using the following command

    npm run build

It will create a subfolder inside the react folder called **build**.


**Notes:**

You may also check all the possible npm scripts in the package.json of each subfolder.
The following variables are different in the production and development environments.
* urls of the workers and main-server
* ports
* certificates of the servers
