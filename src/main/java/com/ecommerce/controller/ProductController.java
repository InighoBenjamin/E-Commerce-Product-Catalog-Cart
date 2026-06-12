package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for Product API endpoints.
 * 
 * Endpoints:
 *   GET  /api/products              - List all products (with optional search, category, sort, price filters)
 *   GET  /api/products/{id}         - Get a single product by ID
 *   GET  /api/products/categories   - Get all product categories
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    /**
     * GET /api/products
     * Retrieves all products with optional filtering, searching, and sorting.
     *
     * @param search   - Search query (filters by name and description)
     * @param category - Filter by category
     * @param sort     - Sort option: "price-asc", "price-desc", "name", "rating"
     * @param minPrice - Minimum price filter
     * @param maxPrice - Maximum price filter
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        List<Product> products;

        // Apply search and category filters
        if (search != null && !search.isEmpty() && category != null && !category.isEmpty()) {
            products = productRepository.searchByCategory(category, search);
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.searchProducts(search);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findAll();
        }

        // Apply price range filter
        if (minPrice != null || maxPrice != null) {
            final double min = minPrice != null ? minPrice : 0;
            final double max = maxPrice != null ? maxPrice : Double.MAX_VALUE;
            products = products.stream()
                    .filter(p -> p.getPrice() >= min && p.getPrice() <= max)
                    .collect(Collectors.toList());
        }

        // Apply sorting
        if (sort != null) {
            switch (sort) {
                case "price-asc":
                    products.sort(Comparator.comparingDouble(Product::getPrice));
                    break;
                case "price-desc":
                    products.sort(Comparator.comparingDouble(Product::getPrice).reversed());
                    break;
                case "name":
                    products.sort(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER));
                    break;
                case "rating":
                    products.sort(Comparator.comparingDouble(Product::getRating).reversed());
                    break;
            }
        }

        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}
     * Retrieves a single product by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/products/categories
     * Retrieves a list of all distinct product categories.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productRepository.findAllCategories());
    }
}
