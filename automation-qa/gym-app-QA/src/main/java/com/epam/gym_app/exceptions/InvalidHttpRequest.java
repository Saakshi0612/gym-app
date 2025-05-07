package com.epam.gym_app.exceptions;

public class InvalidHttpRequest extends RuntimeException{
    public InvalidHttpRequest(String message){
        super(message);
    }
}
