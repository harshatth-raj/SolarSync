package com.example.demo.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Forward all non-API, non-static routes to index.html
    // so React Router handles client-side navigation
    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/sites",
        "/sites/**",
        "/tickets",
        "/dashboard"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
