package com.dlrs.dto;

import com.dlrs.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long propertyId;
    private String propertyUid;
    private String propertyTitle;
    private Long buyerId;
    private String buyerName;
    private Long sellerId;
    private String sellerName;
    private BigDecimal amount;
    private TransactionStatus status;
    private Long approvedById;
    private String approvedByName;
    private LocalDateTime createdAt;
}

