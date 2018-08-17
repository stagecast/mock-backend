#!/bin/bash 
cd .git/lost-found/other
kwords=( "UserController" "BaseController" "ApiController" "WelcomeController" "populate" "app.listen" "this.Model" "mongoose.Schema" "stagecast" "starter-project")
COUNTER=1
FOUND=0
for f in *; do 
    echo "File: $COUNTER Foud: $FOUND - Processing $f file..." 

    for word in "${kwords[@]}"
    do
        RES=$(git show $f | grep $word)
        if [ -z "$RES" -o "$RES" = " " ]
        then 
            continue
        else 
            break
        fi    
    done 

# RES=$(git show $f | grep "BaseController")
    if [ -z "$RES" ]
        then
            echo "empty"
        else
            echo "************ FOOOOOOOOOOOOOOUND *************"
            FOUND=$((FOUND + 1))
            cd ../../..
            git show $f > "saveme/$COUNTER.m" 
            cd .git/lost-found/other
    fi

    COUNTER=$((COUNTER + 1))
done

echo "Counted: $COUNTER,  Foud: $FOUND" 

