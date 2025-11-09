package com.dlrs.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    @NotNull
    private Long propertyId;
    
    @NotNull
    private BigDecimal amount;
}

