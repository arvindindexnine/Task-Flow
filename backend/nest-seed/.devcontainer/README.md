# Dev Container Setup

Dev Containers in Visual Studio Code provides a consistent development environment by using Docker containers where :

- **Isolate Dependencies**
- **Standardize Environments**
- **Simplify Onboarding**

are maintained.

## Prerequisites

### Download and Install VsCode

- [Download](https://code.visualstudio.com/download) VsCode and install by double clicking on installer
- Open vscode and Install following extensions:
  - `WSL`
  - `Docker`
  - `Dev Container`
  - `Remote Development`

### Install WSL

1. Press 🪟 (Windows) and type `cmd` or `powershell` according to your prefference and make sure that it should `Run as administrator` .

2. Type below command
   ```
   $ wsl --install
   ```
3. While installation process it will ask for UNIX `username` and `password` so keep an eye on screen.

4. Make sure that your WSL distro version is set to 2 using this :

   ```
   $ wsl --set-default-version 2
   ```

5. After successfully installation, you can check WSL installation by typing

   ```
   $ wsl -v

   // you will see something like this
   WSL version: 2.1.5.0
   Kernel version: 5.15.146.1-2
   WSLg version: 1.0.60
   MSRDC version: 1.2.5105
   Direct3D version: 1.611.1-81528511
   DXCore version: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
   Windows version: 10.0.22631.3737
   ```

6. Restart your WSL once
   ```
   $ wsl --shutdown
   ```

### Now close the current window and open new WSL terminal.

- By pressing 🪟 and typing `Terminal` you can open `Terminal App` .
- Click on dropdown from the top bar and select `Ubuntu` terminal.
- Now, run the following commands...

### Install Docker Inside WSL

1. Make sure to update the packages by running the following command and remove any old conflicts
   ```
   $ sudo apt update
   $ sudo apt remove docker docker-engine docker.io containerd runc
   ```
2. Install Docker dependencies:
   ```
   $ sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
   ```
3. Add Docker’s official GPG key:
   ```
   $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```
4. Set up the stable repository:
   ```
   $ echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
5. Install Docker:
   ```
   $ sudo apt update
   $ sudo apt install docker-ce docker-ce-cli containerd.io -y
   ```
6. **Docker user permissions**:
   ```
   $ sudo usermod -aG docker $USER
   ```

### Update Docker Compose

1. In case of docker compse is outdated or corrupted, update it (Basically in any case, update it).

   ```
   $ sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   $ sudo chmod +x /usr/local/bin/docker-compose

   ```

2. **Reset Docker Context** : Sometimes, the Docker context can get misconfigured. Reset it to the default.
   ```
   $ docker context use default
   ```
3. **Verify docker installation** :

   ```
   $ docker -v
   $ docker-compose -v
   $ sudo systemctl status docker.service
   ```

4. Restart your WSL once again
   ```
   $ wsl --shutdown
   ```

<h3 align="center">OR</h3>

- If you find docker installation lengthy, simply just run the `docker-setup.sh` file in WSL it will do it for you.

<hr>

## Let's deep dive in devcontainer setup

### Run exiisting project with devcontainer

1. **Clone Your Project**
   ```
   [/mnt/{drive}/path/to/project]$ code .
   ```
   - Example: `/mnt/c/My_Projects/project-1`
2. **Open VSCode**

   - Press `F1` or `Ctrl + Shift + P` to open the command palette..

3. **Rebuild and Reopen in Container**

   - Type `Dev Container: Rebuild and Reopen in Container` and hit `Enter`.

4. **Building devcontainer**

   - Keep an eye on the logs for any WSL `password` prompts. Click on `(show logs)` in the notification area to view.

5. **Get Started!**
   - Wait a bit for the terminal to start up your `backend` or `frontend`. You're ready to code!

## Customizations in devcontainer

- If you want to add vscode extensions or your preffered settings, then you can modify it according to you :

  - Open `.devcontainer` folder, (Located in project's root dir)
  - Edit `devcontainer.json` file

    ```
    "customizations": {
       "vscode": {
          "extensions": [
             ...
          ],
          "settings": {
             ...,

             "files.watcherExclude": {
                ...
             }
          }
       }
    }
    ```

  * Here, you can add or remove extensions and settings according to project environment

## Different Profiles for different devcontainer

- If you want to keep your vscode profile seperate from the devcontainer or you want to use diffetrent profile in the devcontainers here's how you can setup it (No TLDR)

* **Open Settings** :

  - Click the `Manage` (gear) icon at the bottom left.

* **Access Profiles** :

  - Hover over `Profile (Default)` and click.

* **Create a New Profile** :

  - Select `Create Profile...`
  - Choose from `what to configure` and name your new profile.
  - Hit `Enter` or click `Create`.

* **Reload** :

  - Reload the window when prompted.

* **Now you're all set to work in a new profile!**

## Advantages and Disadvantages

### Advantages

- **Simplified Onboarding** :

  - New developers can get up and running quickly by simply cloning the repository and starting the container.
  - No need of complex setup instructions

* **Ease of use** :
  - Set up and running in 15–30 mins and increase productive.

- **Consistency Across Environments** :

  - All developers have consistent dev environment.
  - Reduces the "it works on my machine" problem.

- **Environment Isolation** :
  - Isolates dependencies and tools.
  - prevent conflicts with other projects.

* **Git works in there** :

  - all your credentials and ssh keys all get passed through and work automagically!

* **Portability** :
  - They can be easily moved from one computer to another.
  - To share your development environment with others.

### Disadvantages

- **Performance Overhead** :

  - Can be resource-intensive.
  - Managing and cleaning up unused containers and images.

- **Complexity** :
  - Requires basic knowledge of Docker and containerization concepts.

* **They take time to set up** :

  - They do have some initial upfront time/effort cost.

* **They can become stale** :

  - Because of the fact the dev container is not part of the main codebase, it is very easy to forget to keep the dependencies updated.

* **No support for Windows images (yet)** :

  - You have to do hands dirty with `Linux` and `Bash` things to get familiar.

* **VSCode LiveShare has issues** :
  - Because of the way VSCode is running within the container, there are a few workarounds for the issues.
  - Some functionality such as the voice chat, may or may not function 100%.

## Bonus : Docker management

- If you are not **CLI warrior** and prefer UI, just like Docker Desktop, you can manage Docker containers and volumes within your WSL environment!.

- Portainer is a great tool that provides a beautiful UI for managing Docker. Follow these steps to set it up:

  1.  **Run Portainer using Docker Compose** :
      ```
      $ docker-compose -f docker-compose_portainer.yml up -d
      ```
  2.  **Access Portainer UI** :
      `http://localhost:9000`

  3.  Enjoy a seamless Docker management experience right from your browser!
