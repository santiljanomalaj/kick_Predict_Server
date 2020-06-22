Setting up a remote dev server
================================

Set up a barebone server
-------------------------

For this example, we will take a digitalocean droplet.

Create a droplet and SSH into it.

It's recommended to use the Public key method to login into the server.


Log into the server
--------------------

Log into the server with following command. It's important to have your public key setup properly in the above step for this step to work.

` $ ssh root@<DROPLET_IP> `

NOTE: If you're not using SSH, you may be able to use the Password option, never tried it personally.


Update any older packages
--------------------------

It's important to update any package and get the latest version, specially the security patches. This can be done with the following commands

`apt update`
`apt upgrade`

Specially on a dev server, the above commands should be run as often as possible. This ensure that the dependencies are never outdated and if something breaks, we know it before it goes to PROD.


Install Node
-------------


    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs


Test with the command `node --version` and ensure that it's above v13.12 or above



Setup Code Deployment
---------------------

    mkdir -p /opt/kickpredict
    cd /opt/kickpredict
    mkdir server server.git
    cd server.git/
    git init --bare
    

Copy the following content in `/opt/kickpredict/server.git/hooks/post-receive`

    #!/bin/bash
    echo "executing post-receive hook"
    git --work-tree=/opt/kickpredict/server --git-dir=/opt/kickpredict/server.git checkout -f
    cd /opt/kickpredict/server/src
    npm install
    pm2 restart all


The above file will be executed everytime there is something pushed into the server. But before it can be execute everytime, make it executable with 

    chmod +x /opt/kickpredict/server.git/hooks/post-receive


Install PM2 with `npm install -g pm2`



Add a local remote 
------------------

In your code folder add the following remote

`git remote add dev2 ssh://root@hello2:/opt/kickpredict/server.git`


here:

1. `dev2` is the name of the remote 
2. `root` is the username of the remote user
3. `hello2` can also be the IP address of the remote server
4. `/opt/kickpredict/server.git` is the path of git bare repo


Setup Razorpay Environment variables
------------------------------------

    export RAZORPAY_KEY_ID=rzp_test_2ERqAWrhNkitwo
    export RAZORPAY_KEY_SECRET=U6sjo47MtxQXiWsobDv6AFcf


Push the code
--------------

From the repo, do a `git push dev2 master` and cross your fingers.

**IMPORTANT**

We need to manually start the app server once. Post that, PM2 starts it everytime.

`cd/opt/kickpredict/server/src`


Setup Postgresql
-----------------


sudo -u postgres psql
postgres=# create database mydb;
postgres=# create user myuser with encrypted password 'mypass';
postgres=# grant all privileges on database mydb to myuser;



Install NGINX
-------------


    apt install nginx -y
    systemctl start nginx


Create `/etc/nginx/sites-enabled/reverse-proxy` with the following content


    server {
            access_log /var/log/nginx/reverse-access.log;
            error_log /var/log/nginx/reverse-error.log;
            server_name dev.api.kickpredict.com;
            location / {
                        proxy_pass http://127.0.0.1:1337;
            }
            listen [::]:443 ssl ipv6only=on; # managed by Certbot
            listen 443 ssl; # managed by Certbot
            ssl_certificate /etc/letsencrypt/live/dev.api.kickpredict.com/fullchain.pem; # managed by Certbot
            ssl_certificate_key /etc/letsencrypt/live/dev.api.kickpredict.com/privkey.pem; # managed by Certbot
            include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
            ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }

    server {
            if ($host = dev.api.kickpredict.com) {
                return 301 https://$host$request_uri;
            } # managed by Certbot

            listen 80;
            listen [::]:80;
            server_name dev.api.kickpredict.com;
            return 404; # managed by Certbot
    }


Use Certbot to install https
-----------------------------

Create the certbot repository with `add-apt-repository ppa:certbot/certbot`

Install certbot with `apt-get update && apt-get install python-certbot-nginx`

Set the correct IP in dev.api on CloudFlare


Reload Nginx
-------------


    systemctl reload nginx



We're done. Now dev.api.kickpredict.com should be pointing to the new server with everything configured and HTTPS setup.