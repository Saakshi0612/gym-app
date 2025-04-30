package com.epam.gym_app.api.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegistrationRequest {
    @JsonProperty("email")
    private String email;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("password")
    private String password;

    @JsonProperty("confirmPassword")
    private String confirmPassword;

    @JsonProperty("target")
    private String target;

    @JsonProperty("activity")
    private String activity;

    private RegistrationRequest(String email, String firstName, String lastName, String password, String confirmPassword, String target, String activity) {
        super();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.target = target;
        this.activity = activity;
    }

    @Override
    public String toString() {
        return "RegistrationRequest{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", password='" + password + '\'' +
                ", confirmPassword='" + confirmPassword + '\'' +
                ", target='" + target + '\'' +
                ", activity='" + activity + '\'' +
                '}';
    }

    public static class RegisterBuilder{
        private String email;
        private String firstName;
        private String lastName;
        private String password;
        private String confirmPassword;
        private String target;
        private String activity;

        public RegisterBuilder email(String email){
            this.email = email;
            return this;
        }

        public RegisterBuilder firstName(String firstName){
            this.firstName = firstName;
            return this;
        }

        public RegisterBuilder lastName(String lastName){
            this.lastName = lastName;
            return this;
        }

        public RegisterBuilder password(String password){
            this.password = password;
            return this;
        }

        public RegisterBuilder confirmPassword(String confirmPassword){
            this.confirmPassword = confirmPassword;
            return this;
        }

        public RegisterBuilder target(String target){
            this.target = target;
            return this;
        }

        public RegisterBuilder activity(String activity){
            this.activity = activity;
            return this;
        }

        public RegistrationRequest build(){
            RegistrationRequest registrationRequest = new RegistrationRequest(email,firstName,lastName,password,confirmPassword,target,activity);
            return registrationRequest;
        }
    }
}
