package com.dlrs.repository;

import com.dlrs.model.Transaction;
import com.dlrs.model.TransactionStatus;
import com.dlrs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyer(User buyer);
    List<Transaction> findBySeller(User seller);
    List<Transaction> findByStatus(TransactionStatus status);
    List<Transaction> findByPropertyId(Long propertyId);
}

