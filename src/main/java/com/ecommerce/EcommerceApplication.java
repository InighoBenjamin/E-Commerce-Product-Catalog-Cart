package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the E-Commerce Product Catalog & Cart application.
 * 
 * This Spring Boot application provides a REST API for:
 * - Product listing, search, and category filtering
 * - Order management and checkout processing
 * 
 * Default configuration uses H2 in-memory database.
 * For production, switch to MySQL in application.properties.
 */
@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  E-Commerce API Server Started!");
        System.out.println("  REST API: http://localhost:8080/api");
        System.out.println("  H2 Console: http://localhost:8080/h2-console");
        System.out.println("========================================\n");
    }
}
