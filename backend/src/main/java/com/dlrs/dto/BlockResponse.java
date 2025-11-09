package com.dlrs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockResponse {
    private Long id;
    private Integer blockIndex;
    private LocalDateTime timestamp;
    private Long transactionId;
    private String dataHash;
    private String previousHash;
    private String currentHash;
    private Long nonce;
    private TransactionResponse transaction;
}

