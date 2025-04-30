package com.epam.gym_app.api.utils;

import com.epam.gym_app.exceptions.InvalidHttpRequest;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

public class HttpMethods {
    public Response httpRequest(String method, String endpoint, RequestSpecification req) {
        return switch (method.toUpperCase()) {
            case "GET" -> req.when().get(endpoint);
            case "POST" -> req.when().post(endpoint);
            case "PUT" -> req.when().put(endpoint);
            case "DELETE" -> req.when().delete(endpoint);
            default -> throw new InvalidHttpRequest("Invalid HTTP method: " + method);
        };
    }
}