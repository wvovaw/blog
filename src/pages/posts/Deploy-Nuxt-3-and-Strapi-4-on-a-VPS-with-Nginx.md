---
layout: "../../layouts/MarkdownPost.astro"
title: "Deploying Nuxt 3 and Strapi 4 on a VPS"
pubDate: 2023-04-09
description: "This guide is about how to get Nuxt 3 + Strapi 4 application up and running on a single VPS"
author: "wvovaw"
image:
  src: "/blog/posts/deploying-nuxt-and-strapi-with-nginx/banner.png"
  alt: "Deploying Nuxt 3 and Strapi 4 with Nginx on a VPS"
  width: 1050
  height: 600
tags: ["nuxt", "strapi", "nginx", "pm2", "certbot", "ubuntu", "vps"]
---

# Installing and configuring software

First of all we install the software that we will need to manage our machine. Our system needs **build-essential**, **git**, **ufw** and **nginx** to be installed. Update the system and install them and other needed software that eventually may not be installed by default for some reason like curl and snapd

```sh
apt update && apt upgrade
apt install build-essential git nginx ufw curl snapd
```

<details>
<summary>Optional: Shell setup</summary>

I also prefer to install **zsh** with **oh-my-zsh** and **powerlevel10k** to have user friendly shell with syntax highlighting, auto-completion, hints etc. You may skip this stage and just go to the second step.

## Setup shell

install **zsh** with **oh-my-zsh**

```sh
apt install zsh
root@1159525-cx96961:~# sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

when installation script ask us if we want to change default shell to zsh we accept it pushing `y`

Installing **powerlevel10k** prompt

```sh
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

After download complete set `ZSH_THEME="powerlevel10k/powerlevel10k"` in `~/.zshrc` and apply changes

```sh
source ~/.zshrc
```

You'll be prompted to choose settings of the prompt. Choose wisely...

</details>

## Setup UFW

Add firewall rules to allow ssh (port 22) connections as well as http (port 80) and https (port 443) traffic and enable it

```sh
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

> [!info] Info
> I'ts ok if your ssh connection has been disrupted. Just reconnect again

## Setup Nginx with Certbot

We will be using Nginx as a proxy server. We already have Nginx installed but not Certbot. Official Certbot documentation recommends us to install it from snap store so we do

### Install Certbot

Remove any previously installed Certbot to avoid conflicts with the snap package

```sh
apt remove certbot
```

Install Certbot from snap store

```sh
snap install --classic certbot
```

Configure a symbolic link to the Certbot directory using the `ln` command

```sh
ln -s /snap/bin/certbot /usr/bin/certbot
```

### Request a TLS/SSL certificate

Certbot will handle basic Nginx configuration for us when we request certificate with `--nginx` flag

```sh
certbot --nginx
```

Enter your email, Accept TOS and enter your domain name `your.domain,www.your.domain`

After you successfully receive certificate Certbot automatically generates basic Nginx configuration with your certificates deployed. Go and check `https://your.domain` You will **Welcome Nginx** page if everything is ok.

> [!tip] Tip
> Certbot will renew certificates automatically before they expire

## Setup Node

Nuxt and Strapi are both run on **Node.js** so we need to install it. We will use [**NVM**](https://github.com/nvm-sh/nvm) because it is the best way to install Node.js and the easiest way to manage its versions. Strapi 4 requires Node LTS versions so I will use _v16_ for it but for Nuxt 3 I'm going to use the latest (v19.8.1 at this moment).

### Intall NVM and Node.js

Install NVM (look for the latest version on their github page)

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Installation script modifies `.zshrc` so we have to source it in the current session

```sh
source ~/.zshrc
```

Install Node v16 and v19.8.1

```sh
nvm install v19.8.1
nvm install v16
```

I also prefer Yarn to NPM so I install it for both Node versions

```sh
nvm use v16
npm install -g yarn
nvm use v19
npm install -g yarn
```

### Install PM2

**PM2** stands for _process manager_. We will use it to orchestrate Nuxt, Strapi processes and some shell scripts.

Install PM2 on the main v19 Node version

```sh
nvm use v19
yarn global add pm2
```

# Run projects

## Preparing

First of all we need to establish connection between our Github and server to be able to fetch from and push to our private repository. For that purpose I create password protected ssh key, add it on my Github. [Read official Github docs about this](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

Generate new key. Use email that you use to sign your commits and don't leave the password empty!

```sh
ssh-keygen -t ed25519 -C "your@email.com"
```

Add this key on github ([read how](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account))

Start the ssh-agent in the background.

```sh
eval "$(ssh-agent -s)"
```

Add your SSH private key to the ssh-agent (replace path with the path of your key and enter your password)

```sh
ssh-add ~/.ssh/id_ed25519
```

Clone your Strapi and Nuxt repos

```sh
git clone git@github.com:yourname/strapi-app.git
git clone git@github.com:yourname/nuxt-app.git
```

## Setup Strapi

Our Strapi app will be proxied to `/strapi` route. This is to avoid collisions of Strapi and Nuxt `/api` routes. Strapi should be configured so it's aware of the upstream proxy. [Read more about it.](https://docs.strapi.io/dev-docs/deployment/nginx-proxy) This example shows subfolder configuration example.

Go to the Strapi project root

```sh
cd strapi-app
```

Add `url` property in the server configuration file and add `BASE_URL` in `.env`

```diff:.env
+ BASE_URL=https://your.domain/strapi
```

```js:config/server.js
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("BASE_URL", "https://localhost:1337"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});
```

This will aware Strapi that it's served on `/strapi` route.

Change Node version, install dependencies and build

```sh
nvm use v16
yarn && yarn build
```

Create PM2 `ecosystem.config.js` file in the root of project and run it

```js:ecosystem.config.js
module.exports = {
	apps : [{
		name: 'strapi',
		script: 'yarn',
		args: 'start' // or 'develop' if you need content-type builder
	}]
};
```

```sh
pm2 start ecosystem.config.js
```

## Setup Nuxt

Strapi also needs the `ecosystem.config.js` file with the similar contend. Read more about [Nuxt deployment](https://nuxt.com/docs/getting-started/deployment#nodejs-server)

Go to the Nuxt project root

```sh
cd ../nuxt-app
```

I assume that you have defined environment variable for Strapi base URL in `.env` You have to change `STRAPI_BASE_URL` environment variable (or how you define it) from `http://localhost:1337` to `https://your.domain/strapi`

Change base Strapi url

```diff:.env
- STRAPI_BASE_URL=http://localhost:1337
+ STRAPI_BASE_URL=https://your.domain/strapi
```

Change Node version to the latest back, install dependencies and build

```sh
nvm use v19
yarn && yarn build
```

Create PM2 `ecosystem.config.js` in the root of project and run it

```js:ecosystem.config.js
module.exports = {
	apps: [{
		name: "nuxt",
		exec_mode: "cluster",
		instances: "max",
		script: "./.output/server/index.mjs",
	}],
};
```

```sh
pm2 start ecosystem.config.js
```

## PM2 configuration

We have to make sure our has as much up time as possible. To run our app after OS reboots create PM2 startup script. This two commands does everything we want

```sh
pm2 startup
```

This will create startup script for all currently running tasks. To make the list respawn at machine reboot run

```sh
pm2 save
```

After that all our processes will spawn after reboot

## Nginx configuration

Create file in `/etc/nginx/sites-available` with the name you want and open it using vim or nano or whatever you prefer and paste here this

```sh
touch /etc/nginx/sites-available/your.domain
vim /etc/nginx/sites-available/your.domain
```

```nginx:/etc/nginx/sites-available/your.domain
upstream strapi {
  server 127.0.0.1:1337; # or whatever port your strapi run on
}
upstream nuxt {
  server 127.0.0.1:3000; # or whatever port your nuxt run on
}
server {
  server_name www.your.domain your.domain;
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

	# This is the root route. All the request directs to Nuxt app
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://nuxt;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 50M;
  }

	# This is the strapi route. All the request directs to Strapi app
  location /strapi/ {
    rewrite ^/strapi/?(.*)$ /$1 break;
    proxy_pass http://strapi;
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_pass_request_headers on;
    client_max_body_size 50M;
  }

  error_page 405 =200 $uri;

  listen 443 ssl; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/your.domain/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/your.domain/privkey.pem; # managed by Certbot
  include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
  if ($host = your.domain) {
    return 301 https://$host$request_uri;
  } # managed by Certbot

  if ($host = www.your.domain) {
    return 301 https://$host$request_uri;
  } # managed by Certbot

  listen 80;
  server_name www.your.domain your.domain;
}
```

> [!warning] Warning
> In this file you'll need to replace all occurrences of `your.domain` with your domain name. in vim you can just run `%s/your.domain/yourreal.domain/g`

Disable `default` config and enable `your.domain` config with the next commands

```sh
rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/your.domain /etc/nginx/sites-enabled/your.domain
```

This will remove link to `default` config from `sites-enabled` and create link to `your.domain` config that make it enabled.

Make sure that your configs contain no errors

```sh
$ nginx -t
> nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
> nginx: configuration file /etc/nginx/nginx.conf test is successful
```

If there is no errors in it restart Nginx

```sh
systemctl restart nginx
```

Open your website and make sure everything works

# Troubleshooting

If you've followed the guide carefully but face an issue here is some of probable purposes:

> [!example]- Wrong upstreams
> upstreams in `/etc/nginx/sites-available/your.domain` ports may differ from that your Strapi or/and Nuxt run on. If your Nuxt port is not `3000` or/and Strapi port is not `1337` then edit upstreams in the Nginx config accordingly.

> [!example]- Wrong SSL certificate key path
> Your SSL certificate may be generated on a different path. Check if `/etc/letsencrypt/live/your.domain/` has `fullchain.pem` and `privkey.pem` files in it. If there is no files then find where Certbot placed it or run Certbot again.
