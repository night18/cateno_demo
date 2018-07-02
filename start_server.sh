#!/bin/sh

#
# Cleanup
#
forever stopall
pkill geth
pkill node
sleep 2

#
# Serve the app
#
# export MONGO_URL=mongodb://localhost:27017/nodeapp
export PORT=3000
export ROOT_URL=http://$(curl -s ipecho.net/plain)
# export METEOR_SETTINGS=$(<settings.json)
forever start /home/ec2-user/cateno_demo/bundle/main.js
echo
echo "Serving app at: $ROOT_URL:$PORT"
echo

#
# Start and tunnel testAPI
#
# Logs at: /home/ec2-user/cateno_demo/testAPI/nohup.out
cd /home/ec2-user/cateno_demo/testAPI/
nohup meteor --port 3002 &
nohup lt -p 3002 -s cateno &

#
# Run Geth RPC and start mining
#
# Logs at: /home/ec2-user/cateno/nohup.out
cd /home/ec2-user/cateno/
nohup geth --identity cateno_demo --datadir /home/ec2-user/cateno/datadir/ --port 30305 --nodiscover --rpc \
           --rpcapi db,eth,net,web3,personal --rpcaddr 0.0.0.0 --rpccorsdomain "*" --mine --minerthreads=1 \
           --unlock "0,1,2,3" --password=/home/ec2-user/eth_passwords.txt &
sleep 3

#
# Build the bridge
#
# Logs at: /home/ec2-user/cateno_demo/ethereum-bridge/bridge.log
cd /home/ec2-user/cateno_demo/ethereum-bridge/
forever start bridge.js --instance oracle_instance_20180702T203119.json
#
# Show status of daemon processes
#
forever list
