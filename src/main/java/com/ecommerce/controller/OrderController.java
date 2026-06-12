package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Order API endpoints.
 * 
 * Endpoints:
 *   POST /api/orders       - Create a new order (checkout)
 *   GET  /api/orders       - List all orders
 *   GET  /api/orders/{id}  - Get order by ID
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * POST /api/orders
     * Creates a new order from the shopping cart checkout.
     * 
     * Expected JSON body:
     * {
     *   "customerName": "John Doe",
     *   "customerEmail": "john@example.com",
     *   "shippingAddress": "123 Main St, Mumbai, India",
     *   "totalAmount": 1549.99,
     *   "items": [
     *     { "productId": 1, "productName": "MacBook Pro", "quantity": 1, "price": 2499.00 }
     *   ]
     * }
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            order.setCreatedAt(LocalDateTime.now());
            order.setStatus("CONFIRMED");

            // Link order items back to the order
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    item.setOrder(order);
                }
            }

            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Order placed successfully!",
                "orderId", savedOrder.getId(),
                "status", savedOrder.getStatus(),
                "totalAmount", savedOrder.getTotalAmount()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create order: " + e.getMessage()));
        }
    }

    /**
     * GET /api/orders
     * Retrieves all orders.
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    /**
     * GET /api/orders/{id}
     * Retrieves a specific order by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
