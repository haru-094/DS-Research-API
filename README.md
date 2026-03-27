## Data Science Research Hub

🔴 Live Demo: http://13.222.225.87<br>
🎥 Video Demo: [https://www.loom.com/share/e11a39472a4f43dcbc12fe96c8a77790]

A responsive, high-performance web application designed to query the OpenAlex API and retrieve highly relevant, open-access academic literature strictly focused on Data Science and Machine Learning. This project demonstrates modern frontend performance optimization and a high-availability deployment architecture using Nginx.

## 🚀 Features
- Targeted Querying: Filters out unrelated disciplines to focus purely on ML/AI research (Concept ID: C119857082).

- Performance Optimization (Caching): Implements a pure-JavaScript localStorage caching mechanism. Repeated queries load instantly from the browser's memory, eliminating redundant API calls and preventing rate-limit errors.

- Responsive UI: Fully optimized for all devices with asynchronous loading states and graceful error handling for network failures.

- High Availability Architecture: Deployed across two web servers behind an Nginx Load Balancer to ensure constant uptime and traffic distribution.

## 💻 How to Run Locally (Localhost)
Because this application utilizes the open-access OpenAlex API, no API keys or hidden .env files are required. To test the application on your own machine, follow these simple steps:

### 1. Clone the Repository

Bash
```
git clone https://github.com/haru-094/data-science-research-hub.git
cd data-science-research-hub
```

### 2. Launch the Application
Since there is no backend server or API key configuration needed, you can simply double-click the index.html file to open it in your default web browser, or use a tool like VS Code Live Server for hot-reloading.

## 🏗️ Deployment Documentation
This application is deployed on a 3-tier architecture designed for redundancy and scalability.

### 1. Web Servers Configuration (Web01 & Web02)
Two Ubuntu servers (34.205.72.228 and 54.165.198.141) were provisioned to host the application files.

Steps Taken:

Environment Setup: Installed Nginx web server.

Bash
```
sudo apt update && sudo apt install nginx -y
```
Code Deployment: Cleared the default Nginx landing page and cloned the repository directly to the web root.

Bash
```
sudo rm -rf /var/www/html/*
sudo git clone https://github.com/haru-094/data-science-research-hub.git /var/www/html/
```
Permissions & Service Management: Granted Nginx ownership of the files and restarted the service.

Bash
```
sudo chown -R www-data:www-data /var/www/html
sudo systemctl restart nginx
```

### 2. Load Balancer Configuration (Lb01)
A third server (13.222.225.87) was configured as an Nginx Reverse Proxy to distribute incoming traffic.

Configuration Steps:

Installed Nginx and modified the default configuration file (/etc/nginx/sites-available/default) to define an upstream pool and proxy routing.

The Configuration Block:
```
Nginx
upstream backend_servers {
    server 34.205.72.228;
    server 54.165.198.141;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    add_header X-Served-By $HOSTNAME;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Key Configurations Explained:

upstream backend_servers: Defines the pool of available web servers. By default, Nginx uses a Round Robin algorithm to cycle requests sequentially (Web01 → Web02 → Web01), preventing server overload.

proxy_pass: Intercepts traffic hitting the load balancer on Port 80 and silently forwards it to the upstream pool.

add_header X-Served-By: Injects a custom HTTP header into the response, allowing developers to track exactly which backend server handled the request.

## 🧪 Testing & Verification
To ensure the architecture functions as intended, the following tests were performed:

### 1. Functional Testing via Load Balancer

Action: Accessed the application via the Load Balancer IP (http://13.222.225.87).

Result: The application loaded instantly, confirming that Lb01 is successfully forwarding requests to the backend servers.

### 2. Load Balancing Verification via HTTP Headers

Objective: Verify that traffic is being mathematically split between Web01 and Web02.

Method: Executed curl -I http://13.222.225.87 from a local terminal.

Observation: The output successfully returned HTTP/1.1 200 OK and displayed two distinct X-Served-By headers (e.g., X-Served-By: 7045-web-02 and X-Served-By: 7045-lb-01), proving the reverse proxy is actively distributing and tagging traffic.

## 📂 Project Structure
Plaintext
```
data-science-research-hub/
├── index.html      # Main HTML structure
├── style.css       # Responsive UI and animations
├── script.js       # API fetch logic, DOM manipulation, and caching
└── README.md       # Project documentation
```

## ⚖️ Attribution
Data Provider: OpenAlex API - An open and comprehensive catalog of scholarly papers, researchers, and institutions.

Author: Anas Khalid
