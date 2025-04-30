package com.epam.gym_app.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginRequest {
    @JsonProperty("email")
    private String email;

    @JsonProperty("password")
    private String password;

    private LoginRequest(String email, String password){
        super();
        this.email = email;
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public static class LoginBuilder{
        private String email;
        private String password;

        public LoginBuilder email(String email){
            this.email = email;
            return this;
        }

        public LoginBuilder password(String password){
            this.password = password;
            return this;
        }

        public LoginRequest build(){
            LoginRequest loginRequest = new LoginRequest(email,password);
            return loginRequest;
        }
    }
}
