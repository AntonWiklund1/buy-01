#!/bin/bash


echo "Installing backend dependencies"
cd backend
mvn install

echo "Starting MongoDB server"
mongod &

sleep 5

echo "Starting backend server"
mvn spring-boot:run &

sleep 10

echo "Installing frontend dependencies"
cd ..
cd frontend
npm install

echo "Starting Angular frontend"
ng serve