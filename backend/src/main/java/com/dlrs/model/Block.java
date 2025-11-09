package com.dlrs.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Block {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "block_index", unique = true, nullable = false)
    private Integer blockIndex;

    @NotNull
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false, unique = true)
    private Transaction transaction;

    @NotBlank
    @Column(name = "data_hash", nullable = false, updatable = false)
    private String dataHash;

    @NotBlank
    @Column(name = "previous_hash", nullable = false, updatable = false)
    private String previousHash;

    @NotBlank
    @Column(name = "current_hash", nullable = false, updatable = false)
    private String currentHash;

    @Column(nullable = false)
    private Long nonce;
}

