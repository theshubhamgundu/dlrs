package com.dlrs.service;

import com.dlrs.dto.TransactionRequest;
import com.dlrs.dto.TransactionResponse;
import com.dlrs.model.*;
import com.dlrs.repository.PropertyRepository;
import com.dlrs.repository.TransactionRepository;
import com.dlrs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockService blockService;

    @Autowired
    private AuditService auditService;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, String username) {
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getStatus().equals(PropertyStatus.FOR_SALE)) {
            throw new RuntimeException("Property is not available for sale");
        }

        if (property.getOwner().getId().equals(buyer.getId())) {
            throw new RuntimeException("Cannot purchase your own property");
        }

        Transaction transaction = new Transaction();
        transaction.setProperty(property);
        transaction.setBuyer(buyer);
        transaction.setSeller(property.getOwner());
        transaction.setAmount(request.getAmount());
        transaction.setStatus(TransactionStatus.INITIATED);

        transaction = transactionRepository.save(transaction);
        property.setStatus(PropertyStatus.PENDING_TRANSFER);
        propertyRepository.save(property);

        auditService.logAction(buyer.getId(), "TRANSACTION_CREATED", 
                "Transaction created for property: " + property.getPropertyUid());

        return toTransactionResponse(transaction);
    }

    public TransactionResponse getTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return toTransactionResponse(transaction);
    }

    public List<TransactionResponse> getTransactionsByBuyer(String username) {
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Transaction> transactions = transactionRepository.findByBuyer(buyer);
        return transactions.stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsBySeller(String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Transaction> transactions = transactionRepository.findBySeller(seller);
        return transactions.stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getPendingTransactions() {
        List<Transaction> transactions = transactionRepository.findByStatus(TransactionStatus.PENDING);
        return transactions.stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse approveTransaction(Long transactionId, String username, boolean approve) {
        User inspector = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!inspector.getRole().equals(Role.INSPECTOR) && !inspector.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("Only inspectors can approve transactions");
        }

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getStatus().equals(TransactionStatus.PENDING)) {
            throw new RuntimeException("Transaction is not pending approval");
        }

        if (approve) {
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setApprovedBy(inspector);

            Property property = transaction.getProperty();
            property.setOwner(transaction.getBuyer());
            property.setStatus(PropertyStatus.TRANSFERRED);
            propertyRepository.save(property);

            transaction = transactionRepository.save(transaction);

            // Create block for completed transaction
            blockService.createBlock(transaction);

            auditService.logAction(inspector.getId(), "TRANSACTION_APPROVED", 
                    "Transaction " + transactionId + " approved");
        } else {
            transaction.setStatus(TransactionStatus.REJECTED);
            transaction.setApprovedBy(inspector);

            Property property = transaction.getProperty();
            property.setStatus(PropertyStatus.FOR_SALE);
            propertyRepository.save(property);

            transaction = transactionRepository.save(transaction);

            auditService.logAction(inspector.getId(), "TRANSACTION_REJECTED", 
                    "Transaction " + transactionId + " rejected");
        }

        return toTransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse acceptTransactionRequest(Long transactionId, String username) {
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("Unauthorized to accept this transaction");
        }

        if (!transaction.getStatus().equals(TransactionStatus.INITIATED)) {
            throw new RuntimeException("Transaction is not in INITIATED status");
        }

        transaction.setStatus(TransactionStatus.PENDING);
        transaction = transactionRepository.save(transaction);

        auditService.logAction(seller.getId(), "TRANSACTION_ACCEPTED", 
                "Transaction " + transactionId + " accepted by seller");

        return toTransactionResponse(transaction);
    }

    private TransactionResponse toTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .propertyId(transaction.getProperty().getId())
                .propertyUid(transaction.getProperty().getPropertyUid())
                .propertyTitle(transaction.getProperty().getTitle())
                .buyerId(transaction.getBuyer().getId())
                .buyerName(transaction.getBuyer().getFullName())
                .sellerId(transaction.getSeller().getId())
                .sellerName(transaction.getSeller().getFullName())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .approvedById(transaction.getApprovedBy() != null ? transaction.getApprovedBy().getId() : null)
                .approvedByName(transaction.getApprovedBy() != null ? transaction.getApprovedBy().getFullName() : null)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

