package com.dlrs.controller;

import com.dlrs.dto.TransactionRequest;
import com.dlrs.dto.TransactionResponse;
import com.dlrs.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        TransactionResponse response = transactionService.createTransaction(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id) {
        TransactionResponse transaction = transactionService.getTransaction(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/my-transactions")
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(Authentication authentication) {
        String username = authentication.getName();
        List<TransactionResponse> transactions = transactionService.getTransactionsByBuyer(username);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<TransactionResponse>> getMyRequests(Authentication authentication) {
        String username = authentication.getName();
        List<TransactionResponse> transactions = transactionService.getTransactionsBySeller(username);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TransactionResponse>> getPendingTransactions() {
        List<TransactionResponse> transactions = transactionService.getPendingTransactions();
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<TransactionResponse> approveTransaction(
            @PathVariable Long id,
            @RequestParam boolean approve,
            Authentication authentication) {
        String username = authentication.getName();
        TransactionResponse response = transactionService.approveTransaction(id, username, approve);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<TransactionResponse> acceptTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        TransactionResponse response = transactionService.acceptTransactionRequest(id, username);
        return ResponseEntity.ok(response);
    }
}

