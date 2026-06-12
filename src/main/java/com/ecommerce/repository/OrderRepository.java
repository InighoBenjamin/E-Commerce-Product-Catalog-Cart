package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository for Order entity.
 * Provides database CRUD operations for order management.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find orders by customer email
    List<Order> findByCustomerEmail(String email);

    // Find orders by status
    List<Order> findByStatus(String status);
}
