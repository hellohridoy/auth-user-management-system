package com.example.springauth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String welcome() {
        return "<h1>Welcome to Spring Auth API</h1><p>The server is running successfully. Please use the Postman collection to interact with the API.</p>";
    }
}
