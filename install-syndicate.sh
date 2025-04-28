#!/bin/bash

# Create Python virtual environment if it doesn't exist
python -m venv awsEnv

# Activate the virtual environment
source awsEnv/Scripts/activate

# Install aws-syndicate
pip install aws-syndicate

# Add the Scripts directory to PATH
SCRIPTS_DIR="/c/Users/sayantan_bhaumik/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0/LocalCache/local-packages/Python313/Scripts"
echo "export PATH=\"$SCRIPTS_DIR:\$PATH\"" >> ~/.bashrc

echo "Installation complete. Please run: source ~/.bashrc" 