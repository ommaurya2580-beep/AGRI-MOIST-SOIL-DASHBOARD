#!/bin/bash
CONTAINER_ID=$(sudo docker ps -qf ancestor=pest-api)
sudo docker exec $CONTAINER_ID mkdir -p /app/models
sudo docker cp /home/ec2-user/best.pt $CONTAINER_ID:/app/models/best.pt
sudo docker restart $CONTAINER_ID
echo "Model injected and container restarted!"
